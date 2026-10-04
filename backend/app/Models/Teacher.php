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
        'designation', 'department', 'salary', 'status',
    ];

    protected $casts = [
        'dob' => 'date',
        'joining_date' => 'date',
        'salary' => 'decimal:2',
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

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function diaries()
    {
        return $this->hasMany(Diary::class);
    }
}
