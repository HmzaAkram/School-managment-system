<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeeController extends ApiController
{
    // ─────────────────────────── Fee structures ───────────────────────────

    public function getStructures(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = FeeStructure::where('school_id', $schoolId)
            ->with(['class:id,name,section', 'academicYear:id,name'])
            ->withCount('invoices');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function storeStructure(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:Monthly,Quarterly,Annually,One-Time',
            'class_id' => 'nullable|exists:classes,id',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'due_day' => 'nullable|integer|min:1|max:31',
            'description' => 'nullable|string',
        ]);

        $structure = FeeStructure::create([
            'school_id' => $schoolId,
            'class_id' => $data['class_id'] ?? null,
            'academic_year_id' => $data['academic_year_id'] ?? $this->currentAcademicYear($schoolId)?->id,
            'name' => $data['name'],
            'amount' => $data['amount'],
            'frequency' => $data['frequency'],
            'due_day' => $data['due_day'] ?? 10,
            'description' => $data['description'] ?? null,
            'status' => 'Active',
            'is_active' => true,
        ]);

        $this->log($request, 'created', FeeStructure::class, $structure->id, $structure->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Fee structure created',
            'structure' => $structure,
        ], 201);
    }

    public function updateStructure(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $structure = FeeStructure::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0',
            'frequency' => 'sometimes|in:Monthly,Quarterly,Annually,One-Time',
            'class_id' => 'nullable|exists:classes,id',
            'due_day' => 'sometimes|integer|min:1|max:31',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:Active,Inactive',
        ]);

        $structure->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Fee structure updated',
            'structure' => $structure->fresh(),
        ]);
    }

    public function destroyStructure(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $structure = FeeStructure::where('school_id', $schoolId)->findOrFail($id);
        $structure->delete();

        return response()->json(['status' => 'success', 'message' => 'Fee structure deleted']);
    }

    // ─────────────────────────── Invoices ───────────────────────────

    public function getInvoices(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = FeeInvoice::where('school_id', $schoolId)
            ->with(['student:id,first_name,last_name,roll_number,class_id,section_id', 'student.class:id,name,section', 'feeStructure:id,name,amount,frequency']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->query('student_id'));
        }

        if ($request->filled('class_id')) {
            $query->whereHas('student', fn ($s) => $s->where('class_id', $request->query('class_id')));
        }

        if ($request->filled('month')) {
            $query->where('month', $request->query('month'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhereHas('student', fn ($s) => $s
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('admission_number', 'like', "%{$search}%"));
            });
        }

        $this->applyDateRange($query, $request, 'due_date', $this->dateRange($request));

        $paginator = $query->orderByDesc('due_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $invoices = collect($paginator->items());

        return response()->json([
            'data' => $invoices->map(fn (FeeInvoice $i) => [
                'id' => $i->id,
                'invoice_number' => $i->invoice_number,
                'title' => $i->title,
                'student_id' => $i->student_id,
                'student_name' => $i->student?->full_name,
                'roll_number' => $i->student?->roll_number,
                'class' => $i->student?->class?->name,
                'fee_structure' => $i->feeStructure?->name,
                'amount' => (float) $i->amount,
                'paid_amount' => (float) $i->paid_amount,
                'due_amount' => max(0, (float) $i->amount - (float) $i->paid_amount),
                'due_date' => $i->due_date?->toDateString(),
                'status' => $i->status,
                'month' => $i->month,
                'is_overdue' => $i->due_date !== null
                    && $i->due_date->lt(now()) && (float) $i->paid_amount < (float) $i->amount,
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => $this->invoiceSummary($invoices),
        ]);
    }

    public function generateInvoices(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'fee_structure_id' => 'required|exists:fee_structures,id',
            'month' => 'required|string|max:30',
            'due_date' => 'required|date',
            'class_id' => 'nullable|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
        ]);

        $structure = FeeStructure::where('school_id', $schoolId)->findOrFail($data['fee_structure_id']);

        $students = Student::where('school_id', $schoolId)->where('status', 'Active')
            ->when($structure->class_id, fn ($q) => $q->where('class_id', $structure->class_id))
            ->when($data['class_id'] ?? null, fn ($q) => $q->where('class_id', $data['class_id']))
            ->when($data['section_id'] ?? null, fn ($q) => $q->where('section_id', $data['section_id']))
            ->get();

        $created = DB::transaction(function () use ($students, $structure, $schoolId, $data) {
            $count = 0;

            foreach ($students as $student) {
                $exists = FeeInvoice::where('school_id', $schoolId)
                    ->where('student_id', $student->id)
                    ->where('fee_structure_id', $structure->id)
                    ->where('month', $data['month'])
                    ->exists();

                if ($exists) {
                    continue;
                }

                FeeInvoice::create([
                    'school_id' => $schoolId,
                    'student_id' => $student->id,
                    'fee_structure_id' => $structure->id,
                    'invoice_number' => 'INV-'.now()->format('Ymd').'-'.str_pad((string) ($count + 1), 4, '0', STR_PAD_LEFT),
                    'title' => $structure->name.' - '.$data['month'],
                    'amount' => $structure->amount,
                    'paid_amount' => 0,
                    'discount_amount' => 0,
                    'fine_amount' => 0,
                    'due_date' => $data['due_date'],
                    'status' => 'Unpaid',
                    'month' => $data['month'],
                ]);

                $count++;
            }

            return $count;
        });

        return response()->json([
            'status' => 'success',
            'message' => "Generated {$created} invoice(s).",
            'created' => $created,
        ]);
    }

    // ─────────────────────────── Payments ───────────────────────────

    public function getPayments(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = FeePayment::where('school_id', $schoolId)
            ->with(['student:id,first_name,last_name,roll_number', 'feeInvoice:id,invoice_number,title,due_date', 'receiver:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->query('payment_method'));
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->query('student_id'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhere('receipt_no', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        $this->applyDateRange($query, $request, 'payment_date', $this->dateRange($request));

        $paginator = $query->orderByDesc('payment_date')->orderByDesc('id')
            ->paginate($this->perPage($request));

        $payments = collect($paginator->items());

        return response()->json([
            'data' => $payments->map(fn (FeePayment $p) => [
                'id' => $p->id,
                'receipt_no' => $p->receipt_no,
                'transaction_id' => $p->transaction_id,
                'student_id' => $p->student_id,
                'student_name' => $p->student?->full_name,
                'invoice_number' => $p->feeInvoice?->invoice_number,
                'invoice_title' => $p->feeInvoice?->title,
                'amount' => (float) $p->amount,
                'payment_method' => $p->payment_method,
                'payment_date' => $p->payment_date?->toDateString(),
                'status' => $p->status,
                'received_by' => $p->receiver?->name,
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => [
                'collected' => round($payments->sum('amount'), 2),
                'count' => $payments->count(),
            ],
        ]);
    }

    public function recordPayment(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'fee_invoice_id' => 'required|exists:fee_invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|max:50',
            'payment_date' => 'required|date',
            'receipt_no' => 'nullable|string|max:30',
            'reference' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        $invoice = FeeInvoice::where('school_id', $schoolId)->findOrFail($data['fee_invoice_id']);

        $result = DB::transaction(function () use ($data, $invoice, $schoolId, $request) {
            $outstanding = max(0, (float) $invoice->amount - (float) $invoice->paid_amount);

            if ((float) $data['amount'] > $outstanding + 0.004) {
                abort(422, 'Payment exceeds the outstanding balance of '.$outstanding.'.');
            }

            $payment = FeePayment::create([
                'school_id' => $schoolId,
                'fee_invoice_id' => $invoice->id,
                'student_id' => $invoice->student_id,
                'transaction_id' => 'PAY-'.strtoupper(uniqid()),
                'receipt_no' => $data['receipt_no'] ?? 'RCP-'.now()->format('YmdHis'),
                'amount' => $data['amount'],
                'payment_method' => $data['payment_method'],
                'reference' => $data['reference'] ?? null,
                'payment_date' => $data['payment_date'],
                'status' => 'Completed',
                'received_by' => $request->user()?->id,
                'remarks' => $data['remarks'] ?? null,
            ]);

            $newPaid = (float) $invoice->paid_amount + (float) $data['amount'];
            $payable = (float) $invoice->amount - (float) $invoice->discount_amount + (float) $invoice->fine_amount;

            $status = 'Unpaid';
            if ($newPaid + 0.004 >= $payable) {
                $status = 'Paid';
            } elseif ($newPaid > 0) {
                $status = 'Partial';
            } elseif ($invoice->due_date !== null && $invoice->due_date->lt(now())) {
                $status = 'Overdue';
            }

            $invoice->update(['paid_amount' => $newPaid, 'status' => $status]);

            return [$payment, $invoice->fresh()];
        });

        $this->log($request, 'recorded_fee_payment', FeePayment::class, $result[0]->id, $result[0]->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Payment recorded successfully',
            'payment' => $result[0],
            'invoice' => $result[1],
        ], 201);
    }

    // ─────────────────────────── Helpers ───────────────────────────

    private function invoiceSummary($invoices): array
    {
        $billed = (float) $invoices->sum('amount');
        $collected = (float) $invoices->sum('paid_amount');

        return [
            'billed' => round($billed, 2),
            'collected' => round($collected, 2),
            'outstanding' => round(max(0, $billed - $collected), 2),
            'count' => $invoices->count(),
            'paid' => $invoices->where('status', 'Paid')->count(),
            'partial' => $invoices->where('status', 'Partial')->count(),
            'unpaid' => $invoices->where('status', 'Unpaid')->count(),
            'overdue' => $invoices->where('status', 'Overdue')->count(),
            'collection_rate' => $billed > 0 ? round($collected / $billed * 100, 1) : null,
        ];
    }
}