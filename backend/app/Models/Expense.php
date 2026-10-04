<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Expense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'school_id', 'expense_id', 'title', 'category', 'amount', 'expense_date', 'date',
        'paid_to', 'payment_method', 'receipt_number', 'description', 'notes',
        'attachment', 'status', 'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'date' => 'date',
    ];

    /**
     * `expense_date` is the canonical column; `date` is the legacy alias.
     * Kept as a modern accessor so the `'date'` cast still yields Carbon.
     */
    protected function date(): Attribute
    {
        return Attribute::get(function ($value): ?Carbon {
            $raw = $value ?: ($this->attributes['expense_date'] ?? null);

            return $raw ? Carbon::parse($raw) : null;
        });
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function ledgerEntry()
    {
        return $this->hasOne(LedgerEntry::class, 'expense_id');
    }
}
