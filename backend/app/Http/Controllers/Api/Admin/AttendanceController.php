<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function getStudentAttendance(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
        ]);

        $query = Attendance::where('school_id', $schoolId)
            ->where('class_id', $request->class_id)
            ->where('date', $request->date)
            ->where('type', 'Student')
            ->with('student');

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->section_id);
        }

        $records = $query->get();

        // If no attendance recorded yet for this date, list all students in class
        if ($records->isEmpty()) {
            $studentsQuery = Student::where('school_id', $schoolId)->where('class_id', $request->class_id);
            if ($request->filled('section_id')) {
                $studentsQuery->where('section_id', $request->section_id);
            }

            $students = $studentsQuery->get();
            $records = $students->map(function ($student) use ($request) {
                return [
                    'student_id' => $student->id,
                    'student' => $student,
                    'status' => 'Present',
                    'date' => $request->date,
                    'remarks' => '',
                ];
            });
        }

        return response()->json($records);
    }

    public function markStudentAttendance(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:student_profiles,id',
            'attendances.*.status' => 'required|in:Present,Absent,Late,Half-Day,Excused',
        ]);

        foreach ($request->attendances as $item) {
            Attendance::updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'student_id' => $item['student_id'],
                    'date' => $request->date,
                    'type' => 'Student',
                ],
                [
                    'class_id' => $request->class_id,
                    'section_id' => $request->section_id ?? null,
                    'status' => $item['status'],
                    'remarks' => $item['remarks'] ?? null,
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Attendance marked successfully'
        ]);
    }

    public function getTeacherAttendance(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $query = Attendance::where('school_id', $schoolId)
            ->where('type', 'Teacher')
            ->with('teacher');

        if ($request->filled('date')) {
            $query->where('date', $request->date);
        }

        $records = $query->latest()->limit(500)->get();

        if ($records->isEmpty() && $request->filled('date')) {
            $teachers = Teacher::where('school_id', $schoolId)->get();
            $records = $teachers->map(function ($teacher) use ($request) {
                return [
                    'teacher_id' => $teacher->id,
                    'teacher' => $teacher,
                    'status' => 'Present',
                    'date' => $request->date,
                    'remarks' => '',
                ];
            });
        }

        return response()->json($records);
    }

    public function markTeacherAttendance(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.teacher_id' => 'required|exists:teachers,id',
            'attendances.*.status' => 'required|in:Present,Absent,Late,Half-Day,Excused',
        ]);

        foreach ($request->attendances as $item) {
            Attendance::updateOrCreate(
                [
                    'school_id' => $schoolId,
                    'teacher_id' => $item['teacher_id'],
                    'date' => $request->date,
                    'type' => 'Teacher',
                ],
                [
                    'status' => $item['status'],
                    'remarks' => $item['remarks'] ?? null,
                    'marked_by' => $request->user()->id,
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher attendance marked successfully'
        ]);
    }
}
