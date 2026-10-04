<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceReportController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());
        $type = $request->query('type', 'student');
        $classId = $request->query('class_id');

        $table = $type === 'teacher' ? 'Teacher' : 'Student';
        $subjectColumn = $type === 'teacher' ? 'teacher_id' : 'student_id';

        $base = Attendance::where('attendances.school_id', $schoolId)
            ->where('attendances.type', $table)
            ->whereBetween('attendances.date', [$from, $to]);

        if ($classId) {
            $base->where('attendances.class_id', $classId);
        }

        $counts = (clone $base)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN attendances.status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN attendances.status='Absent' THEN 1 ELSE 0 END) as absent")
            ->selectRaw("SUM(CASE WHEN attendances.status='Late' THEN 1 ELSE 0 END) as late")
            ->selectRaw("SUM(CASE WHEN attendances.status='Half-Day' THEN 1 ELSE 0 END) as half_day")
            ->selectRaw("SUM(CASE WHEN attendances.status='Excused' THEN 1 ELSE 0 END) as excused")
            ->first();

        $total = (int) ($counts->total ?? 0);
        $effective = (int) $counts->present + (int) $counts->half_day * 0.5;

        $dailyExpr = DB::connection()->getDriverName() === 'sqlite'
            ? 'date'
            : 'DATE(attendances.date)';

        $daily = (clone $base)
            ->selectRaw("{$dailyExpr} as day")
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN attendances.status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN attendances.status='Absent' THEN 1 ELSE 0 END) as absent")
            ->groupBy('day')->orderBy('day')
            ->get()
            ->map(fn ($r) => [
                'date' => $r->day,
                'total' => (int) $r->total,
                'present' => (int) $r->present,
                'absent' => (int) $r->absent,
                'rate' => (int) $r->total > 0 ? round((int) $r->present / (int) $r->total * 100, 1) : null,
            ])->all();

        // Per-person breakdown.
        $personJoin = $type === 'teacher' ? 'teachers' : 'student_profiles';
        $personName = "CONCAT(COALESCE({$personJoin}.first_name,''),' ',COALESCE({$personJoin}.last_name,''))";

        $perPerson = (clone $base)
            ->join($personJoin, "{$personJoin}.id", '=', "attendances.{$subjectColumn}")
            ->groupBy('attendances.'.$subjectColumn, "{$personJoin}.first_name", "{$personJoin}.last_name")
            ->select('attendances.'.$subjectColumn.' as person_id')
            ->selectRaw("{$personName} as person_name")
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN attendances.status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN attendances.status='Absent' THEN 1 ELSE 0 END) as absent")
            ->selectRaw("SUM(CASE WHEN attendances.status='Late' THEN 1 ELSE 0 END) as late")
            ->orderByDesc('present')
            ->limit(200)
            ->get()
            ->map(function ($r) use ($type) {
                $t = (int) $r->total;

                return [
                    'id' => $r->person_id,
                    'name' => trim($r->person_name) ?: '—',
                    'role' => $type === 'teacher' ? 'Teacher' : 'Student',
                    'total' => $t,
                    'present' => (int) $r->present,
                    'absent' => (int) $r->absent,
                    'late' => (int) $r->late,
                    'rate' => $t > 0 ? round((int) $r->present / $t * 100, 1) : null,
                ];
            })
            ->sortByDesc(fn ($r) => $r['rate'] ?? 0)
            ->values()
            ->all();

        return response()->json([
            'period' => ['from' => $from, 'to' => $to, 'type' => $type, 'class_id' => $classId],
            'summary' => [
                'records' => $total,
                'present' => (int) $counts->present,
                'absent' => (int) $counts->absent,
                'late' => (int) $counts->late,
                'half_day' => (int) $counts->half_day,
                'excused' => (int) $counts->excused,
                'attendance_rate' => $total > 0 ? round($effective / $total * 100, 1) : null,
            ],
            'daily' => $daily,
            'per_person' => $perPerson,
        ]);
    }
}