<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Assignments / Homework
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('attachment_url')->nullable();
            $table->string('attachment')->nullable();
            $table->date('due_date');
            $table->decimal('max_marks', 6, 2)->default(100);
            $table->decimal('max_score', 6, 2)->default(100);
            $table->enum('status', ['Active', 'Closed', 'Draft'])->default('Active');
            $table->timestamps();

            $table->index(['school_id', 'class_id']);
        });

        // Assignment submissions
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
            $table->text('content')->nullable();
            $table->string('file_url')->nullable();
            $table->string('attachment')->nullable();
            $table->decimal('marks_obtained', 6, 2)->nullable();
            $table->decimal('obtained_score', 6, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->enum('status', ['Pending', 'Submitted', 'Graded'])->default('Pending');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(['assignment_id', 'student_id']);
        });

        // Diary entries
        Schema::create('diaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->date('date');
            $table->text('task')->nullable();
            $table->text('notes')->nullable();
            $table->text('note')->nullable();
            $table->enum('type', ['Homework', 'Notice', 'Exam Prep'])->default('Homework');
            $table->timestamps();

            $table->index(['school_id', 'class_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diaries');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
    }
};
