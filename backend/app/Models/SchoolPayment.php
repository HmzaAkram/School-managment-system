<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'contract_id', 'transaction_id', 'amount', 'payment_date',
        'payment_method', 'status', 'invoice_url', 'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function contract()
    {
        return $this->belongsTo(SchoolContract::class, 'contract_id');
    }
}
