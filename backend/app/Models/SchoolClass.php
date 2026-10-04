<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchoolClass extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'classes';

    protected $fillable = [
        'school_id', 'academic_year_id', 'name', 'code', 'numeric_level',
        'description', 'section', 'display_name', 'class_teacher_id', 'room',
        'capacity', 'status',
    ];

    protected $casts = [
        'numeric_level' => 'integer',
        'capacity' => 'integer',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class, 'class_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subject', 'class_id', 'subject_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_class', 'class_id', 'teacher_id');
    }

    public function classTeacher()
    {
        return $this->belongsTo(User::class, 'class_teacher_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'class_id');
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class, 'class_id');
    }

    public function exams()
    {
        return $this->hasMany(ExamSchedule::class, 'class_id');
    }

    public function fees()
    {
        return $this->hasMany(FeeStructure::class, 'class_id');
    }

    public function getDisplayNameAttribute($value)
    {
        return $value ?: trim($this->name.'-'.$this->section);
    }
}
