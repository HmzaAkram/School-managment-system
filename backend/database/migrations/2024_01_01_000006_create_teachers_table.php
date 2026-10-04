<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('employee_id', 30)->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('designation')->nullable(); // Senior Teacher, Teacher, HOD
            $table->string('department')->nullable(); // Mathematics, English, Physics
            $table->date('joining_date')->nullable();
            $table->date('dob')->nullable();
            $table->integer('experience_years')->default(0);
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('qualification')->nullable();
            $table->string('specialization')->nullable();
            $table->decimal('salary', 12, 2)->default(0);
            $table->enum('salary_status', ['Paid', 'Pending', 'Overdue'])->default('Pending');
            $table->text('address')->nullable();
            $table->enum('status', ['Active', 'Inactive', 'On Leave', 'Resigned'])->default('Active');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['school_id', 'employee_id']);
            $table->index('school_id');
            $table->index('status');
            $table->index('department');
        });

        // Teacher-class assignments
        Schema::create('teacher_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_class_teacher')->default(false);
            $table->timestamps();

            $table->unique(['teacher_id', 'class_id']);
        });

        // Teacher-subject assignments
        Schema::create('teacher_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['teacher_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('teacher_subject');
        Schema::dropIfExists('teacher_class');
        Schema::dropIfExists('teachers');
    }
};
