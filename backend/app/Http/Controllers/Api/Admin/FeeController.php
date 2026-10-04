<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeController extends Controller
{
    // Fee Structures
    public function getStructures(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $structures = FeeStructure::where('school_id', $schoolId)->with('class')->get();
        return response()->json($structures);
    }

    public function storeStructure(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:Monthly,Quarterly,Annually,One-Time',
        ]);

        $structure = FeeStructure::create([
            'school_id' => $schoolId,
            'class_id' => $request->class_id,
            'name' => $request->name,
            'amount' => $request->amount,
            'frequency' => $request->frequency,
            'due_day' => $request->due_day ?? 10,
            'description' => $request->description,
            'status' => 'Active',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Fee structure created',
            'structure' => $structure
        ], 201);
    }

    // Invoices
    public function getInvoices(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $query = FeeInvoice::where('school_id', $schoolId)->with(['student.class', 'feeStructure']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function generateInvoices(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'fee_structure_id' => 'required|exists:fee_structures,id',
            'month' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $structure = FeeStructure::findOrFail($request->fee_structure_id);

        $studentsQuery = Student::where('school_id', $schoolId)->where('status', 'Active');
        if ($structure->class_id) {
            $studentsQuery->where('class_id', $structure->class_id);
        }
        $students = $studentsQuery->get();

        DB::beginTransaction();
        try {
            $createdCount = 0;
            foreach ($students as $student) {
                // Check if invoice exists for this month
                $exists = FeeInvoice::where('school_id', $schoolId)
                    ->where('student_id', $student->id)
                    ->where('fee_structure_id', $structure->id)
                    ->where('month', $request->month)
                    ->exists();

                if (!$exists) {
                    FeeInvoice::create([
                        'school_id' => $schoolId,
                        'student_id' => $student->id,
                        'fee_structure_id' => $structure->id,
                        'invoice_number' => 'INV-' . strtoupper(uniqid()),
                        'title' => $structure->name . ' - ' . $request->month,
                        'amount' => $structure->amount,
                        'paid_amount' => 0,
                        'discount_amount' => 0,
                        'fine_amount' => 0,
                        'due_date' => $request->due_date,
                        'status' => 'Unpaid',
                        'month' => $request->month,
                    ]);
                    $createdCount++;
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Generated {$createdCount} invoices successfully."
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    // Record Fee Payment
    public function recordPayment(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'fee_invoice_id' => 'required|exists:fee_invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string',
            'payment_date' => 'required|date',
        ]);

        $invoice = FeeInvoice::where('school_id', $schoolId)->findOrFail($request->fee_invoice_id);

        DB::beginTransaction();
        try {
            $payment = FeePayment::create([
                'school_id' => $schoolId,
                'fee_invoice_id' => $invoice->id,
                'student_id' => $invoice->student_id,
                'transaction_id' => 'PAY-' . strtoupper(uniqid()),
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'payment_date' => $request->payment_date,
                'status' => 'Completed',
                'received_by' => $request->user()->id,
                'remarks' => $request->remarks,
            ]);

            $newPaid = $invoice->paid_amount + $request->amount;
            $status = ($newPaid >= ($invoice->amount - $invoice->discount_amount + $invoice->fine_amount)) ? 'Paid' : 'Partial';

            $invoice->update([
                'paid_amount' => $newPaid,
                'status' => $status,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Payment recorded successfully',
                'payment' => $payment,
                'invoice' => $invoice
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
