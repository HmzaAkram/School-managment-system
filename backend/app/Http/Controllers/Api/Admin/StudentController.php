<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $query = Student::where('school_id', $schoolId)->with(['user', 'class', 'section', 'parents']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('admission_number', 'like', "%{$search}%")
                  ->orWhere('roll_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->section_id);
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
            'admission_number' => 'required|string|unique:student_profiles,admission_number',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'gender' => 'required|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'roll_number' => 'nullable|string',
            'father_name' => 'nullable|string',
            'father_phone' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Create user account
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'student',
                'school_id' => $schoolId,
                'status' => 'Active',
            ]);

            // Create student profile
            $student = Student::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'admission_number' => $request->admission_number,
                'roll_number' => $request->roll_number,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender,
                'dob' => $request->dob,
                'blood_group' => $request->blood_group,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'admission_date' => $request->admission_date ?? now(),
                'class_id' => $request->class_id,
                'section_id' => $request->section_id,
                'emergency_contact' => $request->emergency_contact,
                'status' => 'Active',
            ]);

            // Create Parent profile if provided
            if ($request->filled('father_name')) {
                $parentUser = User::create([
                    'name' => $request->father_name,
                    'email' => 'parent_' . $student->id . '_' . uniqid() . '@school.com',
                    'password' => Hash::make('parent123'),
                    'role' => 'parent',
                    'school_id' => $schoolId,
                    'phone' => $request->father_phone,
                    'status' => 'Active',
                ]);

                $parentProfile = ParentModel::create([
                    'school_id' => $schoolId,
                    'user_id' => $parentUser->id,
                    'father_name' => $request->father_name,
                    'mother_name' => $request->mother_name,
                    'alternate_phone' => $request->father_phone,
                ]);

                $student->parents()->attach($parentProfile->id, ['relationship' => 'Father', 'is_primary' => true]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Student enrolled successfully',
                'student' => $student->load(['user', 'class', 'section', 'parents'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create student: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $student = Student::where('school_id', $schoolId)
            ->with(['user', 'class', 'section', 'parents', 'attendances', 'feeInvoices', 'marks.exam', 'marks.subject'])
            ->findOrFail($id);

        return response()->json($student);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $student = Student::where('school_id', $schoolId)->findOrFail($id);

        $student->update($request->except(['user_id', 'school_id']));

        if ($student->user && $request->filled('first_name')) {
            $student->user->update([
                'name' => $request->first_name . ' ' . ($request->last_name ?? $student->last_name)
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Student details updated',
            'student' => $student->load(['class', 'section'])
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        $student = Student::where('school_id', $schoolId)->findOrFail($id);

        if ($student->user) {
            $student->user->delete();
        }
        $student->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Student record deleted'
        ]);
    }
}
