<?php

use App\Http\Controllers\Api\Admin\AcademicController;
use App\Http\Controllers\Api\Admin\AcademicYearController;
use App\Http\Controllers\Api\Admin\ActivityController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AttendanceController;
use App\Http\Controllers\Api\Admin\AttendanceReportController;
use App\Http\Controllers\Api\Admin\EventController;
use App\Http\Controllers\Api\Admin\ExamController;
use App\Http\Controllers\Api\Admin\ExpenseController;
use App\Http\Controllers\Api\Admin\FeeController;
use App\Http\Controllers\Api\Admin\FeeReportController;
use App\Http\Controllers\Api\Admin\LeaveController;
use App\Http\Controllers\Api\Admin\NoticeController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\SchoolProfileController;
use App\Http\Controllers\Api\Admin\SchoolSettingController;
use App\Http\Controllers\Api\Admin\StudentController;
use App\Http\Controllers\Api\Admin\TeacherController;
use App\Http\Controllers\Api\Admin\TimetableController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Student\StudentDashboardController;
use App\Http\Controllers\Api\SuperAdmin\ContractController;
use App\Http\Controllers\Api\SuperAdmin\SchoolController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminDashboardController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminFinancialController;
use App\Http\Controllers\Api\SuperAdmin\SuperAdminReportController;
use App\Http\Controllers\Api\SuperAdmin\SupportTicketController;
use App\Http\Controllers\Api\Teacher\TeacherAcademicController;
use App\Http\Controllers\Api\Teacher\TeacherDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ── Public Auth Routes ──
Route::post('/login', [AuthController::class, 'login']);

// ── Protected Routes (Sanctum) ──
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/me/password', [AuthController::class, 'changePassword']);

    // ── Notifications (all roles) ──
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/read-all', [NotificationController::class, 'markAllRead']);
        Route::post('/{id}/read', [NotificationController::class, 'markRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });

    // ── SUPER ADMIN ROUTES ──
    Route::prefix('super-admin')->middleware('role:super_admin')->group(function () {
        Route::get('/stats', [SuperAdminDashboardController::class, 'stats']);
        Route::get('/reports', [SuperAdminReportController::class, 'index']);

        // Schools
        Route::get('/schools', [SchoolController::class, 'index']);
        Route::post('/schools', [SchoolController::class, 'store']);
        Route::get('/schools/{id}', [SchoolController::class, 'show']);
        Route::get('/schools/{id}/summary', [SchoolController::class, 'summary']);
        Route::put('/schools/{id}', [SchoolController::class, 'update']);
        Route::delete('/schools/{id}', [SchoolController::class, 'destroy']);

        // Contracts
        Route::get('/contracts', [ContractController::class, 'index']);
        Route::post('/contracts', [ContractController::class, 'store']);
        Route::get('/contracts/{id}', [ContractController::class, 'show']);
        Route::put('/contracts/{id}', [ContractController::class, 'update']);
        Route::post('/contracts/{id}/renew', [ContractController::class, 'renew']);
        Route::delete('/contracts/{id}', [ContractController::class, 'destroy']);

        // Payments & expenses
        Route::get('/payments', [SuperAdminFinancialController::class, 'payments']);
        Route::post('/payments', [SuperAdminFinancialController::class, 'recordPayment']);
        Route::get('/ledger', [SuperAdminFinancialController::class, 'ledger']);
        Route::get('/expenses', [SuperAdminFinancialController::class, 'expenses']);
        Route::post('/expenses', [SuperAdminFinancialController::class, 'storeExpense']);
        Route::put('/expenses/{id}', [SuperAdminFinancialController::class, 'updateExpense']);
        Route::delete('/expenses/{id}', [SuperAdminFinancialController::class, 'destroyExpense']);

        // Support
        Route::get('/tickets/stats', [SupportTicketController::class, 'stats']);
        Route::get('/tickets', [SupportTicketController::class, 'index']);
        Route::post('/tickets', [SupportTicketController::class, 'store']);
        Route::get('/tickets/{id}', [SupportTicketController::class, 'show']);
        Route::put('/tickets/{id}', [SupportTicketController::class, 'update']);
        Route::delete('/tickets/{id}', [SupportTicketController::class, 'destroy']);
    });

    // ── SCHOOL ADMIN ROUTES ──
    Route::prefix('admin')->middleware('role:school_admin')->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/activity', [ActivityController::class, 'index']);

        // Students
        Route::get('/students', [StudentController::class, 'index']);
        Route::post('/students', [StudentController::class, 'store']);
        Route::get('/students/{id}', [StudentController::class, 'show']);
        Route::put('/students/{id}', [StudentController::class, 'update']);
        Route::delete('/students/{id}', [StudentController::class, 'destroy']);
        Route::get('/students/{id}/diaries', [StudentController::class, 'diaries']);

        // Teachers
        Route::get('/teachers', [TeacherController::class, 'index']);
        Route::post('/teachers', [TeacherController::class, 'store']);
        Route::get('/teachers/{id}', [TeacherController::class, 'show']);
        Route::put('/teachers/{id}', [TeacherController::class, 'update']);
        Route::delete('/teachers/{id}', [TeacherController::class, 'destroy']);

        // School profile & settings
        Route::get('/profile', [SchoolProfileController::class, 'show']);
        Route::put('/profile', [SchoolProfileController::class, 'update']);
        Route::get('/settings', [SchoolSettingController::class, 'show']);
        Route::put('/settings', [SchoolSettingController::class, 'update']);

        // Academic structure
        Route::get('/academic-years', [AcademicYearController::class, 'index']);
        Route::post('/academic-years', [AcademicYearController::class, 'store']);
        Route::put('/academic-years/{id}', [AcademicYearController::class, 'update']);
        Route::delete('/academic-years/{id}', [AcademicYearController::class, 'destroy']);

        Route::get('/classes', [AcademicController::class, 'getClasses']);
        Route::post('/classes', [AcademicController::class, 'storeClass']);
        Route::put('/classes/{id}', [AcademicController::class, 'updateClass']);
        Route::delete('/classes/{id}', [AcademicController::class, 'destroyClass']);

        Route::get('/sections', [AcademicController::class, 'getSections']);
        Route::post('/sections', [AcademicController::class, 'storeSection']);
        Route::put('/sections/{id}', [AcademicController::class, 'updateSection']);
        Route::delete('/sections/{id}', [AcademicController::class, 'destroySection']);

        Route::get('/subjects', [AcademicController::class, 'getSubjects']);
        Route::post('/subjects', [AcademicController::class, 'storeSubject']);
        Route::put('/subjects/{id}', [AcademicController::class, 'updateSubject']);
        Route::delete('/subjects/{id}', [AcademicController::class, 'destroySubject']);

        // Attendance
        Route::get('/attendance/students', [AttendanceController::class, 'getStudentAttendance']);
        Route::post('/attendance/students', [AttendanceController::class, 'markStudentAttendance']);
        Route::get('/attendance/teachers', [AttendanceController::class, 'getTeacherAttendance']);
        Route::post('/attendance/teachers', [AttendanceController::class, 'markTeacherAttendance']);
        Route::get('/attendance/unmarked', [AttendanceController::class, 'unmarked']);
        Route::get('/reports/attendance', [AttendanceReportController::class, 'index']);

        // Fees
        Route::get('/fees/structures', [FeeController::class, 'getStructures']);
        Route::post('/fees/structures', [FeeController::class, 'storeStructure']);
        Route::put('/fees/structures/{id}', [FeeController::class, 'updateStructure']);
        Route::delete('/fees/structures/{id}', [FeeController::class, 'destroyStructure']);
        Route::get('/fees/invoices', [FeeController::class, 'getInvoices']);
        Route::post('/fees/invoices/generate', [FeeController::class, 'generateInvoices']);
        Route::get('/fees/payments', [FeeController::class, 'getPayments']);
        Route::post('/fees/payments', [FeeController::class, 'recordPayment']);
        Route::get('/reports/fees', [FeeReportController::class, 'index']);

        // Exams
        Route::get('/exams', [ExamController::class, 'getExams']);
        Route::post('/exams', [ExamController::class, 'storeExam']);
        Route::put('/exams/{id}', [ExamController::class, 'updateExam']);
        Route::delete('/exams/{id}', [ExamController::class, 'destroyExam']);
        Route::get('/exam-schedules', [ExamController::class, 'getSchedules']);
        Route::post('/exams/{examId}/schedules', [ExamController::class, 'storeSchedule']);
        Route::put('/exam-schedules/{id}', [ExamController::class, 'updateSchedule']);
        Route::delete('/exam-schedules/{id}', [ExamController::class, 'destroySchedule']);
        Route::get('/marks', [ExamController::class, 'getMarks']);
        Route::post('/marks', [ExamController::class, 'storeMarks']);

        // Results reports
        Route::get('/reports/results', [ReportController::class, 'results']);
        Route::get('/reports/summary', [ReportController::class, 'summary']);

        // Notices
        Route::get('/notices', [NoticeController::class, 'index']);
        Route::post('/notices', [NoticeController::class, 'store']);
        Route::put('/notices/{id}', [NoticeController::class, 'update']);
        Route::delete('/notices/{id}', [NoticeController::class, 'destroy']);

        // Timetable
        Route::get('/timetable', [TimetableController::class, 'index']);
        Route::post('/timetable', [TimetableController::class, 'store']);
        Route::put('/timetable/{id}', [TimetableController::class, 'update']);
        Route::delete('/timetable/{id}', [TimetableController::class, 'destroy']);
        Route::delete('/timetable', [TimetableController::class, 'destroyBulk']);

        // Expenses
        Route::get('/expenses', [ExpenseController::class, 'index']);
        Route::post('/expenses', [ExpenseController::class, 'store']);
        Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
        Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);

        // Events
        Route::get('/events', [EventController::class, 'index']);
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);

        // Student leaves
        Route::get('/leaves', [LeaveController::class, 'index']);
        Route::post('/leaves', [LeaveController::class, 'store']);
        Route::put('/leaves/{id}', [LeaveController::class, 'update']);
        Route::delete('/leaves/{id}', [LeaveController::class, 'destroy']);
    });

    // ── TEACHER ROUTES ──
    Route::prefix('teacher')->middleware('role:teacher')->group(function () {
        Route::get('/stats', [TeacherDashboardController::class, 'stats']);

        Route::get('/assignments', [TeacherAcademicController::class, 'getAssignments']);
        Route::post('/assignments', [TeacherAcademicController::class, 'storeAssignment']);
        Route::put('/assignments/{id}', [TeacherAcademicController::class, 'updateAssignment']);
        Route::delete('/assignments/{id}', [TeacherAcademicController::class, 'destroyAssignment']);
        Route::get('/assignments/{id}/submissions', [TeacherAcademicController::class, 'getSubmissions']);
        Route::post('/submissions/{submissionId}/grade', [TeacherAcademicController::class, 'gradeSubmission']);

        Route::get('/classes', [TeacherAcademicController::class, 'getClasses']);
        Route::get('/classes/{classId}/students', [TeacherAcademicController::class, 'getClassStudents']);

        Route::get('/attendance', [TeacherAcademicController::class, 'getAttendance']);
        Route::post('/attendance', [TeacherAcademicController::class, 'markAttendance']);
        Route::get('/attendance/summary', [TeacherAcademicController::class, 'attendanceSummary']);

        Route::get('/marks', [TeacherAcademicController::class, 'getMarks']);
        Route::get('/marks/mark-sheet', [TeacherAcademicController::class, 'markSheet']);
        Route::post('/marks', [TeacherAcademicController::class, 'storeMarks']);
        Route::get('/performance', [TeacherAcademicController::class, 'performance']);

        Route::get('/reviews', [TeacherAcademicController::class, 'getReviews']);
        Route::post('/reviews', [TeacherAcademicController::class, 'storeReview']);
        Route::delete('/reviews/{id}', [TeacherAcademicController::class, 'destroyReview']);

        Route::get('/diaries', [TeacherAcademicController::class, 'getDiaries']);
        Route::post('/diaries', [TeacherAcademicController::class, 'storeDiary']);
        Route::put('/diaries/{id}', [TeacherAcademicController::class, 'updateDiary']);
        Route::delete('/diaries/{id}', [TeacherAcademicController::class, 'destroyDiary']);

        Route::get('/subjects', [TeacherAcademicController::class, 'getSubjects']);
        Route::get('/sections', [TeacherAcademicController::class, 'getSections']);
        Route::get('/exams', [TeacherAcademicController::class, 'getExams']);
    });

    // ── STUDENT & PARENT ROUTES ──
    Route::prefix('student')->middleware('role:student,parent')->group(function () {
        Route::get('/stats', [StudentDashboardController::class, 'stats']);
        Route::get('/my-students', [StudentDashboardController::class, 'getMyStudents']);

        Route::get('/assignments', [StudentDashboardController::class, 'getAssignments']);
        Route::post('/assignments/{assignmentId}/submit', [StudentDashboardController::class, 'submitAssignment']);

        Route::get('/diaries', [StudentDashboardController::class, 'getDiaries']);
        Route::post('/diaries/{id}/acknowledge', [StudentDashboardController::class, 'acknowledgeDiary']);

        Route::get('/attendance', [StudentDashboardController::class, 'getAttendance']);
        Route::get('/attendance/summary', [StudentDashboardController::class, 'getAttendanceSummary']);

        Route::get('/marks', [StudentDashboardController::class, 'getMarks']);
        Route::get('/marks/summary', [StudentDashboardController::class, 'getGradesSummary']);

        Route::get('/exams', [StudentDashboardController::class, 'getExams']);
        Route::get('/announcements', [StudentDashboardController::class, 'getAnnouncements']);

        Route::get('/invoices', [StudentDashboardController::class, 'getInvoices']);
        Route::get('/invoices/summary', [StudentDashboardController::class, 'getFeeSummary']);
        Route::get('/fee-structures', [StudentDashboardController::class, 'getFeeStructures']);

        Route::get('/courses', [StudentDashboardController::class, 'getCourses']);
        Route::get('/timetable', [StudentDashboardController::class, 'getTimetable']);

        Route::get('/leaves', [StudentDashboardController::class, 'getLeaves']);
        Route::post('/leaves', [StudentDashboardController::class, 'storeLeave']);
    });
});