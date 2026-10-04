<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\Teacher;
use App\Models\Timetable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Teacher::where('school_id', $schoolId)
            ->with(['user:id,name,email,phone,status,avatar', 'subjects:id,name,code', 'classes:id,name,section']);

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('email', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('department')) {
            $query->where('department', $request->query('department'));
        }

        if ($request->filled('subject_id')) {
            $query->whereHas('subjects', fn ($q) => $q->where('subjects.id', $request->query('subject_id')));
        }

        $paginator = $query->orderBy('first_name')->orderBy('last_name')
            ->paginate($this->perPage($request));

        $ids = collect($paginator->items())->pluck('id')->all();
        $attendance = $this->attendanceMap($schoolId, $ids);
        $workload = $this->workloadMap($schoolId, $ids);

        return response()->json([
            'data' => collect($paginator->items())->map(function (Teacher $t) use ($attendance, $workload) {
                return [
                    'id' => $t->id,
                    'name' => $t->full_name,
                    'first_name' => $t->first_name,
                    'last_name' => $t->last_name,
                    'email' => $t->user?->email,
                    'phone' => $t->user?->phone,
                    'avatar' => $t->user?->avatar,
                    'employee_id' => $t->employee_id,
                    'designation' => $t->designation,
                    'department' => $t->department,
                    'qualification' => $t->qualification,
                    'specialization' => $t->specialization,
                    'experience_years' => (int) $t->experience_years,
                    'joining_date' => $t->joining_date?->toDateString(),
                    'gender' => $t->gender,
                    'salary' => (float) $t->salary,
                    'salary_status' => $t->salary_status,
                    'status' => $t->status,
                    'account_status' => $t->user?->status,
                    'subjects' => $t->subjects->map(fn ($s) => [
                        'id' => $s->id, 'name' => $s->name, 'code' => $s->code,
                    ])->all(),
                    'classes' => $t->classes->map(fn ($c) => [
                        'id' => $c->id, 'name' => $c->name, 'section' => $c->section,
                    ])->all(),
                    'classes_count' => $t->classes->count(),
                    'attendance' => $attendance[$t->id] ?? [
                        'marked' => 0, 'present' => 0, 'absent' => 0, 'rate' => null, 'today' => null,
                    ],
                    'workload' => $workload[$t->id] ?? ['assignments' => 0, 'pending_grading' => 0, 'diary_entries' => 0, 'periods' => 0],
                ];
            })->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:30',
            'employee_id' => 'required|string|max:30|unique:teachers,employee_id',
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'gender' => 'nullable|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'joining_date' => 'nullable|date',
            'salary' => 'nullable|numeric|min:0',
            'address' => 'nullable|string',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
        ]);

        $teacher = DB::transaction(function () use ($data, $schoolId) {
            $user = User::create([
                'name' => $data['first_name'].' '.$data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'teacher',
                'school_id' => $schoolId,
                'phone' => $data['phone'] ?? null,
                'status' => 'Active',
            ]);

            $teacher = Teacher::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'employee_id' => $data['employee_id'],
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'gender' => $data['gender'] ?? 'Male',
                'dob' => $data['dob'] ?? null,
                'qualification' => $data['qualification'] ?? null,
                'specialization' => $data['specialization'] ?? null,
                'experience_years' => $data['experience_years'] ?? 0,
                'joining_date' => $data['joining_date'] ?? now(),
                'designation' => $data['designation'] ?? 'Teacher',
                'department' => $data['department'] ?? null,
                'salary' => $data['salary'] ?? 0,
                'address' => $data['address'] ?? null,
                'status' => 'Active',
            ]);

            if (! empty($data['subject_ids'])) {
                $teacher->subjects()->sync($data['subject_ids']);
            }

            if (! empty($data['class_ids'])) {
                $teacher->classes()->sync(array_map(fn ($id) => ['is_class_teacher' => false], $data['class_ids']));
            }

            return $teacher;
        });

        $this->log($request, 'created', Teacher::class, $teacher->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher registered successfully',
            'teacher' => $teacher->load(['user', 'subjects', 'classes']),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);

        $teacher = Teacher::where('school_id', $schoolId)
            ->with(['user', 'subjects', 'classes.sections', 'classes.subjects'])
            ->findOrFail($id);

        $attendance = $this->attendanceMap($schoolId, [$teacher->id])[$teacher->id]
            ?? ['marked' => 0, 'present' => 0, 'absent' => 0, 'rate' => null, 'today' => null];

        // Average score given by this teacher across all published marks.
        $avgScore = DB::table('marks')
            ->join('subjects', 'subjects.id', '=', 'marks.subject_id')
            ->where('marks.school_id', $schoolId)
            ->whereIn('marks.subject_id', $teacher->subjects->pluck('id'))
            ->selectRaw('AVG(marks.marks_obtained) as avg_obtained, AVG(marks.total_marks) as avg_total, COUNT(*) as entries')
            ->first();

        return response()->json([
            'teacher' => [
                'id' => $teacher->id,
                'name' => $teacher->full_name,
                'first_name' => $teacher->first_name,
                'last_name' => $teacher->last_name,
                'email' => $teacher->user?->email,
                'phone' => $teacher->user?->phone,
                'avatar' => $teacher->user?->avatar,
                'account_status' => $teacher->user?->status,
                'employee_id' => $teacher->employee_id,
                'designation' => $teacher->designation,
                'department' => $teacher->department,
                'qualification' => $teacher->qualification,
                'specialization' => $teacher->specialization,
                'experience_years' => (int) $teacher->experience_years,
                'joining_date' => $teacher->joining_date?->toDateString(),
                'gender' => $teacher->gender,
                'salary' => (float) $teacher->salary,
                'salary_status' => $teacher->salary_status,
                'address' => $teacher->address,
                'status' => $teacher->status,
                'subjects' => $teacher->subjects->map(fn ($s) => [
                    'id' => $s->id, 'name' => $s->name, 'code' => $s->code, 'credits' => $s->credits,
                ])->all(),
                'classes' => $teacher->classes->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'section' => $c->section,
                    'students' => $c->students()->count(),
                ])->all(),
            ],
            'attendance' => $attendance,
            'performance' => [
                'entries' => (int) ($avgScore->entries ?? 0),
                'average' => round((float) ($avgScore->avg_obtained ?? 0), 2),
                'max' => round((float) ($avgScore->avg_total ?? 0), 2),
                'percentage' => (float) ($avgScore->avg_total ?? 0) > 0
                    ? round((float) $avgScore->avg_obtained / (float) $avgScore->avg_total * 100, 1)
                    : null,
            ],
            'workload' => [
                'assignments' => $teacher->assignments()->count(),
                'pending_grading' => AssignmentSubmission::whereIn('assignment_id', $teacher->assignments()->pluck('id'))
                    ->whereIn('status', ['Pending', 'Submitted'])->count(),
                'diary_entries' => $teacher->diaries()->count(),
                'periods_per_week' => Timetable::where('teacher_id', $teacher->id)->count(),
            ],
            'timetable' => Timetable::where('teacher_id', $teacher->id)
                ->with(['class', 'section', 'subject'])
                ->orderBy('day_of_week')->orderBy('start_time')
                ->get()
                ->map(fn (Timetable $t) => [
                    'id' => $t->id,
                    'day' => $t->day_name,
                    'period' => $t->period,
                    'start_time' => $t->start_time,
                    'end_time' => $t->end_time,
                    'class' => $t->class?->name,
                    'section' => $t->section?->name,
                    'subject' => $t->subject?->name,
                    'room' => $t->room_number,
                ])->all(),
            'recent_diaries' => $teacher->diaries()->with('class')->latest('date')->limit(10)->get()
                ->map(fn (Diary $d) => [
                    'id' => $d->id,
                    'date' => $d->date?->toDateString(),
                    'task' => $d->task,
                    'type' => $d->type,
                    'class' => $d->class?->name,
                ])->all(),
            'recent_attendance' => Attendance::where('teacher_id', $teacher->id)
                ->orderByDesc('date')->limit(30)->get()
                ->map(fn ($a) => [
                    'date' => $a->date?->toDateString(),
                    'status' => $a->status,
                    'remarks' => $a->remarks,
                ])->all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $teacher = Teacher::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => 'nullable|email|unique:users,email,'.($teacher->user_id ?? 0),
            'phone' => 'nullable|string|max:30',
            'employee_id' => 'sometimes|string|max:30|unique:teachers,employee_id,'.$teacher->id,
            'designation' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'gender' => 'sometimes|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'qualification' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'experience_years' => 'sometimes|integer|min:0',
            'joining_date' => 'nullable|date',
            'salary' => 'sometimes|numeric|min:0',
            'salary_status' => 'sometimes|in:Paid,Pending,Overdue',
            'address' => 'nullable|string',
            'status' => 'sometimes|in:Active,Inactive,On Leave,Resigned',
            'subject_ids' => 'nullable|array',
            'subject_ids.*' => 'exists:subjects,id',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
        ]);

        $old = $teacher->only(array_keys(array_diff_key($data, ['subject_ids' => 1, 'class_ids' => 1])));

        $teacher->fill($data)->save();

        if ($teacher->user && array_intersect(['first_name', 'last_name', 'email', 'phone'], array_keys($data))) {
            $teacher->user->update(array_filter([
                'name' => array_key_exists('first_name', $data) || array_key_exists('last_name', $data)
                    ? trim(($teacher->first_name ?? '').' '.($teacher->last_name ?? ''))
                    : null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ], fn ($v) => $v !== null));
        }

        if (array_key_exists('subject_ids', $data)) {
            $teacher->subjects()->sync($data['subject_ids'] ?? []);
        }

        if (array_key_exists('class_ids', $data)) {
            $teacher->classes()->sync(array_map(fn ($cid) => ['is_class_teacher' => false], $data['class_ids'] ?? []));
        }

        $this->log($request, 'updated', Teacher::class, $teacher->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Teacher profile updated',
            'teacher' => $teacher->fresh(['user', 'subjects', 'classes']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $teacher = Teacher::where('school_id', $schoolId)->findOrFail($id);

        $teacher->user?->delete();
        $teacher->subjects()->detach();
        $teacher->classes()->detach();
        $teacher->delete();

        $this->log($request, 'deleted', Teacher::class, $teacher->id);

        return response()->json(['status' => 'success', 'message' => 'Teacher record deleted']);
    }

    // ─────────────────────────── Helpers ───────────────────────────

    /** Attendance summary per teacher id over the last 90 days. */
    private function attendanceMap(int $schoolId, array $teacherIds): array
    {
        if (empty($teacherIds)) {
            return [];
        }

        $rows = DB::table('attendances')
            ->where('school_id', $schoolId)
            ->where('type', 'Teacher')
            ->whereIn('teacher_id', $teacherIds)
            ->whereDate('date', '>=', now()->subDays(90)->toDateString())
            ->groupBy('teacher_id')
            ->select('teacher_id')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent")
            ->get()
            ->keyBy('teacher_id');

        $today = Attendance::where('school_id', $schoolId)
            ->where('type', 'Teacher')
            ->whereDate('date', now()->toDateString())
            ->whereIn('teacher_id', $teacherIds)
            ->pluck('status', 'teacher_id');

        return collect($teacherIds)->mapWithKeys(function ($id) use ($rows, $today) {
            $row = $rows->get($id);
            $total = (int) ($row->total ?? 0);

            return [$id => [
                'marked' => $total,
                'present' => (int) ($row->present ?? 0),
                'absent' => (int) ($row->absent ?? 0),
                'rate' => $total > 0 ? round((int) $row->present / $total * 100, 1) : null,
                'today' => $today[$id] ?? null,
            ]];
        })->all();
    }

    /** Teaching load per teacher id. */
    private function workloadMap(int $schoolId, array $teacherIds): array
    {
        if (empty($teacherIds)) {
            return [];
        }

        $assignments = DB::table('assignments')
            ->where('school_id', $schoolId)
            ->whereIn('teacher_id', $teacherIds)
            ->groupBy('teacher_id')->select('teacher_id')->selectRaw('COUNT(*) as total')
            ->pluck('total', 'teacher_id');

        $pending = AssignmentSubmission::whereIn('assignment_submissions.assignment_id', function ($q) use ($schoolId, $teacherIds) {
            $q->select('id')->from('assignments')
                ->where('school_id', $schoolId)->whereIn('teacher_id', $teacherIds);
        })->whereIn('assignment_submissions.status', ['Pending', 'Submitted'])
            ->join('assignments', 'assignments.id', '=', 'assignment_submissions.assignment_id')
            ->groupBy('assignments.teacher_id')->select('assignments.teacher_id')
            ->selectRaw('COUNT(*) as total')->pluck('total', 'assignments.teacher_id');

        $diaries = DB::table('diaries')
            ->where('school_id', $schoolId)
            ->whereIn('teacher_id', $teacherIds)
            ->groupBy('teacher_id')->select('teacher_id')->selectRaw('COUNT(*) as total')
            ->pluck('total', 'teacher_id');

        $periods = DB::table('timetables')
            ->where('school_id', $schoolId)
            ->whereIn('teacher_id', $teacherIds)
            ->groupBy('teacher_id')->select('teacher_id')->selectRaw('COUNT(*) as total')
            ->pluck('total', 'teacher_id');

        return collect($teacherIds)->mapWithKeys(fn ($id) => [$id => [
            'assignments' => (int) ($assignments[$id] ?? 0),
            'pending_grading' => (int) ($pending[$id] ?? 0),
            'diary_entries' => (int) ($diaries[$id] ?? 0),
            'periods' => (int) ($periods[$id] ?? 0),
        ]])->all();
    }
}