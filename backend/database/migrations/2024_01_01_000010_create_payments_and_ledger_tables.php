<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // School payments (from schools to platform - SaaS revenue)
        Schema::create('school_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_contract_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('contract_id')->nullable()->constrained('school_contracts')->nullOnDelete();
            $table->string('transaction_id', 100)->nullable();
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->string('payment_method', 50)->default('Bank Transfer');
            $table->string('reference')->nullable();
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->string('invoice_url')->nullable();
            $table->string('month_for')->nullable();
            $table->enum('status', ['Completed', 'Pending', 'Failed'])->default('Completed');
            $table->timestamps();

            $table->index('school_id');
            $table->index('payment_date');
        });

        // Ledger entries (platform financial ledger)
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id', 50)->nullable();
            $table->date('date')->nullable();
            $table->date('entry_date')->nullable();
            $table->string('description');
            $table->string('category')->nullable();
            $table->enum('type', ['Credit', 'Debit']); // Income vs expense
            $table->decimal('amount', 12, 2)->default(0);
            $table->decimal('debit', 12, 2)->default(0);
            $table->decimal('credit', 12, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->decimal('running_balance', 15, 2)->default(0);
            $table->string('payment_method', 50)->nullable();
            $table->foreignId('school_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('school_payment_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('expense_id')->nullable()->constrained('expenses')->nullOnDelete();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('reference_type')->nullable();
            $table->enum('status', ['Completed', 'Pending'])->default('Completed');
            $table->timestamps();

            $table->index('school_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
        Schema::dropIfExists('school_payments');
    }
};
