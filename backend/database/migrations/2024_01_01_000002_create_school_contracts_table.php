<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('school_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->string('contract_number', 50)->nullable()->unique();
            $table->string('plan_name')->nullable();
            $table->decimal('per_student_fee', 10, 2)->default(0);
            $table->decimal('school_share_percent', 5, 2)->default(50);
            $table->decimal('saas_share_percent', 5, 2)->default(50);
            $table->decimal('saas_fee_per_student', 10, 2)->default(0);
            $table->integer('contract_duration_months')->default(12);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('contract_start')->nullable();
            $table->date('contract_end')->nullable();
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('balance_due', 15, 2)->default(0);
            $table->decimal('total_contract_value', 15, 2)->default(0);
            $table->decimal('total_paid_amount', 15, 2)->default(0);
            $table->decimal('total_pending_amount', 15, 2)->default(0);
            $table->string('billing_cycle')->default('Annually');
            $table->enum('current_month_status', ['Paid', 'Pending', 'Overdue'])->default('Pending');
            $table->enum('status', ['Active', 'Pending', 'Pending Renewal', 'Expired', 'Inactive'])->default('Active');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('school_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_contracts');
    }
};
