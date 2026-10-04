<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\LedgerEntry;
use App\Models\SchoolPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SuperAdminFinancialController extends Controller
{
    // Payments
    public function payments(Request $request)
    {
        $query = SchoolPayment::with('school');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function recordPayment(Request $request)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            $payment = SchoolPayment::create([
                'school_id' => $request->school_id,
                'contract_id' => $request->contract_id,
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'amount' => $request->amount,
                'payment_date' => $request->payment_date,
                'payment_method' => $request->payment_method,
                'status' => 'Completed',
                'notes' => $request->notes,
            ]);

            // Add to Ledger
            $lastBalance = LedgerEntry::orderBy('id', 'desc')->value('balance') ?? 0;
            LedgerEntry::create([
                'school_id' => $request->school_id,
                'entry_date' => $request->payment_date,
                'type' => 'Credit',
                'category' => 'School Subscription Fee',
                'description' => "Payment from School ID {$request->school_id}",
                'debit' => 0,
                'credit' => $request->amount,
                'balance' => $lastBalance + $request->amount,
                'reference_id' => $payment->id,
                'reference_type' => 'SchoolPayment',
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Payment recorded successfully',
                'payment' => $payment->load('school')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // Ledger
    public function ledger(Request $request)
    {
        $query = LedgerEntry::with('school');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    // Expenses
    public function expenses(Request $request)
    {
        $query = Expense::whereNull('school_id'); // Platform-level expenses

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function storeExpense(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'expense_date' => 'required|date',
            'payment_method' => 'required|string',
        ]);

        $expense = Expense::create([
            'school_id' => null, // Super admin platform expense
            'title' => $request->title,
            'category' => $request->category,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'paid_to' => $request->paid_to,
            'payment_method' => $request->payment_method,
            'receipt_number' => $request->receipt_number,
            'description' => $request->description,
            'status' => 'Paid',
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Platform expense recorded',
            'expense' => $expense
        ], 201);
    }
}
