<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('attendances', 'subject_id')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->unsignedBigInteger('subject_id')->nullable()->after('section_id');
            });
        }

        if (! Schema::hasColumn('subjects', 'credits')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->decimal('credits', 4, 1)->default(1.0)->after('total_marks');
            });
        }

        if (! Schema::hasColumn('diaries', 'completed')) {
            Schema::table('diaries', function (Blueprint $table) {
                $table->boolean('completed')->default(false)->after('notes');
                $table->timestamp('parent_acknowledged_at')->nullable()->after('completed');
            });
        }

        if (! Schema::hasTable('student_leaves')) {
            Schema::create('student_leaves', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
                $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
                $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
                $table->string('leave_type', 50)->default('Casual');
                $table->date('from_date');
                $table->date('to_date')->nullable();
                $table->text('reason')->nullable();
                $table->string('status', 30)->default('Pending');
                $table->text('remarks')->nullable();
                $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('reviewed_at')->nullable();
                $table->timestamps();

                $table->index(['school_id', 'status']);
                $table->index(['student_id', 'from_date']);
            });
        }

        if (! Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table) {
                $table->id();
                $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->date('start_date');
                $table->date('end_date')->nullable();
                $table->time('start_time')->nullable();
                $table->time('end_time')->nullable();
                $table->string('location', 255)->nullable();
                $table->string('event_type', 50)->default('General');
                $table->string('color', 20)->default('#6366f1');
                $table->string('audience', 50)->default('All');
                $table->string('status', 30)->default('Upcoming');
                $table->boolean('is_published')->default(true);
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
                $table->softDeletes();

                $table->index(['school_id', 'start_date']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
        Schema::dropIfExists('student_leaves');

        if (Schema::hasColumn('diaries', 'parent_acknowledged_at')) {
            Schema::table('diaries', function (Blueprint $table) {
                $table->dropColumn(['completed', 'parent_acknowledged_at']);
            });
        }

        if (Schema::hasColumn('subjects', 'credits')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->dropColumn('credits');
            });
        }

        if (Schema::hasColumn('attendances', 'subject_id')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->dropColumn('subject_id');
            });
        }
    }
};