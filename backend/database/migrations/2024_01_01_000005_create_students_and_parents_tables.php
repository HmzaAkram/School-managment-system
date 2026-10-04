<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Student profiles
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('admission_number', 50)->nullable();
            $table->string('student_id', 30)->nullable(); // e.g. STD-1001
            $table->string('roll_number', 20)->nullable();
            $table->string('roll_no', 20)->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->date('dob')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->date('admission_date')->nullable();
            $table->string('previous_school')->nullable();
            $table->string('emergency_contact', 50)->nullable();
            $table->enum('status', ['Active', 'Inactive', 'Graduated', 'Transferred'])->default('Active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('school_id');
            $table->index('class_id');
            $table->index('status');
        });

        // Parent profiles
        Schema::create('parent_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('father_name')->nullable();
            $table->string('father_phone', 30)->nullable();
            $table->string('father_email')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('mother_phone', 30)->nullable();
            $table->string('mother_email')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->string('occupation')->nullable();
            $table->decimal('income', 12, 2)->default(0);
            $table->string('alternate_phone', 30)->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_phone', 30)->nullable();
            $table->string('guardian_relation')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact', 30)->nullable();
            $table->timestamps();

            $table->index('school_id');
        });

        // Student-Parent relationship
        Schema::create('student_parent', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
            $table->foreignId('parent_id')->constrained('parent_profiles')->cascadeOnDelete();
            $table->string('relationship')->default('Father');
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->unique(['student_id', 'parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_parent');
        Schema::dropIfExists('parent_profiles');
        Schema::dropIfExists('student_profiles');
    }
};
