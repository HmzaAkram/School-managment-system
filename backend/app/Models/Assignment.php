<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'teacher_id', 'class_id', 'section_id', 'subject_id',
        'title', 'description', 'attachment_url', 'attachment',
        'due_date', 'max_marks', 'max_score', 'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'max_marks' => 'decimal:2',
        'max_score' => 'decimal:2',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    /**
     * Effective score limit. `max_score` is the canonical column; `max_marks`
     * is the legacy name and is used as a fallback. Raw attributes are read
     * directly so the accessor does not recurse into itself.
     */
    protected function maxScore(): Attribute
    {
        return Attribute::get(function () {
            $maxScore = $this->attributes['max_score'] ?? null;
            $maxMarks = $this->attributes['max_marks'] ?? null;

            return $maxScore ?: $maxMarks;
        });
    }
}