<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Diary;
use App\Models\Student;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TeacherDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return response()->json(['message' => 'Teacher profile not found'], 404);
        }

        $schoolId = $teacher->school_id;

        // Timetable for today
        $dayName = now()->format('l');
        $todayClasses = Timetable::where('school_id', $schoolId)
            ->where('teacher_id', $teacher->id)
            ->where('day_of_week', $dayName)
            ->with(['class', 'section', 'subject'])
            ->orderBy('start_time')
            ->get();

        $assignmentsCount = Assignment::where('teacher_id', $teacher->id)->count();
        $diariesCount = Diary::where('teacher_id', $teacher->id)->count();

        // Subjects taught
        $subjects = $teacher->subjects;

        return response()->json([
            'teacher' => $teacher,
            'today_classes' => $todayClasses,
            'total_assignments' => $assignmentsCount,
            'total_diaries' => $diariesCount,
            'subjects' => $subjects,
        ]);
    }
}
