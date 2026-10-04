<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Api\ApiController;
use App\Models\School;
use App\Models\SchoolContract;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class SchoolController extends ApiController
{
    public function index(Request $request)
    {
        $query = School::withCount(['users', 'students', 'teachers', 'classes'])->with('activeContract');

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('principal_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('subscription_status')) {
            $query->where('subscription_status', $request->query('subscription_status'));
        }

        if ($request->filled('plan')) {
            $query->where('plan', $request->query('plan'));
        }

        // Contract renewal state is derived from the linked contract, not schools.status.
        if ($request->filled('contract_status')) {
            $status = $request->query('contract_status');

            if ($status === 'Pending Renewal') {
                $query->whereHas('contracts', fn ($c) => $c->where('status', 'Pending Renewal'));
            } elseif ($status === 'Expiring') {
                $query->whereHas('contracts', fn ($c) => $c
                    ->whereIn('status', ['Active', 'Pending Renewal'])
                    ->whereNotNull('end_date')
                    ->whereDate('end_date', '>=', now()->toDateString())
                    ->whereDate('end_date', '<=', now()->addDays(60)->toDateString()));
            } elseif ($status === 'None') {
                $query->whereDoesntHave('contracts');
            } else {
                $query->whereHas('contracts', fn ($c) => $c->where('status', $status));
            }
        }

        $paginator = $query->orderByDesc('id')->paginate($this->perPage($request));

        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'totals' => [
                'contract_amount' => (float) School::sum('contract_amount'),
                'paid_amount' => (float) School::sum('paid_amount'),
                'pending_amount' => (float) School::sum('pending_amount'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:schools,code',
            'email' => 'required|email|max:255|unique:schools,email',
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'principal_name' => 'nullable|string|max:255',
            'plan' => 'required|in:Basic,Standard,Premium,Enterprise',
            'contract_amount' => 'required|numeric|min:0',
            'contract_start' => 'nullable|date',
            'contract_duration_months' => 'nullable|integer|min:1|max:120',
            'per_student_fee' => 'nullable|numeric|min:0',
            'school_share_percent' => 'nullable|numeric|min:0|max:100',
            'saas_share_percent' => 'nullable|numeric|min:0|max:100',
            'billing_cycle' => 'nullable|in:Monthly,Quarterly,Annually',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        $start = $data['contract_start'] ? \Illuminate\Support\Carbon::parse($data['contract_start']) : now();
        $months = (int) ($data['contract_duration_months'] ?? 12);
        $end = $start->copy()->addMonths($months);

        return DB::transaction(function () use ($data, $start, $end, $months) {
            $school = School::create([
                'name' => $data['name'],
                'code' => strtoupper($data['code']),
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'country' => $data['country'] ?? 'Pakistan',
                'address' => $data['address'] ?? null,
                'website' => $data['website'] ?? null,
                'principal_name' => $data['principal_name'] ?? null,
                'plan' => $data['plan'],
                'status' => 'Active',
                'subscription_status' => 'Active',
                'contract_amount' => $data['contract_amount'],
                'contract_start' => $start,
                'contract_end' => $end,
                'contract_type' => $months % 12 === 0 ? 'Annual' : 'Monthly',
                'paid_amount' => 0,
                'pending_amount' => $data['contract_amount'],
            ]);

            $adminUser = User::create([
                'name' => $data['admin_name'],
                'email' => $data['admin_email'],
                'password' => Hash::make($data['admin_password']),
                'role' => 'school_admin',
                'school_id' => $school->id,
                'phone' => $data['phone'] ?? null,
                'status' => 'Active',
            ]);

            $contract = SchoolContract::create([
                'school_id' => $school->id,
                'contract_number' => 'CNT-'.strtoupper($school->code).'-'.now()->format('Ym'),
                'plan_name' => $data['plan'],
                'per_student_fee' => $data['per_student_fee'] ?? 0,
                'school_share_percent' => $data['school_share_percent'] ?? 50,
                'saas_share_percent' => $data['saas_share_percent'] ?? 50,
                'saas_fee_per_student' => round(((float) ($data['per_student_fee'] ?? 0)) * ((float) ($data['saas_share_percent'] ?? 50)) / 100, 2),
                'contract_duration_months' => $months,
                'start_date' => $start,
                'end_date' => $end,
                'contract_start' => $start,
                'contract_end' => $end,
                'total_amount' => $data['contract_amount'],
                'total_contract_value' => $data['contract_amount'],
                'paid_amount' => 0,
                'total_paid_amount' => 0,
                'balance_due' => $data['contract_amount'],
                'total_pending_amount' => $data['contract_amount'],
                'billing_cycle' => $data['billing_cycle'] ?? 'Annually',
                'current_month_status' => 'Pending',
                'status' => 'Active',
                'notes' => null,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'School, administrator and contract created successfully',
                'school' => $school->fresh(['users', 'contracts']),
                'admin' => $adminUser,
                'contract' => $contract,
            ], 201);
        });
    }

    public function show(Request $request, $id)
    {
        $school = School::with([
            'users', 'contracts', 'academicYears', 'settings',
            'activeContract', 'feeStructures',
        ])->withCount(['students', 'teachers', 'classes', 'sections', 'subjects', 'events'])
            ->findOrFail($id);

        return response()->json([
            'school' => $school,
            'stats' => [
                'students' => $school->students_count,
                'teachers' => $school->teachers_count,
                'classes' => $school->classes_count,
                'sections' => $school->sections_count,
                'subjects' => $school->subjects_count,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $school = School::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:20|unique:schools,code,'.$school->id,
            'email' => 'sometimes|required|email|max:255|unique:schools,email,'.$school->id,
            'phone' => 'nullable|string|max:30',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'principal_name' => 'nullable|string|max:255',
            'status' => 'sometimes|required|in:Active,Inactive,Suspended',
            'subscription_status' => 'sometimes|required|in:Active,Expired,Trial,Cancelled',
            'plan' => 'sometimes|required|in:Basic,Standard,Premium,Enterprise',
            'contract_amount' => 'sometimes|required|numeric|min:0',
            'contract_start' => 'nullable|date',
            'contract_end' => 'nullable|date|after_or_equal:contract_start',
            'contract_type' => 'nullable|string|max:255',
            'paid_amount' => 'sometimes|numeric|min:0',
            'pending_amount' => 'sometimes|numeric|min:0',
            'domain' => 'nullable|string|max:255',
            'subdomain' => 'nullable|string|max:255|unique:schools,subdomain,'.$school->id,
            'custom_domain' => 'nullable|string|max:255',
            'ssl_active' => 'sometimes|boolean',
        ]);

        $old = $school->only(array_keys($data));
        $school->update($data);

        // Keep the cached pending balance consistent when either side is edited.
        if (array_key_exists('contract_amount', $data) || array_key_exists('paid_amount', $data)) {
            $paid = (float) $school->paid_amount;
            $school->pending_amount = max(0, (float) $school->contract_amount - $paid);
            $school->save();
        }

        $this->log($request, 'updated', School::class, $school->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'School updated successfully',
            'school' => $school->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $school = School::findOrFail($id);
        $school->delete();

        $this->log($request, 'deleted', School::class, $school->id);

        return response()->json([
            'status' => 'success',
            'message' => 'School deleted successfully',
        ]);
    }

    /** Aggregate counters used by the school detail drawer. */
    public function summary(Request $request, $id)
    {
        $school = School::findOrFail($id);

        return response()->json([
            'students' => Student::where('school_id', $school->id)->count(),
            'teachers' => Teacher::where('school_id', $school->id)->count(),
            'admins' => User::where('school_id', $school->id)->where('role', 'school_admin')->count(),
            'paid_amount' => (float) $school->paid_amount,
            'pending_amount' => (float) $school->pending_amount,
        ]);
    }
}