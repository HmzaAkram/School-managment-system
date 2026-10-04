<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeReportController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());
        $classId = $request->query('class_id');

        $invoices = FeeInvoice::where('school_id', $schoolId)->whereBetween('due_date', [$from, $to])
            ->when($classId, fn ($q) => $q->whereHas('student', fn ($s) => $s->where('class_id', $classId)));

        $summary = (clone $invoices)
            ->selectRaw('COUNT(*) as invoices')
            ->selectRaw('COALESCE(SUM(amount),0) as billed')
            ->selectRaw('COALESCE(SUM(paid_amount),0) as collected')
            ->first();

        $billed = (float) $summary->billed;
        $collected = (float) $summary->collected;

        $byStatus = (clone $invoices)
            ->select('status')
            ->selectRaw('COUNT(*) as invoices')
            ->selectRaw('COALESCE(SUM(amount),0) as amount')
            ->selectRaw('COALESCE(SUM(paid_amount),0) as paid')
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => [
                'status' => $r->status,
                'invoices' => (int) $r->invoices,
                'amount' => (float) $r->amount,
                'paid' => (float) $r->paid,
                'due' => round((float) $r->amount - (float) $r->paid, 2),
            ])->all();

        // Collection trend by month over the range (plus the 5 preceding months).
        $start = \Illuminate\Support\Carbon::parse($from)->startOfMonth()->subMonths(5);
        $monthExpr = DB::connection()->getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', payment_date)"
            : "DATE_FORMAT(payment_date, '%Y-%m')";

        $paymentRows = FeePayment::where('school_id', $schoolId)
            ->where('status', 'Completed')
            ->whereBetween('payment_date', [$start->toDateString(), $to])
            ->selectRaw("{$monthExpr} as month")
            ->selectRaw('COALESCE(SUM(amount),0) as total')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('month')->pluck('total', 'month');

        $trend = [];
        $cursor = $start->copy();
        while ($cursor->lte(\Illuminate\Support\Carbon::parse($to))) {
            $key = $cursor->format('Y-m');
            $trend[] = [
                'month' => $key,
                'collected' => round((float) ($paymentRows[$key] ?? 0), 2),
            ];
            $cursor->addMonth();
        }

        // Outstanding per class.
        $byClass = DB::table('fee_invoices')
            ->join('student_profiles', 'student_profiles.id', '=', 'fee_invoices.student_id')
            ->leftJoin('classes', 'classes.id', '=', 'student_profiles.class_id')
            ->where('fee_invoices.school_id', $schoolId)
            ->whereBetween('fee_invoices.due_date', [$from, $to])
            ->groupBy('classes.id', 'classes.name', 'classes.section')
            ->select('classes.id as class_id')
            ->selectRaw("COALESCE(CONCAT(classes.name,'-',classes.section),'Unassigned') as class_name")
            ->selectRaw('COUNT(*) as invoices')
            ->selectRaw('COALESCE(SUM(fee_invoices.amount),0) as billed')
            ->selectRaw('COALESCE(SUM(fee_invoices.paid_amount),0) as collected')
            ->orderByDesc('billed')
            ->get()
            ->map(fn ($r) => [
                'class_id' => $r->class_id,
                'class' => $r->class_name,
                'invoices' => (int) $r->invoices,
                'billed' => round((float) $r->billed, 2),
                'collected' => round((float) $r->collected, 2),
                'due' => round((float) $r->billed - (float) $r->collected, 2),
                'rate' => (float) $r->billed > 0 ? round((float) $r->collected / (float) $r->billed * 100, 1) : null,
            ])->all();

        // Top defaulters (highest outstanding balance).
        $defaulters = FeeInvoice::where('school_id', $schoolId)
            ->whereBetween('due_date', [$from, $to])
            ->with('student:id,first_name,last_name,roll_number,class_id')
            ->get()
            ->map(fn (FeeInvoice $i) => [
                'invoice_id' => $i->id,
                'invoice_number' => $i->invoice_number,
                'student_id' => $i->student_id,
                'student_name' => $i->student?->full_name,
                'roll_number' => $i->student?->roll_number,
                'title' => $i->title,
                'due_date' => $i->due_date?->toDateString(),
                'due' => round((float) $i->amount - (float) $i->paid_amount, 2),
                'is_overdue' => $i->due_date !== null && $i->due_date->lt(now()),
            ])
            ->filter(fn ($i) => $i['due'] > 0.004)
            ->sortByDesc('due')
            ->values()
            ->take(25)
            ->all();

        return response()->json([
            'period' => ['from' => $from, 'to' => $to, 'class_id' => $classId],
            'summary' => [
                'invoices' => (int) $summary->invoices,
                'billed' => round($billed, 2),
                'collected' => round($collected, 2),
                'outstanding' => round(max(0, $billed - $collected), 2),
                'collection_rate' => $billed > 0 ? round($collected / $billed * 100, 1) : null,
            ],
            'by_status' => $byStatus,
            'trend' => $trend,
            'by_class' => $byClass,
            'defaulters' => $defaulters,
        ]);
    }
}