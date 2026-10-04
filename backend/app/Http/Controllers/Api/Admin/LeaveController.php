<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\StudentLeave;
use Illuminate\Http\Request;

class LeaveController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = StudentLeave::where('school_id', $schoolId)
            ->with(['student:id,first_name,last_name,roll_number,class_id', 'class:id,name,section', 'reviewer:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->query('student_id'));
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(fn ($q) => $q->where('reason', 'like', "%{$search}%")
                ->orWhereHas('student', fn ($s) => $s
                    ->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")));
        }

        $paginator = $query->orderByDesc('created_at')->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (StudentLeave $l) => [
                'id' => $l->id,
                'student_id' => $l->student_id,
                'student_name' => $l->student?->full_name,
                'roll_number' => $l->student?->roll_number,
                'class' => $l->class?->name,
                'leave_type' => $l->leave_type,
                'from_date' => $l->from_date?->toDateString(),
                'to_date' => $l->to_date?->toDateString(),
                'days' => $l->from_date && $l->to_date
                    ? $l->from_date->diffInDays($l->to_date) + 1
                    : 1,
                'reason' => $l->reason,
                'status' => $l->status,
                'remarks' => $l->remarks,
                'reviewed_by' => $l->reviewer?->name,
                'reviewed_at' => $l->reviewed_at?->toIso8601String(),
                'created_at' => $l->created_at?->toIso8601String(),
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'summary' => [
                'pending' => (clone $query)->where('status', 'Pending')->count(),
                'approved' => (clone $query)->where('status', 'Approved')->count(),
                'rejected' => (clone $query)->where('status', 'Rejected')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'student_id' => 'required|exists:student_profiles,id',
            'leave_type' => 'required|string|max:50',
            'from_date' => 'required|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'reason' => 'nullable|string',
            'status' => 'nullable|in:Pending,Approved,Rejected',
        ]);

        $student = \App\Models\Student::where('school_id', $schoolId)
            ->findOrFail($data['student_id']);

        $leave = StudentLeave::create([
            'school_id' => $schoolId,
            'student_id' => $student->id,
            'class_id' => $student->class_id,
            'leave_type' => $data['leave_type'],
            'from_date' => $data['from_date'],
            'to_date' => $data['to_date'] ?? null,
            'reason' => $data['reason'] ?? null,
            'status' => $data['status'] ?? 'Pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Leave request recorded',
            'leave' => $leave,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $leave = StudentLeave::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected,Cancelled',
            'remarks' => 'nullable|string',
            'leave_type' => 'sometimes|string|max:50',
            'from_date' => 'sometimes|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
        ]);

        $data['reviewed_by'] = $request->user()?->id;
        $data['reviewed_at'] = now();

        $old = $leave->only(['status']);
        $leave->update($data);

        $this->log($request, 'reviewed_leave', StudentLeave::class, $leave->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Leave request updated',
            'leave' => $leave->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        StudentLeave::where('school_id', $schoolId)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Leave request deleted']);
    }
}