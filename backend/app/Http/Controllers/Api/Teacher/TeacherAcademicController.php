<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Diary;
use Illuminate\Http\Request;

class TeacherAcademicController extends Controller
{
    // ── Assignments ──
    public function getAssignments(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }
        $assignments = Assignment::where('teacher_id', $teacher->id)
            ->with(['class', 'section', 'subject', 'submissions.student'])
            ->latest()
            ->get();

        return response()->json($assignments);
    }

    public function storeAssignment(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $assignment = Assignment::create([
            'school_id' => $teacher->school_id,
            'teacher_id' => $teacher->id,
            'class_id' => $request->class_id,
            'section_id' => $request->section_id,
            'subject_id' => $request->subject_id,
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'max_marks' => $request->max_marks ?? 100,
            'status' => 'Active',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Assignment created successfully',
            'assignment' => $assignment->load(['class', 'subject'])
        ], 201);
    }

    public function gradeSubmission(Request $request, $submissionId)
    {
        $teacher = $request->user()->teacher;

        $submission = AssignmentSubmission::with('assignment')->findOrFail($submissionId);

        if (!$teacher || $submission->assignment->teacher_id !== $teacher->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $request->validate([
            'marks_obtained' => 'required|numeric|min:0',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'marks_obtained' => $request->marks_obtained,
            'feedback' => $request->feedback,
            'status' => 'Graded',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Submission graded',
            'submission' => $submission
        ]);
    }

    // ── Classes & Students ──
    public function getClasses(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $classIds = \App\Models\Timetable::where('teacher_id', $teacher->id)->pluck('class_id')->unique();

        $classes = \App\Models\SchoolClass::whereIn('id', $classIds)
            ->with(['sections', 'subjects'])
            ->withCount('students')
            ->get()
            ->map(function ($class) use ($teacher) {
                $timetable = \App\Models\Timetable::where('teacher_id', $teacher->id)
                    ->where('class_id', $class->id)
                    ->with('subject')
                    ->get();
                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'code' => $class->code,
                    'students_count' => $class->students_count,
                    'subjects' => $timetable->pluck('subject.name')->filter()->unique()->values(),
                    'sections' => $class->sections,
                    'schedule' => $timetable->map(fn($t) => [
                        'day' => $t->day_of_week,
                        'start_time' => $t->start_time,
                        'end_time' => $t->end_time,
                        'subject' => $t->subject->name ?? null,
                        'room' => $t->room_number,
                    ])->values(),
                ];
            });

        return response()->json($classes);
    }

    public function getClassStudents(Request $request, $classId)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $hasAccess = \App\Models\Timetable::where('teacher_id', $teacher->id)->where('class_id', $classId)->exists();
        if (!$hasAccess) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $students = \App\Models\Student::where('school_id', $teacher->school_id)
            ->where('class_id', $classId)
            ->with(['user', 'section'])
            ->get();

        return response()->json($students);
    }

    // ── Attendance ──
    public function markAttendance(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:student_profiles,id',
            'attendances.*.status' => 'required|in:Present,Absent,Late,Half-Day,Excused',
        ]);

        $hasAccess = \App\Models\Timetable::where('teacher_id', $teacher->id)->where('class_id', $request->class_id)->exists();
        if (!$hasAccess) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        foreach ($request->attendances as $item) {
            \App\Models\Attendance::updateOrCreate(
                [
                    'school_id' => $teacher->school_id,
                    'student_id' => $item['student_id'],
                    'date' => $request->date,
                    'type' => 'Student',
                ],
                [
                    'class_id' => $request->class_id,
                    'section_id' => $request->section_id ?? null,
                    'status' => $item['status'],
                    'remarks' => $item['remarks'] ?? null,
                    'marked_by' => $request->user()->id,
                ]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Attendance marked successfully']);
    }

    public function getAttendance(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $query = \App\Models\Attendance::where('school_id', $teacher->school_id)
            ->where('marked_by', $request->user()->id)
            ->with('student');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        if ($request->filled('date')) {
            $query->where('date', $request->date);
        }

        return response()->json($query->latest()->limit(500)->get());
    }

    public function getMarks(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $marks = \App\Models\Mark::where('entered_by', $teacher->id)
            ->with(['student', 'subject', 'exam'])
            ->latest()
            ->limit(200)
            ->get();

        return response()->json($marks);
    }

    public function getExams(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $exams = \App\Models\Exam::where('school_id', $teacher->school_id)
            ->with(['schedules.subject', 'schedules.class'])
            ->latest()
            ->get();

        return response()->json($exams);
    }

    // ── Diaries ──
    public function getDiaries(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }
        $diaries = Diary::where('teacher_id', $teacher->id)
            ->with(['class', 'section', 'subject'])
            ->latest()
            ->get();

        return response()->json($diaries);
    }

    public function storeDiary(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'task' => 'required|string',
        ]);

        $diary = Diary::create([
            'school_id' => $teacher->school_id,
            'teacher_id' => $teacher->id,
            'class_id' => $request->class_id,
            'section_id' => $request->section_id,
            'subject_id' => $request->subject_id,
            'date' => $request->date,
            'task' => $request->task,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Diary entry logged',
            'diary' => $diary->load(['class', 'subject'])
        ], 201);
    }
}
