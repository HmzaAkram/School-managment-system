<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $query = School::withCount(['users', 'students', 'teachers']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('plan')) {
            $query->where('plan', $request->plan);
        }

        $schools = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($schools);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:schools,code',
            'email' => 'required|email|unique:schools,email',
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'address' => 'nullable|string',
            'principal_name' => 'nullable|string',
            'plan' => 'required|in:Basic,Standard,Premium,Enterprise',
            'contract_amount' => 'required|numeric|min:0',
            'admin_name' => 'required|string',
            'admin_email' => 'required|email|unique:users,email',
            'admin_password' => 'required|string|min:6',
        ]);

        DB::beginTransaction();
        try {
            $school = School::create([
                'name' => $request->name,
                'code' => strtoupper($request->code),
                'email' => $request->email,
                'phone' => $request->phone,
                'city' => $request->city,
                'state' => $request->state,
                'address' => $request->address,
                'principal_name' => $request->principal_name,
                'plan' => $request->plan,
                'status' => 'Active',
                'subscription_status' => 'Active',
                'contract_amount' => $request->contract_amount,
                'contract_start' => now(),
                'contract_end' => now()->addYear(),
                'contract_type' => 'Annual',
                'paid_amount' => 0,
                'pending_amount' => $request->contract_amount,
            ]);

            // Create School Admin User
            $adminUser = User::create([
                'name' => $request->admin_name,
                'email' => $request->admin_email,
                'password' => Hash::make($request->admin_password),
                'role' => 'school_admin',
                'school_id' => $school->id,
                'phone' => $request->phone,
                'status' => 'Active',
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'School and School Admin created successfully',
                'school' => $school->load('users'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create school: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $school = School::with(['users', 'contracts', 'academicYears'])->withCount(['students', 'teachers', 'classes'])->findOrFail($id);
        return response()->json($school);
    }

    public function update(Request $request, $id)
    {
        $school = School::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:schools,code,' . $id,
            'email' => 'sometimes|email|unique:schools,email,' . $id,
            'phone' => 'nullable|string',
            'city' => 'nullable|string',
            'status' => 'sometimes|in:Active,Inactive,Suspended',
            'plan' => 'sometimes|in:Basic,Standard,Premium,Enterprise',
        ]);

        $school->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'School updated successfully',
            'school' => $school
        ]);
    }

    public function destroy($id)
    {
        $school = School::findOrFail($id);
        $school->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'School deleted successfully'
        ]);
    }
}
