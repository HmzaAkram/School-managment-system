<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id', 'student_id', 'submitted_at', 'graded_at',
        'file_url', 'attachment', 'content',
        'marks_obtained', 'obtained_score', 'feedback', 'status',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
        'marks_obtained' => 'decimal:2',
        'obtained_score' => 'decimal:2',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function getScoreAttribute()
    {
        return $this->obtained_score ?? $this->marks_obtained;
    }
}