<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fee structures (templates)
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->string('name'); // "Tuition Fee", "Lab Fee", "Exam Fee"
            $table->decimal('amount', 12, 2);
            $table->string('frequency', 50)->default('Monthly');
            $table->integer('due_day')->default(10);
            $table->text('description')->nullable();
            $table->string('academic_year')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('school_id');
        });

        // Individual student fee invoices
        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
            $table->foreignId('fee_structure_id')->nullable()->constrained('fee_structures')->nullOnDelete();
            $table->string('invoice_number', 50)->nullable();
            $table->string('title'); // "Academic Term 2 Tuition"
            $table->decimal('amount', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('fine_amount', 12, 2)->default(0);
            $table->date('due_date');
            $table->string('status', 30)->default('Unpaid');
            $table->string('month', 30)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['school_id', 'student_id']);
        });

        // Fee payments (receipts)
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('fee_invoice_id')->nullable()->constrained('fee_invoices')->nullOnDelete();
            $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
            $table->string('transaction_id', 100)->nullable();
            $table->string('receipt_no', 30)->nullable();
            $table->decimal('amount', 12, 2);
            $table->string('payment_method', 50)->default('Cash');
            $table->string('reference')->nullable();
            $table->text('remarks')->nullable();
            $table->text('notes')->nullable();
            $table->date('payment_date');
            $table->string('status', 30)->default('Completed');
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('school_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_invoices');
        Schema::dropIfExists('fee_structures');
    }
};
