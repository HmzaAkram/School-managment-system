<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SchoolContract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index(Request $request)
    {
        $query = SchoolContract::with('school');

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'school_id' => 'required|exists:schools,id',
            'plan_name' => 'required|string',
            'total_amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'billing_cycle' => 'required|in:Monthly,Quarterly,Annually',
        ]);

        $contract = SchoolContract::create([
            'school_id' => $request->school_id,
            'contract_number' => 'CNT-' . strtoupper(uniqid()),
            'plan_name' => $request->plan_name,
            'total_amount' => $request->total_amount,
            'paid_amount' => 0,
            'balance_due' => $request->total_amount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'Active',
            'billing_cycle' => $request->billing_cycle,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contract created successfully',
            'contract' => $contract->load('school')
        ], 201);
    }

    public function show($id)
    {
        return response()->json(SchoolContract::with('school')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $contract = SchoolContract::findOrFail($id);
        $contract->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Contract updated successfully',
            'contract' => $contract
        ]);
    }

    public function destroy($id)
    {
        SchoolContract::findOrFail($id)->delete();
        return response()->json(['message' => 'Contract deleted']);
    }
}
