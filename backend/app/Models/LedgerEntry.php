<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LedgerEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id', 'date', 'entry_date', 'description', 'category',
        'type', 'amount', 'debit', 'credit', 'balance', 'running_balance',
        'payment_method', 'school_id', 'school_payment_id', 'expense_id',
        'reference_id', 'reference_type', 'status',
    ];

    protected $casts = [
        'date' => 'date',
        'entry_date' => 'date',
        'amount' => 'decimal:2',
        'debit' => 'decimal:2',
        'credit' => 'decimal:2',
        'balance' => 'decimal:2',
        'running_balance' => 'decimal:2',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function schoolPayment()
    {
        return $this->belongsTo(SchoolPayment::class, 'school_payment_id');
    }

    public function expense()
    {
        return $this->belongsTo(Expense::class, 'expense_id');
    }
}