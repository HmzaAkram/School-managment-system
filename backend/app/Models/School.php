<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class School extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code', 'domain', 'logo', 'address', 'city', 'state', 'country',
        'phone', 'email', 'principal_name', 'status', 'subscription_status', 'plan',
        'contract_amount', 'contract_start', 'contract_end', 'contract_type', 'paid_amount', 'pending_amount',
        'website', 'tagline', 'subdomain', 'custom_domain', 'ssl_active',
    ];

    protected $casts = [
        'contract_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'pending_amount' => 'decimal:2',
        'contract_start' => 'date',
        'contract_end' => 'date',
        'ssl_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function contracts()
    {
        return $this->hasMany(SchoolContract::class);
    }

    public function activeContract()
    {
        return $this->hasOne(SchoolContract::class)->where('status', 'Active');
    }

    public function academicYears()
    {
        return $this->hasMany(AcademicYear::class);
    }

    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
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

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function settings()
    {
        return $this->hasMany(Setting::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function feeInvoices()
    {
        return $this->hasMany(FeeInvoice::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    /**
     * The school administrator(s) belonging to this school.
     */
    public function admins()
    {
        return $this->hasMany(User::class)->where('role', 'school_admin');
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    public function diaries()
    {
        return $this->hasMany(Diary::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function leaves()
    {
        return $this->hasMany(StudentLeave::class);
    }

    public function feeStructures()
    {
        return $this->hasMany(FeeStructure::class);
    }

    public function currentAcademicYear()
    {
        return $this->academicYears()->where('is_current', true)->first()
            ?: $this->academicYears()->orderByDesc('start_date')->first();
    }
}
