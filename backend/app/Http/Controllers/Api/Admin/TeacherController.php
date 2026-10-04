<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $query = Teacher::where('school_id', $schoolId)->with(['user', 'subjects']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'employee_id' => 'required|string|unique:teachers,employee_id',
            'designation' => 'nullable|string',
            'department' => 'nullable|string',
            'phone' => 'nullable|string',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'teacher',
                'school_id' => $schoolId,
                'phone' => $request->phone,
                'status' => 'Active',
            ]);

            $teacher = Teacher::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'employee_id' => $request->employee_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender ?? 'Male',
                'dob' => $request->dob,
                'qualification' => $request->qualification,
                'experience_years' => $request->experience_years ?? 0,
                'joining_date' => $request->joining_date ?? now(),
                'designation' => $request->designation ?? 'Teacher',
                'department' => $request->department,
                'salary' => $request->salary ?? 0,
                'status' => 'Active',
            ]);

            if (!empty($request->subject_ids)) {
                $teacher->subjects()->sync($request->subject_ids);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Teacher registered successfully',
                'teacher' => $teacher->load(['user', 'subjects'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create teacher: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $teacher = Teacher::where('school_id', $schoolId)->with(['user', 'subjects', 'assignments', 'diaries'])->findOrFail($id);
        return response()->json($teacher);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $teacher = Teacher::where('school_id', $schoolId)->findOrFail($id);

        $teacher->update($request->except(['user_id', 'school_id']));

        if (!empty($request->subject_ids)) {
            $teacher->subjects()->sync($request->subject_ids);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher profile updated',
            'teacher' => $teacher->load('subjects')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $teacher = Teacher::where('school_id', $schoolId)->findOrFail($id);

        if ($teacher->user) {
            $teacher->user->delete();
        }
        $teacher->delete();

        return response()->json(['message' => 'Teacher record deleted']);
    }
}
