<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Expense;
use App\Models\LedgerEntry;
use App\Models\School;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Student;
use App\Models\SupportTicket;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminDashboardController extends ApiController
{
    /** Number of months of trend history to report. */
    private const TREND_MONTHS = 12;

    public function stats()
    {
        $now = now();

        $totalSchools = School::count();
        $activeSchools = School::where('status', 'Active')->count();
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalUsers = User::count();

        $totalRevenue = (float) SchoolPayment::where('status', 'Completed')->sum('amount');
        $totalExpenses = (float) Expense::whereNull('school_id')->sum('amount');
        $netProfit = $totalRevenue - $totalExpenses;

        $pendingContracts = SchoolContract::whereIn('status', ['Pending', 'Pending Renewal'])->count();
        $activeContracts = SchoolContract::where('status', 'Active')->count();
        $expiringContracts = SchoolContract::whereIn('status', ['Active', 'Pending Renewal'])
            ->whereNotNull('end_date')
            ->whereDate('end_date', '>=', $now->toDateString())
            ->whereDate('end_date', '<=', $now->copy()->addDays(60)->toDateString())
            ->count();

        // ARR: forward-looking value of all active contracts / per-student billing.
        $activeContractRows = SchoolContract::where('status', 'Active')->get();
        $arr = (float) $activeContractRows->sum(function (SchoolContract $c) {
            if ((float) $c->total_contract_value > 0) {
                return (float) $c->total_contract_value;
            }

            if ((float) $c->total_amount > 0 && (int) $c->contract_duration_months > 0) {
                return (float) $c->total_amount / ((int) $c->contract_duration_months / 12);
            }

            return 0;
        });

        $contractValueTotal = (float) SchoolContract::sum('total_contract_value');
        $totalPaid = (float) SchoolContract::sum('total_paid_amount');
        $totalPending = (float) SchoolContract::sum('total_pending_amount');

        $openTickets = SupportTicket::whereIn('status', ['Open', 'In Progress'])->count();

        // Recent schools
        $recentSchools = School::withCount(['users', 'students', 'teachers'])->latest()->take(5)->get();

        // Recent payments
        $recentPayments = SchoolPayment::with('school')->latest('payment_date')->take(5)->get();

        $monthlyRevenue = $this->monthlySeries('school_payments', 'payment_date', 'amount', "status = 'Completed'");
        $monthlyExpenses = $this->monthlySeries('expenses', 'expense_date', 'amount', 'school_id IS NULL');

        return response()->json([
            'summary' => [
                'total_schools' => $totalSchools,
                'active_schools' => $activeSchools,
                'inactive_schools' => $totalSchools - $activeSchools,
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_users' => $totalUsers,
                'total_revenue' => $totalRevenue,
                'total_expenses' => $totalExpenses,
                'net_profit' => $netProfit,
                'profit_margin' => $totalRevenue > 0 ? round($netProfit / $totalRevenue * 100, 2) : 0.0,
                'pending_contracts' => $pendingContracts,
                'active_contracts' => $activeContracts,
                'expiring_contracts' => $expiringContracts,
                'open_tickets' => $openTickets,
                'total_contract_value' => $contractValueTotal,
                'total_paid_amount' => $totalPaid,
                'total_pending_amount' => $totalPending,
                'arr' => round($arr, 2),
                'saas_share' => (float) LedgerEntry::where('type', 'Credit')->where('category', 'like', '%SaaS%')->sum('credit'),
            ],
            'recent_schools' => $recentSchools,
            'recent_payments' => $recentPayments,
            'monthly_revenue' => $monthlyRevenue,
            'monthly_expenses' => $monthlyExpenses,
        ]);
    }

    /**
     * Build a contiguous, ascending 12-month series for a money column.
     * Missing months are emitted as zero so charts never show phantom gaps.
     *
     * @return array<int,array{month:string,total:float}>
     */
    private function monthlySeries(string $table, string $dateColumn, string $amountColumn, string $where): array
    {
        $driver = DB::connection()->getDriverName();
        $expr = $driver === 'sqlite'
            ? "strftime('%Y-%m', {$dateColumn})"
            : "DATE_FORMAT({$dateColumn}, '%Y-%m')";

        $rows = DB::table($table)
            ->selectRaw("{$expr} as month, SUM({$amountColumn}) as total")
            ->whereRaw($where)
            ->whereNotNull($dateColumn)
            ->groupBy('month')
            ->pluck('total', 'month');

        $series = [];
        $cursor = now()->startOfMonth()->subMonths(self::TREND_MONTHS - 1);

        for ($i = 0; $i < self::TREND_MONTHS; $i++) {
            $key = $cursor->format('Y-m');
            $series[] = [
                'month' => $key,
                'total' => round((float) ($rows[$key] ?? 0), 2),
            ];
            $cursor->addMonth();
        }

        return $series;
    }
}