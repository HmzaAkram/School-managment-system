<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Expense;
use App\Models\LedgerEntry;
use App\Models\School;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminFinancialController extends ApiController
{
    // ─────────────────────────── Payments ───────────────────────────

    public function payments(Request $request)
    {
        $query = SchoolPayment::with('school');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->query('school_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->query('payment_method'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%")
                    ->orWhereHas('school', fn ($s) => $s->where('name', 'like', "%{$search}%"));
            });
        }

        $this->applyDateRange($query, $request, 'payment_date', $this->dateRange($request));

        // Totals are computed from the un-paginated, unordered query.
        $totals = (clone $query)->reorder()
            ->selectRaw('COALESCE(SUM(amount),0) as total')
            ->selectRaw("COALESCE(SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END),0) as completed")
            ->selectRaw("COALESCE(SUM(CASE WHEN status <> 'Completed' THEN amount ELSE 0 END),0) as outstanding")
            ->first();

        $paginator = $query->orderByDesc('payment_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'totals' => [
                'total' => (float) $totals->total,
                'completed' => (float) $totals->completed,
                'outstanding' => (float) $totals->outstanding,
            ],
        ]);
    }

    public function recordPayment(Request $request)
    {
        $data = $request->validate([
            'school_id' => 'required|exists:schools,id',
            'school_contract_id' => 'nullable|exists:school_contracts,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|max:50',
            'status' => 'nullable|in:Completed,Pending,Failed',
            'reference' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'month_for' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $payment = SchoolPayment::create([
                'school_id' => $data['school_id'],
                'school_contract_id' => $data['school_contract_id'] ?? null,
                'transaction_id' => $data['reference'] ?: 'TXN-'.strtoupper(uniqid()),
                'amount' => $data['amount'],
                'payment_date' => $data['payment_date'],
                'payment_method' => $data['payment_method'],
                'reference' => $data['reference'] ?? null,
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'month_for' => $data['month_for'] ?? null,
                'status' => $data['status'] ?? 'Completed',
            ]);

            if ($payment->status === 'Completed') {
                $this->appendLedger($payment);
                $this->syncContractTotals($payment);
            }

            $this->log($request, 'created', SchoolPayment::class, $payment->id, $payment->toArray());

            return response()->json([
                'status' => 'success',
                'message' => 'Payment recorded successfully',
                'payment' => $payment->load('school'),
            ], 201);
        });
    }

    // ─────────────────────────── Ledger ───────────────────────────

    public function ledger(Request $request)
    {
        $query = LedgerEntry::with('school');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->query('school_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('transaction_id', 'like', "%{$search}%");
            });
        }

        $this->applyDateRange($query, $request, 'entry_date', $this->dateRange($request));

        // Totals are computed from the un-paginated, unordered query.
        $totals = (clone $query)->reorder()
            ->selectRaw('COALESCE(SUM(credit),0) as credits, COALESCE(SUM(debit),0) as debits')
            ->first();

        $paginator = $query->orderByDesc('entry_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $categories = LedgerEntry::query()
            ->selectRaw('category, COALESCE(SUM(credit),0) as credit, COALESCE(SUM(debit),0) as debit, COUNT(*) as entries')
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderByDesc('entries')
            ->get()
            ->map(fn ($r) => [
                'category' => $r->category,
                'credit' => (float) $r->credit,
                'debit' => (float) $r->debit,
                'net' => (float) $r->credit - (float) $r->debit,
                'entries' => (int) $r->entries,
            ]);

        $opening = LedgerEntry::orderBy('id')->value('balance') ?? 0;

        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'totals' => [
                'credits' => (float) $totals->credits,
                'debits' => (float) $totals->debits,
                'net' => (float) $totals->credits - (float) $totals->debits,
                'closing_balance' => (float) $opening + (float) $totals->credits - (float) $totals->debits,
            ],
            'categories' => $categories,
        ]);
    }

    // ─────────────────────────── Expenses ───────────────────────────

    public function expenses(Request $request)
    {
        $query = Expense::with('creator')->whereNull('school_id');

        $this->applyExpenseFilters($query, $request);

        $totals = (clone $query)->reorder()->selectRaw('COALESCE(SUM(amount),0) as total')->first();

        $paginator = $query->orderByDesc('expense_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $categoryTotals = Expense::whereNull('school_id')
            ->whereNull('deleted_at')
            ->selectRaw('category, COALESCE(SUM(amount),0) as total, COUNT(*) as entries')
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => [
                'category' => $r->category,
                'total' => (float) $r->total,
                'entries' => (int) $r->entries,
            ]);

        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'totals' => ['total' => (float) $totals->total],
            'category_totals' => $categoryTotals,
        ]);
    }

    public function storeExpense(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'required|string|max:50',
            'paid_to' => 'nullable|string|max:255',
            'receipt_number' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|max:30',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $expense = Expense::create([
                'school_id' => null, // platform-level expense
                'title' => $data['title'],
                'category' => $data['category'],
                'amount' => $data['amount'],
                'expense_date' => $data['expense_date'],
                'paid_to' => $data['paid_to'] ?? null,
                'payment_method' => $data['payment_method'],
                'receipt_number' => $data['receipt_number'] ?? null,
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
                'status' => $data['status'] ?? 'Paid',
                'created_by' => $request->user()?->id,
            ]);

            $this->appendLedger($expense);
            $this->log($request, 'created', Expense::class, $expense->id, $expense->toArray());

            return response()->json([
                'status' => 'success',
                'message' => 'Platform expense recorded',
                'expense' => $expense,
            ], 201);
        });
    }

    public function updateExpense(Request $request, $id)
    {
        $expense = Expense::whereNull('school_id')->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0.01',
            'expense_date' => 'sometimes|required|date',
            'payment_method' => 'sometimes|required|string|max:50',
            'paid_to' => 'nullable|string|max:255',
            'receipt_number' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string|max:30',
        ]);

        $old = $expense->only(array_keys($data));
        $expense->update($data);

        // Keep the mirrored ledger row in sync.
        $entry = LedgerEntry::where('expense_id', $expense->id)->first();
        if ($entry) {
            $entry->update([
                'description' => $expense->title,
                'category' => $expense->category,
                'debit' => (float) $expense->amount,
                'amount' => (float) $expense->amount,
                'entry_date' => $expense->expense_date,
                'payment_method' => $expense->payment_method,
            ]);
        }

        $this->log($request, 'updated', Expense::class, $expense->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Expense updated',
            'expense' => $expense->fresh(),
        ]);
    }

    public function destroyExpense(Request $request, $id)
    {
        $expense = Expense::whereNull('school_id')->findOrFail($id);

        return DB::transaction(function () use ($expense, $request) {
            LedgerEntry::where('expense_id', $expense->id)->delete();
            $expense->delete();

            $this->log($request, 'deleted', Expense::class, $expense->id, [], $expense->toArray());

            return response()->json([
                'status' => 'success',
                'message' => 'Expense deleted',
            ]);
        });
    }

    // ─────────────────────────── Internals ───────────────────────────

    private function applyExpenseFilters($query, Request $request): void
    {
        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->query('payment_method'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('paid_to', 'like', "%{$search}%")
                    ->orWhere('receipt_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $this->applyDateRange($query, $request, 'expense_date', $this->dateRange($request));
    }

    /** Mirror a financial event into the general ledger, keeping a running balance. */
    private function appendLedger($record): LedgerEntry
    {
        $isExpense = $record instanceof Expense;
        $amount = (float) $record->amount;

        $lastBalance = (float) (LedgerEntry::orderByDesc('id')->value('running_balance')
            ?? LedgerEntry::orderByDesc('id')->value('balance')
            ?? 0);

        $balance = $isExpense ? $lastBalance - $amount : $lastBalance + $amount;

        return LedgerEntry::create([
            'transaction_id' => $record->transaction_id ?? ('EXP-'.strtoupper(uniqid())),
            'school_id' => $record->school_id,
            'school_payment_id' => $isExpense ? null : $record->id,
            'expense_id' => $isExpense ? $record->id : null,
            'entry_date' => $record->expense_date ?? $record->payment_date,
            'date' => $record->expense_date ?? $record->payment_date,
            'type' => $isExpense ? 'Debit' : 'Credit',
            'category' => $isExpense ? $record->category : 'School Subscription Fee',
            'description' => $isExpense
                ? $record->title
                : 'Payment received from '.($record->school?->name ?? 'School'),
            'debit' => $isExpense ? $amount : 0,
            'credit' => $isExpense ? 0 : $amount,
            'amount' => $amount,
            'balance' => $balance,
            'running_balance' => $balance,
            'payment_method' => $record->payment_method,
            'reference_id' => $record->id,
            'reference_type' => $isExpense ? Expense::class : SchoolPayment::class,
            'status' => 'Completed',
        ]);
    }

    /** Recompute cached contract payment totals from actual payments. */
    private function syncContractTotals(SchoolPayment $payment): void
    {
        $contract = SchoolPayment::find($payment->id)->schoolContract;

        if (! $contract) {
            return;
        }

        $paid = (float) SchoolPayment::where('school_contract_id', $contract->id)
            ->where('status', 'Completed')
            ->sum('amount');

        $value = (float) $contract->total_contract_value ?: (float) $contract->total_amount;

        $contract->update([
            'paid_amount' => $paid,
            'total_paid_amount' => $paid,
            'balance_due' => max(0, $value - $paid),
            'total_pending_amount' => max(0, $value - $paid),
            'current_month_status' => $paid > 0 ? 'Paid' : 'Pending',
        ]);
    }
}