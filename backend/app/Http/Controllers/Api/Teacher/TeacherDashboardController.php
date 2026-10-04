<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Api\ApiController;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\ExamSchedule;
use App\Models\Student;
use App\Models\Timetable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherDashboardController extends ApiController
{
    public function stats(Request $request)
    {
        $teacher = $request->user()->teacher;

        abort_if(! $teacher, 404, 'Teacher profile not found');

        $schoolId = $teacher->school_id;
        $today = now()->toDateString();

        // Today's periods
        $todayClasses = Timetable::where('school_id', $schoolId)
            ->where('teacher_id', $teacher->id)
            ->where('day_of_week', now()->format('l'))
            ->with(['class:id,name,section', 'section:id,name', 'subject:id,name,code'])
            ->orderBy('start_time')
            ->get()
            ->map(fn (Timetable $t) => [
                'id' => $t->id,
                'period' => (int) $t->period,
                'start_time' => $t->start_time,
                'end_time' => $t->end_time,
                'class' => $t->class?->name,
                'section' => $t->section?->name,
                'subject' => $t->subject?->name,
                'room' => $t->room_number,
                'is_ongoing' => $t->start_time <= now()->format('H:i:s') && $t->end_time >= now()->format('H:i:s'),
            ]);

        // Classes + sections this teacher is timetabled for.
        $classIds = Timetable::where('teacher_id', $teacher->id)->distinct()->pluck('class_id');
        $myClasses = \App\Models\SchoolClass::whereIn('id', $classIds)
            ->withCount('students')->get();

        $totalStudents = (int) $myClasses->sum('students_count');

        $assignmentsCount = Assignment::where('teacher_id', $teacher->id)->count();
        $activeAssignments = Assignment::where('teacher_id', $teacher->id)
            ->where('status', 'Active')
            ->whereDate('due_date', '>=', $today)->count();

        $assignmentIds = Assignment::where('teacher_id', $teacher->id)->pluck('id');
        $pendingGrading = AssignmentSubmission::whereIn('assignment_id', $assignmentIds)
            ->whereIn('status', ['Pending', 'Submitted'])->count();
        $totalSubmissions = AssignmentSubmission::whereIn('assignment_id', $assignmentIds)->count();

        $diariesCount = Diary::where('teacher_id', $teacher->id)->count();
        $diariesToday = Diary::where('teacher_id', $teacher->id)->whereDate('date', $today)->count();

        // Attendance the teacher has marked (last 30 days)
        $att = Attendance::where('marked_by', $request->user()->id)
            ->whereDate('date', '>=', now()->subDays(30)->toDateString())
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent")
            ->selectRaw("SUM(CASE WHEN status='Late' THEN 1 ELSE 0 END) as late")
            ->first();

        $attTotal = (int) ($att->total ?? 0);

        // Student attendance rate in the teacher's classes (last 30 days).
        $classAttendance = DB::table('attendances')
            ->where('school_id', $schoolId)
            ->where('type', 'Student')
            ->whereIn('class_id', $classIds)
            ->whereDate('date', '>=', now()->subDays(30)->toDateString())
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->first();

        $classAttTotal = (int) ($classAttendance->total ?? 0);

        // Upcoming exams for the teacher's subjects
        $subjectIds = $teacher->subjects->pluck('id');
        $upcomingExams = ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
            ->whereIn('subject_id', $subjectIds)
            ->whereDate('date', '>=', $today)
            ->with(['exam:id,name,term,status', 'class:id,name,section'])
            ->orderBy('date')
            ->limit(6)
            ->get()
            ->map(fn (ExamSchedule $s) => [
                'id' => $s->id,
                'exam' => $s->exam?->name,
                'term' => $s->exam?->term,
                'class' => $s->class?->name,
                'subject' => $s->subject?->name,
                'date' => $s->date?->toDateString(),
                'start_time' => $s->start_time,
                'room' => $s->room_number,
                'days_away' => $s->date ? (int) now()->startOfDay()->diffInDays($s->date->startOfDay(), false) : null,
            ]);

        // Action items the teacher must handle.
        $actionItems = [
            [
                'key' => 'pending_grading',
                'label' => 'Submissions awaiting grading',
                'count' => $pendingGrading,
                'href' => '/teacher-dashboard/assignments',
            ],
            [
                'key' => 'attendance_today',
                'label' => 'Classes without attendance today',
                'count' => $this->classesMissingAttendance($teacher->id, $today),
                'href' => '/teacher-dashboard/attendance',
            ],
            [
                'key' => 'assignments_due',
                'label' => 'Assignments due this week',
                'count' => Assignment::where('teacher_id', $teacher->id)
                    ->whereBetween('due_date', [$today, now()->addWeek()->toDateString()])->count(),
                'href' => '/teacher-dashboard/assignments',
            ],
        ];

        return response()->json([
            'teacher' => [
                'id' => $teacher->id,
                'name' => $teacher->full_name,
                'employee_id' => $teacher->employee_id,
                'designation' => $teacher->designation,
                'department' => $teacher->department,
            ],
            'academic_year' => $this->currentAcademicYear($schoolId),
            'today_classes' => $todayClasses,
            'stats' => [
                'total_students' => $totalStudents,
                'total_classes' => $myClasses->count(),
                'total_subjects' => $teacher->subjects->count(),
                'total_assignments' => $assignmentsCount,
                'active_assignments' => $activeAssignments,
                'pending_grading' => $pendingGrading,
                'total_submissions' => $totalSubmissions,
                'total_diaries' => $diariesCount,
                'diaries_today' => $diariesToday,
                'periods_today' => $todayClasses->count(),
                'attendance_marked' => $attTotal,
                'own_attendance_rate' => $attTotal > 0
                    ? round(((int) $att->present + (int) $att->late) / $attTotal * 100, 1)
                    : null,
                'avg_attendance' => $classAttTotal > 0
                    ? round((int) $classAttendance->present / $classAttTotal * 100, 1)
                    : null,
            ],
            'classes' => $myClasses->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'section' => $c->section,
                'students_count' => $c->students_count,
            ]),
            'subjects' => $teacher->subjects->map(fn ($s) => [
                'id' => $s->id, 'name' => $s->name, 'code' => $s->code, 'credits' => $s->credits,
            ]),
            'upcoming_exams' => $upcomingExams,
            'action_items' => $actionItems,
            'recent_diaries' => Diary::where('teacher_id', $teacher->id)
                ->with('class:id,name,section')->latest('date')->limit(5)->get()
                ->map(fn (Diary $d) => [
                    'id' => $d->id,
                    'date' => $d->date?->toDateString(),
                    'task' => $d->task,
                    'type' => $d->type,
                    'class' => $d->class?->name,
                ])->all(),
            'recent_assignments' => Assignment::where('teacher_id', $teacher->id)
                ->with('class:id,name,section')->latest()->limit(5)->get()
                ->map(fn (Assignment $a) => [
                    'id' => $a->id,
                    'title' => $a->title,
                    'due_date' => $a->due_date?->toDateString(),
                    'status' => $a->status,
                    'class' => $a->class?->name,
                ])->all(),
        ]);
    }

    /** Of today's periods, how many classes have no student attendance yet. */
    private function classesMissingAttendance(int $teacherId, string $today): int
    {
        $todayClassIds = Timetable::where('teacher_id', $teacherId)
            ->where('day_of_week', now()->format('l'))
            ->distinct()->pluck('class_id');

        if ($todayClassIds->isEmpty()) {
            return 0;
        }

        $markedClasses = Attendance::whereDate('date', $today)
            ->whereIn('class_id', $todayClassIds)
            ->distinct()->count('class_id');

        return max(0, $todayClassIds->count() - $markedClasses);
    }
}