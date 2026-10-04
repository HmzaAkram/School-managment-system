<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'school_id', 'user_id', 'employee_id', 'first_name', 'last_name',
        'gender', 'dob', 'qualification', 'experience_years', 'joining_date',
        'designation', 'department', 'salary', 'salary_status', 'specialization',
        'address', 'status',
    ];

    protected $casts = [
        'dob' => 'date',
        'joining_date' => 'date',
        'salary' => 'decimal:2',
        'experience_years' => 'integer',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'teacher_subject', 'teacher_id', 'subject_id');
    }

    public function classes()
    {
        return $this->belongsToMany(SchoolClass::class, 'teacher_class', 'teacher_id', 'class_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function diaries()
    {
        return $this->hasMany(Diary::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'teacher_id');
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class, 'teacher_id');
    }

    public function reviews()
    {
        return $this->hasMany(StudentReview::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id', 'id');
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamSchedule::class, 'subject_id', 'id');
    }

    public function getFullNameAttribute(): string
    {
        return trim(($this->first_name ?? '').' '.($this->last_name ?? '')) ?: '—';
    }

    public function getPhoneAttribute()
    {
        return $this->user?->phone;
    }

    public function getEmailAttribute()
    {
        return $this->user?->email;
    }
}
