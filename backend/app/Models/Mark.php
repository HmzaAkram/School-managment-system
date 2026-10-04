<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'exam_id', 'student_id', 'subject_id', 'class_id',
        'marks_obtained', 'total_marks', 'coursework', 'midterm', 'final_exam',
        'total_score', 'max_score', 'grade', 'gpa_point', 'remarks', 'entered_by',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'total_marks' => 'decimal:2',
        'coursework' => 'decimal:2',
        'midterm' => 'decimal:2',
        'final_exam' => 'decimal:2',
        'total_score' => 'decimal:2',
        'max_score' => 'decimal:2',
        'gpa_point' => 'decimal:2',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'entered_by');
    }

    /** Percentage score, 0-100 */
    public function getPercentageAttribute(): float
    {
        $max = (float) ($this->max_score ?: $this->total_marks ?: 0);

        if ($max <= 0) {
            return 0.0;
        }

        $score = $this->total_score !== null && $this->total_score !== ''
            ? (float) $this->total_score
            : (float) $this->marks_obtained;

        return round(($score / $max) * 100, 2);
    }
}