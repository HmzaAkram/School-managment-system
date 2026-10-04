<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\FeeInvoice;
use App\Models\Mark;
use App\Models\Timetable;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    private function resolveStudent(Request $request)
    {
        $user = $request->user();
        if ($user->isStudent() && $user->student) {
            return $user->student;
        }
        if ($user->isParent() && $user->parentProfile) {
            return $user->parentProfile->students()->with(['class', 'section', 'school'])->first();
        }
        return null;
    }

    public function stats(Request $request)
    {
        $student = $this->resolveStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $student->load(['class', 'section', 'school']);

        // Attendance stats
        $totalAttendance = Attendance::where('student_id', $student->id)->count();
        $presentAttendance = Attendance::where('student_id', $student->id)->where('status', 'Present')->count();
        $attendancePercentage = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 100;

        // Pending fee invoices
        $unpaidInvoices = FeeInvoice::where('student_id', $student->id)->whereIn('status', ['Unpaid', 'Partial', 'Overdue'])->get();
        $totalPendingFee = $unpaidInvoices->sum(function ($inv) {
            return $inv->amount - $inv->paid_amount;
        });

        // Recent Marks / Grades
        $recentMarks = Mark::where('student_id', $student->id)->with(['exam', 'subject'])->latest()->take(5)->get();

        // Active Assignments
        $assignments = Assignment::where('class_id', $student->class_id)
            ->with(['subject', 'teacher'])
            ->latest()
            ->take(5)
            ->get();

        // Today's Timetable
        $dayName = now()->format('l');
        $timetable = Timetable::where('class_id', $student->class_id)
            ->where('day_of_week', $dayName)
            ->with(['subject', 'teacher'])
            ->orderBy('start_time')
            ->get();

        // Diaries
        $diaries = Diary::where('class_id', $student->class_id)->with('subject')->latest()->take(5)->get();

        return response()->json([
            'student' => $student,
            'attendance_percentage' => $attendancePercentage,
            'total_pending_fee' => (float)$totalPendingFee,
            'recent_marks' => $recentMarks,
            'assignments' => $assignments,
            'timetable' => $timetable,
            'diaries' => $diaries,
        ]);
    }

    public function submitAssignment(Request $request, $assignmentId)
    {
        $student = $this->resolveStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        $assignment = Assignment::where('school_id', $student->school_id)
            ->where('class_id', $student->class_id)
            ->findOrFail($assignmentId);

        $request->validate([
            'content' => 'required|string',
            'file_url' => 'nullable|string',
        ]);

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'student_id' => $student->id,
            ],
            [
                'submitted_at' => now(),
                'content' => $request->content,
                'file_url' => $request->file_url,
                'status' => 'Submitted',
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Assignment submitted successfully',
            'submission' => $submission
        ]);
    }

    public function getInvoices(Request $request)
    {
        $student = $this->resolveStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        return response()->json(
            FeeInvoice::where('student_id', $student->id)
                ->with('feeStructure')
                ->latest()
                ->get()
        );
    }

    public function getAttendance(Request $request)
    {
        $student = $this->resolveStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        return response()->json(
            Attendance::where('student_id', $student->id)
                ->with(['class', 'section'])
                ->orderBy('date', 'desc')
                ->limit(500)
                ->get()
        );
    }

    public function getMarks(Request $request)
    {
        $student = $this->resolveStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        return response()->json(
            Mark::where('student_id', $student->id)
                ->with(['exam', 'subject'])
                ->latest()
                ->get()
        );
    }

    public function getCourses(Request $request)
    {
        $student = $this->resolveStudent($request);
        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        // Subjects attached to the student's class
        $class = \App\Models\SchoolClass::where('id', $student->class_id)
            ->with('subjects')
            ->first();

        $result = $class->subjects->map(function ($subject) use ($student) {
            $teacher = \App\Models\Teacher::where('school_id', $student->school_id)
                ->whereHas('subjects', fn($q) => $q->where('subjects.id', $subject->id))
                ->first();
            $timetable = Timetable::where('class_id', $student->class_id)
                ->where('subject_id', $subject->id)
                ->first();
            return [
                'id' => $subject->id,
                'name' => $subject->name,
                'code' => $subject->code,
                'teacher' => $teacher ? trim($teacher->first_name . ' ' . $teacher->last_name) : null,
                'day' => $timetable->day_of_week ?? null,
                'start_time' => $timetable->start_time ?? null,
                'end_time' => $timetable->end_time ?? null,
                'room' => $timetable->room_number ?? null,
            ];
        });

        return response()->json($result);
    }
}
