<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $totalStudents = Student::where('school_id', $schoolId)->count();
        $totalTeachers = Teacher::where('school_id', $schoolId)->count();
        $totalClasses = SchoolClass::where('school_id', $schoolId)->count();

        // Today's attendance stats
        $today = now()->format('Y-m-d');
        $todayAttendance = Attendance::where('school_id', $schoolId)
            ->where('date', $today)
            ->where('type', 'Student')
            ->get();

        $presentCount = $todayAttendance->where('status', 'Present')->count();
        $absentCount = $todayAttendance->where('status', 'Absent')->count();
        $attendanceRate = $totalStudents > 0 ? round(($presentCount / max(1, $todayAttendance->count())) * 100, 1) : 100;

        // Financial stats
        $totalFeeCollected = FeeInvoice::where('school_id', $schoolId)->sum('paid_amount');
        $totalFeePending = FeeInvoice::where('school_id', $schoolId)->whereIn('status', ['Unpaid', 'Partial', 'Overdue'])->sum(DB::raw('amount - paid_amount'));

        // Recent Announcements
        $announcements = Announcement::where('school_id', $schoolId)
            ->latest()
            ->take(5)
            ->get();

        // Recent Students
        $recentStudents = Student::where('school_id', $schoolId)
            ->with(['class', 'section'])
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_classes' => $totalClasses,
                'attendance_rate' => $attendanceRate,
                'today_present' => $presentCount,
                'today_absent' => $absentCount,
                'fee_collected' => (float)$totalFeeCollected,
                'fee_pending' => (float)$totalFeePending,
            ],
            'recent_announcements' => $announcements,
            'recent_students' => $recentStudents,
        ]);
    }
}
