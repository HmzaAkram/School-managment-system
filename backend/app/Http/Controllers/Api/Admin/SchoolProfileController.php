<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SchoolProfileController extends ApiController
{
    public function show(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);
        $school = School::withCount(['students', 'teachers', 'classes'])->findOrFail($schoolId);

        return response()->json([
            'id' => $school->id,
            'name' => $school->name,
            'code' => $school->code,
            'logo' => $school->logo,
            'email' => $school->email,
            'phone' => $school->phone,
            'address' => $school->address,
            'city' => $school->city,
            'state' => $school->state,
            'country' => $school->country,
            'website' => $school->website,
            'tagline' => $school->tagline,
            'principal_name' => $school->principal_name,
            'domain' => $school->domain,
            'subdomain' => $school->subdomain,
            'custom_domain' => $school->custom_domain,
            'ssl_active' => (bool) $school->ssl_active,
            'status' => $school->status,
            'subscription_status' => $school->subscription_status,
            'plan' => $school->plan,
            'contract_amount' => (float) $school->contract_amount,
            'paid_amount' => (float) $school->paid_amount,
            'pending_amount' => (float) $school->pending_amount,
            'contract_start' => $school->contract_start?->toDateString(),
            'contract_end' => $school->contract_end?->toDateString(),
            'contract_type' => $school->contract_type,
            'students_count' => $school->students_count,
            'teachers_count' => $school->teachers_count,
            'classes_count' => $school->classes_count,
        ]);
    }

    public function update(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);
        $school = School::findOrFail($schoolId);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'website' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'principal_name' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($school->logo) {
                Storage::disk('public')->delete($school->logo);
            }
            $data['logo'] = $request->file('logo')->store('school-logos', 'public');
        }

        $school->fill($data)->save();

        $this->log($request, 'updated_school_profile', School::class, $school->id, $data);

        return response()->json([
            'status' => 'success',
            'message' => 'School profile updated',
            'school' => $this->show($request)->getData(true)['school'] ?? $school,
        ]);
    }
}