<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\GradeScale;
use App\Http\Controllers\Api\ApiController;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamController extends ApiController
{
    public function getExams(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Exam::where('school_id', $schoolId)
            ->withCount('schedules')
            ->with(['schedules.subject:id,name,code', 'schedules.class:id,name,section']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('term', 'like', "%{$search}%"));
        }

        return response()->json($query->orderByDesc('start_date')->get());
    }

    public function storeExam(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'term' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'status' => 'nullable|in:Upcoming,Ongoing,Completed,Cancelled',
        ]);

        $exam = Exam::create([
            'school_id' => $schoolId,
            'academic_year_id' => $data['academic_year_id'] ?? $this->currentAcademicYear($schoolId)?->id,
            'name' => $data['name'],
            'term' => $data['term'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'status' => $data['status'] ?? 'Upcoming',
            'description' => $data['description'] ?? null,
        ]);

        $this->log($request, 'created', Exam::class, $exam->id, $exam->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Exam created successfully',
            'exam' => $exam,
        ], 201);
    }

    public function updateExam(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $exam = Exam::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'term' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:Upcoming,Ongoing,Completed,Cancelled',
        ]);

        $exam->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Exam updated',
            'exam' => $exam->fresh(),
        ]);
    }

    public function destroyExam(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $exam = Exam::where('school_id', $schoolId)->findOrFail($id);

        DB::transaction(function () use ($exam, $schoolId, $request) {
            Mark::where('exam_id', $exam->id)->where('school_id', $schoolId)->delete();
            ExamSchedule::where('exam_id', $exam->id)->delete();
            $exam->delete();
        });

        return response()->json(['status' => 'success', 'message' => 'Exam deleted']);
    }

    // ─────────────────────────── Schedules ───────────────────────────

    /** Flattened schedule list across all exams, with candidate counts. */
    public function getSchedules(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = ExamSchedule::query()
            ->whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
            ->with(['exam:id,school_id,name,term,status,start_date,end_date', 'subject:id,name,code', 'class:id,name,section', 'section:id,name'])
            ->withCount(['marks']);

        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->query('exam_id'));
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->query('subject_id'));
        }

        if ($request->filled('status')) {
            $status = $request->query('status');

            if ($status === 'upcoming') {
                $query->whereDate('date', '>=', now()->toDateString());
            } elseif ($status === 'past') {
                $query->whereDate('date', '<', now()->toDateString());
            }
        }

        $this->applyDateRange($query, $request, 'date', $this->dateRange($request));

        $schedules = $query->orderBy('date')->orderBy('start_time')->get();

        // Expected candidates per schedule, based on class/section enrolment.
        $candidateCounts = $this->candidateCounts($schoolId, $schedules);

        return response()->json(
            $schedules->map(fn (ExamSchedule $s) => [
                'id' => $s->id,
                'exam_id' => $s->exam_id,
                'exam' => $s->exam?->name,
                'term' => $s->exam?->term,
                'exam_status' => $s->exam?->status,
                'class_id' => $s->class_id,
                'class' => $s->class?->name,
                'section_id' => $s->section_id,
                'section' => $s->section?->name,
                'subject_id' => $s->subject_id,
                'subject' => $s->subject?->name,
                'subject_code' => $s->subject?->code,
                'date' => $s->date?->toDateString(),
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'room_number' => $s->room_number,
                'invigilator' => $s->invigilator,
                'max_marks' => (float) $s->max_marks,
                'pass_marks' => (float) $s->pass_marks,
                'candidates' => $candidateCounts[$s->id] ?? 0,
                'results_entered' => $s->marks_count,
            ])->all()
        );
    }

    public function storeSchedule(Request $request, $examId)
    {
        $schoolId = $this->requireSchoolId($request);
        $exam = Exam::where('school_id', $schoolId)->findOrFail($examId);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'section_id' => 'nullable|exists:sections,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'room_number' => 'nullable|string|max:50',
            'invigilator' => 'nullable|string|max:120',
            'max_marks' => 'nullable|numeric|min:1',
            'pass_marks' => 'nullable|numeric|min:0',
        ]);

        $schedule = ExamSchedule::create([
            'exam_id' => $exam->id,
            'class_id' => $data['class_id'],
            'section_id' => $data['section_id'] ?? null,
            'subject_id' => $data['subject_id'],
            'date' => $data['date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'room_number' => $data['room_number'] ?? null,
            'invigilator' => $data['invigilator'] ?? null,
            'max_marks' => $data['max_marks'] ?? 100,
            'pass_marks' => $data['pass_marks'] ?? 33,
        ]);

        $this->log($request, 'created', ExamSchedule::class, $schedule->id, $schedule->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Exam schedule added',
            'schedule' => $schedule->load(['class', 'section', 'subject']),
        ], 201);
    }

    public function updateSchedule(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $schedule = ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
            ->findOrFail($id);

        $data = $request->validate([
            'class_id' => 'sometimes|exists:classes,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'section_id' => 'nullable|exists:sections,id',
            'date' => 'sometimes|date',
            'start_time' => 'sometimes',
            'end_time' => 'sometimes',
            'room_number' => 'nullable|string|max:50',
            'invigilator' => 'nullable|string|max:120',
            'max_marks' => 'sometimes|numeric|min:1',
            'pass_marks' => 'sometimes|numeric|min:0',
        ]);

        $schedule->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule updated',
            'schedule' => $schedule->fresh(),
        ]);
    }

    public function destroySchedule(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
            ->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Schedule deleted']);
    }

    // ─────────────────────────── Marks ───────────────────────────

    public function getMarks(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $existing = Mark::where('school_id', $schoolId)
            ->where('exam_id', $request->query('exam_id'))
            ->where('subject_id', $request->query('subject_id'))
            ->with('student')
            ->get()
            ->keyBy('student_id');

        // Always return the full roster so the grid renders every student.
        $students = Student::where('school_id', $schoolId)
            ->where('class_id', $request->query('class_id'))
            ->orderBy('first_name')
            ->get();

        return response()->json([
            'exam_id' => (int) $request->query('exam_id'),
            'class_id' => (int) $request->query('class_id'),
            'subject_id' => (int) $request->query('subject_id'),
            'marks' => $students->map(function (Student $s) use ($existing) {
                $mark = $existing->get($s->id);

                return [
                    'id' => $mark?->id,
                    'student_id' => $s->id,
                    'student_name' => $s->full_name,
                    'roll_number' => $s->roll_number,
                    'admission_number' => $s->admission_number,
                    'marks_obtained' => $mark ? (float) $mark->marks_obtained : null,
                    'total_marks' => $mark ? (float) $mark->total_marks : null,
                    'coursework' => $mark ? (float) $mark->coursework : null,
                    'midterm' => $mark ? (float) $mark->midterm : null,
                    'final_exam' => $mark ? (float) $mark->final_exam : null,
                    'grade' => $mark?->grade,
                    'gpa_point' => $mark ? (float) $mark->gpa_point : null,
                    'remarks' => $mark?->remarks,
                    'is_entered' => $mark !== null,
                ];
            })->all(),
        ]);
    }

    public function storeMarks(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'class_id' => 'nullable|exists:classes,id',
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:student_profiles,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
            'marks.*.total_marks' => 'nullable|numeric|min:1',
            'marks.*.remarks' => 'nullable|string',
        ]);

        $exam = Exam::where('school_id', $schoolId)->findOrFail($data['exam_id']);
        $subject = \App\Models\Subject::where('school_id', $schoolId)->findOrFail($data['subject_id']);

        // A school admin has no `teacher` relation — entered_by must tolerate null.
        $enteredBy = $request->user()->teacher?->id;

        $validStudentIds = Student::where('school_id', $schoolId)->pluck('id')->all();

        DB::transaction(function () use ($data, $schoolId, $exam, $subject, $enteredBy, $validStudentIds, $request) {
            foreach ($data['marks'] as $m) {
                if (! in_array($m['student_id'], $validStudentIds, true)) {
                    continue;
                }

                $total = (float) ($m['total_marks'] ?? $subject->total_marks ?? 100);
                $obtained = (float) $m['marks_obtained'];

                if ($obtained > $total + 0.004) {
                    abort(422, "Marks for student {$m['student_id']} exceed the maximum of {$total}.");
                }

                $percent = $total > 0 ? ($obtained / $total) * 100 : 0;
                $scale = GradeScale::forPercentage($percent);

                $student = Student::find($m['student_id']);

                Mark::updateOrCreate(
                    [
                        'school_id' => $schoolId,
                        'exam_id' => $exam->id,
                        'student_id' => $m['student_id'],
                        'subject_id' => $subject->id,
                    ],
                    [
                        'class_id' => $m['student_id'] ? $student?->class_id : ($data['class_id'] ?? null),
                        'marks_obtained' => $obtained,
                        'total_marks' => $total,
                        'total_score' => $obtained,
                        'max_score' => $total,
                        'grade' => $scale['grade'],
                        'gpa_point' => $scale['gpa_point'],
                        'remarks' => $m['remarks'] ?? null,
                        'entered_by' => $enteredBy,
                    ]
                );
            }
        });

        $this->log($request, 'entered_marks', Mark::class, null, [
            'exam_id' => $exam->id,
            'subject_id' => $subject->id,
            'count' => count($data['marks']),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Marks recorded successfully',
        ]);
    }

    // ─────────────────────────── Helpers ───────────────────────────

    /** @return array<int,int> schedule id => number of enrolled candidates */
    private function candidateCounts(int $schoolId, $schedules): array
    {
        $rows = Student::where('school_id', $schoolId)
            ->where('status', 'Active')
            ->selectRaw('class_id, section_id, COUNT(*) as total')
            ->groupBy('class_id', 'section_id')
            ->get();

        $map = [];
        foreach ($rows as $row) {
            $map[$row->class_id.'|'.$row->section_id] = (int) $row->total;
            $map[$row->class_id.'|'] = ($map[$row->class_id.'|'] ?? 0) + (int) $row->total;
        }

        return $schedules->mapWithKeys(fn (ExamSchedule $s) => [
            $s->id => $map[$s->class_id.'|'.$s->section_id] ?? ($map[$s->class_id.'|'] ?? 0),
        ])->all();
    }
}