<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchoolContract extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'school_id', 'contract_number', 'plan_name',
        'per_student_fee', 'school_share_percent', 'saas_share_percent',
        'saas_fee_per_student', 'contract_duration_months',
        'start_date', 'end_date', 'contract_start', 'contract_end',
        'total_amount', 'paid_amount', 'balance_due',
        'total_contract_value', 'total_paid_amount', 'total_pending_amount',
        'billing_cycle', 'current_month_status', 'status', 'notes',
    ];

    protected $casts = [
        'per_student_fee' => 'decimal:2',
        'saas_fee_per_student' => 'decimal:2',
        'school_share_percent' => 'decimal:2',
        'saas_share_percent' => 'decimal:2',
        'contract_duration_months' => 'integer',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_due' => 'decimal:2',
        'total_contract_value' => 'decimal:2',
        'total_paid_amount' => 'decimal:2',
        'total_pending_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'contract_start' => 'date',
        'contract_end' => 'date',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function payments()
    {
        return $this->hasMany(SchoolPayment::class, 'school_contract_id');
    }

    public function getDaysRemainingAttribute(): int
    {
        $end = $this->contract_end ?: $this->end_date;

        if (! $end) {
            return 0;
        }

        return (int) now()->startOfDay()->diffInDays($end->startOfDay(), false);
    }
}