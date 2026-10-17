<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\ParentModel;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\SchoolPayment;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiAssistantTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.gemini.key' => 'test-key']);
    }

    public function test_super_admin_question_sends_only_real_platform_payment_totals_to_gemini(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Platform receipts were 125.00.']]]]],
        ])]);
        $school = $this->school();
        SchoolPayment::create([
            'school_id' => $school->id, 'amount' => 125, 'payment_date' => now()->toDateString(), 'status' => 'Completed',
        ]);
        SchoolPayment::create([
            'school_id' => $school->id, 'amount' => 900, 'payment_date' => now()->subMonth()->toDateString(), 'status' => 'Completed',
        ]);

        $response = $this->actingAs($this->user('super_admin'))->postJson('/api/ai-assistant/chat', [
            'message' => 'How much platform revenue did we receive this month?',
        ]);

        $response->assertOk()->assertJsonPath('answer', 'Platform receipts were 125.00.');
        Http::assertSent(fn ($request) => str_contains($request['systemInstruction']['parts'][0]['text'], '"completed_revenue":125'));
        Http::assertSent(fn ($request) => ! str_contains($request['systemInstruction']['parts'][0]['text'], '"completed_revenue":1025'));
        Http::assertSent(fn ($request) => $request->hasHeader('x-goog-api-key', 'test-key') && ! str_contains($request->url(), 'test-key'));
    }

    public function test_school_admin_only_sends_its_own_school_student_count(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'One active student is enrolled.']]]]],
        ])]);
        $school = $this->school();
        $otherSchool = $this->school();
        $admin = $this->user('school_admin', $school->id);
        $this->student($school->id);
        $this->student($otherSchool->id);

        $this->actingAs($admin)->postJson('/api/ai-assistant/chat', [
            'message' => 'How many students are enrolled in my school?',
            'school_id' => $otherSchool->id,
            'role' => 'super_admin',
        ])->assertOk();

        Http::assertSent(fn ($request) => str_contains($request['systemInstruction']['parts'][0]['text'], '"active_student_count":1'));
    }

    public function test_student_cannot_request_platform_revenue_and_gemini_is_not_called(): void
    {
        Http::fake();
        $school = $this->school();
        $studentUser = $this->user('student', $school->id);

        $this->actingAs($studentUser)->postJson('/api/ai-assistant/chat', [
            'message' => 'How much platform revenue did we receive this month?',
        ])->assertOk()->assertJsonPath('answer', 'That information is restricted and is not available to your account.');

        Http::assertNothingSent();
    }

    public function test_missing_gemini_key_returns_a_clear_configuration_error(): void
    {
        config(['services.gemini.key' => '']);
        Http::fake();

        $this->actingAs($this->user('super_admin'))->postJson('/api/ai-assistant/chat', [
            'message' => 'How many schools are currently active?',
        ])->assertStatus(503)->assertJsonPath('message', 'The AI assistant is not configured. Please contact your administrator.');

        Http::assertNothingSent();
    }

    public function test_unavailable_gemini_model_returns_a_clear_configuration_error(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'error' => ['code' => 404, 'status' => 'NOT_FOUND'],
        ], 404)]);

        $this->actingAs($this->user('super_admin'))->postJson('/api/ai-assistant/chat', [
            'message' => 'How many schools are currently active?',
        ])->assertStatus(503)->assertJsonPath('message', 'The configured Gemini model is unavailable. Please ask your administrator to check GEMINI_MODEL.');
    }

    public function test_default_gemini_model_uses_a_supported_generation_model(): void
    {
        config(['services.gemini.key' => 'test-key', 'services.gemini.model' => null]);
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Active schools count is known.']]]]],
        ])]);

        $this->actingAs($this->user('super_admin'))->postJson('/api/ai-assistant/chat', [
            'message' => 'How many schools are currently active?',
        ])->assertOk();

        Http::assertSent(fn ($request) => str_contains($request->url(), '/models/gemini-3.8-flash:generateContent'));
    }

    public function test_gemini_high_demand_error_is_reported_as_retryable(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'error' => ['code' => 503, 'status' => 'UNAVAILABLE'],
        ], 503)]);

        $this->actingAs($this->user('super_admin'))->postJson('/api/ai-assistant/chat', [
            'message' => 'How many schools are currently active?',
        ])->assertStatus(503)->assertJsonPath('message', 'The AI service is experiencing high demand right now. Please wait a moment and try again.');
    }

    public function test_student_attendance_context_contains_only_their_own_records(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Your recorded attendance is 100%.']]]]],
        ])]);
        $school = $this->school();
        $student = $this->student($school->id);
        $otherStudent = $this->student($school->id);
        Attendance::create([
            'school_id' => $school->id, 'student_id' => $student->id, 'date' => today(), 'status' => 'Present', 'type' => 'Student',
        ]);
        Attendance::create([
            'school_id' => $school->id, 'student_id' => $otherStudent->id, 'date' => today(), 'status' => 'Absent', 'type' => 'Student',
        ]);

        $this->actingAs($student->user)->postJson('/api/ai-assistant/chat', [
            'message' => 'What is my attendance percentage?',
        ])->assertOk();

        Http::assertSent(fn ($request) => str_contains($request['systemInstruction']['parts'][0]['text'], '"attendance_records":1'));
        Http::assertSent(fn ($request) => ! str_contains($request['systemInstruction']['parts'][0]['text'], '"attendance_records":2'));
    }

    public function test_parent_can_only_access_attendance_for_linked_children(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'Your linked child has attendance on record.']]]]],
        ])]);
        $school = $this->school();
        $parentUser = $this->user('parent', $school->id);
        $parent = ParentModel::create(['user_id' => $parentUser->id, 'school_id' => $school->id]);
        $linked = $this->student($school->id);
        $unlinked = $this->student($school->id);
        $parent->students()->attach($linked->id);
        Attendance::create([
            'school_id' => $school->id, 'student_id' => $linked->id, 'date' => today(), 'status' => 'Present', 'type' => 'Student',
        ]);
        Attendance::create([
            'school_id' => $school->id, 'student_id' => $unlinked->id, 'date' => today(), 'status' => 'Absent', 'type' => 'Student',
        ]);

        $this->actingAs($parentUser)->postJson('/api/ai-assistant/chat', [
            'message' => 'What is my attendance percentage?',
        ])->assertOk();

        Http::assertSent(fn ($request) => str_contains($request['systemInstruction']['parts'][0]['text'], '"attendance_records":1'));
        Http::assertSent(fn ($request) => ! str_contains($request['systemInstruction']['parts'][0]['text'], '"attendance_records":2'));
    }

    public function test_teacher_attendance_is_limited_to_assigned_classes(): void
    {
        Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [['content' => ['parts' => [['text' => 'There is one absence.']]]]],
        ])]);
        $school = $this->school();
        $teacherUser = $this->user('teacher', $school->id);
        $teacher = Teacher::create([
            'school_id' => $school->id, 'user_id' => $teacherUser->id, 'first_name' => 'Test', 'last_name' => 'Teacher',
        ]);
        $assigned = SchoolClass::create(['school_id' => $school->id, 'name' => 'Class A', 'section' => 'A']);
        $unassigned = SchoolClass::create(['school_id' => $school->id, 'name' => 'Class B', 'section' => 'B']);
        $teacher->classes()->attach($assigned->id);
        $assignedStudent = $this->student($school->id);
        Attendance::create([
            'school_id' => $school->id, 'student_id' => $assignedStudent->id, 'class_id' => $assigned->id, 'date' => today(), 'status' => 'Absent', 'type' => 'Student',
        ]);
        Attendance::create([
            'school_id' => $school->id, 'student_id' => $this->student($school->id)->id, 'class_id' => $unassigned->id, 'date' => today(), 'status' => 'Absent', 'type' => 'Student',
        ]);

        $response = $this->actingAs($teacherUser)->postJson('/api/ai-assistant/chat', [
            'message' => 'How many students were absent today in my assigned classes?',
        ]);
        $response->assertOk()->assertJsonPath('answer', 'There is one absence.');

        Http::assertSent(fn ($request) => str_contains($request['systemInstruction']['parts'][0]['text'], '"assigned_class_absences":1'));
    }

    private function school(): School
    {
        return School::create(['name' => 'Test School', 'code' => uniqid('SCH'), 'status' => 'Active']);
    }

    private function user(string $role, ?int $schoolId = null): User
    {
        return User::factory()->create([
            'role' => $role,
            'school_id' => $schoolId,
            'status' => 'Active',
        ]);
    }

    private function student(int $schoolId): Student
    {
        return Student::create([
            'user_id' => $this->user('student', $schoolId)->id,
            'school_id' => $schoolId,
            'first_name' => 'Sample',
            'last_name' => 'Student',
            'status' => 'Active',
        ]);
    }
}
