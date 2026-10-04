<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\SchoolClass;
use App\Models\Section;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AcademicController extends ApiController
{
    // ─────────────────────────── Classes ───────────────────────────

    public function getClasses(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = SchoolClass::where('school_id', $schoolId)
            ->with(['sections', 'subjects', 'classTeacher'])
            ->withCount('students');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('display_name', 'like', "%{$search}%");
            });
        }

        $classes = $query->orderBy('numeric_level')->get();

        // Attendance rate for the current month, per class.
        $rates = DB::table('attendances')
            ->where('school_id', $schoolId)
            ->where('type', 'Student')
            ->whereDate('date', '>=', now()->startOfMonth()->toDateString())
            ->groupBy('class_id')
            ->select('class_id')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->get()
            ->keyBy('class_id');

        return response()->json(
            $classes->map(function (SchoolClass $c) use ($rates) {
                $row = $rates->get($c->id);
                $total = (int) ($row->total ?? 0);

                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'code' => $c->code,
                    'section' => $c->section,
                    'display_name' => $c->display_name ?: trim($c->name.'-'.$c->section),
                    'numeric_level' => $c->numeric_level,
                    'capacity' => $c->capacity,
                    'room' => $c->room,
                    'status' => $c->status,
                    'description' => $c->description,
                    'academic_year_id' => $c->academic_year_id,
                    'students_count' => $c->students_count,
                    'sections_count' => $c->sections_count,
                    'subjects_count' => $c->subjects_count,
                    'sections' => $c->sections,
                    'subjects' => $c->subjects->map(fn ($s) => [
                        'id' => $s->id, 'name' => $s->name, 'code' => $s->code,
                        'credits' => $s->credits, 'total_marks' => $s->total_marks,
                    ]),
                    'class_teacher' => $c->classTeacher ? [
                        'id' => $c->classTeacher->id,
                        'name' => $c->classTeacher->name,
                    ] : null,
                    'avg_attendance' => $total > 0
                        ? round((int) $row->present / $total * 100, 1)
                        : null,
                ];
            })
        );
    }

    public function storeClass(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'numeric_level' => 'nullable|integer|min:1',
            'section' => 'nullable|string|max:10',
            'display_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
            'room' => 'nullable|string|max:255',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'class_teacher_id' => 'nullable|exists:users,id',
        ]);

        $class = SchoolClass::create([
            'school_id' => $schoolId,
            'name' => $data['name'],
            'code' => strtoupper($data['code'] ?? substr(preg_replace('/[^A-Za-z]/', '', $data['name']), 0, 4)),
            'numeric_level' => $data['numeric_level'] ?? 1,
            'section' => $data['section'] ?? 'A',
            'display_name' => $data['display_name'] ?? null,
            'description' => $data['description'] ?? null,
            'capacity' => $data['capacity'] ?? 50,
            'room' => $data['room'] ?? null,
            'academic_year_id' => $data['academic_year_id'] ?? $this->currentAcademicYear($schoolId)?->id,
            'class_teacher_id' => $data['class_teacher_id'] ?? null,
            'status' => 'Active',
        ]);

        // Automatically create the default first section.
        Section::create([
            'school_id' => $schoolId,
            'class_id' => $class->id,
            'name' => 'Section '.$class->section,
            'capacity' => $class->capacity,
        ]);

        $this->log($request, 'created', SchoolClass::class, $class->id, $class->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Class created',
            'class' => $class->load('sections'),
        ], 201);
    }

    public function updateClass(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $class = SchoolClass::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|string|max:50',
            'numeric_level' => 'sometimes|integer|min:1',
            'section' => 'sometimes|string|max:10',
            'display_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'sometimes|integer|min:1',
            'room' => 'nullable|string|max:255',
            'academic_year_id' => 'nullable|exists:academic_years,id',
            'class_teacher_id' => 'nullable|exists:users,id',
            'status' => 'sometimes|in:Active,Archived',
        ]);

        $old = $class->only(array_keys($data));
        $class->update($data);

        if (! empty($data['class_teacher_id'])) {
            $class->teachers()->syncWithoutDetaching([
                $class->class_teacher_id => ['is_class_teacher' => true],
            ]);
        }

        $this->log($request, 'updated', SchoolClass::class, $class->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Class updated',
            'class' => $class->fresh(['sections', 'subjects', 'classTeacher']),
        ]);
    }

    public function destroyClass(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $class = SchoolClass::where('school_id', $schoolId)->findOrFail($id);
        $class->delete();

        $this->log($request, 'deleted', SchoolClass::class, $class->id);

        return response()->json(['status' => 'success', 'message' => 'Class deleted']);
    }

    // ─────────────────────────── Sections ───────────────────────────

    public function getSections(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Section::where('school_id', $schoolId)
            ->with('class')
            ->withCount('students');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function storeSection(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'room_number' => 'nullable|string|max:255',
        ]);

        $section = Section::create([
            'school_id' => $schoolId,
            'class_id' => $data['class_id'],
            'name' => $data['name'],
            'capacity' => $data['capacity'] ?? 40,
            'room_number' => $data['room_number'] ?? null,
        ]);

        $this->log($request, 'created', Section::class, $section->id, $section->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Section created',
            'section' => $section,
        ], 201);
    }

    public function updateSection(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $section = Section::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|integer|min:1',
            'room_number' => 'nullable|string|max:255',
        ]);

        $section->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Section updated',
            'section' => $section->fresh(),
        ]);
    }

    public function destroySection(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        Section::where('school_id', $schoolId)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Section deleted']);
    }

    // ─────────────────────────── Subjects ───────────────────────────

    public function getSubjects(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Subject::where('school_id', $schoolId)->with(['classes', 'teachers']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('class_id')) {
            $query->whereHas('classes', fn ($q) => $q->where('classes.id', $request->query('class_id')));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%"));
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function storeSubject(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20',
            'type' => 'required|in:Theory,Practical,Both',
            'pass_marks' => 'nullable|numeric|min:0',
            'total_marks' => 'nullable|numeric|min:1',
            'credits' => 'nullable|numeric|min:0|max:20',
            'description' => 'nullable|string',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
        ]);

        $subject = Subject::create([
            'school_id' => $schoolId,
            'name' => $data['name'],
            'code' => strtoupper($data['code']),
            'type' => $data['type'],
            'pass_marks' => $data['pass_marks'] ?? 33,
            'total_marks' => $data['total_marks'] ?? 100,
            'credits' => $data['credits'] ?? 1,
            'description' => $data['description'] ?? null,
            'status' => 'Active',
        ]);

        if (! empty($data['class_ids'])) {
            $subject->classes()->sync($data['class_ids']);
        }

        $this->log($request, 'created', Subject::class, $subject->id, $subject->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Subject created',
            'subject' => $subject->load('classes'),
        ], 201);
    }

    public function updateSubject(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $subject = Subject::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:20',
            'type' => 'sometimes|in:Theory,Practical,Both',
            'pass_marks' => 'sometimes|numeric|min:0',
            'total_marks' => 'sometimes|numeric|min:1',
            'credits' => 'sometimes|numeric|min:0|max:20',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:Active,Inactive',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
        ]);

        $classIds = $data['class_ids'] ?? null;
        unset($data['class_ids']);

        $subject->update($data);

        if ($classIds !== null) {
            $subject->classes()->sync($classIds);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Subject updated',
            'subject' => $subject->fresh(['classes', 'teachers']),
        ]);
    }

    public function destroySubject(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $subject = Subject::where('school_id', $schoolId)->findOrFail($id);
        $subject->classes()->detach();
        $subject->teachers()->detach();
        $subject->delete();

        return response()->json(['status' => 'success', 'message' => 'Subject deleted']);
    }
}