<?php

use App\Http\Controllers\Api\Admin\AcademicController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AttendanceController;
use App\Http\Controllers\Api\Admin\ExamController;
use App\Http\Controllers\Api\Admin\FeeController;
use App\Http\Controllers\Api\Admin\NoticeController;
use App\Http\Controllers\Api\Admin\StudentController;
use App\Http\Controllers\Api\Admin\TeacherController;
use App\Http\Controllers\Api\Admin\TimetableController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Student\StudentDashboardController;
use App\Http\Controllers\Api\SuperAdmin\ContractController;
use App\Http\Controllers\Api\SuperAdmin\SchoolController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminFinancialController;
use App\Http\Controllers\Api\SuperAdmin\SupportTicketController;
use App\Http\Controllers\Api\Teacher\TeacherAcademicController;
use App\Http\Controllers\Api\Teacher\TeacherDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ── SUPER ADMIN ROUTES ──
    Route::prefix('super-admin')->middleware('role:super_admin')->group(function () {
        Route::get('/stats', [SuperAdminDashboardController::class, 'stats']);
        Route::apiResource('schools', SchoolController::class);
        Route::apiResource('contracts', ContractController::class);
        Route::get('/payments', [SuperAdminFinancialController::class, 'payments']);
        Route::post('/payments', [SuperAdminFinancialController::class, 'recordPayment']);
        Route::get('/ledger', [SuperAdminFinancialController::class, 'ledger']);
        Route::get('/expenses', [SuperAdminFinancialController::class, 'expenses']);
        Route::post('/expenses', [SuperAdminFinancialController::class, 'storeExpense']);
        Route::apiResource('tickets', SupportTicketController::class);
    });

    // ── SCHOOL ADMIN ROUTES ──
    Route::prefix('admin')->middleware('role:school_admin')->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        Route::apiResource('students', StudentController::class);
        Route::apiResource('teachers', TeacherController::class);

        // Academic Structure
        Route::get('/classes', [AcademicController::class, 'getClasses']);
        Route::post('/classes', [AcademicController::class, 'storeClass']);
        Route::get('/sections', [AcademicController::class, 'getSections']);
        Route::post('/sections', [AcademicController::class, 'storeSection']);
        Route::get('/subjects', [AcademicController::class, 'getSubjects']);
        Route::post('/subjects', [AcademicController::class, 'storeSubject']);

        // Attendance
        Route::get('/attendance/students', [AttendanceController::class, 'getStudentAttendance']);
        Route::post('/attendance/students', [AttendanceController::class, 'markStudentAttendance']);
        Route::get('/attendance/teachers', [AttendanceController::class, 'getTeacherAttendance']);
        Route::post('/attendance/teachers', [AttendanceController::class, 'markTeacherAttendance']);

        // Fees
        Route::get('/fees/structures', [FeeController::class, 'getStructures']);
        Route::post('/fees/structures', [FeeController::class, 'storeStructure']);
        Route::get('/fees/invoices', [FeeController::class, 'getInvoices']);
        Route::post('/fees/invoices/generate', [FeeController::class, 'generateInvoices']);
        Route::post('/fees/payments', [FeeController::class, 'recordPayment']);

        // Exams
        Route::get('/exams', [ExamController::class, 'getExams']);
        Route::post('/exams', [ExamController::class, 'storeExam']);
        Route::post('/exams/{examId}/schedules', [ExamController::class, 'storeSchedule']);
        Route::get('/marks', [ExamController::class, 'getMarks']);
        Route::post('/marks', [ExamController::class, 'storeMarks']);

        // Notices & Timetable
        Route::get('/notices', [NoticeController::class, 'index']);
        Route::post('/notices', [NoticeController::class, 'store']);
        Route::delete('/notices/{id}', [NoticeController::class, 'destroy']);

        Route::get('/timetable', [TimetableController::class, 'index']);
        Route::post('/timetable', [TimetableController::class, 'store']);
    });

    // ── TEACHER ROUTES ──
    Route::prefix('teacher')->middleware('role:teacher')->group(function () {
        Route::get('/stats', [TeacherDashboardController::class, 'stats']);
        Route::get('/assignments', [TeacherAcademicController::class, 'getAssignments']);
        Route::post('/assignments', [TeacherAcademicController::class, 'storeAssignment']);
        Route::post('/assignments/submissions/{id}/grade', [TeacherAcademicController::class, 'gradeSubmission']);
        Route::get('/diaries', [TeacherAcademicController::class, 'getDiaries']);
        Route::post('/diaries', [TeacherAcademicController::class, 'storeDiary']);
        Route::get('/classes', [TeacherAcademicController::class, 'getClasses']);
        Route::get('/classes/{classId}/students', [TeacherAcademicController::class, 'getClassStudents']);
        Route::post('/attendance', [TeacherAcademicController::class, 'markAttendance']);
        Route::get('/attendance', [TeacherAcademicController::class, 'getAttendance']);
        Route::get('/marks', [TeacherAcademicController::class, 'getMarks']);
        Route::get('/exams', [TeacherAcademicController::class, 'getExams']);
    });

    // ── STUDENT ROUTES ──
    Route::prefix('student')->middleware('role:student,parent')->group(function () {
        Route::get('/stats', [StudentDashboardController::class, 'stats']);
        Route::post('/assignments/{id}/submit', [StudentDashboardController::class, 'submitAssignment']);
        Route::get('/invoices', [StudentDashboardController::class, 'getInvoices']);
        Route::get('/attendance', [StudentDashboardController::class, 'getAttendance']);
        Route::get('/marks', [StudentDashboardController::class, 'getMarks']);
        Route::get('/courses', [StudentDashboardController::class, 'getCourses']);
    });
});
