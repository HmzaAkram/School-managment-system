<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Expense::where('school_id', $schoolId)->with('creator:id,name');

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('paid_to', 'like', "%{$search}%")
                    ->orWhere('receipt_number', 'like', "%{$search}%");
            });
        }

        $this->applyDateRange($query, $request, 'expense_date', $this->dateRange($request));

        $paginator = $query->orderByDesc('expense_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $entries = collect($paginator->items());

        return response()->json([
            'data' => $entries->map(fn (Expense $e) => [
                'id' => $e->id,
                'expense_id' => $e->expense_id,
                'title' => $e->title,
                'category' => $e->category,
                'amount' => (float) $e->amount,
                'expense_date' => $e->expense_date?->toDateString(),
                'paid_to' => $e->paid_to,
                'payment_method' => $e->payment_method,
                'receipt_number' => $e->receipt_number,
                'description' => $e->description,
                'status' => $e->status,
                'created_by' => $e->creator?->name,
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => [
                'total' => round((float) $entries->sum('amount'), 2),
                'count' => $entries->count(),
            ],
            'category_totals' => Expense::where('school_id', $schoolId)
                ->whereNull('deleted_at')
                ->select('category')
                ->selectRaw('COALESCE(SUM(amount),0) as total, COUNT(*) as entries')
                ->whereNotNull('category')
                ->groupBy('category')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($r) => [
                    'category' => $r->category,
                    'total' => (float) $r->total,
                    'entries' => (int) $r->entries,
                ])->all(),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

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

        $expense = Expense::create([
            'school_id' => $schoolId,
            'expense_id' => 'EXP-'.now()->format('Ymd').'-'.str_pad((string) (Expense::where('school_id', $schoolId)->count() + 1), 3, '0', STR_PAD_LEFT),
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

        $this->log($request, 'created', Expense::class, $expense->id, $expense->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Expense recorded',
            'expense' => $expense,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $expense = Expense::where('school_id', $schoolId)->findOrFail($id);

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

        $this->log($request, 'updated', Expense::class, $expense->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Expense updated',
            'expense' => $expense->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        Expense::where('school_id', $schoolId)->findOrFail($id)->delete();

        $this->log($request, 'deleted', Expense::class, $id);

        return response()->json(['status' => 'success', 'message' => 'Expense deleted']);
    }
}