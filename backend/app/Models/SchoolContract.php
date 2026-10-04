<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolContract extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'contract_number', 'plan_name', 'total_amount',
        'paid_amount', 'balance_due', 'start_date', 'end_date', 'status', 'billing_cycle', 'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance_due' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
