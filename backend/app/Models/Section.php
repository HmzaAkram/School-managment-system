<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['school_id', 'class_id', 'name', 'capacity', 'room_number'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'section_id');
    }

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    public function examSchedules()
    {
        return $this->hasMany(ExamSchedule::class);
    }
}
