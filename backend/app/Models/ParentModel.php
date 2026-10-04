<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    use HasFactory;

    protected $table = 'parent_profiles';

    protected $fillable = [
        'school_id', 'user_id',
        'father_name', 'father_phone', 'father_email', 'father_occupation',
        'mother_name', 'mother_phone', 'mother_email', 'mother_occupation',
        'occupation', 'income', 'alternate_phone',
        'guardian_name', 'guardian_phone', 'guardian_relation',
        'address', 'emergency_contact',
    ];

    protected $casts = [
        'income' => 'decimal:2',
    ];

    public function getNameAttribute(): string
    {
        return $this->father_name ?: ($this->guardian_name ?: 'Guardian');
    }

    public function getPhoneAttribute(): ?string
    {
        return $this->father_phone ?: ($this->guardian_phone ?: $this->user?->phone);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_parent', 'parent_id', 'student_id')
                    ->withPivot('relationship', 'is_primary');
    }
}
