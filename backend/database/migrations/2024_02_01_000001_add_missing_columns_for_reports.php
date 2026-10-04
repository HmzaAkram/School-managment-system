<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Announcements: pinning + category (used by the notices module) ──
        if (!Schema::hasColumn('announcements', 'pinned')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->boolean('pinned')->default(false)->after('priority');
            });
        }
        if (!Schema::hasColumn('announcements', 'category')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->string('category', 50)->nullable()->after('pinned');
            });
        }

        // ── Exam schedules: section + invigilator ──
        if (!Schema::hasColumn('exam_schedules', 'section_id')) {
            Schema::table('exam_schedules', function (Blueprint $table) {
                $table->foreignId('section_id')->nullable()->after('class_id')
                    ->constrained('sections')->nullOnDelete();
            });
        }
        if (!Schema::hasColumn('exam_schedules', 'invigilator')) {
            Schema::table('exam_schedules', function (Blueprint $table) {
                $table->string('invigilator', 120)->nullable()->after('room_number');
            });
        }

        // ── Timetable: slot type (lecture / lab / break / assembly) ──
        if (!Schema::hasColumn('timetables', 'type')) {
            Schema::table('timetables', function (Blueprint $table) {
                $table->string('type', 30)->default('lecture')->after('period');
            });
        }

        // ── Users: profile preferences surfaced on the settings screens ──
        if (!Schema::hasColumn('users', 'timezone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('timezone', 64)->default('UTC')->after('avatar');
            });
        }

        // ── School contracts: per-student revenue sharing model ──
        if (!Schema::hasColumn('school_contracts', 'per_student_fee')) {
            Schema::table('school_contracts', function (Blueprint $table) {
                $table->decimal('per_student_fee', 10, 2)->default(0);
                $table->decimal('school_share_percent', 5, 2)->default(50);
                $table->decimal('saas_share_percent', 5, 2)->default(50);
                $table->decimal('saas_fee_per_student', 10, 2)->default(0);
                $table->unsignedSmallInteger('contract_duration_months')->default(12);
                $table->decimal('total_contract_value', 14, 2)->default(0);
                $table->decimal('total_paid_amount', 14, 2)->default(0);
                $table->decimal('total_pending_amount', 14, 2)->default(0);
                $table->string('current_month_status', 20)->default('Pending');
                $table->unsignedInteger('billable_students')->default(0);
            });
        }

        // ── Ledger entries: keep transaction reference + running balance auditable ──
        if (!Schema::hasColumn('ledger_entries', 'transaction_id')) {
            Schema::table('ledger_entries', function (Blueprint $table) {
                $table->string('transaction_id', 50)->nullable()->after('school_id');
                $table->decimal('running_balance', 14, 2)->default(0);
                $table->string('payment_method', 60)->nullable();
                $table->string('status', 30)->default('Completed');
            });
        }
    }

    public function down(): void
    {
        Schema::table('ledger_entries', function (Blueprint $table) {
            $table->dropColumn(['transaction_id', 'running_balance', 'payment_method', 'status']);
        });

        Schema::table('school_contracts', function (Blueprint $table) {
            $table->dropColumn([
                'per_student_fee', 'school_share_percent', 'saas_share_percent',
                'saas_fee_per_student', 'contract_duration_months', 'total_contract_value',
                'total_paid_amount', 'total_pending_amount', 'current_month_status', 'billable_students',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('timezone');
        });

        Schema::table('timetables', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('exam_schedules', function (Blueprint $table) {
            $table->dropConstrainedForeignId('section_id');
            $table->dropColumn('invigilator');
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn(['pinned', 'category']);
        });
    }
};
