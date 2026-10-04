<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Unified expenses table (school_id is null for super admin platform expenses)
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->nullable()->constrained()->nullOnDelete();
            $table->string('expense_id', 50)->nullable();
            $table->string('title');
            $table->string('category')->nullable();
            $table->decimal('amount', 12, 2);
            $table->date('expense_date')->nullable();
            $table->date('date')->nullable();
            $table->string('paid_to')->nullable();
            $table->string('payment_method', 50)->default('Bank Transfer');
            $table->string('receipt_number', 50)->nullable();
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->string('attachment')->nullable();
            $table->string('status', 30)->default('Paid');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('school_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
