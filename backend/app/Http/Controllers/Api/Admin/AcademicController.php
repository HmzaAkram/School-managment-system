<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Http\Request;

class AcademicController extends Controller
{
    // ── Classes ──
    public function getClasses(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $classes = SchoolClass::where('school_id', $schoolId)
            ->with(['sections', 'subjects'])
            ->withCount('students')
            ->orderBy('numeric_level', 'asc')
            ->get();

        return response()->json($classes);
    }

    public function storeClass(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string|max:100',
            'numeric_level' => 'nullable|integer',
        ]);

        $class = SchoolClass::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'code' => $request->code ?? strtoupper(substr($request->name, 0, 4)),
            'numeric_level' => $request->numeric_level ?? 1,
            'description' => $request->description,
        ]);

        // Automatically create Section A
        Section::create([
            'school_id' => $schoolId,
            'class_id' => $class->id,
            'name' => 'Section A',
            'capacity' => 40,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Class created',
            'class' => $class->load('sections')
        ], 201);
    }

    // ── Sections ──
    public function getSections(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $query = Section::where('school_id', $schoolId)->with('class');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        return response()->json($query->get());
    }

    public function storeSection(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string',
        ]);

        $section = Section::create([
            'school_id' => $schoolId,
            'class_id' => $request->class_id,
            'name' => $request->name,
            'capacity' => $request->capacity ?? 40,
            'room_number' => $request->room_number,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Section created',
            'section' => $section
        ], 201);
    }

    // ── Subjects ──
    public function getSubjects(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $subjects = Subject::where('school_id', $schoolId)->with(['classes', 'teachers'])->get();
        return response()->json($subjects);
    }

    public function storeSubject(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'name' => 'required|string',
            'code' => 'required|string',
            'type' => 'required|in:Theory,Practical,Both',
        ]);

        $subject = Subject::create([
            'school_id' => $schoolId,
            'name' => $request->name,
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'pass_marks' => $request->pass_marks ?? 33,
            'total_marks' => $request->total_marks ?? 100,
            'description' => $request->description,
        ]);

        if ($request->filled('class_ids')) {
            $subject->classes()->sync($request->class_ids);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Subject created',
            'subject' => $subject->load('classes')
        ], 201);
    }
}
