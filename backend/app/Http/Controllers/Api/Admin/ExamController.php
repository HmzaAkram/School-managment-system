<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function getExams(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $exams = Exam::where('school_id', $schoolId)->with('schedules.subject')->latest()->get();
        return response()->json($exams);
    }

    public function storeExam(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string',
            'term' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $exam = Exam::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'term' => $request->term,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'Upcoming',
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Exam created successfully',
            'exam' => $exam
        ], 201);
    }

    public function storeSchedule(Request $request, $examId)
    {
        $schoolId = $request->user()->school_id;
        $exam = Exam::where('school_id', $schoolId)->findOrFail($examId);

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $schedule = ExamSchedule::create([
            'exam_id' => $exam->id,
            'class_id' => $request->class_id,
            'subject_id' => $request->subject_id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'max_marks' => $request->max_marks ?? 100,
            'pass_marks' => $request->pass_marks ?? 33,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Exam schedule added',
            'schedule' => $schedule->load(['class', 'subject'])
        ], 201);
    }

    public function getMarks(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $marks = Mark::where('school_id', $schoolId)
            ->where('exam_id', $request->exam_id)
            ->where('subject_id', $request->subject_id)
            ->with('student')
            ->get();

        if ($marks->isEmpty()) {
            $students = Student::where('school_id', $schoolId)->where('class_id', $request->class_id)->get();
            $marks = $students->map(function ($s) {
                return [
                    'student_id' => $s->id,
                    'student' => $s,
                    'marks_obtained' => 0,
                    'total_marks' => 100,
                    'grade' => 'N/A',
                    'remarks' => '',
                ];
            });
        }

        return response()->json($marks);
    }

    public function storeMarks(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:student_profiles,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
        ]);

        foreach ($request->marks as $m) {
            $obtained = $m['marks_obtained'];
            $total = $m['total_marks'] ?? 100;
            $percent = ($obtained / max(1, $total)) * 100;

            $grade = 'F';
            if ($percent >= 90) $grade = 'A+';
            elseif ($percent >= 80) $grade = 'A';
            elseif ($percent >= 70) $grade = 'B';
            elseif ($percent >= 60) $grade = 'C';
            elseif ($percent >= 50) $grade = 'D';

            Mark::updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'exam_id' => $request->exam_id,
                    'student_id' => $m['student_id'],
                    'subject_id' => $request->subject_id,
                ],
                [
                    'marks_obtained' => $obtained,
                    'total_marks' => $total,
                    'grade' => $grade,
                    'remarks' => $m['remarks'] ?? null,
                    'entered_by' => $request->user()->teacher->id ?? null,
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Marks recorded successfully'
        ]);
    }
}
