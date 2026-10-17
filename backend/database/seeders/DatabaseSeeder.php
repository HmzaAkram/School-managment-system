<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Production Database Seeder
 * Creates strictly the Platform Super Admin account.
 * (For full demo mock dataset, use: php artisan db:seed --class=DemoDataSeeder)
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Seeding Platform Super Admin…');

        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@skoolms.com');
        $password = env('SUPER_ADMIN_PASSWORD', 'password123');
        $name = env('SUPER_ADMIN_NAME', 'Platform Super Admin');

        $superAdmin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => 'super_admin',
                'school_id' => null,
                'phone' => '+92 300 0000000',
                'status' => 'Active',
                'email_verified_at' => now(),
            ]
        );

        $this->command?->info('----------------------------------------------');
        $this->command?->info(' Super Admin created successfully!');
        $this->command?->info(" Email:    {$email}");
        $this->command?->info(" Password: {$password}");
        $this->command?->info(' Role:     super_admin');
        $this->command?->info('----------------------------------------------');
        $this->command?->info('No demo schools or records were created. You can now create your school contracts from the Super Admin dashboard.');
    }
}