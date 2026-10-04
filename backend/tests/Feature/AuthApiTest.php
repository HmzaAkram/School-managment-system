<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_login()
    {
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@skoolms.com',
            'password' => bcrypt('password123'),
            'role' => 'super_admin',
            'status' => 'Active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'superadmin@skoolms.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'role']
            ]);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson('/api/super-admin/stats');
        $response->assertStatus(401);
    }
}
