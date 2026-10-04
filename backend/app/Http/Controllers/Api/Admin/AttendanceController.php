<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends ApiController
{
    /** Valid attendance states — mirrors the DB column. */
    private const STATUSES = ['Present', 'Absent', 'Late', 'Half-Day', 'Excused'];

    public function getStudentAttendance(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'section_id' => 'nullable|exists:sections,id',
        ]);

        $records = Attendance::where('school_id', $schoolId)
            ->where('class_id', $request->query('class_id'))
            ->where('date', $request->query('date'))
            ->where('type', 'Student')
            ->when($request->filled('section_id'), fn ($q) => $q->where('section_id', $request->query('section_id')))
            ->with('student')
            ->get();

        // Roster fallback: nothing marked yet -> list the class with a null status.
        if ($records->isEmpty()) {
            $students = Student::where('school_id', $schoolId)
                ->where('class_id', $request->query('class_id'))
                ->when($request->filled('section_id'), fn ($q) => $q->where('section_id', $request->query('section_id')))
                ->orderBy('first_name')
                ->get();

            return response()->json([
                'date' => $request->query('date'),
                'class_id' => (int) $request->query('class_id'),
                'section_id' => $request->query('section_id'),
                'is_roster' => true,
                'records' => $students->map(fn (Student $s) => [
                    'id' => null,
                    'student_id' => $s->id,
                    'student' => [
                        'id' => $s->id,
                        'name' => $s->full_name,
                        'roll_number' => $s->roll_number,
                        'admission_number' => $s->admission_number,
                    ],
                    'status' => null,
                    'remarks' => null,
                ])->all(),
                'summary' => null,
            ]);
        }

        return response()->json([
            'date' => $request->query('date'),
            'class_id' => (int) $request->query('class_id'),
            'section_id' => $request->query('section_id'),
            'is_roster' => false,
            'records' => $records->map(fn (Attendance $a) => [
                'id' => $a->id,
                'student_id' => $a->student_id,
                'student' => $a->student ? [
                    'id' => $a->student->id,
                    'name' => $a->student->full_name,
                    'roll_number' => $a->student->roll_number,
                    'admission_number' => $a->student->admission_number,
                ] : null,
                'status' => $a->status,
                'remarks' => $a->remarks,
            ])->all(),
            'summary' => [
                'marked' => $records->count(),
                'present' => $records->where('status', 'Present')->count(),
                'absent' => $records->where('status', 'Absent')->count(),
                'late' => $records->where('status', 'Late')->count(),
                'half_day' => $records->where('status', 'Half-Day')->count(),
                'excused' => $records->where('status', 'Excused')->count(),
            ],
        ]);
    }

    public function markStudentAttendance(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'section_id' => 'nullable|exists:sections,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:student_profiles,id',
            'attendances.*.status' => 'required|in:'.implode(',', self::STATUSES),
            'attendances.*.remarks' => 'nullable|string',
        ]);

        // Guard against cross-school writes.
        $validIds = Student::where('school_id', $schoolId)->pluck('id')->all();

        DB::transaction(function () use ($data, $schoolId, $validIds, $request) {
            foreach ($data['attendances'] as $item) {
                if (! in_array($item['student_id'], $validIds, true)) {
                    continue;
                }

                Attendance::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'student_id' => $item['student_id'],
                        'date' => $data['date'],
                        'type' => 'Student',
                    ],
                    [
                        'class_id' => $data['class_id'],
                        'section_id' => $data['section_id'] ?? null,
                        'status' => $item['status'],
                        'remarks' => $item['remarks'] ?? null,
                        'marked_by' => $request->user()?->id,
                    ]
                );
            }
        });

        $this->log($request, 'marked_attendance', Attendance::class, null, [
            'class_id' => $data['class_id'],
            'date' => $data['date'],
            'count' => count($data['attendances']),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Attendance marked successfully',
        ]);
    }

    public function getTeacherAttendance(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $date = $request->query('date', now()->toDateString());

        $records = Attendance::where('school_id', $schoolId)
            ->where('type', 'Teacher')
            ->whereDate('date', $date)
            ->with('teacher')
            ->get()
            ->keyBy('teacher_id');

        $teachers = Teacher::where('school_id', $schoolId)->orderBy('first_name')->get();

        return response()->json([
            'date' => $date,
            'is_roster' => $records->isEmpty(),
            'records' => $teachers->map(function (Teacher $t) use ($records) {
                $record = $records->get($t->id);

                return [
                    'id' => $record?->id,
                    'teacher_id' => $t->id,
                    'teacher' => [
                        'id' => $t->id,
                        'name' => $t->full_name,
                        'employee_id' => $t->employee_id,
                        'designation' => $t->designation,
                    ],
                    'status' => $record?->status,
                    'remarks' => $record?->remarks,
                ];
            })->all(),
            'summary' => $records->isEmpty() ? null : [
                'marked' => $records->count(),
                'present' => $records->where('status', 'Present')->count(),
                'absent' => $records->where('status', 'Absent')->count(),
                'late' => $records->where('status', 'Late')->count(),
                'half_day' => $records->where('status', 'Half-Day')->count(),
                'excused' => $records->where('status', 'Excused')->count(),
            ],
        ]);
    }

    public function markTeacherAttendance(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.teacher_id' => 'required|exists:teachers,id',
            'attendances.*.status' => 'required|in:'.implode(',', self::STATUSES),
            'attendances.*.remarks' => 'nullable|string',
        ]);

        $validIds = Teacher::where('school_id', $schoolId)->pluck('id')->all();

        DB::transaction(function () use ($data, $schoolId, $validIds, $request) {
            foreach ($data['attendances'] as $item) {
                if (! in_array($item['teacher_id'], $validIds, true)) {
                    continue;
                }

                Attendance::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'teacher_id' => $item['teacher_id'],
                        'date' => $data['date'],
                        'type' => 'Teacher',
                    ],
                    [
                        'status' => $item['status'],
                        'remarks' => $item['remarks'] ?? null,
                        'marked_by' => $request->user()?->id,
                    ]
                );
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher attendance marked successfully',
        ]);
    }

    /** Which dates in a range have no student attendance recorded. */
    public function unmarked(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        $marked = Attendance::where('school_id', $schoolId)
            ->where('type', 'Student')
            ->whereBetween('date', [$from, $to])
            ->distinct()
            ->pluck('date')
            ->map(fn ($d) => \Illuminate\Support\Carbon::parse($d)->toDateString())
            ->flip();

        $dates = [];
        $cursor = \Illuminate\Support\Carbon::parse($from)->startOfDay();

        while ($cursor->lte(\Illuminate\Support\Carbon::parse($to))) {
            if ($cursor->isWeekday() && ! $marked->has($cursor->toDateString())) {
                $dates[] = $cursor->toDateString();
            }
            $cursor->addDay();
        }

        return response()->json(['from' => $from, 'to' => $to, 'unmarked_dates' => $dates]);
    }
}