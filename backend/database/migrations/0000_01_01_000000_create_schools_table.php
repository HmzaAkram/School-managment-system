<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique();
            $table->string('logo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('country', 100)->default('Pakistan');
            $table->string('website')->nullable();
            $table->string('tagline')->nullable();

            $table->string('domain')->nullable();
            $table->string('subdomain')->nullable()->unique();
            $table->string('custom_domain')->nullable();
            $table->string('principal_name')->nullable();
            $table->boolean('ssl_active')->default(true);

            $table->enum('status', ['Active', 'Inactive', 'Suspended'])->default('Active');
            $table->enum('subscription_status', ['Active', 'Expired', 'Trial', 'Cancelled'])->default('Active');
            $table->string('plan')->default('Standard');
            $table->decimal('contract_amount', 12, 2)->default(0);
            $table->date('contract_start')->nullable();
            $table->date('contract_end')->nullable();
            $table->string('contract_type')->default('Annual');
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('pending_amount', 12, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
