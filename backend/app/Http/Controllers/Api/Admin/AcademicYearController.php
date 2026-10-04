<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AcademicYearController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        return response()->json(
            AcademicYear::where('school_id', $schoolId)
                ->withCount(['classes', 'exams'])
                ->orderByDesc('start_date')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'nullable|boolean',
        ]);

        $year = DB::transaction(function () use ($schoolId, $data) {
            if ($data['is_current'] ?? false) {
                AcademicYear::where('school_id', $schoolId)->update(['is_current' => false, 'is_active' => false]);
            }

            return AcademicYear::create([
                'school_id' => $schoolId,
                'name' => $data['name'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'is_current' => $data['is_current'] ?? false,
                'is_active' => $data['is_current'] ?? false,
            ]);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Academic year created',
            'academic_year' => $year,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $year = AcademicYear::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'is_current' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        DB::transaction(function () use ($schoolId, $year, $data) {
            if (($data['is_current'] ?? false) === true) {
                AcademicYear::where('school_id', $schoolId)
                    ->where('id', '!=', $year->id)
                    ->update(['is_current' => false, 'is_active' => false]);
            }

            $year->update($data);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Academic year updated',
            'academic_year' => $year->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $year = AcademicYear::where('school_id', $schoolId)->findOrFail($id);

        if ($year->is_current) {
            abort(422, 'You cannot delete the current academic year.');
        }

        $year->delete();

        return response()->json(['status' => 'success', 'message' => 'Academic year deleted']);
    }
}