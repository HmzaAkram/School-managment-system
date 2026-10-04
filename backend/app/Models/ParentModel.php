<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentModel extends Model
{
    use HasFactory;

    protected $table = 'parent_profiles';

    protected $fillable = [
        'school_id', 'user_id', 'father_name', 'mother_name', 'occupation',
        'income', 'alternate_phone', 'address',
    ];

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
