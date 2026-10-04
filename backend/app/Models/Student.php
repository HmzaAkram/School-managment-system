<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'student_profiles';

    protected $fillable = [
        'school_id', 'user_id', 'admission_number', 'student_id',
        'roll_number', 'roll_no', 'first_name', 'last_name',
        'class_id', 'section_id', 'dob', 'date_of_birth',
        'gender', 'blood_group', 'address', 'city', 'state',
        'admission_date', 'previous_school', 'emergency_contact', 'status',
    ];

    protected $casts = [
        'dob' => 'date',
        'date_of_birth' => 'date',
        'admission_date' => 'date',
    ];

    protected $appends = ['full_name'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function parents()
    {
        return $this->belongsToMany(ParentModel::class, 'student_parent', 'student_id', 'parent_id')
                    ->withPivot('relationship', 'is_primary');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function feeInvoices()
    {
        return $this->hasMany(FeeInvoice::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class, 'class_id', 'class_id')
            ->when($this->section_id, fn ($q) => $q->where('section_id', $this->section_id));
    }

    public function leaves()
    {
        return $this->hasMany(StudentLeave::class);
    }

    public function reviews()
    {
        return $this->hasMany(StudentReview::class);
    }

    public function getFullNameAttribute(): string
    {
        return trim(($this->first_name ?? '').' '.($this->last_name ?? '')) ?: '—';
    }

    public function getRollNumberAttribute($value)
    {
        return $value ?: $this->roll_no;
    }

    /**
     * `date_of_birth` is the canonical column; `dob` is the legacy alias. Both
     * are cast to Carbon so callers can keep using ->toDateString().
     *
     * A plain getDateOfBirthAttribute() would shadow the cast and hand back the
     * raw string, so this has to stay a modern accessor.
     */
    protected function dateOfBirth(): Attribute
    {
        return Attribute::get(function ($value): ?Carbon {
            $raw = $value ?: ($this->attributes['dob'] ?? null);

            return $raw ? Carbon::parse($raw) : null;
        });
    }
}