<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Expense;
use App\Models\School;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Student;
use App\Models\SupportTicket;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminReportController extends ApiController
{
    public function index(Request $request)
    {
        $months = max(1, min((int) $request->query('months', 12), 36));
        $end = now()->endOfMonth();
        $start = now()->startOfMonth()->subMonths($months - 1)->startOfMonth();

        return response()->json([
            'period' => [
                'months' => $months,
                'from' => $start->toDateString(),
                'to' => $end->toDateString(),
            ],
            'revenue' => $this->revenueReport($start, $end),
            'growth' => $this->growthReport($months),
            'engagement' => $this->engagementReport(),
            'renewals' => $this->renewalReport(),
        ]);
    }

    // ── Revenue: money in vs money out per month, from the ledger ──
    private function revenueReport($start, $end): array
    {
        $expr = $this->monthExpr('entry_date');

        $rows = DB::table('ledger_entries')
            ->selectRaw("{$expr} as month")
            ->selectRaw('COALESCE(SUM(credit),0) as revenue')
            ->selectRaw('COALESCE(SUM(debit),0) as expenses')
            ->whereBetween('entry_date', [$start->toDateString(), $end->toDateString()])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $series = [];
        $cursor = $start->copy();
        $cumRevenue = 0.0;
        $cumExpenses = 0.0;

        while ($cursor->lte($end)) {
            $key = $cursor->format('Y-m');
            $revenue = (float) ($rows[$key]->revenue ?? 0);
            $expenses = (float) ($rows[$key]->expenses ?? 0);
            $cumRevenue += $revenue;
            $cumExpenses += $expenses;

            $series[] = [
                'month' => $key,
                'revenue' => round($revenue, 2),
                'expenses' => round($expenses, 2),
                'net' => round($revenue - $expenses, 2),
                'cumulative_revenue' => round($cumRevenue, 2),
                'cumulative_net' => round($cumRevenue - $cumExpenses, 2),
            ];

            $cursor->addMonth();
        }

        $bySource = SchoolPayment::where('school_payments.status', 'Completed')
            ->whereBetween('school_payments.payment_date', [$start->toDateString(), $end->toDateString()])
            ->join('schools', 'schools.id', '=', 'school_payments.school_id')
            ->select('schools.name as school_name')
            ->selectRaw('COALESCE(SUM(school_payments.amount),0) as total')
            ->groupBy('schools.name')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($r) => ['label' => $r->school_name, 'value' => (float) $r->total]);

        $byCategory = Expense::whereNull('school_id')->whereNull('deleted_at')
            ->whereBetween('expense_date', [$start->toDateString(), $end->toDateString()])
            ->select('category')
            ->selectRaw('COALESCE(SUM(amount),0) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($r) => ['label' => $r->category ?? 'Uncategorised', 'value' => (float) $r->total]);

        $totalRevenue = array_sum(array_column($series, 'revenue'));
        $totalExpenses = array_sum(array_column($series, 'expenses'));

        return [
            'series' => $series,
            'totals' => [
                'revenue' => round($totalRevenue, 2),
                'expenses' => round($totalExpenses, 2),
                'net' => round($totalRevenue - $totalExpenses, 2),
                'margin' => $totalRevenue > 0 ? round(($totalRevenue - $totalExpenses) / $totalRevenue * 100, 2) : 0.0,
            ],
            'by_school' => $bySource,
            'by_expense_category' => $byCategory,
        ];
    }

    // ── Growth: new schools / students / teachers per month + MoM % ──
    private function growthReport(int $months): array
    {
        $start = now()->startOfMonth()->subMonths($months - 1)->startOfMonth();
        $end = now()->endOfMonth();

        $build = function (string $table, string $dateColumn) use ($start, $end, $months): array {
            $expr = $this->monthExpr($dateColumn);

            $rows = DB::table($table)
                ->selectRaw("{$expr} as month, COUNT(*) as total")
                ->whereNull('deleted_at')
                ->whereBetween($dateColumn, [$start->toDateString(), $end->toDateString()])
                ->groupBy('month')
                ->pluck('total', 'month');

            $series = [];
            $cursor = $start->copy();
            $prev = null;

            while ($cursor->lte($end)) {
                $key = $cursor->format('Y-m');
                $value = (int) ($rows[$key] ?? 0);
                $series[] = [
                    'month' => $key,
                    'value' => $value,
                    'change_pct' => ($prev === null || $prev === 0) ? null : round((($value - $prev) / $prev) * 100, 2),
                ];
                $prev = $value;
                $cursor->addMonth();
            }

            return $series;
        };

        return [
            'schools' => $build('schools', 'created_at'),
            'students' => $build('student_profiles', 'created_at'),
            'teachers' => $build('teachers', 'created_at'),
            'users' => $build('users', 'created_at'),
            'payments' => DB::table('school_payments')
                ->selectRaw("{$this->monthExpr('payment_date')} as month, COUNT(*) as value, COALESCE(SUM(amount),0) as amount")
                ->where('status', 'Completed')
                ->whereBetween('payment_date', [$start->toDateString(), $end->toDateString()])
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->map(fn ($r) => ['month' => $r->month, 'value' => (int) $r->value, 'amount' => (float) $r->amount])
                ->all(),
        ];
    }

    // ── Engagement: platform usage signals ──
    private function engagementReport(): array
    {
        $activeSchools = School::where('status', 'Active')->count();
        $totalSchools = School::count();

        return [
            'schools' => [
                'total' => $totalSchools,
                'active' => $activeSchools,
                'active_pct' => $totalSchools > 0 ? round($activeSchools / $totalSchools * 100, 2) : 0.0,
            ],
            'people' => [
                'students' => Student::count(),
                'teachers' => Teacher::count(),
                'users' => User::count(),
                'admins' => User::where('role', 'school_admin')->count(),
            ],
            'adoption' => School::withCount(['students', 'teachers', 'classes'])
                ->orderByDesc('students_count')
                ->limit(10)
                ->get()
                ->map(fn ($s) => [
                    'school' => $s->name,
                    'students' => $s->students_count,
                    'teachers' => $s->teachers_count,
                    'classes' => $s->classes_count,
                ]),
            'support' => [
                'open' => SupportTicket::whereIn('status', ['Open', 'In Progress'])->count(),
                'resolved' => SupportTicket::whereIn('status', ['Resolved', 'Closed'])->count(),
                'by_priority' => SupportTicket::select('priority')
                    ->selectRaw('COUNT(*) as total')
                    ->groupBy('priority')
                    ->pluck('total', 'priority'),
            ],
        ];
    }

    // ── Renewals: contract expiry pipeline ──
    private function renewalReport(): array
    {
        $now = now();
        $buckets = ['expired' => 0, 'due_30' => 0, 'due_60' => 0, 'due_90' => 0, 'later' => 0];

        SchoolContract::query()
            ->select('id', 'contract_end', 'end_date', 'status', 'total_contract_value', 'school_id')
            ->get()
            ->each(function ($c) use (&$buckets, $now) {
                $end = $c->contract_end ?: $c->end_date;

                if (! $end) {
                    return;
                }

                $days = $now->startOfDay()->diffInDays($end->startOfDay(), false);

                if ($days < 0) {
                    $buckets['expired']++;
                } elseif ($days <= 30) {
                    $buckets['due_30']++;
                } elseif ($days <= 60) {
                    $buckets['due_60']++;
                } elseif ($days <= 90) {
                    $buckets['due_90']++;
                } else {
                    $buckets['later']++;
                }
            });

        $upcoming = SchoolContract::with('school')
            ->whereNotNull('end_date')
            ->whereDate('end_date', '>=', $now->toDateString())
            ->orderBy('end_date')
            ->limit(15)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'school' => $c->school?->name,
                'plan_name' => $c->plan_name,
                'end_date' => ($c->contract_end ?: $c->end_date)?->toDateString(),
                'days_remaining' => $c->days_remaining,
                'value' => (float) ($c->total_contract_value ?: $c->total_amount),
                'status' => $c->status,
            ]);

        return [
            'buckets' => $buckets,
            'upcoming' => $upcoming,
            'at_risk_value' => (float) SchoolContract::whereIn('status', ['Expired', 'Pending Renewal'])->sum('total_contract_value'),
        ];
    }

    private function monthExpr(string $column): string
    {
        return DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', {$column})"
            : "DATE_FORMAT({$column}, '%Y-%m')";
    }
}