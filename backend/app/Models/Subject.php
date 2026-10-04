<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['school_id', 'name', 'code', 'type', 'pass_marks', 'total_marks', 'credits', 'description', 'status'];

    protected $casts = [
        'pass_marks' => 'decimal:2',
        'total_marks' => 'decimal:2',
        'credits' => 'decimal:1',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classes()
    {
        return $this->belongsToMany(SchoolClass::class, 'class_subject', 'subject_id', 'class_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'teacher_subject', 'subject_id', 'teacher_id');
    }
}
