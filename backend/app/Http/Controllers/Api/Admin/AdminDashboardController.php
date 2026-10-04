<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Announcement;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\Mark;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\StudentLeave;
use App\Models\Teacher;
use App\Models\Timetable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends ApiController
{
    public function stats(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);
        $school = School::findOrFail($schoolId);
        $today = now()->toDateString();

        $totalStudents = Student::where('school_id', $schoolId)->count();
        $totalTeachers = Teacher::where('school_id', $schoolId)->count();
        $totalClasses = SchoolClass::where('school_id', $schoolId)->count();
        $totalSections = DB::table('sections')->where('school_id', $schoolId)->count();

        // ── Today's student attendance ──
        $todayAttendance = Attendance::where('school_id', $schoolId)
            ->where('date', $today)
            ->where('type', 'Student')
            ->get(['status']);

        $marked = $todayAttendance->count();
        $present = $todayAttendance->where('status', 'Present')->count();
        $absent = $todayAttendance->where('status', 'Absent')->count();
        $late = $todayAttendance->where('status', 'Late')->count();
        $halfDay = $todayAttendance->where('status', 'Half-Day')->count();
        $excused = $todayAttendance->where('status', 'Excused')->count();
        $unmarked = max(0, $totalStudents - $marked);

        $attendanceRate = $marked > 0
            ? round((($present + $halfDay * 0.5) / $marked) * 100, 1)
            : null;

        // ── Monthly attendance trend (last 6 months) ──
        $attendanceTrend = $this->attendanceTrend($schoolId);

        // ── Staff attendance today ──
        $staffToday = Attendance::where('school_id', $schoolId)
            ->where('date', $today)
            ->where('type', 'Teacher')
            ->get(['status']);

        $staffPresent = $staffToday->whereIn('status', ['Present', 'Late'])->count();

        // ── Financials ──
        $feeCollected = (float) FeeInvoice::where('school_id', $schoolId)->sum('paid_amount');
        $feeBilled = (float) FeeInvoice::where('school_id', $schoolId)->sum('amount');
        $feePending = (float) FeeInvoice::where('school_id', $schoolId)
            ->whereIn('status', ['Unpaid', 'Partial', 'Overdue'])
            ->get()
            ->sum(fn (FeeInvoice $i) => max(0, (float) $i->amount - (float) $i->paid_amount));

        $feeTrend = $this->feeTrend($schoolId);

        // ── Exams ──
        $upcomingExams = Exam::where('school_id', $schoolId)
            ->whereIn('status', ['Upcoming', 'Ongoing'])
            ->orderBy('start_date')
            ->limit(5)
            ->get(['id', 'name', 'term', 'start_date', 'end_date', 'status']);

        // ── Pending work for the admin ──
        $pendingGrading = AssignmentSubmission::whereHas('assignment', fn ($q) => $q->where('school_id', $schoolId))
            ->whereIn('status', ['Pending', 'Submitted'])
            ->count();
        $pendingLeaves = StudentLeave::where('school_id', $schoolId)->where('status', 'Pending')->count();
        $unmarkedAttendanceDays = $this->unmarkedAttendanceDays($schoolId);

        // ── Class-wise attendance & subject performance ──
        $classAttendance = $this->classAttendance($schoolId);
        $subjectAverages = $this->subjectAverages($schoolId);

        // ── Recent activity ──
        $recentStudents = Student::where('school_id', $schoolId)
            ->with(['class', 'section'])->latest()->limit(5)->get();

        $recentAnnouncements = Announcement::where('school_id', $schoolId)
            ->latest()->limit(5)->get(['id', 'title', 'priority', 'pinned', 'target_audience', 'created_at']);

        $academicYear = $this->currentAcademicYear($schoolId);

        return response()->json([
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'code' => $school->code,
                'logo' => $school->logo,
            ],
            'academic_year' => $academicYear,
            'stats' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_classes' => $totalClasses,
                'total_sections' => $totalSections,
                'attendance_rate' => $attendanceRate,
                'today_present' => $present,
                'today_absent' => $absent,
                'today_late' => $late,
                'today_half_day' => $halfDay,
                'today_excused' => $excused,
                'today_marked' => $marked,
                'today_unmarked' => $unmarked,
                'staff_total' => $totalTeachers,
                'staff_present' => $staffPresent,
                'staff_attendance_rate' => $totalTeachers > 0 ? round($staffPresent / $totalTeachers * 100, 1) : null,
                'fee_billed' => $feeBilled,
                'fee_collected' => $feeCollected,
                'fee_pending' => $feePending,
                'collection_rate' => $feeBilled > 0 ? round($feeCollected / $feeBilled * 100, 1) : null,
                'pending_grading' => $pendingGrading,
                'pending_leaves' => $pendingLeaves,
                'unmarked_attendance_days' => $unmarkedAttendanceDays,
                'avg_class_size' => $totalClasses > 0 ? round($totalStudents / $totalClasses, 1) : 0,
            ],
            'attendance_trend' => $attendanceTrend,
            'fee_trend' => $feeTrend,
            'class_attendance' => $classAttendance,
            'subject_averages' => $subjectAverages,
            'upcoming_exams' => $upcomingExams,
            'recent_students' => $recentStudents,
            'recent_announcements' => $recentAnnouncements,
            'activity' => $this->activityFeed($schoolId),
            'monthly_comparison' => $this->monthlyComparison($schoolId),
        ]);
    }

    /** Last 6 months of attendance rate. */
    private function attendanceTrend(int $schoolId): array
    {
        $expr = $this->monthExpr('date');

        $rows = DB::table('attendances')
            ->where('school_id', $schoolId)
            ->where('type', 'Student')
            ->selectRaw("{$expr} as month")
            ->selectRaw("COUNT(*) as total")
            ->selectRaw("SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status = 'Half-Day' THEN 0.5 ELSE 0 END) as half_days")
            ->selectRaw("SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent")
            ->selectRaw("SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late")
            ->groupBy('month')
            ->pluck('total', 'month');

        $series = [];
        $cursor = now()->startOfMonth()->subMonths(5);

        for ($i = 0; $i < 6; $i++) {
            $key = $cursor->format('Y-m');
            $total = (int) ($rows[$key] ?? 0);
            $record = DB::table('attendances')
                ->where('school_id', $schoolId)->where('type', 'Student')
                ->whereRaw("{$expr} = ?", [$key])
                ->selectRaw("COALESCE(SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END),0) as present")
                ->selectRaw("COALESCE(SUM(CASE WHEN status='Half-Day' THEN 1 ELSE 0 END),0) as half")
                ->selectRaw("COALESCE(SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END),0) as absent")
                ->selectRaw("COALESCE(SUM(CASE WHEN status='Late' THEN 1 ELSE 0 END),0) as late")
                ->first();

            $series[] = [
                'month' => $key,
                'total' => $total,
                'present' => (int) $record->present,
                'absent' => (int) $record->absent,
                'late' => (int) $record->late,
                'rate' => $total > 0
                    ? round(((int) $record->present + (int) $record->half * 0.5) / $total * 100, 1)
                    : null,
            ];
            $cursor->addMonth();
        }

        return $series;
    }

    /** Last 6 months of billed vs collected fees. */
    private function feeTrend(int $schoolId): array
    {
        $series = [];
        $cursor = now()->startOfMonth()->subMonths(5);

        for ($i = 0; $i < 6; $i++) {
            $start = $cursor->copy()->startOfMonth();
            $end = $cursor->copy()->endOfMonth();

            $billed = (float) FeeInvoice::where('school_id', $schoolId)
                ->whereBetween('due_date', [$start->toDateString(), $end->toDateString()])->sum('amount');

            $collected = (float) FeePayment::where('school_id', $schoolId)
                ->where('status', 'Completed')
                ->whereBetween('payment_date', [$start->toDateString(), $end->toDateString()])->sum('amount');

            $series[] = [
                'month' => $cursor->format('Y-m'),
                'billed' => round($billed, 2),
                'collected' => round($collected, 2),
                'outstanding' => round(max(0, $billed - $collected), 2),
                'rate' => $billed > 0 ? round($collected / $billed * 100, 1) : null,
            ];
            $cursor->addMonth();
        }

        return $series;
    }

    /** Attendance rate per class over the current month. */
    private function classAttendance(int $schoolId): array
    {
        $start = now()->startOfMonth()->toDateString();

        $rows = DB::table('attendances')
            ->join('classes', 'classes.id', '=', 'attendances.class_id')
            ->where('attendances.school_id', $schoolId)
            ->where('attendances.type', 'Student')
            ->whereDate('attendances.date', '>=', $start)
            ->groupBy('classes.id', 'classes.name', 'classes.section')
            ->select('classes.id', 'classes.name', 'classes.section')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN attendances.status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN attendances.status='Absent' THEN 1 ELSE 0 END) as absent")
            ->selectRaw("SUM(CASE WHEN attendances.status='Late' THEN 1 ELSE 0 END) as late")
            ->get()
            ->map(function ($r) {
                $den = (int) $r->total;

                return [
                    'class_id' => $r->id,
                    'class' => trim($r->name.'-'.$r->section),
                    'total' => $den,
                    'present' => (int) $r->present,
                    'absent' => (int) $r->absent,
                    'late' => (int) $r->late,
                    'rate' => $den > 0 ? round((int) $r->present / $den * 100, 1) : null,
                ];
            });

        return $rows->sortByDesc('rate')->values()->all();
    }

    /** Average score per subject across all published marks. */
    private function subjectAverages(int $schoolId): array
    {
        return Mark::where('marks.school_id', $schoolId)
            ->join('subjects', 'subjects.id', '=', 'marks.subject_id')
            ->groupBy('subjects.id', 'subjects.name')
            ->select('subjects.id', 'subjects.name')
            ->selectRaw('COUNT(*) as entries')
            ->selectRaw('AVG(marks.marks_obtained) as avg_obtained')
            ->selectRaw('AVG(marks.total_marks) as avg_total')
            ->orderByDesc('avg_obtained')
            ->limit(12)
            ->get()
            ->map(function ($r) {
                $avgTotal = (float) $r->avg_total;

                return [
                    'subject_id' => $r->id,
                    'subject' => $r->name,
                    'entries' => (int) $r->entries,
                    'average' => round((float) $r->avg_obtained, 2),
                    'max' => round($avgTotal, 2),
                    'percentage' => $avgTotal > 0 ? round((float) $r->avg_obtained / $avgTotal * 100, 1) : null,
                ];
            })
            ->all();
    }

    /** Unified "recent activity" feed built from real audit + domain records. */
    private function activityFeed(int $schoolId): array
    {
        $items = [];

        Student::where('school_id', $schoolId)->latest()->limit(6)->get()
            ->each(fn (Student $s) => $items[] = [
                'type' => 'student_enrolled',
                'title' => $s->full_name.' enrolled',
                'meta' => $s->admission_number,
                'at' => $s->created_at,
            ]);

        Announcement::where('school_id', $schoolId)->latest()->limit(5)->get()
            ->each(fn (Announcement $a) => $items[] = [
                'type' => 'announcement',
                'title' => 'Announcement: '.$a->title,
                'meta' => $a->target_audience,
                'at' => $a->created_at,
            ]);

        FeePayment::where('school_id', $schoolId)->latest()->limit(6)->get()
            ->each(fn (FeePayment $p) => $items[] = [
                'type' => 'payment',
                'title' => 'Payment received',
                'meta' => (float) $p->amount.' via '.$p->payment_method,
                'at' => $p->created_at,
            ]);

        Teacher::where('school_id', $schoolId)->latest()->limit(4)->get()
            ->each(fn (Teacher $t) => $items[] = [
                'type' => 'teacher_added',
                'title' => $t->full_name.' joined the staff',
                'meta' => $t->employee_id,
                'at' => $t->created_at,
            ]);

        ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
            ->with('exam')->latest('date')->limit(4)->get()
            ->each(fn (ExamSchedule $s) => $items[] = [
                'type' => 'exam_schedule',
                'title' => ($s->exam?->name ?? 'Exam').' schedule published',
                'meta' => $s->date?->format('d M Y'),
                'at' => $s->created_at,
            ]);

        usort($items, fn ($a, $b) => ($b['at']?->timestamp ?? 0) <=> ($a['at']?->timestamp ?? 0));

        return array_map(fn ($i) => [
            'type' => $i['type'],
            'title' => $i['title'],
            'meta' => $i['meta'],
            'at' => $i['at']?->toIso8601String(),
        ], array_slice($items, 0, 15));
    }

    /** This month vs last month on the three headline metrics. */
    private function monthlyComparison(int $schoolId): array
    {
        $thisStart = now()->startOfMonth();
        $thisEnd = now();
        $lastStart = now()->startOfMonth()->subMonth();
        $lastEnd = now()->startOfMonth()->subDay();

        $attendance = function ($from, $to) use ($schoolId) {
            $rows = Attendance::where('school_id', $schoolId)->where('type', 'Student')
                ->whereBetween('date', [$from->toDateString(), $to->toDateString()])
                ->selectRaw('COUNT(*) as total')
                ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
                ->first();

            $total = (int) ($rows->total ?? 0);

            return [
                'total' => $total,
                'rate' => $total > 0 ? round((int) $rows->present / $total * 100, 1) : null,
            ];
        };

        $fees = function ($from, $to) use ($schoolId) {
            return (float) FeePayment::where('school_id', $schoolId)->where('status', 'Completed')
                ->whereBetween('payment_date', [$from->toDateString(), $to->toDateString()])->sum('amount');
        };

        return [
            'attendance' => [
                'this_month' => $attendance($thisStart, $thisEnd),
                'last_month' => $attendance($lastStart, $lastEnd),
            ],
            'collection' => [
                'this_month' => round($fees($thisStart, $thisEnd), 2),
                'last_month' => round($fees($lastStart, $lastEnd), 2),
            ],
            'students' => [
                'this_month' => Student::where('school_id', $schoolId)->where('created_at', '>=', $thisStart)->count(),
                'last_month' => Student::where('school_id', $schoolId)
                    ->whereBetween('created_at', [$lastStart, $lastEnd])->count(),
            ],
        ];
    }

    /** Number of weekdays this month with no attendance recorded at all. */
    private function unmarkedAttendanceDays(int $schoolId): int
    {
        $marked = Attendance::where('school_id', $schoolId)
            ->where('type', 'Student')
            ->whereBetween('date', [now()->startOfMonth()->toDateString(), now()->toDateString()])
            ->distinct()
            ->count('date');

        $weekdays = 0;
        $cursor = now()->startOfMonth();

        while ($cursor->lte(now())) {
            if ($cursor->isWeekday()) {
                $weekdays++;
            }
            $cursor->addDay();
        }

        return max(0, $weekdays - $marked);
    }

    private function monthExpr(string $column): string
    {
        return DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', {$column})"
            : "DATE_FORMAT({$column}, '%Y-%m')";
    }
}