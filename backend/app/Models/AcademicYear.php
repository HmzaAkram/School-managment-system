<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    protected $fillable = ['school_id', 'name', 'start_date', 'end_date', 'is_active', 'is_current'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
        'is_current' => 'boolean',
    ];

    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
