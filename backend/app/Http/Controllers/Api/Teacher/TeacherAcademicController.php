<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Helpers\GradeScale;
use App\Http\Controllers\Api\ApiController;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\Mark;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\StudentReview;
use App\Models\Subject;
use App\Models\Timetable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherAcademicController extends ApiController
{
    private const ATTENDANCE_STATUSES = 'Present,Absent,Late,Half-Day,Excused';

    // ─────────────────────────── Assignments ───────────────────────────

    public function getAssignments(Request $request)
    {
        $teacher = $this->teacher($request);

        $query = Assignment::where('teacher_id', $teacher->id)
            ->with(['class:id,name,section', 'section:id,name', 'subject:id,name,code'])
            ->withCount('submissions');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->query('subject_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }

        $paginator = $query->orderByDesc('due_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $graded = AssignmentSubmission::whereIn('assignment_id', Assignment::where('teacher_id', $teacher->id)->pluck('id'))
            ->where('status', 'Graded')
            ->selectRaw('COALESCE(AVG(obtained_score),0) as avg')
            ->value('avg');

        $rosterSize = Student::where('school_id', $teacher->school_id)->count();

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Assignment $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'description' => $a->description,
                'class_id' => $a->class_id,
                'class' => $a->class?->name,
                'section' => $a->section?->name,
                'subject' => $a->subject?->name,
                'subject_code' => $a->subject?->code,
                'due_date' => $a->due_date?->toDateString(),
                'max_score' => (float) $a->max_score,
                'status' => $a->status,
                'is_overdue' => $a->due_date !== null && $a->due_date->lt(now()) && $a->status === 'Active',
                'submissions' => $a->submissions_count,
                'expected' => $rosterSize,
                'submission_rate' => $rosterSize > 0 ? round($a->submissions_count / $rosterSize * 100, 1) : null,
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => [
                'total' => Assignment::where('teacher_id', $teacher->id)->count(),
                'active' => Assignment::where('teacher_id', $teacher->id)->where('status', 'Active')->count(),
                'overdue' => Assignment::where('teacher_id', $teacher->id)
                    ->where('status', 'Active')->whereDate('due_date', '<', now()->toDateString())->count(),
                'pending_grading' => AssignmentSubmission::whereIn(
                    'assignment_id', Assignment::where('teacher_id', $teacher->id)->pluck('id')
                )->whereIn('status', ['Pending', 'Submitted'])->count(),
                'average_score' => round((float) $graded, 2),
            ],
        ]);
    }

    public function storeAssignment(Request $request)
    {
        $teacher = $this->teacher($request);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'nullable|exists:sections,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'max_marks' => 'nullable|numeric|min:1',
            'status' => 'nullable|in:Active,Closed,Draft',
        ]);

        $assignment = Assignment::create([
            'school_id' => $teacher->school_id,
            'teacher_id' => $teacher->id,
            'class_id' => $data['class_id'],
            'section_id' => $data['section_id'] ?? null,
            'subject_id' => $data['subject_id'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'due_date' => $data['due_date'],
            'max_marks' => $data['max_marks'] ?? 100,
            'max_score' => $data['max_marks'] ?? 100,
            'status' => $data['status'] ?? 'Active',
        ]);

        $this->log($request, 'created', Assignment::class, $assignment->id, $assignment->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Assignment created successfully',
            'assignment' => $assignment->load(['class', 'subject']),
        ], 201);
    }

    public function updateAssignment(Request $request, $id)
    {
        $teacher = $this->teacher($request);
        $assignment = Assignment::where('teacher_id', $teacher->id)->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|date',
            'max_marks' => 'sometimes|numeric|min:1',
            'status' => 'sometimes|in:Active,Closed,Draft',
        ]);

        if (isset($data['max_marks'])) {
            $data['max_score'] = $data['max_marks'];
        }

        $assignment->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Assignment updated',
            'assignment' => $assignment->fresh(),
        ]);
    }

    public function destroyAssignment(Request $request, $id)
    {
        $teacher = $this->teacher($request);
        $assignment = Assignment::where('teacher_id', $teacher->id)->findOrFail($id);
        $assignment->delete();

        return response()->json(['status' => 'success', 'message' => 'Assignment deleted']);
    }

    /** Submissions for one assignment. */
    public function getSubmissions(Request $request, $id)
    {
        $teacher = $this->teacher($request);
        $assignment = Assignment::where('teacher_id', $teacher->id)->findOrFail($id);

        $roster = Student::where('school_id', $teacher->school_id)
            ->where('class_id', $assignment->class_id)
            ->when($assignment->section_id, fn ($q) => $q->where('section_id', $assignment->section_id))
            ->orderBy('first_name')
            ->get();

        $subs = $assignment->submissions()->get()->keyBy('student_id');

        return response()->json([
            'assignment' => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'due_date' => $assignment->due_date?->toDateString(),
                'max_score' => (float) $assignment->max_score,
                'class' => $assignment->class?->name,
            ],
            'submissions' => $roster->map(function (Student $s) use ($subs, $assignment) {
                $sub = $subs->get($s->id);

                return [
                    'submission_id' => $sub?->id,
                    'student_id' => $s->id,
                    'student_name' => $s->full_name,
                    'roll_number' => $s->roll_number,
                    'content' => $sub?->content,
                    'file_url' => $sub?->file_url,
                    'submitted_at' => $sub?->submitted_at?->toIso8601String(),
                    'score' => $sub ? (float) $sub->score : null,
                    'max_score' => (float) $assignment->max_score,
                    'feedback' => $sub?->feedback,
                    'status' => $sub?->status ?? 'Not Submitted',
                ];
            })->all(),
        ]);
    }

    public function gradeSubmission(Request $request, $submissionId)
    {
        $teacher = $this->teacher($request);

        $submission = AssignmentSubmission::with('assignment')->findOrFail($submissionId);

        if ($submission->assignment->teacher_id !== $teacher->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'marks_obtained' => 'required|numeric|min:0',
            'feedback' => 'nullable|string',
        ]);

        $max = (float) $submission->assignment->max_score;

        if ((float) $data['marks_obtained'] > $max + 0.004) {
            return response()->json(['message' => "Score cannot exceed the maximum of {$max}."], 422);
        }

        $submission->update([
            'marks_obtained' => $data['marks_obtained'],
            'obtained_score' => $data['marks_obtained'],
            'feedback' => $data['feedback'],
            'status' => 'Graded',
            'graded_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Submission graded',
            'submission' => $submission->fresh(),
        ]);
    }

    // ─────────────────────────── Classes & students ───────────────────────────

    public function getClasses(Request $request)
    {
        $teacher = $this->teacher($request);

        $entries = Timetable::where('teacher_id', $teacher->id)
            ->with(['class:id,name,section', 'section:id,name', 'subject:id,name,code'])
            ->orderBy('day_of_week')->orderBy('start_time')->get();

        $classIds = $entries->pluck('class_id')->unique()->values();
        $sectionIds = $entries->pluck('section_id')->filter()->unique()->values();

        $classes = SchoolClass::whereIn('id', $classIds)->withCount('students')->get();

        // Next exam per class for the teacher's subjects.
        $subjectIds = $teacher->subjects->pluck('id');
        $nextExams = ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $teacher->school_id))
            ->whereIn('class_id', $classIds)
            ->whereIn('subject_id', $subjectIds)
            ->whereDate('date', '>=', now()->toDateString())
            ->with(['exam:id,name,term', 'subject:id,name,code'])
            ->orderBy('date')
            ->get()
            ->groupBy('class_id')
            ->map(fn ($group) => $group->first());

        return response()->json(
            $classes->map(function (SchoolClass $class) use ($entries, $nextExams) {
                $mine = $entries->where('class_id', $class->id);
                $exam = $nextExams->get($class->id);

                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'section' => $class->section,
                    'code' => $class->code,
                    'room' => $class->room,
                    'students_count' => $class->students_count,
                    'subjects' => $mine->pluck('subject.name')->filter()->unique()->values(),
                    'sections' => $mine->pluck('section')->filter()->unique()->values(),
                    'schedule' => $mine->map(fn (Timetable $t) => [
                        'id' => $t->id,
                        'day' => $t->day_name,
                        'period' => (int) $t->period,
                        'start_time' => $t->start_time,
                        'end_time' => $t->end_time,
                        'subject' => $t->subject?->name,
                        'section' => $t->section?->name,
                        'room' => $t->room_number,
                    ])->values(),
                    'next_exam' => $exam ? [
                        'id' => $exam->id,
                        'name' => $exam->exam?->name,
                        'term' => $exam->exam?->term,
                        'subject' => $exam->subject?->name,
                        'date' => $exam->date?->toDateString(),
                        'start_time' => $exam->start_time,
                        'room' => $exam->room_number,
                        'days_away' => $exam->date
                            ? (int) now()->startOfDay()->diffInDays($exam->date->startOfDay(), false)
                            : null,
                    ] : null,
                ];
            })
        );
    }

    public function getClassStudents(Request $request, $classId)
    {
        $teacher = $this->teacher($request);

        abort_unless($this->teachesClass($teacher->id, $classId), 403, 'You do not teach this class.');

        $students = Student::where('school_id', $teacher->school_id)
            ->where('class_id', $classId)
            ->when($request->filled('section_id'), fn ($q) => $q->where('section_id', $request->query('section_id')))
            ->orderBy('first_name')
            ->get();

        return response()->json(
            $students->map(fn (Student $s) => [
                'id' => $s->id,
                'name' => $s->full_name,
                'roll_number' => $s->roll_number,
                'admission_number' => $s->admission_number,
                'section_id' => $s->section_id,
                'status' => $s->status,
            ])
        );
    }

    // ─────────────────────────── Attendance ───────────────────────────

    public function getAttendance(Request $request)
    {
        $teacher = $this->teacher($request);

        $date = $request->query('date', now()->toDateString());

        $records = Attendance::where('school_id', $teacher->school_id)
            ->where('type', 'Student')
            ->where('marked_by', $request->user()->id)
            ->whereDate('date', $date)
            ->when($request->filled('class_id'), fn ($q) => $q->where('class_id', $request->query('class_id')))
            ->with('student:id,first_name,last_name,roll_number')
            ->get()
            ->keyBy('student_id');

        // Roster fallback: classes the teacher teaches, with unmarked students.
        $classIds = Timetable::where('teacher_id', $teacher->id)
            ->distinct()->pluck('class_id')
            ->when($request->filled('class_id'), fn ($ids) => $ids->filter(fn ($id) => $id == $request->query('class_id'))->values());

        if ($classIds->isEmpty()) {
            return response()->json([
                'date' => $date,
                'classes' => [],
                'records' => [],
                'summary' => null,
            ]);
        }

        $classes = SchoolClass::whereIn('id', $classIds)->withCount('students')->get();

        $roster = Student::where('school_id', $teacher->school_id)
            ->whereIn('class_id', $classIds)
            ->when($request->filled('section_id'), fn ($q) => $q->where('section_id', $request->query('section_id')))
            ->orderBy('first_name')
            ->get();

        return response()->json([
            'date' => $date,
            'classes' => $classes->map(fn ($c) => [
                'id' => $c->id, 'name' => $c->name, 'section' => $c->section, 'students_count' => $c->students_count,
            ]),
            'records' => $roster->map(function (Student $s) use ($records) {
                $r = $records->get($s->id);

                return [
                    'id' => $r?->id,
                    'student_id' => $s->id,
                    'student_name' => $s->full_name,
                    'roll_number' => $s->roll_number,
                    'class_id' => $s->class_id,
                    'section_id' => $s->section_id,
                    'status' => $r?->status,
                    'remarks' => $r?->remarks,
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

    public function markAttendance(Request $request)
    {
        $teacher = $this->teacher($request);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'section_id' => 'nullable|exists:sections,id',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:student_profiles,id',
            'attendances.*.status' => 'required|in:'.self::ATTENDANCE_STATUSES,
            'attendances.*.remarks' => 'nullable|string',
        ]);

        abort_unless($this->teachesClass($teacher->id, $data['class_id']), 403, 'You do not teach this class.');

        $validIds = Student::where('school_id', $teacher->school_id)
            ->where('class_id', $data['class_id'])->pluck('id')->all();

        DB::transaction(function () use ($data, $teacher, $validIds, $request) {
            foreach ($data['attendances'] as $item) {
                if (! in_array($item['student_id'], $validIds, true)) {
                    continue;
                }

                Attendance::updateOrCreate(
                    [
                        'school_id' => $teacher->school_id,
                        'student_id' => $item['student_id'],
                        'date' => $data['date'],
                        'type' => 'Student',
                    ],
                    [
                        'class_id' => $data['class_id'],
                        'section_id' => $data['section_id'] ?? null,
                        'teacher_id' => $teacher->id,
                        'status' => $item['status'],
                        'remarks' => $item['remarks'] ?? null,
                        'marked_by' => $request->user()->id,
                    ]
                );
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Attendance marked successfully',
        ]);
    }

    /** Attendance summary the teacher marked, per day, for the last 30 days. */
    public function attendanceSummary(Request $request)
    {
        $teacher = $this->teacher($request);

        $rows = Attendance::where('marked_by', $request->user()->id)
            ->where('school_id', $teacher->school_id)
            ->whereDate('date', '>=', now()->subDays(29)->toDateString())
            ->groupBy('date')
            ->select('date')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent")
            ->orderBy('date')
            ->get()
            ->map(fn ($r) => [
                'date' => $r->date,
                'total' => (int) $r->total,
                'present' => (int) $r->present,
                'absent' => (int) $r->absent,
                'rate' => (int) $r->total > 0 ? round((int) $r->present / (int) $r->total * 100, 1) : null,
            ]);

        return response()->json(['daily' => $rows]);
    }

    // ─────────────────────────── Marks ───────────────────────────

    public function getMarks(Request $request)
    {
        $teacher = $this->teacher($request);

        $subjectIds = $teacher->subjects->pluck('id');

        $query = Mark::where('school_id', $teacher->school_id)
            ->whereIn('subject_id', $subjectIds)
            ->with(['student:id,first_name,last_name,roll_number', 'subject:id,name,code,credits', 'exam:id,name,term']);

        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->query('exam_id'));
        }

        if ($request->filled('class_id')) {
            $query->whereHas('student', fn ($s) => $s->where('class_id', $request->query('class_id')));
        }

        $marks = $query->orderByDesc('exam_id')->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($marks->items())->map(fn (Mark $m) => [
                'id' => $m->id,
                'student_id' => $m->student_id,
                'student_name' => $m->student?->full_name,
                'roll_number' => $m->student?->roll_number,
                'exam' => $m->exam?->name,
                'term' => $m->exam?->term,
                'subject' => $m->subject?->name,
                'marks_obtained' => (float) $m->marks_obtained,
                'total_marks' => (float) $m->total_marks,
                'percentage' => $m->percentage,
                'grade' => $m->grade,
                'gpa_point' => (float) $m->gpa_point,
            ])->all(),
            'total' => $marks->total(),
            'current_page' => $marks->currentPage(),
            'last_page' => $marks->lastPage(),
            'per_page' => $marks->perPage(),
        ]);
    }

    /** Mark-sheet entry grid for one exam + class + subject. */
    public function markSheet(Request $request)
    {
        $teacher = $this->teacher($request);

        $data = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        abort_unless(
            $teacher->subjects->contains('id', (int) $data['subject_id'])
            || $this->teachesClass($teacher->id, (int) $data['class_id']),
            403,
            'You are not assigned to this subject/class.'
        );

        $exam = Exam::where('school_id', $teacher->school_id)->findOrFail($data['exam_id']);
        $subject = Subject::where('school_id', $teacher->school_id)->findOrFail($data['subject_id']);

        $existing = Mark::where('school_id', $teacher->school_id)
            ->where('exam_id', $exam->id)
            ->where('subject_id', $subject->id)
            ->get()->keyBy('student_id');

        $students = Student::where('school_id', $teacher->school_id)
            ->where('class_id', $data['class_id'])
            ->orderBy('first_name')->get();

        return response()->json([
            'exam' => ['id' => $exam->id, 'name' => $exam->name, 'term' => $exam->term],
            'subject' => ['id' => $subject->id, 'name' => $subject->name, 'code' => $subject->code, 'total_marks' => (float) $subject->total_marks],
            'marks' => $students->map(function (Student $s) use ($existing) {
                $m = $existing->get($s->id);

                return [
                    'id' => $m?->id,
                    'student_id' => $s->id,
                    'student_name' => $s->full_name,
                    'roll_number' => $s->roll_number,
                    'marks_obtained' => $m ? (float) $m->marks_obtained : null,
                    'total_marks' => $m ? (float) $m->total_marks : null,
                    'grade' => $m?->grade,
                    'is_entered' => $m !== null,
                ];
            })->all(),
        ]);
    }

    public function storeMarks(Request $request)
    {
        $teacher = $this->teacher($request);

        $data = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:student_profiles,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
            'marks.*.total_marks' => 'nullable|numeric|min:1',
            'marks.*.remarks' => 'nullable|string',
        ]);

        $exam = Exam::where('school_id', $teacher->school_id)->findOrFail($data['exam_id']);
        $subject = Subject::where('school_id', $teacher->school_id)->findOrFail($data['subject_id']);

        $validIds = Student::where('school_id', $teacher->school_id)
            ->where('class_id', $data['class_id'])->pluck('id')->all();

        DB::transaction(function () use ($data, $teacher, $exam, $subject, $validIds) {
            foreach ($data['marks'] as $m) {
                if (! in_array($m['student_id'], $validIds, true)) {
                    continue;
                }

                $total = (float) ($m['total_marks'] ?? $subject->total_marks ?? 100);
                $obtained = (float) $m['marks_obtained'];

                abort_if($obtained > $total + 0.004, 422, "Marks for a student exceed the maximum of {$total}.");

                $percent = $total > 0 ? ($obtained / $total) * 100 : 0;
                $scale = GradeScale::forPercentage($percent);

                Mark::updateOrCreate(
                    [
                        'school_id' => $teacher->school_id,
                        'exam_id' => $exam->id,
                        'student_id' => $m['student_id'],
                        'subject_id' => $subject->id,
                    ],
                    [
                        'class_id' => $data['class_id'],
                        'marks_obtained' => $obtained,
                        'total_marks' => $total,
                        'total_score' => $obtained,
                        'max_score' => $total,
                        'grade' => $scale['grade'],
                        'gpa_point' => $scale['gpa_point'],
                        'remarks' => $m['remarks'] ?? null,
                        'entered_by' => $teacher->id,
                    ]
                );
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Marks recorded successfully',
        ]);
    }

    // ─────────────────────────── Performance ───────────────────────────

    public function performance(Request $request)
    {
        $teacher = $this->teacher($request);
        $subjectIds = $teacher->subjects->pluck('id');

        $marksQuery = Mark::where('marks.school_id', $teacher->school_id)
            ->whereIn('marks.subject_id', $subjectIds);

        // Overall averages
        $overall = (clone $marksQuery)
            ->selectRaw('COUNT(*) as entries')
            ->selectRaw('COALESCE(AVG(marks.marks_obtained),0) as avg_obtained')
            ->selectRaw('COALESCE(AVG(marks.total_marks),0) as avg_total')
            ->first();

        $avgTotal = (float) $overall->avg_total;

        // Per subject
        $bySubject = (clone $marksQuery)
            ->join('subjects', 'subjects.id', '=', 'marks.subject_id')
            ->groupBy('subjects.id', 'subjects.name', 'subjects.code')
            ->select('subjects.id', 'subjects.name', 'subjects.code')
            ->selectRaw('COUNT(*) as entries')
            ->selectRaw('COALESCE(AVG(marks.marks_obtained),0) as avg_obtained')
            ->selectRaw('COALESCE(AVG(marks.total_marks),0) as avg_total')
            ->get()
            ->map(fn ($r) => [
                'subject_id' => $r->id,
                'subject' => $r->name,
                'code' => $r->code,
                'entries' => (int) $r->entries,
                'average' => round((float) $r->avg_obtained, 2),
                'percentage' => (float) $r->avg_total > 0
                    ? round((float) $r->avg_obtained / (float) $r->avg_total * 100, 1)
                    : null,
            ])->all();

        // Top and bottom students
        $students = Student::where('school_id', $teacher->school_id)->pluck('id');
        $perStudent = (clone $marksQuery)
            ->whereIn('marks.student_id', $students)
            ->groupBy('marks.student_id')
            ->select('marks.student_id')
            ->selectRaw('SUM(marks.marks_obtained) as obtained')
            ->selectRaw('SUM(marks.total_marks) as total')
            ->get()
            ->map(function ($r) {
                $percent = (float) $r->total > 0 ? (float) $r->obtained / (float) $r->total * 100 : 0;
                $s = Student::find($r->student_id);

                return [
                    'student_id' => $r->student_id,
                    'name' => $s?->full_name ?? '—',
                    'roll_number' => $s?->roll_number,
                    'obtained' => round((float) $r->obtained, 2),
                    'total' => round((float) $r->total, 2),
                    'percentage' => round($percent, 1),
                    'grade' => GradeScale::forPercentage($percent)['grade'],
                ];
            });

        // Grade distribution
        $gradeDistribution = (clone $marksQuery)
            ->select('grade')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('grade')->pluck('total', 'grade');

        // Submission & diary workload
        $assignmentIds = Assignment::where('teacher_id', $teacher->id)->pluck('id');
        $gradedCount = AssignmentSubmission::whereIn('assignment_id', $assignmentIds)->where('status', 'Graded')->count();
        $submissionCount = AssignmentSubmission::whereIn('assignment_id', $assignmentIds)->count();

        return response()->json([
            'summary' => [
                'entries' => (int) $overall->entries,
                'average' => round((float) $overall->avg_obtained, 2),
                'percentage' => $avgTotal > 0 ? round((float) $overall->avg_obtained / $avgTotal * 100, 1) : null,
                'top_students' => $perStudent->sortByDesc('percentage')->take(5)->values()->all(),
                'needs_support' => $perStudent->sortBy('percentage')->take(5)->values()->all(),
            ],
            'by_subject' => $bySubject,
            'grade_distribution' => $gradeDistribution,
            'workload' => [
                'assignments' => Assignment::where('teacher_id', $teacher->id)->count(),
                'submissions' => $submissionCount,
                'graded' => $gradedCount,
                'pending_grading' => max(0, $submissionCount - $gradedCount),
                'diaries' => Diary::where('teacher_id', $teacher->id)->count(),
            ],
        ]);
    }

    // ─────────────────────────── Student reviews ───────────────────────────

    public function getReviews(Request $request)
    {
        $teacher = $this->teacher($request);

        $query = StudentReview::where('school_id', $teacher->school_id)
            ->where('teacher_id', $teacher->id)
            ->with(['student:id,first_name,last_name,roll_number,class_id']);

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->query('student_id'));
        }

        return response()->json($query->orderByDesc('created_at')->get()
            ->map(fn (StudentReview $r) => [
                'id' => $r->id,
                'student_id' => $r->student_id,
                'student_name' => $r->student?->full_name,
                'roll_number' => $r->student?->roll_number,
                'rating' => $r->rating,
                'remarks' => $r->remarks,
                // Already decoded by the model's `array` cast; older rows may
                // still hold a raw JSON string.
                'strengths' => is_array($r->strengths) ? $r->strengths : [],
                'created_at' => $r->created_at?->toIso8601String(),
            ]));
    }

    public function storeReview(Request $request)
    {
        $teacher = $this->teacher($request);

        $data = $request->validate([
            'student_id' => 'required|exists:student_profiles,id',
            'rating' => 'required|string|max:30',
            'remarks' => 'nullable|string',
            'strengths' => 'nullable|array',
            'strengths.*' => 'string|max:255',
        ]);

        $student = Student::where('school_id', $teacher->school_id)->findOrFail($data['student_id']);

        $review = StudentReview::updateOrCreate(
            ['teacher_id' => $teacher->id, 'student_id' => $student->id],
            [
                'school_id' => $teacher->school_id,
                'rating' => $data['rating'],
                'remarks' => $data['remarks'] ?? null,
                'strengths' => $data['strengths'] ? json_encode(array_values($data['strengths'])) : null,
            ]
        );

        $this->log($request, 'created', StudentReview::class, $review->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Student review saved',
            'review' => $review,
        ], 201);
    }

    public function destroyReview(Request $request, $id)
    {
        $teacher = $this->teacher($request);
        StudentReview::where('teacher_id', $teacher->id)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Review deleted']);
    }

    // ─────────────────────────── Diaries ───────────────────────────

    public function getDiaries(Request $request)
    {
        $teacher = $this->teacher($request);

        $query = Diary::where('teacher_id', $teacher->id)
            ->with(['class:id,name,section', 'section:id,name', 'subject:id,name,code']);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->query('date'));
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
                'class' => $d->class?->name,
                'section' => $d->section?->name,
                'subject' => $d->subject?->name,
                'acknowledged_at' => $d->parent_acknowledged_at?->toIso8601String(),
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function storeDiary(Request $request)
    {
        $teacher = $this->teacher($request);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'nullable|exists:sections,id',
            'date' => 'required|date',
            'task' => 'required|string',
            'notes' => 'nullable|string',
            'type' => 'nullable|in:Homework,Notice,Exam Prep',
        ]);

        $diary = Diary::create([
            'school_id' => $teacher->school_id,
            'teacher_id' => $teacher->id,
            'class_id' => $data['class_id'],
            'section_id' => $data['section_id'] ?? null,
            'subject_id' => $data['subject_id'],
            'date' => $data['date'],
            'task' => $data['task'],
            'notes' => $data['notes'] ?? null,
            'type' => $data['type'] ?? 'Homework',
            'completed' => false,
        ]);

        $this->log($request, 'created', Diary::class, $diary->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Diary entry logged',
            'diary' => $diary->load(['class', 'subject']),
        ], 201);
    }

    public function updateDiary(Request $request, $id)
    {
        $teacher = $this->teacher($request);
        $diary = Diary::where('teacher_id', $teacher->id)->findOrFail($id);

        $data = $request->validate([
            'task' => 'sometimes|required|string',
            'notes' => 'nullable|string',
            'type' => 'sometimes|in:Homework,Notice,Exam Prep',
            'date' => 'sometimes|date',
            'completed' => 'sometimes|boolean',
        ]);

        $diary->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Diary entry updated',
            'diary' => $diary->fresh(),
        ]);
    }

    public function destroyDiary(Request $request, $id)
    {
        $teacher = $this->teacher($request);
        Diary::where('teacher_id', $teacher->id)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Diary entry deleted']);
    }

    // ─────────────────────────── Lookups ───────────────────────────

    public function getSubjects(Request $request)
    {
        $teacher = $this->teacher($request);

        return response()->json($teacher->subjects->map(fn ($s) => [
            'id' => $s->id, 'name' => $s->name, 'code' => $s->code,
            'type' => $s->type, 'credits' => $s->credits,
            'total_marks' => (float) $s->total_marks, 'pass_marks' => (float) $s->pass_marks,
        ]));
    }

    public function getSections(Request $request)
    {
        $teacher = $this->teacher($request);

        $sections = \App\Models\Section::where('school_id', $teacher->school_id)
            ->whereIn('class_id', Timetable::where('teacher_id', $teacher->id)->distinct()->pluck('class_id'))
            ->with('class:id,name,section')
            ->withCount('students')
            ->get();

        return response()->json($sections->map(fn ($s) => [
            'id' => $s->id,
            'name' => $s->name,
            'class_id' => $s->class_id,
            'class' => $s->class?->name,
            'room_number' => $s->room_number,
            'students_count' => $s->students_count,
        ]));
    }

    /** Exams + flattened schedules relevant to this teacher. */
    public function getExams(Request $request)
    {
        $teacher = $this->teacher($request);
        $classIds = Timetable::where('teacher_id', $teacher->id)->distinct()->pluck('class_id');
        $subjectIds = $teacher->subjects->pluck('id');

        $schedules = ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $teacher->school_id))
            ->where(function ($q) use ($classIds, $subjectIds) {
                $q->whereIn('class_id', $classIds)
                    ->orWhereIn('subject_id', $subjectIds);
            })
            ->with(['exam:id,school_id,name,term,status,start_date,end_date', 'subject:id,name,code', 'class:id,name,section', 'section:id,name'])
            ->orderBy('date')
            ->get()
            ->map(fn (ExamSchedule $s) => [
                'id' => $s->id,
                'exam_id' => $s->exam_id,
                'exam' => $s->exam?->name,
                'term' => $s->exam?->term,
                'exam_status' => $s->exam?->status,
                'class' => $s->class?->name,
                'section' => $s->section?->name,
                'subject' => $s->subject?->name,
                'subject_code' => $s->subject?->code,
                'date' => $s->date?->toDateString(),
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'room' => $s->room_number,
                'invigilator' => $s->invigilator,
                'max_marks' => (float) $s->max_marks,
                'is_mine' => $subjectIds->contains($s->subject_id) && $classIds->contains($s->class_id),
            ]);

        $grouped = $schedules->groupBy('exam_id')->map(function ($rows, $examId) {
            $first = $rows->first();

            return [
                'exam_id' => $first['exam_id'],
                'exam' => $first['exam'],
                'term' => $first['term'],
                'status' => $first['exam_status'],
                'schedule_count' => $rows->count(),
                'schedules' => $rows->values(),
            ];
        })->values();

        return response()->json($grouped);
    }

    // ─────────────────────────── Internals ───────────────────────────

    private function teacher(Request $request)
    {
        $teacher = $request->user()->teacher;

        abort_if(! $teacher, 404, 'Teacher profile not found');

        return $teacher;
    }

    private function teachesClass(int $teacherId, $classId): bool
    {
        return Timetable::where('teacher_id', $teacherId)->where('class_id', $classId)->exists()
            || DB::table('teacher_class')->where('teacher_id', $teacherId)->where('class_id', $classId)->exists();
    }
}