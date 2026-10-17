<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Expense;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\Mark;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Timetable;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class SchoolAssistantDataService
{
    /**
     * @return array{allowed: bool, supported: bool, data: array<string, mixed>, message?: string}
     */
    public function retrieve(User $user, string $question): array
    {
        $text = mb_strtolower($question);

        if ($this->asksForPlatformData($text) && ! $user->isSuperAdmin()) {
            return [
                'allowed' => false,
                'supported' => false,
                'data' => [],
                'message' => 'That information is restricted and is not available to your account.',
            ];
        }

        if (in_array($user->role, ['student', 'parent'], true) && $this->asksForRestrictedData($text)) {
            return [
                'allowed' => false,
                'supported' => false,
                'data' => [],
                'message' => 'That information is restricted and is not available to your account.',
            ];
        }

        return match ($user->role) {
            'super_admin' => $this->superAdminData($text),
            'school_admin' => $this->schoolAdminData($user, $text),
            'teacher' => $this->teacherData($user, $text),
            'student', 'parent' => $this->studentData($user, $text),
            default => ['allowed' => false, 'supported' => false, 'data' => [], 'message' => 'Your account cannot use the AI assistant.'],
        };
    }

    private function superAdminData(string $text): array
    {
        [$from, $to] = $this->period($text);
        $periodName = Carbon::parse($from)->translatedFormat('F Y');

        if (preg_match('/\b(revenue|income|received|collected|payments?|transactions?|kamai|pese|pesay|kitne paise|wasooli)\b/i', $text)) {
            $query = SchoolPayment::whereBetween('payment_date', [$from, $to]);
            $completed = (clone $query)->where('status', 'Completed');
            $data = [
                'metric' => 'SchoolMS platform subscription and contract payments; excludes school fee payments.',
            ];

            if (preg_match('/\b(recent|latest|show|list|transactions?|details|akhri)\b/i', $text)) {
                $data['recent_transactions'] = SchoolPayment::with('school:id,name')
                    ->latest('payment_date')->limit(10)->get(['school_id', 'transaction_id', 'amount', 'payment_date', 'status'])
                    ->map(fn (SchoolPayment $payment) => [
                        'school' => $payment->school?->name,
                        'amount' => (float) $payment->amount,
                        'date' => $payment->payment_date?->toDateString(),
                        'status' => $payment->status,
                        'transaction' => $payment->transaction_id,
                    ])->all();
            } else {
                $data['period'] = ['from' => $from, 'to' => $to, 'label' => $periodName];
                $data['completed_revenue'] = round((float) $completed->sum('amount'), 2);
                $data['completed_payment_count'] = (clone $completed)->count();
            }

            return $this->supported($data);
        }

        if (preg_match('/\b(contract|contracts|overdue|pending|outstanding|due|dues|unpaid|baki|baqi|arrears)\b/i', $text)
            || (preg_match('/\b(kon|kaun|konsa|kaunsa|which|list|what|show|batao|naam)\b/i', $text) && preg_match('/\b(pending|due|overdue|unpaid|baki|arrear)\b/i', $text))) {
            $contracts = SchoolContract::with('school:id,name,code,status')
                ->where(function (Builder $query) {
                    $query->where('balance_due', '>', 0)->orWhere('total_pending_amount', '>', 0);
                })
                ->get(['school_id', 'contract_number', 'balance_due', 'total_pending_amount', 'current_month_status', 'end_date']);

            $rows = $contracts->map(fn (SchoolContract $contract) => [
                'school' => $contract->school?->name,
                'school_code' => $contract->school?->code,
                'contract' => $contract->contract_number,
                'outstanding_amount' => (float) ($contract->total_pending_amount ?: $contract->balance_due),
                'payment_status' => $contract->current_month_status,
                'contract_end_date' => $contract->end_date?->toDateString(),
            ])->values()->all();

            $pendingPayments = SchoolPayment::where('status', 'Pending')->with('school:id,name')
                ->latest('payment_date')->limit(30)->get(['school_id', 'amount', 'payment_date', 'transaction_id'])
                ->map(fn (SchoolPayment $payment) => [
                    'school' => $payment->school?->name,
                    'amount' => (float) $payment->amount,
                    'date' => $payment->payment_date?->toDateString(),
                    'transaction' => $payment->transaction_id,
                ])->all();

            // Also include schools with pending balance directly
            $pendingSchools = School::where('pending_amount', '>', 0)
                ->get(['id', 'name', 'code', 'pending_amount', 'contract_amount', 'status'])
                ->map(fn (School $s) => [
                    'school' => $s->name,
                    'school_code' => $s->code,
                    'pending_amount' => (float) $s->pending_amount,
                    'status' => $s->status,
                ])->all();

            return $this->supported([
                'pending_schools' => $pendingSchools,
                'pending_contracts' => $rows,
                'pending_payments' => $pendingPayments,
                'contract_count' => count($rows),
            ]);
        }

        if (preg_match('/\b(active|currently|how many|total|all|list|registered|kitne|tamam)\b/i', $text) && preg_match('/\b(schools?|institutions?|school)\b/i', $text)) {
            $allSchools = School::get(['id', 'name', 'code', 'status', 'city', 'plan', 'contract_amount', 'pending_amount']);
            return $this->supported([
                'active_schools' => School::where('status', 'Active')->count(),
                'total_schools' => $allSchools->count(),
                'schools' => $allSchools->map(fn (School $s) => [
                    'name' => $s->name,
                    'code' => $s->code,
                    'status' => $s->status,
                    'city' => $s->city,
                    'pending_amount' => (float) $s->pending_amount,
                ])->all(),
            ]);
        }

        // Contextual fallback for super admin so natural queries are never rigidly blocked
        $allSchools = School::get(['id', 'name', 'code', 'status', 'city', 'pending_amount', 'contract_amount']);
        $contracts = SchoolContract::with('school:id,name')
            ->where(function (Builder $query) {
                $query->where('balance_due', '>', 0)->orWhere('total_pending_amount', '>', 0);
            })
            ->get(['school_id', 'contract_number', 'balance_due', 'total_pending_amount', 'current_month_status']);

        return $this->supported([
            'platform_overview' => [
                'total_schools_count' => $allSchools->count(),
                'active_schools_count' => $allSchools->where('status', 'Active')->count(),
                'schools_summary' => $allSchools->take(25)->map(fn ($s) => [
                    'name' => $s->name,
                    'code' => $s->code,
                    'status' => $s->status,
                    'pending_amount' => (float) $s->pending_amount,
                ])->values()->all(),
                'pending_contracts' => $contracts->take(25)->map(fn ($c) => [
                    'school' => $c->school?->name,
                    'contract' => $c->contract_number,
                    'outstanding_amount' => (float) ($c->total_pending_amount ?: $c->balance_due),
                    'status' => $c->current_month_status,
                ])->values()->all(),
            ],
        ]);
    }

    private function schoolAdminData(User $user, string $text): array
    {
        if (! $user->school_id) {
            return $this->unsupported('Your account is not linked to a school.');
        }

        $schoolId = $user->school_id;
        [$from, $to] = $this->period($text);

        if (preg_match('/\b(student|enrollment|enrolled|students|bache|bachay|dakhla|taadad)\b/i', $text)) {
            return $this->supported([
                'active_student_count' => Student::where('school_id', $schoolId)->where('status', 'Active')->count(),
            ]);
        }

        if (preg_match('/\b(attendance|absent|present|haziri|ghair hazir|chutti)\b/i', $text)) {
            $date = Carbon::today()->toDateString();
            $query = Attendance::where('school_id', $schoolId)->whereDate('date', $date);
            if (preg_match('/\bteacher|staff|asatza\b/i', $text)) {
                $records = (clone $query)->whereNotNull('teacher_id');

                return $this->supported([
                    'date' => $date,
                    'teacher_attendance_recorded' => (clone $records)->count(),
                    'teachers_present' => (clone $records)->where('status', 'Present')->count(),
                    'teachers_absent' => (clone $records)->where('status', 'Absent')->count(),
                ]);
            }

            $records = (clone $query)->whereNotNull('student_id');

            return $this->supported([
                'date' => $date,
                'student_attendance_recorded' => (clone $records)->count(),
                'students_present' => (clone $records)->where('status', 'Present')->count(),
                'students_absent' => (clone $records)->where('status', 'Absent')->count(),
            ]);
        }

        if (preg_match('/\b(expense|expenses|spending|spent|kharcha|kharchay)\b/i', $text)) {
            $total = Expense::where('school_id', $schoolId)->whereBetween('expense_date', [$from, $to])->sum('amount');

            return $this->supported(['period' => ['from' => $from, 'to' => $to], 'school_expense_total' => round((float) $total, 2)]);
        }

        if (preg_match('/\b(fee|fees|collection|collected|revenue|outstanding|pending|defaulter|baki|baqi|arrear|arrears)\b/i', $text)) {
            if (preg_match('/\b(student|students|who|which|list|names|outstanding|kon|kaun|kis|bache|bachay)\b/i', $text) && preg_match('/\b(pending|outstanding|fee|fees|who|which|list|defaulter|baki|baqi)\b/i', $text)) {
                $invoices = FeeInvoice::with('student:id,first_name,last_name,roll_number,roll_no')
                    ->where('school_id', $schoolId)->get(['student_id', 'title', 'amount', 'paid_amount', 'due_date']);
                $outstanding = $invoices->map(fn (FeeInvoice $invoice) => [
                    'student' => $invoice->student?->full_name,
                    'roll_number' => $invoice->student?->roll_number,
                    'invoice' => $invoice->title,
                    'amount_due' => round(max(0, (float) $invoice->amount - (float) $invoice->paid_amount), 2),
                    'due_date' => $invoice->due_date?->toDateString(),
                ])->filter(fn (array $row) => $row['amount_due'] > 0)->take(30)->values()->all();

                return $this->supported(['students_with_outstanding_fees' => $outstanding, 'records_limited_to' => 30]);
            }

            if (preg_match('/\b(collected|collection|revenue|received|jama|wasooli)\b/i', $text)) {
                $total = FeePayment::where('school_id', $schoolId)->where('status', 'Completed')
                    ->whereBetween('payment_date', [$from, $to])->sum('amount');

                return $this->supported([
                    'metric' => 'School fee payments only; excludes platform contract revenue.',
                    'period' => ['from' => $from, 'to' => $to],
                    'fees_collected' => round((float) $total, 2),
                ]);
            }

            $invoices = FeeInvoice::where('school_id', $schoolId)->get(['amount', 'paid_amount']);

            return $this->supported([
                'outstanding_student_fees' => round((float) $invoices->sum(fn (FeeInvoice $invoice) => max(0, (float) $invoice->amount - (float) $invoice->paid_amount)), 2),
            ]);
        }

        // Contextual fallback for school admin
        return $this->supported([
            'school_overview' => [
                'active_students' => Student::where('school_id', $schoolId)->where('status', 'Active')->count(),
                'teachers_count' => Teacher::where('school_id', $schoolId)->where('status', 'Active')->count(),
                'classes_count' => SchoolClass::where('school_id', $schoolId)->count(),
            ],
        ]);
    }

    private function teacherData(User $user, string $text): array
    {
        $teacher = Teacher::where('user_id', $user->id)->where('school_id', $user->school_id)->first();
        if (! $teacher) {
            return $this->unsupported('Your account does not have a linked teacher profile.');
        }

        $classIds = $teacher->classes()->where('classes.school_id', $teacher->school_id)->pluck('classes.id');

        if (preg_match('/\b(class|classes|assigned|roster|students)\b/', $text) && ! preg_match('/\b(attendance|absent)\b/', $text)) {
            $classes = $teacher->classes()->where('classes.school_id', $teacher->school_id)
                ->withCount(['students' => fn ($query) => $query->where('student_profiles.school_id', $teacher->school_id)->where('status', 'Active')])
                ->get(['classes.id', 'name', 'section']);
            $includeRoster = (bool) preg_match('/\b(which students|student names|roster)\b/', $text);

            return $this->supported(['assigned_classes' => $classes->map(fn (SchoolClass $class) => [
                'class' => $class->display_name,
                'active_students' => $class->students_count,
                ...($includeRoster ? [
                    'students' => Student::where('school_id', $teacher->school_id)->where('class_id', $class->id)
                        ->where('status', 'Active')->get(['first_name', 'last_name'])
                        ->map(fn (Student $student) => $student->full_name)->all(),
                ] : []),
            ])->all()]);
        }

        if (preg_match('/\b(attendance|absent|present)\b/', $text)) {
            $query = Attendance::where('school_id', $teacher->school_id)->whereIn('class_id', $classIds);
            if (preg_match('/\bmy attendance|attendance record\b/', $text)) {
                $records = Attendance::where('school_id', $teacher->school_id)->where('teacher_id', $teacher->id)
                    ->whereBetween('date', [now()->startOfMonth(), now()->endOfMonth()]);

                return $this->supported([
                    'period' => [now()->startOfMonth()->toDateString(), now()->endOfMonth()->toDateString()],
                    'present' => (clone $records)->where('status', 'Present')->count(),
                    'absent' => (clone $records)->where('status', 'Absent')->count(),
                    'recorded_days' => $records->count(),
                ]);
            }

            $records = $query->whereDate('date', Carbon::today())->whereNotNull('student_id');

            return $this->supported([
                'date' => Carbon::today()->toDateString(),
                'assigned_class_absences' => (clone $records)->where('status', 'Absent')->count(),
                'attendance_records_in_assigned_classes' => $records->count(),
            ]);
        }

        if (preg_match('/\b(homework|assignment|assignments)\b/', $text)) {
            $assignments = Assignment::where('teacher_id', $teacher->id)->where('school_id', $teacher->school_id)
                ->with(['class:id,name,section', 'subject:id,name'])
                ->orderByDesc('due_date')->limit(20)->get();

            return $this->supported(['my_assignments' => $assignments->map(fn (Assignment $assignment) => [
                'title' => $assignment->title,
                'class' => $assignment->class?->display_name,
                'subject' => $assignment->subject?->name,
                'due_date' => $assignment->due_date?->toDateString(),
                'status' => $assignment->status,
            ])->all()]);
        }

        if (preg_match('/\b(timetable|schedule|periods?)\b/', $text)) {
            $rows = Timetable::where('teacher_id', $teacher->id)->where('school_id', $teacher->school_id)
                ->with(['class:id,name,section', 'subject:id,name'])
                ->orderBy('day')->orderBy('period')->limit(50)->get();

            return $this->supported(['my_timetable' => $rows->map(fn (Timetable $row) => [
                'day' => $row->day_name,
                'period' => $row->period,
                'class' => $row->class?->display_name,
                'subject' => $row->subject?->name,
                'start' => $row->start_time,
                'end' => $row->end_time,
                'room' => $row->room_number ?: $row->room,
            ])->all()]);
        }

        return $this->unsupported();
    }

    private function studentData(User $user, string $text): array
    {
        $students = $user->isParent()
            ? ($user->parentProfile?->students()->where('student_profiles.school_id', $user->school_id)->get() ?? collect())
            : Student::where('user_id', $user->id)->where('school_id', $user->school_id)->get();
        $students = $students->filter(fn (Student $student) => (int) $student->school_id === (int) $user->school_id)->values();
        if ($students->isEmpty()) {
            return $this->unsupported('No student profile linked to your account was found.');
        }

        if (preg_match('/\b(revenue|salary|salaries|teacher pay|school-wide expense|platform|all students|other students)\b/', $text)) {
            return [
                'allowed' => false,
                'supported' => false,
                'data' => [],
                'message' => 'That information is restricted and is not available to your account.',
            ];
        }

        if (preg_match('/\b(attendance|absent|present)\b/', $text)) {
            $data = [];
            foreach ($students as $student) {
                $records = Attendance::where('school_id', $student->school_id)->where('student_id', $student->id);
                $total = (clone $records)->count();
                $present = (clone $records)->whereIn('status', ['Present', 'Late'])->count();
                $data[] = [
                    'attendance_records' => $total,
                    'present_or_partial' => $present,
                    'absent' => (clone $records)->where('status', 'Absent')->count(),
                    'attendance_percentage' => $total > 0 ? round($present / $total * 100, 1) : null,
                ];
            }

            return $this->supported(['linked_students_attendance' => $data]);
        }

        if (preg_match('/\b(fee|fees|pending|outstanding)\b/', $text)) {
            $data = [];
            foreach ($students as $student) {
                $invoices = FeeInvoice::where('student_id', $student->id)->where('school_id', $student->school_id)
                    ->get(['amount', 'paid_amount', 'discount_amount', 'fine_amount', 'title', 'due_date']);
                $data[] = [
                    'outstanding_total' => round((float) $invoices->sum(fn (FeeInvoice $invoice) => max(0, (float) $invoice->amount - (float) $invoice->paid_amount)), 2),
                    'paid_total' => round((float) $invoices->sum('paid_amount'), 2),
                    'unpaid_invoices' => $invoices->filter(fn (FeeInvoice $invoice) => (float) $invoice->amount > (float) $invoice->paid_amount)
                        ->map(fn (FeeInvoice $invoice) => [
                            'title' => $invoice->title,
                            'amount_due' => round(max(0, (float) $invoice->amount - (float) $invoice->discount_amount + (float) $invoice->fine_amount - (float) $invoice->paid_amount), 2),
                            'due_date' => $invoice->due_date?->toDateString(),
                        ])->take(20)->values()->all(),
                ];
            }

            return $this->supported(['linked_students_fees' => $data]);
        }

        if (preg_match('/\b(homework|assignment|assignments|diary)\b/', $text)) {
            return $this->supported(['linked_students_homework' => $this->studentRecords($students, function (Student $student) {
                return Assignment::where('school_id', $student->school_id)->where('class_id', $student->class_id)
                    ->where(fn ($query) => $query->whereNull('section_id')->orWhere('section_id', $student->section_id))
                    ->where('status', 'Active')->whereDate('due_date', '>=', today())
                    ->orderBy('due_date')->limit(15)->get(['title', 'description', 'due_date']);
            })]);
        }

        if (preg_match('/\b(timetable|schedule|periods?)\b/', $text)) {
            return $this->supported(['linked_students_timetable' => $this->studentRecords($students, function (Student $student) {
                return Timetable::where('school_id', $student->school_id)->where('class_id', $student->class_id)
                    ->where(function ($query) use ($student) {
                        $query->whereNull('section_id')->orWhere('section_id', $student->section_id);
                    })->with(['class:id,name,section', 'subject:id,name', 'teacher:id,first_name,last_name'])
                    ->orderBy('day')->orderBy('period')->limit(40)->get()
                    ->map(fn (Timetable $row) => [
                        'day' => $row->day_name,
                        'period' => $row->period,
                        'subject' => $row->subject?->name,
                        'teacher' => $row->teacher?->full_name,
                        'start' => $row->start_time,
                        'end' => $row->end_time,
                        'room' => $row->room_number ?: $row->room,
                    ]);
            })]);
        }

        if (preg_match('/\b(result|results|exam|exams|grade|grades|marks)\b/', $text)) {
            return $this->supported(['linked_students_results' => $this->studentRecords($students, function (Student $student) {
                return Mark::where('student_id', $student->id)->where('school_id', $student->school_id)
                    ->with(['exam:id,name', 'subject:id,name'])->latest()->limit(20)->get()
                    ->map(fn (Mark $mark) => [
                        'exam' => $mark->exam?->name,
                        'subject' => $mark->subject?->name,
                        'score' => $mark->total_score ?: $mark->marks_obtained,
                        'maximum' => $mark->max_score ?: $mark->total_marks,
                        'grade' => $mark->grade,
                    ]);
            })]);
        }

        if (preg_match('/\b(announcement|announcements|notice|notices)\b/', $text)) {
            $audiences = $user->isParent() ? ['All', 'Parents'] : ['All', 'Students'];

            return $this->supported(['class_announcements' => $this->studentRecords($students, function (Student $student) use ($audiences) {
                return Announcement::where('school_id', $student->school_id)->where('is_published', true)
                    ->where('status', 'Published')
                    ->whereIn('target_audience', $audiences)
                    ->where(fn ($query) => $query->whereNull('class_id')->orWhere('class_id', $student->class_id))
                    ->where(function ($query) {
                        $query->whereNull('expiry_date')->orWhereDate('expiry_date', '>=', today());
                    })->latest('publish_date')->limit(15)->get(['title', 'content', 'description', 'publish_date']);
            })]);
        }

        return $this->unsupported();
    }

    /**
     * @param  Collection<int, Student>  $students
     * @return array<int, array<string, mixed>>
     */
    private function studentRecords(Collection $students, callable $query): array
    {
        return $students->map(fn (Student $student) => [
            'class' => $student->class?->display_name,
            'records' => $query($student)->values()->all(),
        ])->all();
    }

    /** @return array{0: string, 1: string} */
    private function period(string $text): array
    {
        $month = now()->startOfMonth();
        if (preg_match('/\blast month\b/', $text)) {
            $month->subMonth();
        }

        return [$month->toDateString(), $month->copy()->endOfMonth()->toDateString()];
    }

    private function asksForPlatformData(string $text): bool
    {
        if (preg_match('/\b(school fee|student fees|fee collection|fees collected|fee revenue|fee income|tuition)\b/', $text)) {
            return false;
        }

        return (bool) preg_match('/\b(platform|schoolms|subscription|contract|saas|active schools|overdue payments|platform revenue|platform payments)\b/', $text)
            || (bool) preg_match('/\b(revenue|income)\b/', $text);
    }

    private function asksForRestrictedData(string $text): bool
    {
        return (bool) preg_match('/\b(salary|salaries|payroll|school-wide expense|school wide|whole school|everyone|all students|other students|other schools|which students|students with (?:outstanding|pending) fees|fee collection|fees collected|fee revenue|fee income|school fee collection|school fees collected|contract payments|platform)\b/', $text);
    }

    private function supported(array $data): array
    {
        return ['allowed' => true, 'supported' => true, 'data' => $data];
    }

    private function unsupported(string $message = 'I could not find a supported SchoolMS record for that question. Try one of the suggested questions.'): array
    {
        return ['allowed' => true, 'supported' => false, 'data' => [], 'message' => $message];
    }
}
