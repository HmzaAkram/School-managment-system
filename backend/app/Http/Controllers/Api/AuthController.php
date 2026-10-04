<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if ($user->status !== 'Active') {
            return response()->json([
                'message' => 'Your account is '.strtolower((string) $user->status).'. Please contact administration.',
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $this->userPayload($request->user()),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    /** Update the authenticated user's own profile. */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
            unset($data['password']);
        }

        if ($avatarPath) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $avatarPath;
        }

        $user->fill($data)->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated.',
            'user' => $this->userPayload($user->fresh()),
        ]);
    }

    /** Change the authenticated user's password. */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed', 'different:current_password'],
        ]);

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Your current password is incorrect.'],
            ]);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password updated.',
        ]);
    }

    /**
     * Build the consistent user payload used by login, /me and profile updates.
     */
    private function userPayload(User $user): array
    {
        $user->loadMissing([
            'school',
            'teacher.subjects',
            'teacher.classes',
            'student.class',
            'student.section',
            'parentProfile.students.class',
        ]);

        $profile = null;

        if ($user->isStudent()) {
            $profile = $user->student;
        } elseif ($user->isTeacher()) {
            $profile = $user->teacher;
        } elseif ($user->isParent()) {
            $profile = $user->parentProfile;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'school_id' => $user->school_id,
            'school' => $user->school,
            'avatar' => $user->avatar,
            'phone' => $user->phone,
            'timezone' => $user->timezone,
            'profile' => $profile,
        ];
    }
}