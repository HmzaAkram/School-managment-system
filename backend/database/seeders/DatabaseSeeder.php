<?php

namespace Database\Seeders;

use App\Helpers\GradeScale;
use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\Event;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\Expense;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\LedgerEntry;
use App\Models\Mark;
use App\Models\Notification;
use App\Models\ParentModel;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Section;
use App\Models\Setting;
use App\Models\Student;
use App\Models\StudentLeave;
use App\Models\StudentReview;
use App\Models\Subject;
use App\Models\SupportTicket;
use App\Models\Teacher;
use App\Models\Timetable;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Seeds a realistic, multi-school dataset so every dashboard in the frontend
 * renders genuine MySQL rows. Safe to re-run: all writes are idempotent.
 */
class DatabaseSeeder extends Seeder
{
    /** @var array<string, string> */
    private const PASSWORD = 'password123';

    public function run(): void
    {
        $this->command?->info('Seeding SkoolMS demo data…');

        $superAdmin = $this->user('superadmin@skoolms.com', 'Platform Super Admin', 'super_admin');

        $schools = $this->schools();
        $this->platformRevenue($schools);
        $this->platformExpenses($superAdmin);
        $this->supportTickets($schools, $superAdmin);

        // ── Greenwood International School: the fully-populated tenant ──
        $greenwood = $schools[0];
        $context = $this->greenwood($greenwood);

        $this->notify($context['admin'], [
            'title' => 'Fee collection below target',
            'message' => 'Only 68% of October invoices have been settled. Review the outstanding list.',
            'type' => 'fees',
            'link' => '/admin-dashboard/fees',
        ]);

        // ── Apex Academy: a smaller second tenant ──
        $apex = $schools[1];
        $this->apex($apex);
    }

    // ══════════════════════════════ Helpers ══════════════════════════════

    private function user(string $email, string $name, string $role, ?int $schoolId = null, ?string $phone = null): User
    {
        return User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make(self::PASSWORD),
                'role' => $role,
                'school_id' => $schoolId,
                'phone' => $phone,
                'status' => 'Active',
                'email_verified_at' => now(),
            ]
        );
    }

    private function notify(User $user, array $data, ?\DateTimeInterface $readAt = null): Notification
    {
        // Deterministic UUID (RFC-4122 v5 shape) so re-seeding is idempotent.
        $hash = md5('skoolms|'.$user->id.'|'.($data['type'] ?? 'general').'|'.$data['title']);
        $id = sprintf(
            '%s-%s-5%s-%s%s-%s',
            substr($hash, 0, 8),
            substr($hash, 8, 4),
            substr($hash, 13, 3),
            dechex((hexdec(substr($hash, 16, 1)) & 0x3) | 0x8),
            substr($hash, 17, 3),
            substr($hash, 20, 12)
        );

        return Notification::updateOrCreate(
            ['id' => $id],
            [
                'type' => $data['type'] ?? 'general',
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => [
                    'title' => $data['title'],
                    'message' => $data['message'],
                    'link' => $data['link'] ?? null,
                ],
                'read_at' => $readAt,
            ]
        );
    }

    // ══════════════════════════════ Schools ══════════════════════════════

    private function schools(): array
    {
        $definitions = [
            [
                'code' => 'GIS-001',
                'name' => 'Greenwood International School',
                'subdomain' => 'greenwood',
                'domain' => 'greenwood.skoolms.com',
                'address' => '123 Education Lane, Sector 4',
                'city' => 'Lahore',
                'state' => 'Punjab',
                'country' => 'Pakistan',
                'phone' => '+92 42 3577 0199',
                'email' => 'info@greenwood.edu.pk',
                'website' => 'https://greenwood.edu.pk',
                'tagline' => 'Excellence in Education Since 1985',
                'principal_name' => 'Dr. Eleanor Vance',
                'status' => 'Active',
                'subscription_status' => 'Active',
                'plan' => 'Premium',
                'contract_amount' => 48000.00,
                'contract_start' => '2026-01-01',
                'contract_end' => '2026-12-31',
                'contract_type' => 'Annual',
                'paid_amount' => 48000.00,
                'pending_amount' => 0.00,
                'created_at' => now()->subMonths(30),
            ],
            [
                'code' => 'AAS-002',
                'name' => 'Apex Academy of Science',
                'subdomain' => 'apex',
                'domain' => 'apex.skoolms.com',
                'address' => '45 Tech Boulevard, Gulberg',
                'city' => 'Lahore',
                'state' => 'Punjab',
                'country' => 'Pakistan',
                'phone' => '+92 42 3577 0288',
                'email' => 'contact@apexacademy.edu.pk',
                'website' => 'https://apexacademy.edu.pk',
                'tagline' => 'Where Science Meets Ambition',
                'principal_name' => 'Prof. Robert Langdon',
                'status' => 'Active',
                'subscription_status' => 'Active',
                'plan' => 'Standard',
                'contract_amount' => 24000.00,
                'contract_start' => '2026-04-01',
                'contract_end' => '2027-03-31',
                'contract_type' => 'Annual',
                'paid_amount' => 12000.00,
                'pending_amount' => 12000.00,
                'created_at' => now()->subMonths(9),
            ],
            [
                'code' => 'NSC-003',
                'name' => 'Northside Collegiate',
                'subdomain' => 'northside',
                'domain' => 'northside.skoolms.com',
                'address' => '8 Canal Road',
                'city' => 'Islamabad',
                'state' => 'ICT',
                'country' => 'Pakistan',
                'phone' => '+92 51 2222 4477',
                'email' => 'office@northside.edu.pk',
                'website' => 'https://northside.edu.pk',
                'tagline' => 'Building Tomorrow\'s Leaders',
                'principal_name' => 'Ms. Ayesha Siddiqui',
                'status' => 'Active',
                'subscription_status' => 'Trial',
                'plan' => 'Starter',
                'contract_amount' => 9000.00,
                'contract_start' => now()->startOfMonth()->toDateString(),
                'contract_end' => now()->addMonths(11)->endOfMonth()->toDateString(),
                'contract_type' => 'Annual',
                'paid_amount' => 0.00,
                'pending_amount' => 9000.00,
                'created_at' => now()->subDays(24),
            ],
            [
                'code' => 'HVB-004',
                'name' => 'Harborview boarding School',
                'subdomain' => 'harborview',
                'domain' => 'harborview.skoolms.com',
                'address' => '22 Marine Drive',
                'city' => 'Karachi',
                'state' => 'Sindh',
                'country' => 'Pakistan',
                'phone' => '+92 21 3455 9012',
                'email' => 'admin@harborview.edu.pk',
                'website' => null,
                'tagline' => 'Home away from home',
                'principal_name' => 'Mr. Bilal Ahmed',
                'status' => 'Inactive',
                'subscription_status' => 'Expired',
                'plan' => 'Standard',
                'contract_amount' => 18000.00,
                'contract_start' => '2025-01-01',
                'contract_end' => '2025-12-31',
                'contract_type' => 'Annual',
                'paid_amount' => 18000.00,
                'pending_amount' => 0.00,
                'created_at' => now()->subMonths(22),
            ],
        ];

        $schools = [];
        foreach ($definitions as $def) {
            $schools[] = School::updateOrCreate(['code' => $def['code']], $def);
        }

        return $schools;
    }

    // ══════════════════════ Super-admin financials ══════════════════════

    private function platformRevenue(array $schools): void
    {
        $contracts = [
            ['school' => $schools[0], 'number' => 'CNT-2026-0001', 'plan' => 'Premium Plan', 'value' => 48000.00,
                'start' => '2026-01-01', 'end' => '2026-12-31', 'status' => 'Active', 'per_student' => 22.00, 'cycle' => 'Annually'],
            ['school' => $schools[1], 'number' => 'CNT-2026-0002', 'plan' => 'Standard Plan', 'value' => 24000.00,
                'start' => '2026-04-01', 'end' => '2027-03-31', 'status' => 'Pending Renewal', 'per_student' => 14.00, 'cycle' => 'Annually'],
            ['school' => $schools[2], 'number' => 'CNT-2026-0003', 'plan' => 'Starter Trial', 'value' => 9000.00,
                'start' => now()->startOfMonth()->toDateString(), 'end' => now()->addMonths(11)->endOfMonth()->toDateString(), 'status' => 'Pending', 'per_student' => 9.00, 'cycle' => 'Annually'],
            ['school' => $schools[3], 'number' => 'CNT-2025-0091', 'plan' => 'Standard Plan', 'value' => 18000.00,
                'start' => '2025-01-01', 'end' => '2025-12-31', 'status' => 'Expired', 'per_student' => 14.00, 'cycle' => 'Annually'],
        ];

        foreach ($contracts as $c) {
            SchoolContract::updateOrCreate(
                ['contract_number' => $c['number']],
                [
                    'school_id' => $c['school']->id,
                    'plan_name' => $c['plan'],
                    'per_student_fee' => $c['per_student'],
                    'saas_fee_per_student' => $c['per_student'],
                    'saas_share_percent' => 100.00,
                    'school_share_percent' => 0.00,
                    'contract_duration_months' => 12,
                    'start_date' => $c['start'],
                    'end_date' => $c['end'],
                    'contract_start' => $c['start'],
                    'contract_end' => $c['end'],
                    'total_amount' => $c['value'],
                    'total_contract_value' => $c['value'],
                    'balance_due' => $c['value'],
                    'total_paid_amount' => 0,
                    'total_pending_amount' => $c['value'],
                    'billing_cycle' => $c['cycle'],
                    'current_month_status' => 'Pending',
                    'status' => $c['status'],
                ]
            );
        }

        // School payments spread over the last 12 months → real revenue trend.
        $paymentPlan = [
            [$schools[0], '2026-01-08', 48000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Premium Plan'],
            [$schools[0], '2025-10-05', 48000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Premium Plan'],
            [$schools[0], '2025-06-11', 48000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Premium Plan'],
            [$schools[0], '2025-02-14', 48000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Premium Plan'],
            [$schools[1], '2026-04-02', 12000.00, 'Bank Transfer', 'Completed', 'First instalment — Standard Plan'],
            [$schools[1], '2025-04-03', 24000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Standard Plan'],
            [$schools[1], '2025-01-20', 24000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Standard Plan'],
            [$schools[2], now()->startOfMonth()->toDateString(), 9000.00, 'Bank Transfer', 'Pending', 'Starter trial invoice'],
            [$schools[3], '2025-01-05', 18000.00, 'Bank Transfer', 'Completed', 'Annual subscription — Standard Plan'],
            [$schools[3], '2024-01-04', 18000.00, 'Bank Transfer', 'Failed', 'Annual subscription — Standard Plan'],
        ];

        $balance = 0.0;

        foreach ($paymentPlan as $i => [$school, $date, $amount, $method, $status, $description]) {
            $payment = SchoolPayment::updateOrCreate(
                ['transaction_id' => 'TXN-'.str_pad((string) (100200 + $i), 6, '0', STR_PAD_LEFT)],
                [
                    'school_id' => $school->id,
                    'school_contract_id' => SchoolContract::where('school_id', $school->id)->value('id'),
                    'amount' => $amount,
                    'payment_date' => $date,
                    'payment_method' => $method,
                    'reference' => 'REF-'.str_pad((string) (900 + $i), 5, '0', STR_PAD_LEFT),
                    'description' => $description,
                    'month_for' => \Illuminate\Support\Carbon::parse($date)->format('F Y'),
                    'status' => $status,
                ]
            );

            $balance += $status === 'Completed' ? $amount : 0;

            LedgerEntry::updateOrCreate(
                ['reference_type' => SchoolPayment::class, 'reference_id' => $payment->id],
                [
                    'transaction_id' => $payment->transaction_id,
                    'school_id' => $school->id,
                    'school_payment_id' => $payment->id,
                    'date' => $date,
                    'entry_date' => $date,
                    'type' => 'Credit',
                    'category' => 'School Subscription Fee',
                    'description' => $description.' — '.$school->name,
                    'debit' => 0.00,
                    'credit' => $amount,
                    'amount' => $amount,
                    'balance' => $balance,
                    'running_balance' => $balance,
                    'payment_method' => $method,
                    'status' => $status === 'Completed' ? 'Completed' : 'Pending',
                ]
            );
        }
    }

    private function platformExpenses(User $superAdmin): void
    {
        $expenses = [
            ['AWS Cloud Infrastructure', 'Hosting & Cloud', 2450.00, 'Amazon Web Services', 'Corporate Credit Card', 'Monthly server cluster and managed database hosting'],
            ['Engineering Team Payroll', 'Salaries', 18500.00, 'Payroll Services Ltd', 'Bank Transfer', 'Platform engineering and support staff for the month'],
            ['SSL & Domain Renewals', 'Infrastructure', 380.00, 'Namecheap', 'Corporate Credit Card', 'Wildcard certificate and domain portfolio renewal'],
            ['Customer Support Outsourcing', 'Operations', 6200.00, 'SupportDesk Global', 'Bank Transfer', 'Tier-1 and tier-2 helpdesk retainer'],
            ['Marketing — Back to School Campaign', 'Marketing', 4800.00, 'BrightAds Media', 'Bank Transfer', 'Digital acquisition campaign for the September intake'],
            ['Office Rent & Utilities', 'Facilities', 3100.00, 'Meridian Properties', 'Bank Transfer', 'Lahore office space and utilities'],
            ['Third-party SMS Gateway Credits', 'Communication', 1450.00, 'MSGate', 'Online Wallet', 'Prepaid balance for attendance and fee SMS alerts'],
            ['Security Audit & Penetration Test', 'Compliance', 5600.00, 'SecureAudit Labs', 'Bank Transfer', 'Annual independent penetration test and SOC2 readiness review'],
        ];

        $running = DB::table('ledger_entries')->orderByDesc('id')->value('running_balance') ?? 0;
        $running = (float) $running;

        foreach ($expenses as $i => [$title, $category, $amount, $paidTo, $method, $description]) {
            $date = now()->subMonths($i % 3)->startOfMonth()->addDays(4 + $i)->toDateString();

            $expense = Expense::updateOrCreate(
                ['expense_id' => 'EXP-'.str_pad((string) (4400 + $i), 5, '0', STR_PAD_LEFT)],
                [
                    'school_id' => null,
                    'title' => $title,
                    'category' => $category,
                    'amount' => $amount,
                    'expense_date' => $date,
                    'date' => $date,
                    'paid_to' => $paidTo,
                    'payment_method' => $method,
                    'receipt_number' => 'RCP-'.str_pad((string) (7700 + $i), 5, '0', STR_PAD_LEFT),
                    'description' => $description,
                    'status' => 'Paid',
                    'created_by' => $superAdmin->id,
                ]
            );

            $running -= $amount;

            LedgerEntry::updateOrCreate(
                ['reference_type' => Expense::class, 'reference_id' => $expense->id],
                [
                    'transaction_id' => 'LG-'.str_pad((string) (2200 + $i), 5, '0', STR_PAD_LEFT),
                    'expense_id' => $expense->id,
                    'date' => $date,
                    'entry_date' => $date,
                    'type' => 'Debit',
                    'category' => $category,
                    'description' => $title.' — '.$paidTo,
                    'debit' => $amount,
                    'credit' => 0.00,
                    'amount' => $amount,
                    'balance' => $running,
                    'running_balance' => $running,
                    'payment_method' => $method,
                    'status' => 'Completed',
                ]
            );
        }
    }

    private function supportTickets(array $schools, User $superAdmin): void
    {
        $tickets = [
            ['TCK-8801', $schools[0], 'Custom grade report template', 'Feature Request', 'Medium', 'In Progress',
                'We would like to customise our report card layout with the school logo and a watermark.'],
            ['TCK-8802', $schools[1], 'Fee invoice export returns empty CSV', 'Bug Report', 'High', 'Open',
                'Since the 3.2 release the CSV export of the fees module downloads a 0-byte file.'],
            ['TCK-8803', $schools[0], 'Unable to add a second timetable slot', 'Bug Report', 'Medium', 'Open',
                'Saving a second period for the same class and day returns a duplicate entry error.'],
            ['TCK-8804', $schools[2], 'How do we import our existing students?', 'How To', 'Low', 'Resolved',
                'Looking for a bulk import path for roughly 400 students from our old system.'],
            ['TCK-8805', $schools[1], 'Parent portal password reset emails not arriving', 'Bug Report', 'High', 'In Progress',
                'About a third of parents report the reset email never reaches their inbox.'],
            ['TCK-8806', $schools[0], 'Request to increase timetable periods to 8', 'Feature Request', 'Low', 'Closed',
                'Our secondary block needs an eighth period for supervised study.'],
            ['TCK-8807', $schools[3], 'Subscription renewal invoice', 'Billing', 'Medium', 'Resolved',
                'Please send the renewal invoice to our new finance contact address.'],
        ];

        foreach ($tickets as [$ref, $school, $subject, $category, $priority, $status, $description]) {
            $admin = User::where('school_id', $school->id)->where('role', 'school_admin')->first();

            SupportTicket::updateOrCreate(
                ['ticket_id' => $ref],
                [
                    'school_id' => $school->id,
                    'user_id' => $admin?->id,
                    'created_by' => $admin?->id,
                    'subject' => $subject,
                    'category' => $category,
                    'priority' => $priority,
                    'status' => $status,
                    'description' => $description,
                    'assigned_to' => $superAdmin->id,
                ]
            );
        }
    }

    // ═══════════════════════ Greenwood (main tenant) ═══════════════════════

    private function greenwood(School $school): array
    {
        $schoolId = $school->id;

        Setting::where('school_id', $schoolId)->delete();
        foreach ([
            'school_name' => $school->name,
            'school_code' => $school->code,
            'school_email' => $school->email,
            'school_phone' => $school->phone,
            'school_address' => $school->address,
            'school_city' => $school->city,
            'school_country' => $school->country,
            'principal_name' => $school->principal_name,
            'academic_session' => '2026-2027',
            'term_system' => 'Semester',
            'attendance_time' => '08:00',
            'dismissal_time' => '14:30',
            'grading_scale' => 'A+ / A / B+ / B / C+ / C / D / F',
            'pass_percentage' => '33',
            'currency' => 'PKR',
            'late_marking_grace_minutes' => '15',
            'sms_provider' => 'MSGate',
            'report_card_template' => 'Standard',
        ] as $key => $value) {
            Setting::updateOrCreate(
                ['school_id' => $schoolId, 'key' => $key],
                ['value' => $value]
            );
        }

        $ay = AcademicYear::updateOrCreate(
            ['school_id' => $schoolId, 'name' => '2026-2027'],
            ['start_date' => '2026-04-01', 'end_date' => '2027-03-31', 'is_current' => true, 'is_active' => true]
        );

        AcademicYear::updateOrCreate(
            ['school_id' => $schoolId, 'name' => '2025-2026'],
            ['start_date' => '2025-04-01', 'end_date' => '2026-03-31', 'is_current' => false, 'is_active' => false]
        );

        $admin = $this->user('admin@greenwood.com', 'Arthur Pendleton', 'school_admin', $schoolId, '+92 300 4127788');

        // ── Classes & sections ──
        $classes = [];
        $gradeDefs = [
            ['code' => 'G08', 'name' => 'Grade 8', 'level' => 8, 'capacity' => 45, 'section' => 'A'],
            ['code' => 'G09', 'name' => 'Grade 9', 'level' => 9, 'capacity' => 45, 'section' => 'A'],
            ['code' => 'G10', 'name' => 'Grade 10', 'level' => 10, 'capacity' => 40, 'section' => 'A'],
            ['code' => 'G11', 'name' => 'Grade 11', 'level' => 11, 'capacity' => 35, 'section' => 'A'],
        ];

        foreach ($gradeDefs as $def) {
            $class = SchoolClass::updateOrCreate(
                ['school_id' => $schoolId, 'code' => $def['code']],
                [
                    'academic_year_id' => $ay->id,
                    'name' => $def['name'],
                    'numeric_level' => $def['level'],
                    'section' => $def['section'],
                    'capacity' => $def['capacity'],
                    'description' => $def['name'].' — secondary section',
                    'status' => 'Active',
                ]
            );

            $classes[$def['code']] = $class;

            foreach (['A', 'B'] as $idx => $suffix) {
                Section::updateOrCreate(
                    ['school_id' => $schoolId, 'class_id' => $class->id, 'name' => 'Section '.strtoupper($suffix)],
                    ['capacity' => 22, 'room_number' => $def['level'].'0'.($idx + 1)]
                );
            }
        }

        $sections = Section::where('school_id', $schoolId)->orderBy('id')->get()
            ->groupBy('class_id');

        // ── Subjects ──
        $subjectDefs = [
            ['MATH101', 'Mathematics', 4.0, 'Theory'],
            ['PHY101', 'Physics', 4.0, 'Both'],
            ['CHEM101', 'Chemistry', 4.0, 'Both'],
            ['ENG101', 'English Literature', 3.0, 'Theory'],
            ['BIO101', 'Biology', 3.5, 'Theory'],
            ['CS201', 'Computer Science', 3.5, 'Both'],
            ['HIST101', 'History & Civics', 2.0, 'Theory'],
            ['ECON201', 'Economics', 2.0, 'Theory'],
        ];

        $subjects = [];
        foreach ($subjectDefs as [$code, $name, $credits, $type]) {
            $subjects[$code] = Subject::updateOrCreate(
                ['school_id' => $schoolId, 'code' => $code],
                [
                    'name' => $name,
                    'type' => $type,
                    'credits' => $credits,
                    'pass_marks' => 33,
                    'total_marks' => 100,
                    'status' => 'Active',
                ]
            );
        }

        foreach ($classes as $class) {
            $class->subjects()->syncWithoutDetaching(collect($subjects)->pluck('id'));
        }

        // ── Teachers ──
        $teacherDefs = [
            ['teacher@greenwood.com', 'Sarah', 'Jenkins', 'EMP-2026-01', 'Senior Mathematics Teacher', 'Mathematics', 'M.Sc Mathematics, B.Ed', 11, 'Female', 145000, ['MATH101', 'CS201']],
            ['j.osei@greenwood.com', 'James', 'Osei', 'EMP-2026-02', 'Physics Teacher', 'Science', 'M.Sc Physics', 6, 'Male', 118000, ['PHY101']],
            ['a.rahman@greenwood.com', 'Aisha', 'Rahman', 'EMP-2026-03', 'Chemistry Teacher', 'Science', 'M.Sc Chemistry, B.Ed', 8, 'Female', 126000, ['CHEM101', 'BIO101']],
            ['m.chen@greenwood.com', 'Michael', 'Chen', 'EMP-2026-04', 'English Teacher', 'Humanities', 'M.A English Literature', 5, 'Male', 98000, ['ENG101']],
            ['f.khan@greenwood.com', 'Fatima', 'Khan', 'EMP-2026-05', 'Computer Science Teacher', 'Computer Science', 'M.S Computer Science', 7, 'Female', 132000, ['CS201']],
            ['d.ali@greenwood.com', 'Bilal', 'Ali', 'EMP-2025-14', 'History & Civics Teacher', 'Humanities', 'M.A History', 13, 'Male', 105000, ['HIST101', 'ECON201']],
            ['n.patel@greenwood.com', 'Nisha', 'Patel', 'EMP-2026-07', 'Biology Teacher', 'Science', 'M.Sc Zoology, B.Ed', 4, 'Female', 92000, ['BIO101']],
            ['r.mehta@greenwood.com', 'Rohan', 'Mehta', 'EMP-2024-09', 'Economics Teacher', 'Commerce', 'M.Com Economics', 15, 'Male', 112000, ['ECON201']],
        ];

        $teachers = [];
        foreach ($teacherDefs as $i => [$email, $first, $last, $empId, $designation, $dept, $qualification, $years, $gender, $salary, $subjectCodes]) {
            $user = $this->user($email, "{$first} {$last}", 'teacher', $schoolId, '+92 30'.(1 + $i).'76543210');

            $teachers[$email] = Teacher::updateOrCreate(
                ['school_id' => $schoolId, 'employee_id' => $empId],
                [
                    'user_id' => $user->id,
                    'first_name' => $first,
                    'last_name' => $last,
                    'designation' => $designation,
                    'department' => $dept,
                    'joining_date' => now()->subYears($years)->startOfYear()->toDateString(),
                    'dob' => now()->subYears($years + 27)->toDateString(),
                    'experience_years' => $years,
                    'gender' => $gender,
                    'qualification' => $qualification,
                    'salary' => $salary,
                    'salary_status' => 'Paid',
                    'address' => 'Staff Colony, '.$school->city,
                    'status' => $email === 'n.patel@greenwood.com' ? 'On Leave' : 'Active',
                ]
            );

            $teachers[$email]->subjects()->syncWithoutDetaching(
                array_map(fn ($c) => $subjects[$c]->id, $subjectCodes)
            );
        }

        // Class teachers
        $classTeacherMap = [
            'G08' => 'd.ali@greenwood.com',
            'G09' => 'm.chen@greenwood.com',
            'G10' => 'teacher@greenwood.com',
            'G11' => 'j.osei@greenwood.com',
        ];
        foreach ($classTeacherMap as $code => $email) {
            DB::table('teacher_class')->updateOrInsert(
                ['teacher_id' => $teachers[$email]->id, 'class_id' => $classes[$code]->id],
                ['is_class_teacher' => 1, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // ── Students & parents ──
        $firstNames = ['Alexander', 'Priya', 'Daniel', 'Sofia', 'Omar', 'Emma', 'Yusuf', 'Zara', 'Liam', 'Aisha',
            'Noah', 'Maya', 'Hassan', 'Chloe', 'Bilal', 'Nadia', 'Ethan', 'Leila', 'Marcus', 'Hana',
            'Ryan', 'Iqra', 'Victor', 'Amara', 'Kai'];
        $lastNames = ['Wright', 'Sharma', 'Okonkwo', 'Rossi', 'Haddad', 'Müller', 'Khan', 'Ahmed', 'Byrne', 'Siddiqui',
            'Novak', 'Tanaka', 'Farooq', 'Dubois', 'Aslam', 'Iqbal', 'Silva', 'Nasser', 'Osei', 'Kim'];

        $students = [];
        $parents = [];

        foreach ($gradeDefs as $gi => $def) {
            $class = $classes[$def['code']];
            $classSections = $sections[$class->id] ?? collect();
            $count = $gi === 2 ? 24 : 12 + $gi * 2;

            for ($i = 0; $i < $count; $i++) {
                $fn = $firstNames[($gi * 7 + $i) % count($firstNames)];
                $ln = $lastNames[($gi * 5 + $i * 3) % count($lastNames)];
                $section = $classSections[$i % max(1, $classSections->count())] ?? null;
                $gender = $i % 3 === 0 ? 'Female' : 'Male';
                $roll = (string) ((int) ($def['level'] * 100) + $i + 1);
                $email = strtolower($fn.'.'.$ln.$roll).'@student.greenwood.edu.pk';

                $user = $this->user($email, "{$fn} {$ln}", 'student', $schoolId);

                $students[] = Student::updateOrCreate(
                    ['school_id' => $schoolId, 'admission_number' => 'ADM-'.$def['level'].str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT)],
                    [
                        'user_id' => $user->id,
                        'student_id' => 'STU-'.$roll,
                        'roll_number' => $roll,
                        'roll_no' => $roll,
                        'first_name' => $fn,
                        'last_name' => $ln,
                        'class_id' => $class->id,
                        'section_id' => $section?->id,
                        'dob' => now()->subYears($def['level'] + 5)->subDays($i * 3)->toDateString(),
                        'date_of_birth' => now()->subYears($def['level'] + 5)->subDays($i * 3)->toDateString(),
                        'gender' => $gender,
                        'blood_group' => ['O+', 'A+', 'B+', 'AB+', 'O-'][$i % 5],
                        'address' => (10 + $i).' Residential Area, '.$school->city,
                        'city' => $school->city,
                        'state' => $school->state,
                        'admission_date' => $ay->start_date,
                        'previous_school' => $i % 4 === 0 ? 'City Model School' : null,
                        'emergency_contact' => '+92 3'.(1 + $i % 9).'0'.str_pad((string) $i, 6, '0', STR_PAD_LEFT),
                        'status' => 'Active',
                    ]
                );
            }
        }

        // A handful of non-active students so filters have something to show.
        foreach ($students as $idx => $student) {
            if ($idx % 17 !== 3) {
                continue;
            }

            $student->update([
                'status' => $idx % 34 === 3 ? 'Transferred' : 'Inactive',
            ]);
        }

        // Parents: each student gets one primary parent; a few get both.
        foreach ($students as $i => $student) {
            $pUser = $this->user(
                'parent.'.$student->roll_number.'@greenwood.edu.pk',
                $student->first_name.' '.$student->last_name.' (Guardian)',
                'parent',
                $schoolId,
                '+92 31'.($i % 9).'2345678'
            );

            $parent = ParentModel::updateOrCreate(
                ['user_id' => $pUser->id],
                [
                    'school_id' => $schoolId,
                    'father_name' => $i % 2 === 0 ? $student->last_name.' Senior' : 'Mr. '.$student->last_name,
                    'father_phone' => '+92 31'.($i % 9).'2345678',
                    'father_email' => 'father.'.$student->roll_number.'@greenwood.edu.pk',
                    'father_occupation' => ['Engineer', 'Doctor', 'Accountant', 'Businessman', 'Architect'][$i % 5],
                    'mother_name' => 'Mrs. '.$student->last_name,
                    'mother_phone' => '+92 32'.($i % 9).'2345678',
                    'mother_occupation' => ['Homemaker', 'Teacher', 'Pharmacist', 'Bank Manager'][$i % 4],
                    'occupation' => ['Engineer', 'Doctor', 'Accountant', 'Businessman', 'Architect'][$i % 5],
                    'income' => 250000 + ($i % 8) * 75000,
                    'alternate_phone' => '+92 33'.($i % 9).'2345678',
                    'address' => $student->address,
                    'emergency_contact' => '+92 34'.($i % 9).'2345678',
                ]
            );

            $parents[$student->id] = $parent;

            $student->parents()->syncWithoutDetaching([
                $parent->id => ['relationship' => $i % 2 === 0 ? 'Father' : 'Mother', 'is_primary' => true],
            ]);
        }

        // Known demo accounts
        $primaryStudent = Student::where('school_id', $schoolId)->where('roll_number', '1001')->first()
            ?? $students[0];

        $studentUser = $this->user('student@greenwood.com', $primaryStudent->first_name.' '.$primaryStudent->last_name, 'student', $schoolId);
        $primaryStudent->update(['user_id' => $studentUser->id]);

        $parentUser = $this->user('parent@greenwood.com', $primaryStudent->last_name.' Family', 'parent', $schoolId, '+92 300 9988776');
        $demoParent = ParentModel::updateOrCreate(
            ['user_id' => $parentUser->id],
            [
                'school_id' => $schoolId,
                'father_name' => 'Mr. '.$primaryStudent->last_name,
                'father_phone' => '+92 300 9988776',
                'father_email' => 'parent@greenwood.com',
                'father_occupation' => 'Software Engineer',
                'mother_name' => 'Mrs. '.$primaryStudent->last_name,
                'occupation' => 'Software Engineer',
                'income' => 420000,
                'alternate_phone' => '+92 301 9988776',
                'address' => $primaryStudent->address,
                'emergency_contact' => '+92 302 9988776',
            ]
        );
        $primaryStudent->parents()->syncWithoutDetaching([
            $demoParent->id => ['relationship' => 'Father', 'is_primary' => true],
        ]);

        // Give the demo parent a second child so the child-switcher has options.
        $sibling = $students[1] ?? $primaryStudent;
        if ($sibling->id !== $primaryStudent->id) {
            $sibling->parents()->syncWithoutDetaching([
                $demoParent->id => ['relationship' => 'Father', 'is_primary' => false],
            ]);
        }

        $teacherUser = $this->user('teacher@greenwood.com', 'Sarah Jenkins', 'teacher', $schoolId, '+92 300 1234567');
        $teachers['teacher@greenwood.com']->update(['user_id' => $teacherUser->id]);

        // ── Attendance: 60 school days × all students + teachers ──
        $this->attendance($schoolId, $students, $classes, $teachers);

        // ── Timetable ──
        $this->timetable($schoolId, $classes, $subjects, $teachers);

        // ── Fees ──
        $this->fees($schoolId, $students, $classes, $admin, $ay);

        // ── Exams, schedules & marks ──
        $this->exams($schoolId, $students, $classes, $subjects, $teachers, $ay);

        // ── Assignments, submissions & reviews ──
        $this->assignments($schoolId, $students, $classes, $subjects, $teachers);

        // ── Diaries ──
        $this->diaries($schoolId, $classes, $subjects, $teachers);

        // ── Announcements, events, leaves ──
        $this->announcements($schoolId, $admin, $classes);
        $this->events($schoolId, $admin);
        $this->leaves($schoolId, $students, $admin);

        // ── Notifications for each demo persona ──
        $this->greenwoodNotifications($schoolId, $admin, $teachers, $studentUser, $parentUser, $primaryStudent);

        return [
            'admin' => $admin,
            'student' => $primaryStudent,
            'parent' => $demoParent,
            'school' => $school,
        ];
    }

    // ══════════════════════════ Greenwood datasets ══════════════════════════

    private function attendance(int $schoolId, array $students, array $classes, array $teachers): void
    {
        // attendances has no natural unique key, so clear and rebuild.
        DB::table('attendances')->where('school_id', $schoolId)->delete();

        $rows = [];
        $now = now();
        $statuses = ['Present', 'Present', 'Present', 'Present', 'Late', 'Absent', 'Half-Day', 'Excused'];

        // 60 school days, weekdays only.
        for ($d = 60; $d >= 0; $d--) {
            $day = $now->copy()->subDays($d);
            if ($day->isWeekend()) {
                continue;
            }
            $date = $day->toDateString();

            foreach ($students as $i => $student) {
                // Deliberately deterministic so re-seeding is stable.
                $status = $d === 0
                    ? $statuses[($i * 7) % count($statuses)]
                    : $statuses[($i * 7 + $d) % count($statuses)];

                $rows[] = [
                    'school_id' => $schoolId,
                    'student_id' => $student->id,
                    'teacher_id' => null,
                    'user_id' => null,
                    'class_id' => $student->class_id,
                    'section_id' => $student->section_id,
                    'subject_id' => null,
                    'date' => $date,
                    'type' => 'Student',
                    'status' => $status,
                    'remarks' => $status === 'Absent' ? 'Unexcused absence' : null,
                    'marked_by' => null,
                    'created_at' => $day->copy()->setTime(8, 15),
                    'updated_at' => $day->copy()->setTime(8, 15),
                ];
            }

            foreach (array_values($teachers) as $i => $teacher) {
                $status = $d === 0
                    ? ($i % 5 === 3 ? 'Late' : 'Present')
                    : ['Present', 'Present', 'Late', 'Present', 'Absent'][(($i * 3) + $d) % 5];

                $rows[] = [
                    'school_id' => $schoolId,
                    'student_id' => null,
                    'teacher_id' => $teacher->id,
                    'user_id' => null,
                    'class_id' => null,
                    'section_id' => null,
                    'subject_id' => null,
                    'date' => $date,
                    'type' => 'Teacher',
                    'status' => $status,
                    'remarks' => null,
                    'marked_by' => null,
                    'created_at' => $day->copy()->setTime(8, 5),
                    'updated_at' => $day->copy()->setTime(8, 5),
                ];
            }
        }

        // Bulk insert() binds columns positionally, so every row in a chunk must
        // carry an identical key set in an identical order.
        $columns = [
            'school_id', 'student_id', 'teacher_id', 'user_id', 'class_id', 'section_id',
            'subject_id', 'date', 'type', 'status', 'remarks', 'marked_by',
            'created_at', 'updated_at',
        ];

        $rows = array_map(static function (array $row) use ($columns): array {
            $normalised = [];
            foreach ($columns as $column) {
                $normalised[$column] = $row[$column] ?? null;
            }

            return $normalised;
        }, $rows);

        foreach (array_chunk($rows, 400) as $chunk) {
            DB::table('attendances')->insert($chunk);
        }
    }

    private function timetable(int $schoolId, array $classes, array $subjects, array $teachers): void
    {
        // $classes is keyed by code upstream; integer indices drive the rotation below.
        $classes = array_values($classes);
        $subjectCodes = array_keys($subjects);
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $startTimes = ['08:00:00', '08:55:00', '09:50:00', '10:45:00', '11:55:00', '12:50:00'];
        $endTimes = ['08:50:00', '09:45:00', '10:40:00', '11:30:00', '12:45:00', '13:40:00'];
        $teacherEmails = array_keys($teachers);

        DB::table('timetables')->where('school_id', $schoolId)->delete();

        $rows = [];
        foreach ($classes as $ci => $class) {
            $sections = Section::where('class_id', $class->id)->get();

            foreach ($sections as $si => $section) {
                foreach ($days as $di => $day) {
                    for ($p = 0; $p < 6; $p++) {
                        $subjectCode = $subjectCodes[(($ci * 3) + $di + $p + $si) % count($subjectCodes)];
                        $teacherEmail = $teacherEmails[(($ci + $di + $p + $si) % count($teacherEmails))];

                        $rows[] = [
                            'school_id' => $schoolId,
                            'class_id' => $class->id,
                            'section_id' => $section->id,
                            'subject_id' => $subjects[$subjectCode]->id,
                            'teacher_id' => $teachers[$teacherEmail]->id,
                            'day_of_week' => $day,
                            'day' => $day,
                            'period' => $p + 1,
                            'type' => 'lecture',
                            'start_time' => $startTimes[$p],
                            'end_time' => $endTimes[$p],
                            'room_number' => $section->room_number,
                            'room' => $section->room_number,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }
        }

        foreach (array_chunk($rows, 300) as $chunk) {
            DB::table('timetables')->insert($chunk);
        }
    }

    private function fees(int $schoolId, array $students, array $classes, User $admin, AcademicYear $ay): void
    {
        $structures = [];
        foreach ($classes as $code => $class) {
            $level = (int) $class->numeric_level;
            $tuition = 9000 + $level * 400;

            $structures[$code] = FeeStructure::updateOrCreate(
                ['school_id' => $schoolId, 'class_id' => $class->id, 'name' => "Grade {$level} Monthly Tuition"],
                [
                    'academic_year_id' => $ay->id,
                    'academic_year' => $ay->name,
                    'amount' => $tuition,
                    'frequency' => 'Monthly',
                    'due_day' => 10,
                    'description' => 'Tuition, laboratory and library fees',
                    'status' => 'Active',
                    'is_active' => 1,
                ]
            );
        }

        $structures[$classes['G10']->code] = $structures['G10'];

        $months = [
            ['label' => 'August 2026', 'due' => '2026-08-10'],
            ['label' => 'September 2026', 'due' => '2026-09-10'],
            ['label' => 'October 2026', 'due' => '2026-10-10'],
        ];

        $invoices = [];
        $payments = [];
        $seq = 0;

        foreach ($students as $si => $student) {
            $classCode = collect($classes)->firstWhere('id', $student->class_id)?->code;
            if (! $classCode || ! isset($structures[$classCode])) {
                continue;
            }

            $structure = $structures[$classCode];

            foreach ($months as $mi => ['label' => $label, 'due' => $due]) {
                $seq++;
                $amount = (float) $structure->amount;
                $discount = $si % 10 === 0 ? round($amount * 0.1, 2) : 0.0;

                // Deterministic payment state mix.
                $bucket = ($si + $mi) % 10;
                [$paidAmount, $status] = match (true) {
                    $bucket < 5 => [$amount - $discount, 'Paid'],
                    $bucket < 7 => [round(($amount - $discount) / 2, 2), 'Partial'],
                    $bucket < 9 => [0.0, now()->toDateString() > $due ? 'Overdue' : 'Unpaid'],
                    default => [0.0, 'Unpaid'],
                };

                $invoice = FeeInvoice::updateOrCreate(
                    ['invoice_number' => 'INV-2026-'.str_pad((string) (5000 + $seq), 5, '0', STR_PAD_LEFT)],
                    [
                        'school_id' => $schoolId,
                        'student_id' => $student->id,
                        'fee_structure_id' => $structure->id,
                        'title' => $structure->name.' — '.$label,
                        'amount' => $amount,
                        'paid_amount' => $paidAmount,
                        'discount_amount' => $discount,
                        'fine_amount' => 0.00,
                        'due_date' => $due,
                        'status' => $status,
                        'month' => $label,
                        'notes' => null,
                    ]
                );

                $invoices[] = [$invoice, $paidAmount, $status];

                if ($paidAmount > 0) {
                    $payments[] = [
                        'school_id' => $schoolId,
                        'fee_invoice_id' => $invoice->id,
                        'student_id' => $student->id,
                        'transaction_id' => 'PAY-ST-'.str_pad((string) (7000 + $seq), 6, '0', STR_PAD_LEFT),
                        'receipt_no' => 'RCP-'.str_pad((string) (8000 + $seq), 6, '0', STR_PAD_LEFT),
                        'amount' => $paidAmount,
                        'payment_method' => ['Cash', 'Bank Transfer', 'Credit Card', 'Online Wallet', 'Cheque'][$seq % 5],
                        'payment_date' => now()->parse($due)->subDays(2)->toDateString(),
                        'status' => 'Completed',
                        'received_by' => $admin->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // fee_payments has no natural unique key beyond the PK, so rebuild the
        // tenant's payment rows from the invoices we just wrote.
        DB::table('fee_payments')->where('school_id', $schoolId)->delete();

        foreach (array_chunk($payments, 300) as $chunk) {
            DB::table('fee_payments')->insert($chunk);
        }

        $this->command?->info('  invoices: '.count($invoices).', payments: '.count($payments));
    }

    private function exams(int $schoolId, array $students, array $classes, $subjects, $teachers, AcademicYear $ay): void
    {
        // marks has no natural unique key beyond the PK, so rebuild results.
        DB::table('marks')->where('school_id', $schoolId)->delete();

        // $classes is keyed by code upstream; integer indices drive the rotation below.
        $classes = array_values($classes);

        $examDefs = [
            ['name' => 'First Term Examination 2026', 'term' => 'First Term', 'status' => 'Completed',
                'start' => '2026-07-20', 'end' => '2026-07-31', 'published' => true],
            ['name' => 'Mid-Term Examination 2026', 'term' => 'Mid-Term', 'status' => 'Upcoming',
                'start' => now()->addDays(12)->toDateString(), 'end' => now()->addDays(26)->toDateString(), 'published' => false],
            ['name' => 'Unit Test I 2026', 'term' => 'Unit Test', 'status' => 'Upcoming',
                'start' => now()->addDays(40)->toDateString(), 'end' => now()->addDays(42)->toDateString(), 'published' => false],
        ];

        $teacherEmails = array_keys($teachers);
        $marks = [];

        foreach ($examDefs as $ei => [
            'name' => $name,
            'term' => $term,
            'status' => $status,
            'start' => $start,
            'end' => $end,
            'published' => $published,
        ]) {
            $exam = Exam::updateOrCreate(
                ['school_id' => $schoolId, 'name' => $name],
                [
                    'academic_year_id' => $ay->id,
                    'term' => $term,
                    'start_date' => $start,
                    'end_date' => $end,
                    'description' => $term.' assessment for the 2026-2027 session',
                    'status' => $status,
                ]
            );

            $startDate = \Illuminate\Support\Carbon::parse($start);

            foreach ($classes as $ci => $class) {
                $sections = Section::where('class_id', $class->id)->get();

                foreach ($sections as $section) {
                    $subjectIds = $class->subjects()->pluck('subjects.id');

                    foreach ($subjectIds as $si => $subjectId) {
                        ExamSchedule::updateOrCreate(
                            [
                                'exam_id' => $exam->id,
                                'class_id' => $class->id,
                                'section_id' => $section->id,
                                'subject_id' => $subjectId,
                            ],
                            [
                                'date' => $startDate->copy()->addDays((int) floor($si / 2))->toDateString(),
                                'start_time' => '09:00:00',
                                'end_time' => '12:00:00',
                                'room_number' => $section->room_number,
                                'invigilator' => $teachers[$teacherEmails[($ci + $si) % count($teacherEmails)]]->full_name,
                                'max_marks' => 100,
                                'pass_marks' => 33,
                            ]
                        );

                        if (! $published) {
                            continue;
                        }

                        $classStudents = collect($students)->where('class_id', $class->id);

                        foreach ($classStudents as $si2 => $student) {
                            // Ability band derived from the student index keeps results
                            // deterministic while still spread across all grades.
                            $ability = (($si2 * 13) + ($ci * 7) + ($ei * 3)) % 100;
                            $total = 100.0;
                            $obtained = round($total * max(0.18, min(1.0, 0.32 + $ability / 145)), 2);
                            $scale = GradeScale::forPercentage(($obtained / $total) * 100);

                            $marks[] = [
                                'school_id' => $schoolId,
                                'exam_id' => $exam->id,
                                'student_id' => $student->id,
                                'subject_id' => $subjectId,
                                'class_id' => $class->id,
                                'marks_obtained' => $obtained,
                                'total_marks' => $total,
                                'coursework' => round($obtained * 0.3, 2),
                                'midterm' => round($obtained * 0.3, 2),
                                'final_exam' => round($obtained * 0.4, 2),
                                'total_score' => $obtained,
                                'max_score' => $total,
                                'grade' => $scale['grade'],
                                'gpa_point' => $scale['gpa_point'],
                                'remarks' => $obtained / $total >= 0.33 ? null : 'Below pass mark — re-sit advised',
                                'entered_by' => $teachers[$teacherEmails[($ci + $si) % count($teacherEmails)]]->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    }
                }
            }
        }

        foreach (array_chunk($marks, 300) as $chunk) {
            DB::table('marks')->insert($chunk);
        }

        $this->command?->info('  marks: '.count($marks));
    }

    private function assignments(int $schoolId, array $students, array $classes, $subjects, array $teachers): void
    {
        // $classes is keyed by code upstream; integer indices drive the rotation below.
        $classes = array_values($classes);

        $templates = [
            ['Quadratic Equations Problem Set', 'Complete exercises 4.1 to 4.6 from Chapter 4.', 'MATH101'],
            ['Optics Lab Report: Refraction', 'Write up the refraction experiment with error analysis.', 'PHY101'],
            ['Stoichiometry Worksheet', 'Balance and solve 15 chemical equations.', 'CHEM101'],
            ['Comparative Essay: Macbeth', 'Write a 1200-word comparative essay.', 'ENG101'],
            ['Binary Search Implementation', 'Implement binary search and analyse its complexity.', 'CS201'],
            ['Cell Division Diagrams', 'Label and explain all phases of mitosis.', 'BIO101'],
            ['Industrial Revolution Timeline', 'Build a sourced timeline with at least 10 events.', 'HIST101'],
            ['Elasticity Problem Set', 'Complete questions 5 to 12 on stress and strain.', 'PHY101'],
            ['Set Theory Exercises', 'Solve the Venn diagram problems in exercises 2.3.', 'MATH101'],
            ['Poetry Analysis Portfolio', 'Analyse two poems of your choosing.', 'ENG101'],
        ];

        $teacherEmails = array_keys($teachers);
        $submissions = [];
        $reviews = [];
        $seenReviews = [];

        foreach ($classes as $ci => $class) {
            $sections = Section::where('class_id', $class->id)->get();

            foreach ($templates as $ti => [$title, $description, $subjectCode]) {
                $teacherEmail = $teacherEmails[($ci + $ti) % count($teacherEmails)];
                $teacher = $teachers[$teacherEmail];

                $dueOffset = ($ti % 5) - 2; // range -2 .. +2
                $status = $ti % 6 === 0 ? 'Closed' : ($ti % 9 === 0 ? 'Draft' : 'Active');

                foreach ($sections as $section) {
                    $assignment = Assignment::updateOrCreate(
                        [
                            'school_id' => $schoolId,
                            'title' => $title.' — '.$class->code.' '.$section->name,
                        ],
                        [
                            'teacher_id' => $teacher->id,
                            'class_id' => $class->id,
                            'section_id' => $section->id,
                            'subject_id' => $subjects[$subjectCode]->id,
                            'description' => $description,
                            'due_date' => now()->addDays($dueOffset)->toDateString(),
                            'max_marks' => 50,
                            'max_score' => 50,
                            'status' => $status,
                        ]
                    );

                    if ($status === 'Draft') {
                        continue;
                    }

                    $classStudents = collect($students)->where('class_id', $class->id);

                    foreach ($classStudents as $si => $student) {
                        // Not everyone submits; pending ones stay ungraded.
                        $bucket = ($si * 5 + $ti) % 10;
                        if ($bucket === 7) {
                            continue;
                        }

                        $graded = $status === 'Closed' || $bucket < 6;
                        $obtained = $graded ? round(50 * max(0.2, min(1, 0.35 + (($si * 11 + $ti * 5) % 60) / 100)), 2) : null;

                        $submissions[] = [
                            'assignment_id' => $assignment->id,
                            'student_id' => $student->id,
                            'content' => 'Submitted work attached. Total pages: '.($ti + 2).'.',
                            'file_url' => null,
                            'attachment' => null,
                            'marks_obtained' => $obtained,
                            'obtained_score' => $obtained,
                            'feedback' => $graded ? ($obtained >= 40 ? 'Excellent work — keep it up.' : 'Correct approach, review the marking scheme.') : null,
                            'status' => $graded ? 'Graded' : 'Submitted',
                            'submitted_at' => now()->addDays($dueOffset - 2)->setTime(20, 30),
                            'graded_at' => $graded ? now()->addDays($dueOffset - 1)->setTime(9, 0) : null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];

                        // A student may face the same teacher across several
                        // templates, but student_reviews is unique per
                        // (teacher, student) — so only keep the first one.
                        $reviewKey = $teacher->id.'|'.$student->id;

                        if ($bucket === 3 && $student->status === 'Active' && ! isset($seenReviews[$reviewKey])) {
                            $seenReviews[$reviewKey] = true;

                            $ratings = ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'];
                            $reviews[] = [
                                'school_id' => $schoolId,
                                'teacher_id' => $teacher->id,
                                'student_id' => $student->id,
                                'rating' => $ratings[($si + $ti) % 4],
                                'remarks' => 'Consistent effort and good classroom participation this term.',
                                'strengths' => json_encode(['Punctuality', 'Homework completion', 'Class participation']),
                                'created_at' => now()->subDays(10 + $ti),
                                'updated_at' => now()->subDays(10 + $ti),
                            ];
                        }
                    }
                }
            }
        }

        foreach (array_chunk($submissions, 250) as $chunk) {
            DB::table('assignment_submissions')->upsert(
                $chunk,
                ['assignment_id', 'student_id'],
                ['marks_obtained', 'obtained_score', 'feedback', 'status', 'graded_at', 'updated_at']
            );
        }

        foreach (array_chunk($reviews, 200) as $chunk) {
            DB::table('student_reviews')->upsert(
                $chunk,
                ['teacher_id', 'student_id'],
                ['rating', 'remarks', 'strengths', 'updated_at']
            );
        }

        $this->command?->info('  submissions: '.count($submissions).', reviews: '.count($reviews));
    }

    private function diaries(int $schoolId, array $classes, $subjects, array $teachers): void
    {
        // diaries has no natural unique key beyond the PK, so rebuild the term.
        DB::table('diaries')->where('school_id', $schoolId)->delete();

        // $classes is keyed by code upstream; integer indices drive the rotation below.
        $classes = array_values($classes);

        $tasks = [
            ['Homework', 'Complete exercises 3.2 to 3.5 and bring the textbook to class.'],
            ['Exam Prep', 'Revise the Laws of Motion summary sheet before the unit test.'],
            ['Notice', 'Bring a printed copy of the lab safety acknowledgement form.'],
            ['Homework', 'Write a 300-word summary of the lesson and solve the worksheet.'],
            ['Exam Prep', 'Practice the ten past-paper questions circulated today.'],
            ['Notice', 'Parent-teacher meeting this week — bring your progress report.'],
            ['Homework', 'Complete the lab observations table and submit online.'],
        ];

        $teacherEmails = array_keys($teachers);
        $rows = [];

        foreach ($classes as $ci => $class) {
            $sections = Section::where('class_id', $class->id)->get();
            $subjectCodes = array_keys($subjects);

            foreach (range(0, 9) as $back) {
                $day = now()->subDays($back);
                if ($day->isWeekend()) {
                    continue;
                }
                $dayName = $day->format('l');

                foreach ($sections as $si => $section) {
                    $subjectCode = $subjectCodes[($ci + $si + $back) % count($subjectCodes)];
                    $teacherEmail = $teacherEmails[($ci + $si + $back) % count($teacherEmails)];
                    [$type, $task] = $tasks[($ci + $si + $back) % count($tasks)];

                    $rows[] = [
                        'school_id' => $schoolId,
                        'teacher_id' => $teachers[$teacherEmail]->id,
                        'class_id' => $class->id,
                        'section_id' => $section->id,
                        'subject_id' => $subjects[$subjectCode]->id,
                        'date' => $day->toDateString(),
                        'task' => $task,
                        'notes' => 'Covered lesson '.(1 + (($ci + $back) % 12)).' of the syllabus.',
                        'completed' => $back > 2 ? 1 : 0,
                        'parent_acknowledged_at' => $back > 4 ? $day->copy()->setTime(21, 0) : null,
                        'type' => $type,
                        'created_at' => $day->copy()->setTime(7, 55),
                        'updated_at' => $day->copy()->setTime(7, 55),
                    ];
                }
            }
        }

        foreach (array_chunk($rows, 250) as $chunk) {
            DB::table('diaries')->insert($chunk);
        }

        $this->command?->info('  diaries: '.count($rows));
    }

    private function announcements(int $schoolId, User $admin, array $classes): void
    {
        $defs = [
            ['Annual Science & Technology Fair 2026', 'All',
                'Registration is now open for all science projects. Final submissions close at the end of the month.',
                'Academic', 'High', 1, now()->subDays(6)->toDateString()],
            ['Parent–Teacher Meeting Schedule', 'Parents',
                'Individual meeting slots have been published on the notice board. Please confirm your slot with the class teacher.',
                'General', 'Medium', 1, now()->subDays(3)->toDateString()],
            ['Mid-Term Examination Timetable', 'Students',
                'The mid-term examination timetable is now available in the examinations section. Examinations begin in two weeks.',
                'Examination', 'High', 1, now()->subDay()->toDateString()],
            ['Staff Development Workshop', 'Teachers',
                'A pedagogy workshop on formative assessment runs this Friday afternoon in the seminar room.',
                'Training', 'Medium', 0, now()->subDays(2)->toDateString()],
            ['Library Week Extended Hours', 'All',
                'The library will remain open until 6pm for the duration of Library Week.',
                'General', 'Low', 0, now()->subDays(14)->toDateString()],
            ['Inter-House Sports Results', 'All',
                'Results from the inter-house athletics meet are posted on the sports notice board.',
                'Sports', 'Low', 0, now()->subDays(20)->toDateString()],
        ];

        foreach ($defs as [$title, $audience, $content, $category, $priority, $pinned, $publishDate]) {
            Announcement::updateOrCreate(
                ['school_id' => $schoolId, 'title' => $title],
                [
                    'content' => $content,
                    'description' => $content,
                    'publish_date' => $publishDate,
                    'date' => $publishDate,
                    'expiry_date' => now()->addMonths(2)->toDateString(),
                    'status' => 'Published',
                    'priority' => $priority,
                    'pinned' => $pinned,
                    'category' => $category,
                    'target_audience' => $audience,
                    'is_published' => 1,
                    'created_by' => $admin->id,
                ]
            );
        }
    }

    private function events(int $schoolId, User $admin): void
    {
        $defs = [
            ['Annual Sports Day', now()->subDays(12)->toDateString(), '08:00:00', '16:00:00', 'Main Sports Ground', 'Sports', '#22c55e', 'All', 'Completed'],
            ['Science & Technology Fair', now()->addDays(18)->toDateString(), '09:00:00', '17:00:00', 'Exhibition Hall', 'Academic', '#3b82f6', 'All', 'Upcoming'],
            ['Parent–Teacher Meeting', now()->addDays(6)->toDateString(), '15:00:00', '18:00:00', 'Respective classrooms', 'Meeting', '#f59e0b', 'Parents', 'Upcoming'],
            ['Mid-Term Examinations Begin', now()->addDays(12)->toDateString(), '09:00:00', '13:00:00', 'Examination Halls', 'Examination', '#ef4444', 'Students', 'Upcoming'],
            ['Staff Training Day', now()->addDays(32)->toDateString(), '09:00:00', '16:00:00', 'Seminar Room', 'Training', '#8b5cf6', 'Teachers', 'Upcoming'],
            ["Founder's Day Assembly", now()->addDays(45)->toDateString(), '08:30:00', '09:30:00', 'Main Auditorium', 'Ceremony', '#6366f1', 'All', 'Upcoming'],
        ];

        foreach ($defs as [$title, $startDate, $startTime, $endTime, $location, $type, $color, $audience, $status]) {
            Event::updateOrCreate(
                ['school_id' => $schoolId, 'title' => $title],
                [
                    'description' => $title.' — organised by the school administration.',
                    'start_date' => $startDate,
                    'end_date' => $startDate,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'location' => $location,
                    'event_type' => $type,
                    'color' => $color,
                    'audience' => $audience,
                    'status' => $status,
                    'is_published' => 1,
                    'created_by' => $admin->id,
                ]
            );
        }
    }

    private function leaves(int $schoolId, array $students, User $admin): void
    {
        DB::table('student_leaves')->where('school_id', $schoolId)->delete();

        $defs = [
            ['Sick Leave', 2, 'Medical appointment and recovery at home.', 'Approved'],
            ['Casual Leave', 1, 'Family function out of town.', 'Approved'],
            ['Medical Leave', 5, 'Recovering from a viral infection; doctor advised rest.', 'Pending'],
            ['Casual Leave', 1, 'Attending a relative\'s wedding ceremony.', 'Pending'],
            ['Emergency Leave', 3, 'Domestic emergency at home.', 'Rejected'],
        ];

        $rows = [];

        foreach ($defs as $i => [$type, $days, $reason, $status]) {
            $student = $students[$i * 5] ?? null;
            if (! $student) {
                continue;
            }

            $from = now()->subDays(20 - $i * 3)->toDateString();

            $rows[] = [
                'school_id' => $schoolId,
                'student_id' => $student->id,
                'class_id' => $student->class_id,
                'leave_type' => $type,
                'from_date' => $from,
                'to_date' => now()->parse($from)->addDays($days - 1)->toDateString(),
                'reason' => $reason,
                'status' => $status,
                'remarks' => $status === 'Rejected' ? 'Insufficient notice provided.' : null,
                'reviewed_by' => $status === 'Pending' ? null : $admin->id,
                'reviewed_at' => $status === 'Pending' ? null : now()->parse($from)->subDay()->setTime(10, 0),
                'created_at' => now()->parse($from)->subDays(2),
                'updated_at' => now()->parse($from)->subDay(),
            ];
        }

        foreach ($rows as $row) {
            DB::table('student_leaves')->insert($row);
        }
    }

    private function greenwoodNotifications(int $schoolId, User $admin, array $teachers, User $studentUser, User $parentUser, Student $student): void
    {
        $teacherUser = User::where('email', 'teacher@greenwood.com')->first();

        $adminNotices = [
            ['Fee collection below target', 'Only 68% of October invoices have been settled. Review the outstanding list.', 'fees', '/admin-dashboard/fees', null],
            ['New support ticket raised', 'Apex Academy reported that the fee invoice CSV export returns an empty file.', 'support', '/admin-dashboard/notices', now()->subHours(5)],
            ['Leave request awaiting approval', 'A student leave request is pending your review.', 'approval', '/admin-dashboard/students', null],
        ];
        foreach ($adminNotices as [$title, $message, $type, $link, $readAt]) {
            $this->notify($admin, ['title' => $title, 'message' => $message, 'type' => $type, 'link' => $link], $readAt);
        }

        $teacherNotices = [
            ['11 assignments awaiting grading', 'Your students have submitted work that still needs marks.', 'grading', '/teacher-dashboard/assignments', null],
            ['Mid-term exam timetable published', 'Invigilation duties for the mid-term have been assigned to you.', 'exam', '/teacher-dashboard/exams', now()->subDays(1)],
            ['Diary entry acknowledged', 'Section A parents acknowledged yesterday\'s homework entry.', 'diary', '/teacher-dashboard/diaries', null],
        ];
        foreach ($teacherNotices as [$title, $message, $type, $link, $readAt]) {
            $this->notify($teacherUser, ['title' => $title, 'message' => $message, 'type' => $type, 'link' => $link], $readAt);
        }

        $studentNotices = [
            ['New assignment posted', 'Quadratic Equations Problem Set has been posted for Mathematics.', 'assignment', '/student-dashboard/assignments', null],
            ['Fee invoice due', 'Your October tuition invoice is due on the 10th.', 'fees', '/student-dashboard/fees', null],
            ['Science fair registration open', 'Register your project before the end of the month.', 'event', '/student-dashboard', now()->subDays(2)],
            ['First term results published', 'Your First Term Examination results are now available.', 'grades', '/student-dashboard/grades', now()->subDays(4)],
        ];
        foreach ($studentNotices as [$title, $message, $type, $link, $readAt]) {
            $this->notify($studentUser, ['title' => $title, 'message' => $message, 'type' => $type, 'link' => $link], $readAt);
        }

        $parentNotices = [
            ['Attendance alert', 'Your child was marked absent today. Please contact the class teacher if this is unexpected.', 'attendance', '/student-dashboard/attendance', null],
            ['New fee invoice', 'A new tuition invoice has been issued for the current month.', 'fees', '/student-dashboard/fees', null],
            ['Parent–teacher meeting', 'Meeting slots are now open for booking.', 'meeting', '/student-dashboard', now()->subDays(1)],
        ];
        foreach ($parentNotices as [$title, $message, $type, $link, $readAt]) {
            $this->notify($parentUser, ['title' => $title, 'message' => $message, 'type' => $type, 'link' => $link], $readAt);
        }
    }

    // ═══════════════════════════ Apex Academy ═══════════════════════════

    private function apex(School $school): void
    {
        $schoolId = $school->id;

        $ay = AcademicYear::updateOrCreate(
            ['school_id' => $schoolId, 'name' => '2026-2027'],
            ['start_date' => '2026-04-01', 'end_date' => '2027-03-31', 'is_current' => true, 'is_active' => true]
        );

        $admin = $this->user('admin@apexacademy.com', 'Daniel Whitfield', 'school_admin', $schoolId, '+92 300 5551234');

        $class = SchoolClass::updateOrCreate(
            ['school_id' => $schoolId, 'code' => 'SCI-11'],
            [
                'academic_year_id' => $ay->id,
                'name' => 'Grade 11 Science',
                'numeric_level' => 11,
                'section' => 'A',
                'capacity' => 30,
                'description' => 'Pre-medical science stream',
                'status' => 'Active',
            ]
        );

        $section = Section::updateOrCreate(
            ['school_id' => $schoolId, 'class_id' => $class->id, 'name' => 'Section A'],
            ['capacity' => 30, 'room_number' => 'S11']
        );

        $subjects = [];
        foreach ([['PHY201', 'Physics', 4.0], ['CHEM201', 'Chemistry', 4.0], ['MATH201', 'Mathematics', 4.0], ['ENG201', 'English', 3.0]] as [$code, $name, $credits]) {
            $subjects[$code] = Subject::updateOrCreate(
                ['school_id' => $schoolId, 'code' => $code],
                ['name' => $name, 'type' => 'Theory', 'credits' => $credits, 'pass_marks' => 33, 'total_marks' => 100, 'status' => 'Active']
            );
        }
        $class->subjects()->syncWithoutDetaching(collect($subjects)->pluck('id'));

        $teacherEmails = ['laura@apexacademy.com', 'raj@apexacademy.com'];
        $teacherDefs = [
            ['laura@apexacademy.com', 'Laura', 'Hansen', 'APX-EMP-01', 'Physics Teacher', 'Science', 7, 'Female', 98000, ['PHY201']],
            ['raj@apexacademy.com', 'Raj', 'Malhotra', 'APX-EMP-02', 'Mathematics Teacher', 'Mathematics', 9, 'Male', 105000, ['MATH201', 'CHEM201']],
        ];

        $teachers = [];
        foreach ($teacherDefs as $i => [$email, $first, $last, $empId, $designation, $dept, $years, $gender, $salary, $codes]) {
            $user = $this->user($email, "{$first} {$last}", 'teacher', $schoolId);
            $teachers[$email] = Teacher::updateOrCreate(
                ['school_id' => $schoolId, 'employee_id' => $empId],
                [
                    'user_id' => $user->id,
                    'first_name' => $first,
                    'last_name' => $last,
                    'designation' => $designation,
                    'department' => $dept,
                    'joining_date' => now()->subYears($years)->startOfYear()->toDateString(),
                    'experience_years' => $years,
                    'gender' => $gender,
                    'qualification' => 'M.Sc '.$dept,
                    'salary' => $salary,
                    'salary_status' => 'Paid',
                    'status' => 'Active',
                ]
            );
            $teachers[$email]->subjects()->syncWithoutDetaching(array_map(fn ($c) => $subjects[$c]->id, $codes));
        }

        $studentNames = [
            ['Hannah', 'Cole'], ['Marcus', 'Reed'], ['Aisha', 'Bakr'], ['Tom', 'Whitaker'],
            ['Sara', 'Lindqvist'], ['Ibrahim', 'Syed'], ['Nora', 'Feldman'], ['Dev', 'Patel'],
            ['Lena', 'Novak'], ['Omar', 'Farouk'],
        ];

        $students = [];
        foreach ($studentNames as $i => [$fn, $ln]) {
            $roll = '110'.($i + 1);
            $user = $this->user('student.'.$ln.'.'.$roll.'@apexacademy.edu.pk', "{$fn} {$ln}", 'student', $schoolId);

            $students[] = Student::updateOrCreate(
                ['school_id' => $schoolId, 'admission_number' => 'ADM-A11-'.str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT)],
                [
                    'user_id' => $user->id,
                    'student_id' => 'STU-'.$roll,
                    'roll_number' => $roll,
                    'roll_no' => $roll,
                    'first_name' => $fn,
                    'last_name' => $ln,
                    'class_id' => $class->id,
                    'section_id' => $section->id,
                    'dob' => now()->subYears(16 + ($i % 2))->subDays($i)->toDateString(),
                    'date_of_birth' => now()->subYears(16 + ($i % 2))->subDays($i)->toDateString(),
                    'gender' => $i % 2 === 0 ? 'Female' : 'Male',
                    'blood_group' => ['A+', 'O+', 'B+'][$i % 3],
                    'address' => (20 + $i).' Gulberg, '.$school->city,
                    'city' => $school->city,
                    'state' => $school->state,
                    'admission_date' => $ay->start_date,
                    'status' => 'Active',
                ]
            );
        }

        $this->attendance($schoolId, $students, ['SCI-11' => $class], $teachers);

        // A small set of invoices so the Apex fee screens are not empty.
        $structure = FeeStructure::updateOrCreate(
            ['school_id' => $schoolId, 'class_id' => $class->id, 'name' => 'Grade 11 Science Tuition'],
            [
                'academic_year_id' => $ay->id,
                'academic_year' => $ay->name,
                'amount' => 12500,
                'frequency' => 'Monthly',
                'due_day' => 10,
                'description' => 'Tuition and laboratory fees',
                'status' => 'Active',
                'is_active' => 1,
            ]
        );

        foreach ($students as $i => $student) {
            $paid = $i % 3 === 0 ? 0.0 : 12500.0;
            $invoice = FeeInvoice::updateOrCreate(
                ['invoice_number' => 'INV-APX-'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT)],
                [
                    'school_id' => $schoolId,
                    'student_id' => $student->id,
                    'fee_structure_id' => $structure->id,
                    'title' => 'Grade 11 Science Tuition — September 2026',
                    'amount' => 12500,
                    'paid_amount' => $paid,
                    'due_date' => '2026-09-10',
                    'status' => $paid > 0 ? 'Paid' : 'Overdue',
                    'month' => 'September 2026',
                ]
            );

            if ($paid > 0) {
                FeePayment::updateOrCreate(
                    ['transaction_id' => 'PAY-APX-'.str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT)],
                    [
                        'school_id' => $schoolId,
                        'fee_invoice_id' => $invoice->id,
                        'student_id' => $student->id,
                        'amount' => $paid,
                        'payment_method' => 'Bank Transfer',
                        'payment_date' => '2026-09-05',
                        'status' => 'Completed',
                        'received_by' => $admin->id,
                    ]
                );
            }
        }

        $exam = Exam::updateOrCreate(
            ['school_id' => $schoolId, 'name' => 'First Term Examination 2026'],
            [
                'academic_year_id' => $ay->id,
                'term' => 'First Term',
                'start_date' => '2026-07-15',
                'end_date' => '2026-07-25',
                'status' => 'Completed',
            ]
        );

        foreach ($subjects as $subject) {
            ExamSchedule::updateOrCreate(
                ['exam_id' => $exam->id, 'class_id' => $class->id, 'section_id' => $section->id, 'subject_id' => $subject->id],
                [
                    'date' => '2026-07-16',
                    'start_time' => '09:00:00',
                    'end_time' => '12:00:00',
                    'room_number' => 'S11',
                    'max_marks' => 100,
                    'pass_marks' => 33,
                ]
            );

            foreach ($students as $i => $student) {
                $obtained = round(100 * (0.4 + (($i * 9) % 55) / 100), 2);
                $scale = GradeScale::forPercentage($obtained);

                Mark::updateOrCreate(
                    ['school_id' => $schoolId, 'exam_id' => $exam->id, 'student_id' => $student->id, 'subject_id' => $subject->id],
                    [
                        'class_id' => $class->id,
                        'marks_obtained' => $obtained,
                        'total_marks' => 100,
                        'coursework' => round($obtained * 0.3, 2),
                        'midterm' => round($obtained * 0.3, 2),
                        'final_exam' => round($obtained * 0.4, 2),
                        'total_score' => $obtained,
                        'max_score' => 100,
                        'grade' => $scale['grade'],
                        'gpa_point' => $scale['gpa_point'],
                        'entered_by' => $teachers[$i % 2 === 0 ? 'laura@apexacademy.com' : 'raj@apexacademy.com']->id,
                    ]
                );
            }
        }

        Announcement::updateOrCreate(
            ['school_id' => $schoolId, 'title' => 'Laboratory Safety Refresher'],
            [
                'content' => 'All Grade 11 students must attend the laboratory safety briefing before the next practical session.',
                'publish_date' => now()->subDays(4)->toDateString(),
                'date' => now()->subDays(4)->toDateString(),
                'status' => 'Published',
                'priority' => 'High',
                'pinned' => 1,
                'category' => 'Academic',
                'target_audience' => 'Students',
                'is_published' => 1,
                'created_by' => $admin->id,
            ]
        );

        $this->notify($admin, [
            'title' => 'Fee invoice export issue',
            'message' => 'Support ticket TCK-8802 reports an empty CSV export from the fees module.',
            'type' => 'support',
            'link' => '/admin-dashboard/notices',
        ]);
    }
}