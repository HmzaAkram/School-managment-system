<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== 'Active') {
            return response()->json([
                'message' => 'Your account is ' . strtolower($user->status) . '. Please contact administration.'
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        // Load profile based on role
        $profile = null;
        if ($user->isStudent()) {
            $user->load(['student.class', 'student.section', 'school']);
            $profile = $user->student;
        } elseif ($user->isTeacher()) {
            $user->load(['teacher', 'school']);
            $profile = $user->teacher;
        } elseif ($user->isParent()) {
            $user->load(['parentProfile.students', 'school']);
            $profile = $user->parentProfile;
        } else {
            $user->load('school');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'school_id' => $user->school_id,
                'school' => $user->school,
                'avatar' => $user->avatar,
                'phone' => $user->phone,
                'profile' => $profile,
            ]
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->isStudent()) {
            $user->load(['student.class', 'student.section', 'school']);
        } elseif ($user->isTeacher()) {
            $user->load(['teacher.subjects', 'school']);
        } elseif ($user->isParent()) {
            $user->load(['parentProfile.students.class', 'school']);
        } else {
            $user->load('school');
        }

        return response()->json([
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out'
        ]);
    }
}
