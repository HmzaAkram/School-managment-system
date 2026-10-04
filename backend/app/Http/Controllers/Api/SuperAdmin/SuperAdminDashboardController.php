<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Expense;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminDashboardController extends Controller
{
    public function stats()
    {
        $totalSchools = School::count();
        $activeSchools = School::where('status', 'Active')->count();
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalUsers = User::count();

        $totalRevenue = SchoolPayment::where('status', 'Completed')->sum('amount');
        $totalExpenses = Expense::whereNull('school_id')->sum('amount');
        $netProfit = $totalRevenue - $totalExpenses;

        $pendingContracts = SchoolContract::where('status', 'Pending')->count();
        $activeContracts = SchoolContract::where('status', 'Active')->count();
        $openTickets = SupportTicket::where('status', 'Open')->count();

        // Recent schools
        $recentSchools = School::latest()->take(5)->get();

        // Recent payments
        $recentPayments = SchoolPayment::with('school')->latest()->take(5)->get();

// Monthly revenue trend (last 6 months)
// Use database-specific date formatting for MySQL and SQLite.
$dateExpression = DB::connection()->getDriverName() === 'sqlite'
    ? "strftime('%Y-%m', payment_date)"
    : "DATE_FORMAT(payment_date, '%Y-%m')";

$monthlyRevenue = SchoolPayment::where('status', 'Completed')
    ->select(
        DB::raw("{$dateExpression} as month"),
        DB::raw('SUM(amount) as total')
    )
    ->groupBy('month')
    ->orderBy('month', 'desc')
    ->take(6)
    ->get();

        return response()->json([
            'summary' => [
                'total_schools' => $totalSchools,
                'active_schools' => $activeSchools,
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_users' => $totalUsers,
                'total_revenue' => (float)$totalRevenue,
                'total_expenses' => (float)$totalExpenses,
                'net_profit' => (float)$netProfit,
                'pending_contracts' => $pendingContracts,
                'active_contracts' => $activeContracts,
                'open_tickets' => $openTickets,
            ],
            'recent_schools' => $recentSchools,
            'recent_payments' => $recentPayments,
            'monthly_revenue' => $monthlyRevenue,
        ]);
    }
}
