<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Api\ApiController;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContractController extends ApiController
{
    public function index(Request $request)
    {
        $query = SchoolContract::with('school')->withSum('payments', 'amount');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->query('school_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('plan_name')) {
            $query->where('plan_name', $request->query('plan_name'));
        }

        if ($request->filled('billing_cycle')) {
            $query->where('billing_cycle', $request->query('billing_cycle'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('contract_number', 'like', "%{$search}%")
                    ->orWhere('plan_name', 'like', "%{$search}%")
                    ->orWhereHas('school', fn ($s) => $s->where('name', 'like', "%{$search}%"));
            });
        }

        // Renewal window filter (contracts ending within N days).
        if ($request->filled('expiring_within_days')) {
            $days = (int) $request->query('expiring_within_days');
            $query->whereNotNull('end_date')
                ->whereDate('end_date', '>=', now()->toDateString())
                ->whereDate('end_date', '<=', now()->addDays(max(0, $days))->toDateString());
        }

        $paginator = $query->orderByDesc('id')->paginate($this->perPage($request));

        $summary = SchoolContract::query()
            ->selectRaw('COALESCE(SUM(total_contract_value),0) as value, COALESCE(SUM(total_paid_amount),0) as paid, COALESCE(SUM(total_pending_amount),0) as pending, COUNT(*) as contracts')
            ->first();

        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => [
                'total_contract_value' => (float) $summary->value,
                'total_paid_amount' => (float) $summary->paid,
                'total_pending_amount' => (float) $summary->pending,
                'contracts' => (int) $summary->contracts,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'plan_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0',
            'total_contract_value' => 'nullable|numeric|min:0',
            'per_student_fee' => 'nullable|numeric|min:0',
            'school_share_percent' => 'nullable|numeric|min:0|max:100',
            'saas_share_percent' => 'nullable|numeric|min:0|max:100',
            'saas_fee_per_student' => 'nullable|numeric|min:0',
            'contract_duration_months' => 'nullable|integer|min:1|max:120',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'billing_cycle' => 'required|in:Monthly,Quarterly,Annually',
            'status' => 'nullable|in:Active,Pending,Pending Renewal,Expired,Inactive',
            'current_month_status' => 'nullable|in:Paid,Pending,Overdue',
            'notes' => 'nullable|string',
        ]);

        $value = (float) ($data['total_contract_value'] ?? $data['total_amount']);
        $saasShare = $data['saas_share_percent'] ?? 50;
        $perStudent = $data['per_student_fee'] ?? 0;

        $contract = SchoolContract::create([
            'school_id' => $data['school_id'],
            'contract_number' => 'CNT-'.strtoupper(uniqid()),
            'plan_name' => $data['plan_name'],
            'per_student_fee' => $perStudent,
            'school_share_percent' => $data['school_share_percent'] ?? 50,
            'saas_share_percent' => $saasShare,
            'saas_fee_per_student' => $data['saas_fee_per_student']
                ?? round($perStudent * $saasShare / 100, 2),
            'contract_duration_months' => $data['contract_duration_months'] ?? 12,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'contract_start' => $data['start_date'],
            'contract_end' => $data['end_date'],
            'total_amount' => $data['total_amount'],
            'total_contract_value' => $value,
            'paid_amount' => 0,
            'total_paid_amount' => 0,
            'balance_due' => $value,
            'total_pending_amount' => $value,
            'billing_cycle' => $data['billing_cycle'],
            'current_month_status' => $data['current_month_status'] ?? 'Pending',
            'status' => $data['status'] ?? 'Active',
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contract created successfully',
            'contract' => $contract->load('school'),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        return response()->json(
            SchoolContract::with(['school', 'payments'])->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $contract = SchoolContract::findOrFail($id);

        $data = $request->validate([
            'plan_name' => 'sometimes|required|string|max:255',
            'total_amount' => 'sometimes|required|numeric|min:0',
            'total_contract_value' => 'sometimes|numeric|min:0',
            'per_student_fee' => 'sometimes|numeric|min:0',
            'school_share_percent' => 'sometimes|numeric|min:0|max:100',
            'saas_share_percent' => 'sometimes|numeric|min:0|max:100',
            'saas_fee_per_student' => 'sometimes|numeric|min:0',
            'contract_duration_months' => 'sometimes|integer|min:1|max:120',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'billing_cycle' => 'sometimes|in:Monthly,Quarterly,Annually',
            'status' => 'sometimes|in:Active,Pending,Pending Renewal,Expired,Inactive',
            'current_month_status' => 'sometimes|in:Paid,Pending,Overdue',
            'paid_amount' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $old = $contract->only(array_keys($data));
        $contract->update($data);

        // Recompute cached derived amounts.
        $value = (float) ($contract->total_contract_value ?: $contract->total_amount);
        $paid = (float) $contract->total_paid_amount;
        $contract->forceFill([
            'balance_due' => max(0, $value - $paid),
            'total_pending_amount' => max(0, $value - $paid),
        ])->save();

        $this->log($request, 'updated', SchoolContract::class, $contract->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Contract updated successfully',
            'contract' => $contract->fresh(),
        ]);
    }

    public function renew(Request $request, $id)
    {
        $contract = SchoolContract::findOrFail($id);

        $data = $request->validate([
            'months' => 'required|integer|min:1|max:120',
            'total_amount' => 'nullable|numeric|min:0',
        ]);

        $base = $contract->contract_end ?: $contract->end_date ?: now();
        $start = $base->copy()->addDay();
        $end = $start->copy()->addMonths((int) $data['months']);
        $value = (float) ($data['total_amount'] ?? $contract->total_contract_value);

        $renewed = DB::transaction(function () use ($contract, $start, $end, $value, $data) {
            $contract->update([
                'status' => 'Active',
                'start_date' => $start,
                'end_date' => $end,
                'contract_start' => $start,
                'contract_end' => $end,
                'contract_duration_months' => (int) $data['months'],
                'total_contract_value' => $value,
                'total_amount' => (float) ($data['total_amount'] ?? $contract->total_amount),
                'balance_due' => $value,
                'total_pending_amount' => $value,
                'current_month_status' => 'Pending',
            ]);

            return $contract->fresh();
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Contract renewed',
            'contract' => $renewed,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        SchoolContract::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Contract deleted',
        ]);
    }
}