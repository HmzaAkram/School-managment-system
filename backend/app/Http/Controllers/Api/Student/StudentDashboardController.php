<?php

namespace App\Http\Controllers\Api\Student;

use App\Helpers\GradeScale;
use App\Http\Controllers\Api\ApiController;
use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\Event;
use App\Models\ExamSchedule;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Mark;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\StudentLeave;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Timetable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentDashboardController extends ApiController
{
    /**
     * Resolve the student for the current session.
     * Students get themselves; parents may pass `?student_id=` to view a child.
     */
    public function resolveStudent(Request $request)
    {
        $user = $request->user();

        if ($user->isStudent() && $user->student) {
            return $user->student;
        }

        if ($user->isParent() && $user->parentProfile) {
            $children = $user->parentProfile->students();

            if ($request->filled('student_id')) {
                return $children->where('student_profiles.id', $request->query('student_id'))->first();
            }

            return $children->first();
        }

        return null;
    }

    private function student(Request $request)
    {
        $student = $this->resolveStudent($request);

        abort_if(! $student, 404, 'Student profile not found');

        return $student;
    }

    /** Children a parent may switch between. */
    public function getMyStudents(Request $request)
    {
        $user = $request->user();

        if ($user->isStudent() && $user->student) {
            return response()->json([$this->studentSummary($user->student)]);
        }

        $children = $user->parentProfile?->students ?? collect();

        return response()->json($children->map(fn (Student $s) => $this->studentSummary($s))->values());
    }

    // ─────────────────────────── Dashboard ───────────────────────────

    public function stats(Request $request)
    {
        $student = $this->student($request)->load(['class', 'section', 'school']);
        $schoolId = $student->school_id;
        $today = now()->toDateString();

        // Attendance (all time + this month)
        $attAll = Attendance::where('student_id', $student->id)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent")
            ->selectRaw("SUM(CASE WHEN status='Late' THEN 1 ELSE 0 END) as late")
            ->selectRaw("SUM(CASE WHEN status='Half-Day' THEN 1 ELSE 0 END) as half_day")
            ->first();

        $totalAtt = (int) ($attAll->total ?? 0);
        $attThisMonth = Attendance::where('student_id', $student->id)
            ->whereDate('date', '>=', now()->startOfMonth()->toDateString())
            ->count();

        $attendancePercentage = $totalAtt > 0
            ? round(((int) $attAll->present + (int) $attAll->late) / $totalAtt * 100, 1)
            : null;

        // Fees
        $invoices = FeeInvoice::where('student_id', $student->id)->get();
        $totalPendingFee = (float) $invoices
            ->filter(fn (FeeInvoice $i) => in_array($i->status, ['Unpaid', 'Partial', 'Overdue'], true))
            ->sum(fn (FeeInvoice $i) => max(0, (float) $i->amount - (float) $i->paid_amount));

        $feeStatus = 'Paid';
        if ($invoices->contains(fn ($i) => $i->status === 'Overdue')) {
            $feeStatus = 'Overdue';
        } elseif ($totalPendingFee > 0.004) {
            $feeStatus = 'Partial';
        }
        if ($invoices->isEmpty()) {
            $feeStatus = 'No Invoices';
        }

        // Grades -> GPA
        $marks = Mark::where('student_id', $student->id)
            ->with(['subject:id,name,code,credits', 'exam:id,name,term'])->get();

        $gpa = $marks->count() > 0 ? round((float) $marks->avg('gpa_point'), 2) : null;
        $overallPercent = $marks->count() > 0
            ? round($marks->avg(fn (Mark $m) => $m->percentage), 1)
            : null;

        // Assignments
        $assignmentIds = Assignment::where('school_id', $schoolId)
            ->when($student->class_id, fn ($q) => $q->where('class_id', $student->class_id))
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->pluck('id');

        $mySubmissions = AssignmentSubmission::where('student_id', $student->id)->get();
        $submittedIds = $mySubmissions->pluck('assignment_id');
        $gradedIds = $mySubmissions->where('status', 'Graded')->pluck('assignment_id');

        $pendingAssignments = $assignmentIds->diff($submittedIds)->count();
        $gradedAssignments = $gradedIds->count();

        // Today's timetable
        $dayName = now()->format('l');
        $timetable = Timetable::where('class_id', $student->class_id)
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->where('day_of_week', $dayName)
            ->with(['subject:id,name,code', 'teacher:id,first_name,last_name'])
            ->orderBy('start_time')->get()
            ->map(fn (Timetable $t) => [
                'id' => $t->id,
                'period' => (int) $t->period,
                'start_time' => $t->start_time,
                'end_time' => $t->end_time,
                'subject' => $t->subject?->name,
                'teacher' => $t->teacher?->full_name,
                'room' => $t->room_number,
            ]);

        // Recent context
        $recentMarks = $marks->sortByDesc('created_at')->take(5)->map(fn (Mark $m) => [
            'id' => $m->id,
            'exam' => $m->exam?->name,
            'subject' => $m->subject?->name,
            'marks_obtained' => (float) $m->marks_obtained,
            'total_marks' => (float) $m->total_marks,
            'percentage' => $m->percentage,
            'grade' => $m->grade,
        ])->all();

        $recentAssignments = Assignment::whereIn('id', $assignmentIds)
            ->with(['subject:id,name,code', 'class:id,name,section'])
            ->orderByDesc('due_date')->limit(5)->get()
            ->map(fn (Assignment $a) => $this->assignmentSummary($a, $mySubmissions->firstWhere('assignment_id', $a->id)))
            ->all();

        $recentDiaries = $this->diaryQuery($student)->limit(5)->get()
            ->map(fn (Diary $d) => [
                'id' => $d->id,
                'date' => $d->date?->toDateString(),
                'task' => $d->task,
                'type' => $d->type,
                'subject' => $d->subject?->name,
                'teacher' => $d->teacher?->full_name,
            ])->all();

        $recentNotices = Announcement::where('school_id', $schoolId)
            ->whereIn('target_audience', ['All', 'Students'])
            ->where(function ($q) use ($student) {
                $q->whereNull('class_id');
                if ($student->class_id) {
                    $q->orWhere('class_id', $student->class_id);
                }
            })
            ->latest()->limit(5)->get()
            ->map(fn (Announcement $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'content' => $a->content,
                'priority' => $a->priority,
                'pinned' => (bool) $a->pinned,
                'publish_date' => $a->publish_date?->toDateString(),
            ])->all();

        $upcomingExams = ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
            ->where('class_id', $student->class_id)
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->whereDate('date', '>=', $today)
            ->with(['exam:id,name,term', 'subject:id,name,code'])
            ->orderBy('date')->limit(5)->get()
            ->map(fn (ExamSchedule $s) => [
                'id' => $s->id,
                'exam' => $s->exam?->name,
                'subject' => $s->subject?->name,
                'date' => $s->date?->toDateString(),
                'start_time' => $s->start_time,
                'room' => $s->room_number,
                'days_away' => $s->date ? (int) now()->startOfDay()->diffInDays($s->date->startOfDay(), false) : null,
            ])->all();

        $upcomingEvents = Event::where('school_id', $schoolId)
            ->whereIn('audience', ['All', 'Students'])
            ->whereDate('start_date', '>=', $today)
            ->orderBy('start_date')->limit(5)->get()
            ->map(fn (Event $e) => [
                'id' => $e->id,
                'title' => $e->title,
                'start_date' => $e->start_date?->toDateString(),
                'location' => $e->location,
                'event_type' => $e->event_type,
            ])->all();

        return response()->json([
            'student' => $this->studentSummary($student),
            'academic_year' => $this->currentAcademicYear($schoolId),
            'stats' => [
                'attendance_percentage' => $attendancePercentage,
                'attendance_present' => (int) $attAll->present,
                'attendance_absent' => (int) $attAll->absent,
                'attendance_late' => (int) $attAll->late,
                'attendance_records' => $totalAtt,
                'attendance_this_month' => $attThisMonth,
                'total_pending_fee' => round($totalPendingFee, 2),
                'fee_status' => $feeStatus,
                'gpa' => $gpa,
                'overall_percentage' => $overallPercent,
                'total_assignments' => $assignmentIds->count(),
                'submitted_assignments' => $submittedIds->count(),
                'pending_assignments' => $pendingAssignments,
                'graded_assignments' => $gradedAssignments,
                'pending_grading' => $mySubmissions->whereIn('status', ['Pending', 'Submitted'])->count(),
                'periods_today' => $timetable->count(),
            ],
            'recent_marks' => $recentMarks,
            'assignments' => $recentAssignments,
            'timetable' => $timetable,
            'diaries' => $recentDiaries,
            'notices' => $recentNotices,
            'upcoming_exams' => $upcomingExams,
            'upcoming_events' => $upcomingEvents,
        ]);
    }

    // ─────────────────────────── Assignments ───────────────────────────

    public function getAssignments(Request $request)
    {
        $student = $this->student($request);

        $submissions = AssignmentSubmission::where('student_id', $student->id)->get()
            ->keyBy('assignment_id');

        $query = Assignment::where('school_id', $student->school_id)
            ->when($student->class_id, fn ($q) => $q->where('class_id', $student->class_id))
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->with(['subject:id,name,code', 'teacher:id,first_name,last_name', 'class:id,name,section']);

        if ($request->filled('status')) {
            $status = $request->query('status');

            if ($status === 'Pending') {
                $query->whereNotIn('id', $submissions->keys());
            } elseif ($status === 'Submitted') {
                $query->whereIn('id', $submissions->keys());
            }
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->query('subject_id'));
        }

        $paginator = $query->orderByDesc('due_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())
                ->map(fn (Assignment $a) => $this->assignmentSummary($a, $submissions->get($a->id)))
                ->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => [
                'total' => Assignment::where('class_id', $student->class_id)->count(),
                'submitted' => $submissions->count(),
                'graded' => $submissions->where('status', 'Graded')->count(),
                'pending' => $submissions->whereIn('status', ['Pending', 'Submitted'])->count(),
            ],
        ]);
    }

    public function submitAssignment(Request $request, $assignmentId)
    {
        $student = $this->student($request);

        $assignment = Assignment::where('school_id', $student->school_id)
            ->where('class_id', $student->class_id)
            ->findOrFail($assignmentId);

        $data = $request->validate([
            'content' => 'required|string',
            'file_url' => 'nullable|string|max:255',
        ]);

        $submission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $student->id],
            [
                'submitted_at' => now(),
                'content' => $data['content'],
                'file_url' => $data['file_url'] ?? null,
                'status' => 'Submitted',
                'graded_at' => null,
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Assignment submitted successfully',
            'submission' => $submission,
        ]);
    }

    // ─────────────────────────── Diary ───────────────────────────

    public function getDiaries(Request $request)
    {
        $student = $this->student($request);

        $query = $this->diaryQuery($student);

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $paginator = $query->orderByDesc('date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Diary $d) => [
                'id' => $d->id,
                'date' => $d->date?->toDateString(),
                'task' => $d->task,
                'notes' => $d->notes,
                'note' => $d->note,
                'type' => $d->type,
                'completed' => (bool) $d->completed,
                'subject' => $d->subject?->name,
                'subject_code' => $d->subject?->code,
                'teacher' => $d->teacher?->full_name,
                'teacher_id' => $d->teacher_id,
                'acknowledged_at' => $d->parent_acknowledged_at?->toIso8601String(),
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function acknowledgeDiary(Request $request, $id)
    {
        $student = $this->student($request);

        $diary = $this->diaryQuery($student)->findOrFail($id);
        $diary->update(['parent_acknowledged_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Diary entry acknowledged',
            'diary' => $diary->fresh(),
        ]);
    }

    // ─────────────────────────── Attendance ───────────────────────────

    public function getAttendance(Request $request)
    {
        $student = $this->student($request);

        $query = Attendance::where('student_id', $student->id)
            ->with(['class:id,name,section', 'section:id,name']);

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->query('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->query('to'));
        }

        $paginator = $query->orderByDesc('date')->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Attendance $a) => [
                'id' => $a->id,
                'date' => $a->date?->toDateString(),
                'status' => $a->status,
                'remarks' => $a->remarks,
                'class' => $a->class?->name,
                'section' => $a->section?->name,
                'marked_by' => $a->marked_by,
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function getAttendanceSummary(Request $request)
    {
        $student = $this->student($request);

        $total = Attendance::where('student_id', $student->id)->count();

        $byStatus = Attendance::where('student_id', $student->id)
            ->select('status')->selectRaw('COUNT(*) as total')
            ->groupBy('status')->pluck('total', 'status');

        // Last 6 months
        $monthExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', date)"
            : "DATE_FORMAT(date, '%Y-%m')";

        $monthly = Attendance::where('student_id', $student->id)
            ->selectRaw("{$monthExpr} as month")
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent")
            ->groupBy('month')->orderBy('month')->get()
            ->keyBy('month');

        $series = [];
        $cursor = now()->startOfMonth()->subMonths(5);

        for ($i = 0; $i < 6; $i++) {
            $key = $cursor->format('Y-m');
            $row = $monthly->get($key);
            $t = (int) ($row->total ?? 0);
            $p = (int) ($row->present ?? 0);

            $series[] = [
                'month' => $key,
                'total' => $t,
                'present' => $p,
                'absent' => (int) ($row->absent ?? 0),
                'rate' => $t > 0 ? round($p / $t * 100, 1) : null,
            ];
            $cursor->addMonth();
        }

        return response()->json([
            'summary' => [
                'total' => $total,
                'present' => (int) ($byStatus->get('Present') ?? 0),
                'absent' => (int) ($byStatus->get('Absent') ?? 0),
                'late' => (int) ($byStatus->get('Late') ?? 0),
                'half_day' => (int) ($byStatus->get('Half-Day') ?? 0),
                'excused' => (int) ($byStatus->get('Excused') ?? 0),
                'rate' => $total > 0
                    ? round(((int) ($byStatus->get('Present') ?? 0) + (int) ($byStatus->get('Late') ?? 0)) / $total * 100, 1)
                    : null,
            ],
            'monthly' => $series,
        ]);
    }

    // ─────────────────────────── Grades ───────────────────────────

    public function getMarks(Request $request)
    {
        $student = $this->student($request);

        $query = Mark::where('student_id', $student->id)
            ->with(['subject:id,name,code,credits,total_marks', 'exam:id,name,term,start_date']);

        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->query('exam_id'));
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->query('subject_id'));
        }

        $paginator = $query->orderByDesc('exam_id')->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Mark $m) => [
                'id' => $m->id,
                'exam_id' => $m->exam_id,
                'exam' => $m->exam?->name,
                'term' => $m->exam?->term,
                'exam_date' => $m->exam?->start_date?->toDateString(),
                'subject_id' => $m->subject_id,
                'subject' => $m->subject?->name,
                'subject_code' => $m->subject?->code,
                'credits' => $m->subject?->credits,
                'marks_obtained' => (float) $m->marks_obtained,
                'total_marks' => (float) $m->total_marks,
                'percentage' => $m->percentage,
                'grade' => $m->grade,
                'gpa_point' => (float) $m->gpa_point,
                'remarks' => $m->remarks,
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function getGradesSummary(Request $request)
    {
        $student = $this->student($request);

        $marks = Mark::where('student_id', $student->id)
            ->with(['subject:id,name,code,credits', 'exam:id,name,term'])->get();

        $byExam = $marks->groupBy('exam_id')->map(function ($group, $examId) {
            $obtained = (float) $group->sum('marks_obtained');
            $total = (float) $group->sum('total_marks');
            $percent = $total > 0 ? ($obtained / $total) * 100 : 0;

            return [
                'exam_id' => $examId,
                'exam' => $group->first()?->exam?->name ?? '—',
                'term' => $group->first()?->exam?->term,
                'subjects' => $group->count(),
                'obtained' => round($obtained, 2),
                'total' => round($total, 2),
                'percentage' => round($percent, 2),
                'grade' => GradeScale::forPercentage($percent)['grade'],
                'gpa' => round((float) $group->avg('gpa_point'), 2),
                'result' => $percent >= 33 ? 'Pass' : 'Fail',
            ];
        })->values()->sortByDesc('exam_id')->all();

        $bySubject = $marks->groupBy('subject_id')->map(function ($group, $subjectId) {
            $obtained = (float) $group->sum('marks_obtained');
            $total = (float) $group->sum('total_marks');
            $percent = $total > 0 ? ($obtained / $total) * 100 : 0;
            $first = $group->first();

            return [
                'subject_id' => $subjectId,
                'subject' => $first?->subject?->name ?? '—',
                'code' => $first?->subject?->code,
                'credits' => $first?->subject?->credits,
                'obtained' => round($obtained, 2),
                'total' => round($total, 2),
                'percentage' => round($percent, 2),
                'grade' => GradeScale::forPercentage($percent)['grade'],
                'result' => $percent >= 33 ? 'Pass' : 'Fail',
            ];
        })->values()->sortByDesc('percentage')->all();

        $overallPercent = $marks->count() > 0 ? round($marks->avg(fn (Mark $m) => $m->percentage), 2) : null;

        return response()->json([
            'summary' => [
                'entries' => $marks->count(),
                'gpa' => $marks->count() > 0 ? round((float) $marks->avg('gpa_point'), 2) : null,
                'percentage' => $overallPercent,
                'grade' => $overallPercent !== null
                    ? GradeScale::forPercentage($overallPercent)['grade']
                    : null,
                'subjects_passed' => collect($bySubject)->where('result', 'Pass')->count(),
                'subjects_failed' => collect($bySubject)->where('result', 'Fail')->count(),
            ],
            'by_exam' => $byExam,
            'by_subject' => $bySubject,
            'grade_scale' => GradeScale::grades(),
        ]);
    }

    // ─────────────────────────── Exams ───────────────────────────

    public function getExams(Request $request)
    {
        $student = $this->student($request);

        $schedules = ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $student->school_id))
            ->where('class_id', $student->class_id)
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->with(['exam:id,school_id,name,term,status,start_date,end_date', 'subject:id,name,code'])
            ->orderBy('date')
            ->get();

        $results = Mark::where('student_id', $student->id)
            ->get()->keyBy(fn (Mark $m) => $m->exam_id.'-'.$m->subject_id);

        $grouped = $schedules->groupBy('exam_id')->map(function ($rows, $examId) use ($results) {
            return [
                'exam_id' => $examId,
                'exam' => $rows->first()?->exam?->name ?? '—',
                'term' => $rows->first()?->exam?->term,
                'status' => $rows->first()?->exam?->status,
                'start_date' => $rows->first()?->exam?->start_date?->toDateString(),
                'end_date' => $rows->first()?->exam?->end_date?->toDateString(),
                'papers' => $rows->map(fn (ExamSchedule $s) => [
                    'id' => $s->id,
                    'subject' => $s->subject?->name,
                    'subject_code' => $s->subject?->code,
                    'date' => $s->date?->toDateString(),
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                    'room' => $s->room_number,
                    'max_marks' => (float) $s->max_marks,
                    'result' => ($r = $results->get($examId.'-'.$s->subject_id))
                        ? [
                            'marks_obtained' => (float) $r->marks_obtained,
                            'percentage' => $r->percentage,
                            'grade' => $r->grade,
                        ]
                        : null,
                ])->values(),
            ];
        })->values();

        return response()->json($grouped);
    }

    // ─────────────────────────── Announcements ───────────────────────────

    public function getAnnouncements(Request $request)
    {
        $student = $this->student($request);

        $query = Announcement::where('school_id', $student->school_id)
            ->whereIn('target_audience', ['All', 'Students', 'Parents'])
            ->where(function ($q) use ($student) {
                $q->whereNull('class_id');
                if ($student->class_id) {
                    $q->orWhere('class_id', $student->class_id);
                }
            });

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        $paginator = $query->orderByDesc('pinned')->orderByDesc('publish_date')->orderByDesc('created_at')
            ->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Announcement $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'content' => $a->content,
                'category' => $a->category,
                'priority' => $a->priority,
                'pinned' => (bool) $a->pinned,
                'target_audience' => $a->target_audience,
                'publish_date' => $a->publish_date?->toDateString(),
                'expiry_date' => $a->expiry_date?->toDateString(),
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    // ─────────────────────────── Fees ───────────────────────────

    public function getInvoices(Request $request)
    {
        $student = $this->student($request);

        $query = FeeInvoice::where('student_id', $student->id)
            ->with(['feeStructure:id,name,frequency,due_day', 'payments']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $paginator = $query->orderByDesc('due_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $invoices = collect($paginator->items());

        return response()->json([
            'data' => $invoices->map(fn (FeeInvoice $i) => $this->invoiceSummary($i))->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => $invoices->isEmpty() ? null : [
                'billed' => round((float) $invoices->sum('amount'), 2),
                'paid' => round((float) $invoices->sum('paid_amount'), 2),
                'due' => round((float) $invoices->sum(fn (FeeInvoice $i) => max(0, (float) $i->amount - (float) $i->paid_amount)), 2),
            ],
        ]);
    }

    public function getFeeSummary(Request $request)
    {
        $student = $this->student($request);

        $invoices = FeeInvoice::where('student_id', $student->id)->get();
        $payments = FeePayment::where('student_id', $student->id)
            ->where('status', 'Completed')->orderByDesc('payment_date')->get();

        $billed = (float) $invoices->sum('amount');
        $paid = (float) $invoices->sum('paid_amount');

        $nextDue = $invoices
            ->filter(fn (FeeInvoice $i) => (float) $i->amount - (float) $i->paid_amount > 0.004)
            ->sortBy('due_date')
            ->first();

        $monthExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', payment_date)"
            : "DATE_FORMAT(payment_date, '%Y-%m')";

        $paidByMonth = $payments
            ->groupBy(fn (FeePayment $p) => $p->payment_date?->format('Y-m'))
            ->map->sum('amount');

        $trend = [];
        $cursor = now()->startOfMonth()->subMonths(5);
        for ($i = 0; $i < 6; $i++) {
            $key = $cursor->format('Y-m');
            $trend[] = ['month' => $key, 'paid' => round((float) ($paidByMonth[$key] ?? 0), 2)];
            $cursor->addMonth();
        }

        return response()->json([
            'summary' => [
                'billed' => round($billed, 2),
                'paid' => round($paid, 2),
                'due' => round(max(0, $billed - $paid), 2),
                'collection_rate' => $billed > 0 ? round($paid / $billed * 100, 1) : null,
                'invoice_count' => $invoices->count(),
                'overdue_count' => $invoices->filter(fn (FeeInvoice $i) => $i->status === 'Overdue'
                    || ($i->due_date !== null && $i->due_date->lt(now()) && (float) $i->amount > (float) $i->paid_amount))->count(),
            ],
            'next_due' => $nextDue ? $this->invoiceSummary($nextDue) : null,
            'payments' => $payments->take(20)->map(fn (FeePayment $p) => [
                'id' => $p->id,
                'receipt_no' => $p->receipt_no,
                'amount' => (float) $p->amount,
                'payment_method' => $p->payment_method,
                'payment_date' => $p->payment_date?->toDateString(),
                'status' => $p->status,
            ])->all(),
            'trend' => $trend,
        ]);
    }

    public function getFeeStructures(Request $request)
    {
        $student = $this->student($request);

        $structures = FeeStructure::where('school_id', $student->school_id)
            ->where('status', 'Active')
            ->where(function ($q) use ($student) {
                $q->whereNull('class_id');
                if ($student->class_id) {
                    $q->orWhere('class_id', $student->class_id);
                }
            })
            ->with('class:id,name,section')
            ->get();

        return response()->json($structures->map(fn (FeeStructure $f) => [
            'id' => $f->id,
            'name' => $f->name,
            'amount' => (float) $f->amount,
            'frequency' => $f->frequency,
            'due_day' => (int) $f->due_day,
            'description' => $f->description,
            'class' => $f->class?->name,
        ]));
    }

    // ─────────────────────────── Classes / timetable ───────────────────────────

    public function getCourses(Request $request)
    {
        $student = $this->student($request);

        $class = SchoolClass::where('school_id', $student->school_id)
            ->where('id', $student->class_id)
            ->with('subjects')
            ->first();

        if (! $class) {
            return response()->json([]);
        }

        // All periods for the class, grouped per subject (not just the first).
        $timetable = Timetable::where('class_id', $class->id)
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->with(['subject:id,name,code', 'teacher:id,first_name,last_name'])
            ->orderBy('start_time')
            ->get()
            ->groupBy('subject_id');

        $teachersBySubject = Teacher::where('school_id', $student->school_id)
            ->whereHas('subjects', fn ($q) => $q->whereIn('subjects.id', $class->subjects->pluck('id')))
            ->with('subjects:id,name')
            ->get();

        return response()->json($class->subjects->map(function (Subject $subject) use ($timetable, $teachersBySubject) {
            $periods = $timetable->get($subject->id, collect());

            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'type' => $subject->type,
                'credits' => $subject->credits,
                'total_marks' => (float) $subject->total_marks,
                'pass_marks' => (float) $subject->pass_marks,
                'teachers' => $teachersBySubject
                    ->filter(fn (Teacher $t) => $t->subjects->contains('id', $subject->id))
                    ->map(fn (Teacher $t) => [
                        'id' => $t->id,
                        'name' => $t->full_name,
                        'designation' => $t->designation,
                    ])->values(),
                'periods_per_week' => $periods->count(),
                'schedule' => $periods->map(fn (Timetable $t) => [
                    'day' => $t->day_name,
                    'period' => (int) $t->period,
                    'start_time' => $t->start_time,
                    'end_time' => $t->end_time,
                    'room' => $t->room_number,
                    'teacher' => $t->teacher?->full_name,
                ])->values(),
            ];
        })->values());
    }

    public function getTimetable(Request $request)
    {
        $student = $this->student($request);

        $entries = Timetable::where('class_id', $student->class_id)
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->with(['subject:id,name,code', 'teacher:id,first_name,last_name'])
            ->orderBy('start_time')->get();

        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $dayName = now()->format('l');

        $slots = $entries->map(fn (Timetable $t) => $t->start_time.'-'.$t->end_time)
            ->unique()->sort()->values()
            ->map(fn ($s) => ['label' => str_replace('-', ' – ', $s)]);

        return response()->json([
            'days' => $days,
            'today' => $dayName,
            'slots' => $slots,
            'entries' => $entries->map(fn (Timetable $t) => [
                'id' => $t->id,
                'day' => $t->day_name,
                'period' => (int) $t->period,
                'slot' => $t->start_time.'-'.$t->end_time,
                'start_time' => $t->start_time,
                'end_time' => $t->end_time,
                'subject' => $t->subject?->name,
                'subject_code' => $t->subject?->code,
                'teacher' => $t->teacher?->full_name,
                'room' => $t->room_number,
                'is_today' => $t->day_name === $dayName,
            ])->all(),
        ]);
    }

    // ─────────────────────────── Leaves ───────────────────────────

    public function getLeaves(Request $request)
    {
        $student = $this->student($request);

        return response()->json(
            StudentLeave::where('student_id', $student->id)
                ->orderByDesc('from_date')->get()
                ->map(fn (StudentLeave $l) => [
                    'id' => $l->id,
                    'leave_type' => $l->leave_type,
                    'from_date' => $l->from_date?->toDateString(),
                    'to_date' => $l->to_date?->toDateString(),
                    'days' => $l->to_date ? $l->from_date->diffInDays($l->to_date) + 1 : 1,
                    'reason' => $l->reason,
                    'status' => $l->status,
                    'remarks' => $l->remarks,
                    'reviewed_at' => $l->reviewed_at?->toIso8601String(),
                ])
        );
    }

    public function storeLeave(Request $request)
    {
        $student = $this->student($request);

        $data = $request->validate([
            'leave_type' => 'required|string|max:50',
            'from_date' => 'required|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'reason' => 'nullable|string',
        ]);

        $leave = StudentLeave::create([
            'school_id' => $student->school_id,
            'student_id' => $student->id,
            'class_id' => $student->class_id,
            'leave_type' => $data['leave_type'],
            'from_date' => $data['from_date'],
            'to_date' => $data['to_date'] ?? null,
            'reason' => $data['reason'] ?? null,
            'status' => 'Pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Leave request submitted',
            'leave' => $leave,
        ], 201);
    }

    // ─────────────────────────── Helpers ───────────────────────────

    private function diaryQuery(Student $student)
    {
        return Diary::where('school_id', $student->school_id)
            ->when($student->class_id, fn ($q) => $q->where('class_id', $student->class_id))
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->with(['subject:id,name,code', 'teacher:id,first_name,last_name', 'class:id,name,section']);
    }

    private function studentSummary(Student $student): array
    {
        return [
            'id' => $student->id,
            'name' => $student->full_name,
            'admission_number' => $student->admission_number,
            'roll_number' => $student->roll_number,
            'class_id' => $student->class_id,
            'class' => $student->class?->name,
            'section_id' => $student->section_id,
            'section' => $student->section?->name,
            'status' => $student->status,
            'email' => $student->user?->email,
            'avatar' => $student->user?->avatar,
        ];
    }

    private function assignmentSummary(Assignment $a, ?AssignmentSubmission $sub): array
    {
        $max = (float) $a->max_score;

        return [
            'id' => $a->id,
            'title' => $a->title,
            'description' => $a->description,
            'subject' => $a->subject?->name,
            'subject_code' => $a->subject?->code,
            'class' => $a->class?->name,
            'teacher' => $a->teacher?->full_name,
            'due_date' => $a->due_date?->toDateString(),
            'max_score' => $max,
            'status' => $a->status,
            'is_overdue' => $a->due_date !== null && $a->due_date->lt(now()) && ! $sub,
            'submission_id' => $sub?->id,
            'submission_status' => $sub?->status ?? 'Not Submitted',
            'submitted_at' => $sub?->submitted_at?->toIso8601String(),
            'score' => $sub ? (float) $sub->score : null,
            'percentage' => $sub && $max > 0 ? round((float) $sub->score / $max * 100, 1) : null,
            'feedback' => $sub?->feedback,
            'file_url' => $sub?->file_url,
        ];
    }

    private function invoiceSummary(FeeInvoice $i): array
    {
        $payable = (float) $i->amount - (float) $i->discount_amount + (float) $i->fine_amount;
        $due = max(0, $payable - (float) $i->paid_amount);

        return [
            'id' => $i->id,
            'invoice_number' => $i->invoice_number,
            'title' => $i->title,
            'amount' => (float) $i->amount,
            'discount_amount' => (float) $i->discount_amount,
            'fine_amount' => (float) $i->fine_amount,
            'paid_amount' => (float) $i->paid_amount,
            'due_amount' => $due,
            'due_date' => $i->due_date?->toDateString(),
            'status' => $i->status,
            'month' => $i->month,
            'is_overdue' => $i->due_date !== null && $i->due_date->lt(now()) && $due > 0.004,
            'days_to_due' => $i->due_date
                ? (int) now()->startOfDay()->diffInDays($i->due_date->startOfDay(), false)
                : null,
            'fee_structure' => $i->feeStructure ? [
                'name' => $i->feeStructure->name,
                'frequency' => $i->feeStructure->frequency,
                'due_day' => $i->feeStructure->due_day,
            ] : null,
            'payments' => $i->relationLoaded('payments')
                ? $i->payments->map(fn ($p) => [
                    'id' => $p->id,
                    'receipt_no' => $p->receipt_no,
                    'amount' => (float) $p->amount,
                    'payment_method' => $p->payment_method,
                    'payment_date' => $p->payment_date?->toDateString(),
                    'status' => $p->status,
                ])->all()
                : [],
        ];
    }
}