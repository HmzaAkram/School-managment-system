<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Classes (e.g. Class 10, Class 9)
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name'); // e.g. "Class 10", "Grade 10"
            $table->string('code', 50)->nullable();
            $table->integer('numeric_level')->default(1);
            $table->text('description')->nullable();
            $table->string('section', 10)->default('A'); // A, B, C
            $table->string('display_name')->nullable(); // "10-A"
            $table->foreignId('class_teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('room')->nullable();
            $table->integer('capacity')->default(50);
            $table->enum('status', ['Active', 'Archived'])->default('Active');
            $table->timestamps();
            $table->softDeletes();

            $table->index('school_id');
            $table->index('status');
        });

        // Sections (e.g. Section A, Section B)
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->string('name');
            $table->integer('capacity')->default(40);
            $table->string('room_number')->nullable();
            $table->timestamps();

            $table->index('school_id');
            $table->index('class_id');
        });

        // Subjects
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('code', 20)->nullable();
            $table->string('type', 30)->default('Theory');
            $table->decimal('pass_marks', 5, 2)->default(33);
            $table->decimal('total_marks', 5, 2)->default(100);
            $table->text('description')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();

            $table->index('school_id');
        });

        // Pivot: which subjects belong to which class
        Schema::create('class_subject', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['class_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_subject');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('classes');
    }
};
