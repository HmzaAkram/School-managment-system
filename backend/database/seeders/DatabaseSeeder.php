<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Attendance;
use App\Models\Diary;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\Expense;
use App\Models\FeeInvoice;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\LedgerEntry;
use App\Models\Mark;
use App\Models\ParentModel;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\SchoolContract;
use App\Models\SchoolPayment;
use App\Models\Section;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SupportTicket;
use App\Models\Teacher;
use App\Models\Timetable;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Admin User
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@skoolms.com'],
            [
                'name' => 'Platform Super Admin',
                'password' => Hash::make('password123'),
                'role' => 'super_admin',
                'status' => 'Active',
            ]
        );

        // 2. Demo Schools
        $greenwood = School::updateOrCreate(
            ['code' => 'GIS-001'],
            [
                'name' => 'Greenwood International School',
                'domain' => 'greenwood.skoolms.com',
                'address' => '123 Education Lane, Sector 4',
                'city' => 'New York',
                'state' => 'NY',
                'phone' => '+1 555-0199',
                'email' => 'info@greenwood.edu',
                'principal_name' => 'Dr. Eleanor Vance',
                'status' => 'Active',
                'subscription_status' => 'Active',
                'plan' => 'Premium',
                'contract_amount' => 12000.00,
                'contract_start' => '2026-01-01',
                'contract_end' => '2026-12-31',
                'contract_type' => 'Annual',
                'paid_amount' => 12000.00,
                'pending_amount' => 0.00,
            ]
        );

        $apex = School::updateOrCreate(
            ['code' => 'AAS-002'],
            [
                'name' => 'Apex Academy of Science',
                'domain' => 'apex.skoolms.com',
                'address' => '45 Tech Boulevard',
                'city' => 'Boston',
                'state' => 'MA',
                'phone' => '+1 555-0288',
                'email' => 'contact@apexacademy.edu',
                'principal_name' => 'Prof. Robert Langdon',
                'status' => 'Active',
                'subscription_status' => 'Active',
                'plan' => 'Standard',
                'contract_amount' => 8500.00,
                'contract_start' => '2026-01-01',
                'contract_end' => '2026-12-31',
                'contract_type' => 'Annual',
                'paid_amount' => 4250.00,
                'pending_amount' => 4250.00,
            ]
        );

        // 3. School Contracts & Payments (Super Admin revenue)
        $contract1 = SchoolContract::updateOrCreate(
            ['contract_number' => 'CNT-2026-001'],
            [
                'school_id' => $greenwood->id,
                'plan_name' => 'Premium Plan',
                'total_amount' => 12000.00,
                'paid_amount' => 12000.00,
                'balance_due' => 0.00,
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'status' => 'Active',
                'billing_cycle' => 'Annually',
            ]
        );

        $payment1 = SchoolPayment::updateOrCreate(
            ['transaction_id' => 'TXN-998811'],
            [
                'school_id' => $greenwood->id,
                'contract_id' => $contract1->id,
                'amount' => 12000.00,
                'payment_date' => '2026-01-05',
                'payment_method' => 'Bank Transfer',
                'status' => 'Completed',
            ]
        );

        LedgerEntry::firstOrCreate(
            [
                'reference_type' => 'SchoolPayment',
                'reference_id' => $payment1->id,
                'type' => 'Credit',
            ],
            [
                'school_id' => $greenwood->id,
                'entry_date' => '2026-01-05',
                'category' => 'Annual Subscription',
                'description' => 'Greenwood International Annual Subscription Payment',
                'debit' => 0.00,
                'credit' => 12000.00,
                'balance' => 12000.00,
            ]
        );

        // 4. Academic Year for Greenwood
        $ay = AcademicYear::updateOrCreate(
            ['school_id' => $greenwood->id, 'name' => '2026-2027 Academic Session'],
            [
                'start_date' => '2026-04-01',
                'end_date' => '2027-03-31',
                'is_current' => true,
            ]
        );

        // 5. School Admin User for Greenwood
        $schoolAdmin = User::updateOrCreate(
            ['email' => 'admin@greenwood.com'],
            [
                'name' => 'Arthur Pendelton (Admin)',
                'password' => Hash::make('password123'),
                'role' => 'school_admin',
                'school_id' => $greenwood->id,
                'phone' => '+1 555-9001',
                'status' => 'Active',
            ]
        );

        // 6. Classes & Sections
        $class10 = SchoolClass::updateOrCreate(
            ['school_id' => $greenwood->id, 'code' => 'G10'],
            [
                'name' => 'Grade 10',
                'numeric_level' => 10,
                'description' => 'Senior Secondary Grade 10',
            ]
        );

        $class9 = SchoolClass::updateOrCreate(
            ['school_id' => $greenwood->id, 'code' => 'G9'],
            [
                'name' => 'Grade 9',
                'numeric_level' => 9,
                'description' => 'Secondary Grade 9',
            ]
        );

        $sectionA = Section::firstOrCreate(
            ['school_id' => $greenwood->id, 'class_id' => $class10->id, 'name' => 'Section A'],
            ['capacity' => 35, 'room_number' => 'Room 101']
        );

        $sectionB = Section::firstOrCreate(
            ['school_id' => $greenwood->id, 'class_id' => $class10->id, 'name' => 'Section B'],
            ['capacity' => 35, 'room_number' => 'Room 102']
        );

        // 7. Subjects
        $math = Subject::updateOrCreate(
            ['school_id' => $greenwood->id, 'code' => 'MATH101'],
            ['name' => 'Mathematics', 'type' => 'Theory', 'pass_marks' => 33, 'total_marks' => 100]
        );

        $physics = Subject::updateOrCreate(
            ['school_id' => $greenwood->id, 'code' => 'PHY101'],
            ['name' => 'Physics', 'type' => 'Both', 'pass_marks' => 33, 'total_marks' => 100]
        );

        $english = Subject::updateOrCreate(
            ['school_id' => $greenwood->id, 'code' => 'ENG101'],
            ['name' => 'English Literature', 'type' => 'Theory', 'pass_marks' => 33, 'total_marks' => 100]
        );

        $class10->subjects()->syncWithoutDetaching([$math->id, $physics->id, $english->id]);

        // 8. Teachers
        $teacherUser = User::updateOrCreate(
            ['email' => 'teacher@greenwood.com'],
            [
                'name' => 'Prof. Sarah Jenkins',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
                'school_id' => $greenwood->id,
                'phone' => '+1 555-8822',
                'status' => 'Active',
            ]
        );

        $teacherProfile = Teacher::updateOrCreate(
            ['school_id' => $greenwood->id, 'employee_id' => 'EMP-2026-01'],
            [
                'user_id' => $teacherUser->id,
                'first_name' => 'Sarah',
                'last_name' => 'Jenkins',
                'gender' => 'Female',
                'dob' => '1988-05-14',
                'qualification' => 'M.Sc Mathematics, B.Ed',
                'experience_years' => 8,
                'joining_date' => '2020-08-01',
                'designation' => 'Senior Mathematics Teacher',
                'department' => 'Science & Mathematics',
                'salary' => 4500.00,
                'status' => 'Active',
            ]
        );

        $teacherProfile->subjects()->syncWithoutDetaching([$math->id, $physics->id]);

        // 9. Student & Parent
        $studentUser = User::updateOrCreate(
            ['email' => 'student@greenwood.com'],
            [
                'name' => 'Alexander Wright',
                'password' => Hash::make('password123'),
                'role' => 'student',
                'school_id' => $greenwood->id,
                'phone' => '+1 555-3344',
                'status' => 'Active',
            ]
        );

        $studentProfile = Student::updateOrCreate(
            ['school_id' => $greenwood->id, 'admission_number' => 'ADM-2026-001'],
            [
                'user_id' => $studentUser->id,
                'roll_number' => '1001',
                'first_name' => 'Alexander',
                'last_name' => 'Wright',
                'gender' => 'Male',
                'dob' => '2010-03-22',
                'blood_group' => 'O+',
                'address' => '742 Evergreen Terrace',
                'city' => 'New York',
                'state' => 'NY',
                'admission_date' => '2024-04-10',
                'class_id' => $class10->id,
                'section_id' => $sectionA->id,
                'status' => 'Active',
            ]
        );

        $parentUser = User::updateOrCreate(
            ['email' => 'parent@greenwood.com'],
            [
                'name' => 'David Wright',
                'password' => Hash::make('password123'),
                'role' => 'parent',
                'school_id' => $greenwood->id,
                'phone' => '+1 555-7788',
                'status' => 'Active',
            ]
        );

        $parentProfile = ParentModel::firstOrCreate(
            ['user_id' => $parentUser->id],
            [
                'school_id' => $greenwood->id,
                'father_name' => 'David Wright',
                'mother_name' => 'Catherine Wright',
                'occupation' => 'Software Engineer',
                'income' => 120000.00,
                'alternate_phone' => '+1 555-7788',
            ]
        );

        $studentProfile->parents()->syncWithoutDetaching([
            $parentProfile->id => ['relationship' => 'Father', 'is_primary' => true],
        ]);

        // 10. Fee Structure, Invoices & Payments
        $feeStructure = FeeStructure::firstOrCreate(
            ['school_id' => $greenwood->id, 'class_id' => $class10->id, 'name' => 'Grade 10 Monthly Tuition Fee'],
            [
                'amount' => 550.00,
                'frequency' => 'Monthly',
                'due_day' => 10,
                'description' => 'Tuition, Lab and Library fees included',
                'status' => 'Active',
            ]
        );

        $invoice = FeeInvoice::updateOrCreate(
            ['invoice_number' => 'INV-2026-101'],
            [
                'school_id' => $greenwood->id,
                'student_id' => $studentProfile->id,
                'fee_structure_id' => $feeStructure->id,
                'title' => 'Grade 10 Monthly Tuition Fee - October 2026',
                'amount' => 550.00,
                'paid_amount' => 550.00,
                'discount_amount' => 0.00,
                'fine_amount' => 0.00,
                'due_date' => '2026-10-10',
                'status' => 'Paid',
                'month' => 'October 2026',
            ]
        );

        FeePayment::updateOrCreate(
            ['transaction_id' => 'PAY-ST-9912'],
            [
                'school_id' => $greenwood->id,
                'fee_invoice_id' => $invoice->id,
                'student_id' => $studentProfile->id,
                'amount' => 550.00,
                'payment_method' => 'Credit Card',
                'payment_date' => '2026-10-02',
                'status' => 'Completed',
                'received_by' => $schoolAdmin->id,
            ]
        );

        // 11. Attendance
        Attendance::updateOrCreate(
            [
                'school_id' => $greenwood->id,
                'student_id' => $studentProfile->id,
                'date' => now()->format('Y-m-d'),
                'type' => 'Student',
            ],
            [
                'class_id' => $class10->id,
                'section_id' => $sectionA->id,
                'status' => 'Present',
            ]
        );

        // 12. Exams & Marks
        $midterm = Exam::firstOrCreate(
            ['school_id' => $greenwood->id, 'name' => 'Mid-Term Examination 2026'],
            [
                'academic_year_id' => $ay->id,
                'term' => 'Mid-Term',
                'start_date' => '2026-11-01',
                'end_date' => '2026-11-15',
                'status' => 'Upcoming',
            ]
        );

        ExamSchedule::firstOrCreate(
            ['exam_id' => $midterm->id, 'class_id' => $class10->id, 'subject_id' => $math->id],
            [
                'date' => '2026-11-02',
                'start_time' => '09:00:00',
                'end_time' => '12:00:00',
                'room_number' => 'Hall A',
                'max_marks' => 100,
                'pass_marks' => 33,
            ]
        );

        Mark::firstOrCreate(
            [
                'school_id' => $greenwood->id,
                'exam_id' => $midterm->id,
                'student_id' => $studentProfile->id,
                'subject_id' => $math->id,
            ],
            [
                'marks_obtained' => 92.5,
                'total_marks' => 100,
                'grade' => 'A+',
                'remarks' => 'Excellent problem solving skills',
                'entered_by' => $teacherProfile->id,
            ]
        );

        // 13. Assignments & Submissions
        $assignment = Assignment::firstOrCreate(
            ['school_id' => $greenwood->id, 'title' => 'Quadratic Equations & Polynomials Problem Set'],
            [
                'teacher_id' => $teacherProfile->id,
                'class_id' => $class10->id,
                'section_id' => $sectionA->id,
                'subject_id' => $math->id,
                'description' => 'Complete problems 1 through 20 from Chapter 4 of the textbook.',
                'due_date' => '2026-10-15',
                'max_marks' => 50,
                'status' => 'Active',
            ]
        );

        AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $studentProfile->id],
            [
                'submitted_at' => now()->subDay(),
                'content' => 'Completed all 20 problems on separate sheets.',
                'marks_obtained' => 48.0,
                'feedback' => 'Great neat work!',
                'status' => 'Graded',
            ]
        );

        // 14. Daily Diary
        Diary::firstOrCreate(
            [
                'school_id' => $greenwood->id,
                'class_id' => $class10->id,
                'section_id' => $sectionA->id,
                'subject_id' => $math->id,
                'date' => now()->format('Y-m-d'),
            ],
            [
                'teacher_id' => $teacherProfile->id,
                'task' => 'Review Chapter 4 section 4.2 formulas and solve exercise 4B.',
                'notes' => 'Quiz scheduled for Friday.',
            ]
        );

        // 15. Timetable
        Timetable::firstOrCreate(
            [
                'school_id' => $greenwood->id,
                'class_id' => $class10->id,
                'section_id' => $sectionA->id,
                'day_of_week' => 'Monday',
                'start_time' => '08:30:00',
            ],
            [
                'subject_id' => $math->id,
                'teacher_id' => $teacherProfile->id,
                'end_time' => '09:30:00',
                'room_number' => '101',
            ]
        );

        // 16. Announcements
        Announcement::firstOrCreate(
            ['school_id' => $greenwood->id, 'title' => 'Annual Science & Tech Fair 2026'],
            [
                'content' => 'All students from Grades 8 to 12 are invited to register their science projects by end of month.',
                'target_audience' => 'All',
                'publish_date' => now()->format('Y-m-d'),
                'created_by' => $schoolAdmin->id,
                'status' => 'Published',
            ]
        );

        // 17. Support Tickets
        SupportTicket::updateOrCreate(
            ['ticket_id' => 'TCK-8801'],
            [
                'school_id' => $greenwood->id,
                'user_id' => $schoolAdmin->id,
                'subject' => 'Request for custom grade report template',
                'category' => 'Feature Request',
                'priority' => 'Medium',
                'status' => 'Open',
                'description' => 'We would like to customize our report card layout with school logo watermark.',
            ]
        );

        // 18. Platform Expense
        Expense::firstOrCreate(
            ['school_id' => null, 'title' => 'AWS Cloud Infrastructure Renewal'],
            [
                'category' => 'Hosting & Cloud',
                'amount' => 1450.00,
                'expense_date' => '2026-09-28',
                'paid_to' => 'Amazon Web Services',
                'payment_method' => 'Corporate Credit Card',
                'description' => 'Monthly server cluster and database hosting',
                'status' => 'Paid',
                'created_by' => $superAdmin->id,
            ]
        );
    }
}
