<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code', 'domain', 'logo', 'address', 'city', 'state', 'zip', 'country',
        'phone', 'email', 'principal_name', 'status', 'subscription_status', 'plan',
        'contract_amount', 'contract_start', 'contract_end', 'contract_type', 'paid_amount', 'pending_amount',
    ];

    protected $casts = [
        'contract_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'pending_amount' => 'decimal:2',
        'contract_start' => 'date',
        'contract_end' => 'date',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function contracts()
    {
        return $this->hasMany(SchoolContract::class);
    }

    public function academicYears()
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    public function payments()
    {
        return $this->hasMany(SchoolPayment::class);
    }

    public function ledgerEntries()
    {
        return $this->hasMany(LedgerEntry::class);
    }
}
