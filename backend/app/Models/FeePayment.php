<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'fee_invoice_id', 'student_id', 'transaction_id', 'receipt_no',
        'amount', 'payment_method', 'reference', 'remarks', 'notes',
        'payment_date', 'status', 'received_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function feeInvoice()
    {
        return $this->belongsTo(FeeInvoice::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}