<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Diary;
use App\Models\FeeInvoice;
use App\Models\ParentModel;
use App\Models\Student;
use App\Models\StudentLeave;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Student::where('school_id', $schoolId)
            ->with(['user:id,name,email,phone,status', 'class:id,name,section,code', 'section:id,name,class_id', 'parents']);

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('admission_number', 'like', "%{$search}%")
                    ->orWhere('roll_number', 'like', "%{$search}%")
                    ->orWhere('roll_no', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($u) => $u->where('email', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->query('section_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->query('gender'));
        }

        $paginator = $query->orderBy('first_name')->orderBy('last_name')
            ->paginate($this->perPage($request));

        $ids = collect($paginator->items())->pluck('id')->all();
        $attendance = $this->attendanceMap($schoolId, $ids);
        $fees = $this->feeMap($schoolId, $ids);

        return response()->json([
            'data' => collect($paginator->items())->map(function (Student $s) use ($attendance, $fees) {
                $att = $attendance[$s->id] ?? ['present' => 0, 'total' => 0, 'rate' => null];
                $fee = $fees[$s->id] ?? ['billed' => 0.0, 'paid' => 0.0, 'due' => 0.0, 'status' => 'Unpaid'];

                return [
                    'id' => $s->id,
                    'name' => $s->full_name,
                    'first_name' => $s->first_name,
                    'last_name' => $s->last_name,
                    'email' => $s->user?->email,
                    'phone' => $s->user?->phone,
                    'admission_number' => $s->admission_number,
                    'roll_number' => $s->roll_number,
                    'gender' => $s->gender,
                    'dob' => $s->date_of_birth?->toDateString(),
                    'blood_group' => $s->blood_group,
                    'address' => $s->address,
                    'city' => $s->city,
                    'admission_date' => $s->admission_date?->toDateString(),
                    'class_id' => $s->class_id,
                    'class' => $s->class?->name,
                    'section_id' => $s->section_id,
                    'section' => $s->section?->name,
                    'status' => $s->status,
                    'avatar' => $s->user?->avatar,
                    'parents' => $s->parents->map(fn (ParentModel $p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'phone' => $p->phone,
                        'email' => $p->father_email,
                        'occupation' => $p->occupation,
                    ]),
                    'attendance' => $att,
                    'fees' => $fee,
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
            'admission_number' => 'required|string|max:50|unique:student_profiles,admission_number',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'gender' => 'required|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'roll_number' => 'nullable|string|max:20',
            'blood_group' => 'nullable|string|max:10',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'admission_date' => 'nullable|date',
            'previous_school' => 'nullable|string|max:255',
            'emergency_contact' => 'nullable|string|max:50',
            'father_name' => 'nullable|string|max:255',
            'father_phone' => 'nullable|string|max:30',
            'father_email' => 'nullable|email',
            'mother_name' => 'nullable|string|max:255',
        ]);

        $student = DB::transaction(function () use ($data, $schoolId) {
            $user = User::create([
                'name' => $data['first_name'].' '.$data['last_name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'student',
                'school_id' => $schoolId,
                'phone' => $data['phone'] ?? null,
                'status' => 'Active',
            ]);

            $student = Student::create([
                'school_id' => $schoolId,
                'user_id' => $user->id,
                'admission_number' => $data['admission_number'],
                'student_id' => $data['admission_number'],
                'roll_number' => $data['roll_number'] ?? null,
                'roll_no' => $data['roll_number'] ?? null,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'gender' => $data['gender'],
                'dob' => $data['dob'] ?? null,
                'date_of_birth' => $data['dob'] ?? null,
                'blood_group' => $data['blood_group'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'admission_date' => $data['admission_date'] ?? now(),
                'previous_school' => $data['previous_school'] ?? null,
                'class_id' => $data['class_id'],
                'section_id' => $data['section_id'] ?? null,
                'emergency_contact' => $data['emergency_contact'] ?? null,
                'status' => 'Active',
            ]);

            if (! empty($data['father_name'])) {
                $parentProfile = $this->createParent($schoolId, $data);
                $student->parents()->attach($parentProfile->id, [
                    'relationship' => 'Father',
                    'is_primary' => true,
                ]);
            }

            return $student;
        });

        $this->log($request, 'created', Student::class, $student->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Student enrolled successfully',
            'student' => $student->load(['user', 'class', 'section', 'parents']),
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);

        $student = Student::where('school_id', $schoolId)
            ->with(['user', 'class', 'section', 'parents.user'])
            ->findOrFail($id);

        $attendanceRows = $student->attendances()->orderByDesc('date')->limit(120)->get();
        $marked = $attendanceRows->count();
        $present = $attendanceRows->where('status', 'Present')->count();
        $late = $attendanceRows->where('status', 'Late')->count();
        $absent = $attendanceRows->where('status', 'Absent')->count();

        $invoices = $student->feeInvoices()->with('payments')->orderByDesc('due_date')->get();

        return response()->json([
            'student' => [
                'id' => $student->id,
                'name' => $student->full_name,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'email' => $student->user?->email,
                'phone' => $student->user?->phone,
                'avatar' => $student->user?->avatar,
                'account_status' => $student->user?->status,
                'admission_number' => $student->admission_number,
                'roll_number' => $student->roll_number,
                'gender' => $student->gender,
                'dob' => $student->date_of_birth?->toDateString(),
                'blood_group' => $student->blood_group,
                'address' => $student->address,
                'city' => $student->city,
                'state' => $student->state,
                'admission_date' => $student->admission_date?->toDateString(),
                'previous_school' => $student->previous_school,
                'emergency_contact' => $student->emergency_contact,
                'status' => $student->status,
                'class' => $student->class?->name,
                'class_id' => $student->class_id,
                'section' => $student->section?->name,
                'section_id' => $student->section_id,
            ],
            'guardians' => $student->parents->map(fn (ParentModel $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'father_name' => $p->father_name,
                'father_phone' => $p->father_phone,
                'father_email' => $p->father_email,
                'father_occupation' => $p->father_occupation,
                'mother_name' => $p->mother_name,
                'mother_phone' => $p->mother_phone,
                'occupation' => $p->occupation,
                'address' => $p->address,
                'account_email' => $p->user?->email,
            ]),
            'attendance' => [
                'summary' => [
                    'total' => $marked,
                    'present' => $present,
                    'late' => $late,
                    'absent' => $absent,
                    'rate' => $marked > 0 ? round(($present + $late) / $marked * 100, 1) : null,
                ],
                'records' => $attendanceRows->map(fn ($a) => [
                    'date' => $a->date?->toDateString(),
                    'status' => $a->status,
                    'remarks' => $a->remarks,
                ])->all(),
            ],
            'invoices' => $invoices->map(fn (FeeInvoice $i) => [
                'id' => $i->id,
                'invoice_number' => $i->invoice_number,
                'title' => $i->title,
                'amount' => (float) $i->amount,
                'paid_amount' => (float) $i->paid_amount,
                'due_amount' => max(0, (float) $i->amount - (float) $i->paid_amount),
                'due_date' => $i->due_date?->toDateString(),
                'status' => $i->status,
                'payments' => $i->payments->map(fn ($p) => [
                    'id' => $p->id,
                    'amount' => (float) $p->amount,
                    'payment_method' => $p->payment_method,
                    'payment_date' => $p->payment_date?->toDateString(),
                    'receipt_no' => $p->receipt_no,
                    'status' => $p->status,
                ])->all(),
            ])->all(),
            'marks' => $student->marks()->with(['subject:id,name,code,credits', 'exam:id,name,term'])->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'exam' => $m->exam?->name,
                    'term' => $m->exam?->term,
                    'subject' => $m->subject?->name,
                    'marks_obtained' => (float) $m->marks_obtained,
                    'total_marks' => (float) $m->total_marks,
                    'percentage' => $m->percentage,
                    'grade' => $m->grade,
                    'gpa_point' => (float) $m->gpa_point,
                    'remarks' => $m->remarks,
                ])->all(),
            'submissions' => $student->assignmentSubmissions()->with('assignment:id,title,due_date,max_marks')->get()
                ->map(fn ($s) => [
                    'id' => $s->id,
                    'assignment' => $s->assignment?->title,
                    'due_date' => $s->assignment?->due_date?->toDateString(),
                    'score' => (float) ($s->score ?? 0),
                    'max' => (float) ($s->assignment?->max_score ?? 0),
                    'status' => $s->status,
                    'submitted_at' => $s->submitted_at?->toIso8601String(),
                    'feedback' => $s->feedback,
                ])->all(),
            'leaves' => $student->leaves()->orderByDesc('from_date')->limit(20)->get()
                ->map(fn (StudentLeave $l) => [
                    'id' => $l->id,
                    'leave_type' => $l->leave_type,
                    'from_date' => $l->from_date?->toDateString(),
                    'to_date' => $l->to_date?->toDateString(),
                    'reason' => $l->reason,
                    'status' => $l->status,
                    'remarks' => $l->remarks,
                ])->all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $student = Student::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'first_name' => 'sometimes|required|string|max:100',
            'last_name' => 'sometimes|required|string|max:100',
            'email' => 'nullable|email|unique:users,email,'.($student->user_id ?? 0),
            'phone' => 'nullable|string|max:30',
            'admission_number' => 'sometimes|string|max:50',
            'roll_number' => 'nullable|string|max:20',
            'class_id' => 'sometimes|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'gender' => 'sometimes|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'blood_group' => 'nullable|string|max:10',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'admission_date' => 'nullable|date',
            'previous_school' => 'nullable|string|max:255',
            'emergency_contact' => 'nullable|string|max:50',
            'status' => 'sometimes|in:Active,Inactive,Graduated,Transferred',
        ]);

        $old = $student->only(array_keys($data));

        // `dob` and `date_of_birth` are duplicated columns — keep both in sync.
        if (array_key_exists('dob', $data)) {
            $data['date_of_birth'] = $data['dob'];
        }

        if (array_key_exists('roll_number', $data)) {
            $data['roll_no'] = $data['roll_number'];
        }

        $student->fill($data)->save();

        if ($student->user && array_intersect(['first_name', 'last_name', 'email', 'phone'], array_keys($data))) {
            $student->user->update(array_filter([
                'name' => array_key_exists('first_name', $data) || array_key_exists('last_name', $data)
                    ? trim(($student->first_name ?? '').' '.($student->last_name ?? ''))
                    : null,
                'email' => $data['email'] ?? null,
                'phone' => $data['phone'] ?? null,
            ], fn ($v) => $v !== null));
        }

        $this->log($request, 'updated', Student::class, $student->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Student details updated',
            'student' => $student->fresh(['user', 'class', 'section', 'parents']),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $student = Student::where('school_id', $schoolId)->findOrFail($id);

        $student->user?->delete();
        $student->delete();

        $this->log($request, 'deleted', Student::class, $student->id);

        return response()->json([
            'status' => 'success',
            'message' => 'Student record deleted',
        ]);
    }

    // ─────────────────────────── Sub-resources ───────────────────────────

    /** Diary entries authored by this student's teachers. */
    public function diaries(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $student = Student::where('school_id', $schoolId)->findOrFail($id);

        $query = Diary::where('school_id', $schoolId)
            ->whereIn('class_id', Student::where('id', $student->id)->pluck('class_id'))
            ->when($student->section_id, fn ($q) => $q->where('section_id', $student->section_id))
            ->with(['teacher', 'subject:id,name,code'])
            ->orderByDesc('date');

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $paginator = $query->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Diary $d) => [
                'id' => $d->id,
                'date' => $d->date?->toDateString(),
                'task' => $d->task,
                'notes' => $d->notes,
                'note' => $d->note,
                'type' => $d->type,
                'completed' => $d->completed,
                'subject' => $d->subject?->name,
                'teacher' => $d->teacher?->full_name,
                'acknowledged_at' => $d->parent_acknowledged_at?->toIso8601String(),
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
        ]);
    }

    // ─────────────────────────── Helpers ───────────────────────────

    private function createParent(int $schoolId, array $data): ParentModel
    {
        $email = $data['father_email']
            ?? 'parent_'.strtolower(preg_replace('/[^a-z0-9]/i', '', $data['first_name'].$data['last_name'])).'.'.substr(sha1((string) $data['admission_number']), 0, 6).'@school.local';

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $data['father_name'],
                'password' => Hash::make('parent123'),
                'role' => 'parent',
                'school_id' => $schoolId,
                'phone' => $data['father_phone'] ?? null,
                'status' => 'Active',
            ]
        );

        return ParentModel::updateOrCreate(
            ['user_id' => $user->id],
            [
                'school_id' => $schoolId,
                'father_name' => $data['father_name'],
                'father_phone' => $data['father_phone'] ?? null,
                'father_email' => $data['father_email'] ?? $email,
                'mother_name' => $data['mother_name'] ?? null,
                'alternate_phone' => $data['father_phone'] ?? null,
            ]
        );
    }

    /** Attendance summary per student id, over the last 90 days. */
    private function attendanceMap(int $schoolId, array $studentIds): array
    {
        if (empty($studentIds)) {
            return [];
        }

        return DB::table('attendances')
            ->where('school_id', $schoolId)
            ->where('type', 'Student')
            ->whereIn('student_id', $studentIds)
            ->whereDate('date', '>=', now()->subDays(90)->toDateString())
            ->groupBy('student_id')
            ->select('student_id')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present")
            ->selectRaw("SUM(CASE WHEN status='Late' THEN 1 ELSE 0 END) as late")
            ->selectRaw("SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) as absent")
            ->get()
            ->mapWithKeys(fn ($r) => [$r->student_id => [
                'total' => (int) $r->total,
                'present' => (int) $r->present,
                'late' => (int) $r->late,
                'absent' => (int) $r->absent,
                'rate' => (int) $r->total > 0
                    ? round(((int) $r->present + (int) $r->late) / (int) $r->total * 100, 1)
                    : null,
            ]])
            ->all();
    }

    /** Billed / paid / due per student id. */
    private function feeMap(int $schoolId, array $studentIds): array
    {
        if (empty($studentIds)) {
            return [];
        }

        return FeeInvoice::where('school_id', $schoolId)
            ->whereIn('student_id', $studentIds)
            ->get(['student_id', 'amount', 'paid_amount', 'status'])
            ->groupBy('student_id')
            ->map(function ($invoices) {
                $billed = (float) $invoices->sum('amount');
                $paid = (float) $invoices->sum('paid_amount');
                $due = max(0, $billed - $paid);

                $status = 'Unpaid';
                if ($invoices->contains(fn ($i) => $i->status === 'Overdue')) {
                    $status = 'Overdue';
                } elseif ($invoices->contains(fn ($i) => $i->status === 'Partial')) {
                    $status = 'Partial';
                } elseif ($billed > 0 && $due <= 0.004) {
                    $status = 'Paid';
                }

                return [
                    'billed' => round($billed, 2),
                    'paid' => round($paid, 2),
                    'due' => round($due, 2),
                    'status' => $status,
                ];
            })
            ->all();
    }
}