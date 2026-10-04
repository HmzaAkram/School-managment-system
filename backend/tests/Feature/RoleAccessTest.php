<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_school_admin_cannot_access_super_admin_stats(): void
    {
        $school = School::create([
            'name' => 'School A', 'code' => 'A-001', 'status' => 'Active',
        ]);
        $admin = User::factory()->create([
            'role' => 'school_admin', 'school_id' => $school->id, 'status' => 'Active',
        ]);

        $this->actingAs($admin)->getJson('/api/super-admin/stats')->assertStatus(403);
    }

    public function test_teacher_cannot_access_admin_routes(): void
    {
        $school = School::create([
            'name' => 'School A', 'code' => 'A-001', 'status' => 'Active',
        ]);
        $teacher = User::factory()->create([
            'role' => 'teacher', 'school_id' => $school->id, 'status' => 'Active',
        ]);

        $this->actingAs($teacher)->getJson('/api/admin/stats')->assertStatus(403);
    }

    public function test_admin_cannot_see_other_schools_student(): void
    {
        $schoolA = School::create(['name' => 'A', 'code' => 'A-001', 'status' => 'Active']);
        $schoolB = School::create(['name' => 'B', 'code' => 'B-001', 'status' => 'Active']);

        $adminA = User::factory()->create(['role' => 'school_admin', 'school_id' => $schoolA->id, 'status' => 'Active']);

        $studentUser = User::factory()->create(['role' => 'student', 'school_id' => $schoolB->id, 'status' => 'Active']);
        $student = Student::create([
            'school_id' => $schoolB->id,
            'user_id' => $studentUser->id,
            'admission_number' => 'ADM-B-1',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'gender' => 'Male',
            'status' => 'Active',
        ]);

        $this->actingAs($adminA)->getJson("/api/admin/students/{$student->id}")->assertStatus(404);
    }

    public function test_super_admin_can_access_everything(): void
    {
        $super = User::factory()->create(['role' => 'super_admin', 'status' => 'Active']);
        $this->actingAs($super)->getJson('/api/super-admin/stats')->assertStatus(200);
    }
}
