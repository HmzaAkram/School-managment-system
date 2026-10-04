<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'contract_id', 'school_contract_id', 'transaction_id', 'amount', 'payment_date',
        'payment_method', 'reference', 'description', 'notes', 'status', 'invoice_url', 'month_for',
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

    public function schoolContract()
    {
        return $this->belongsTo(SchoolContract::class, 'school_contract_id');
    }

    public function ledgerEntry()
    {
        return $this->hasOne(LedgerEntry::class, 'school_payment_id');
    }
}
