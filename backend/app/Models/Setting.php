<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Key/value settings scoped to a school. Backed by the `school_settings` table.
 */
class Setting extends Model
{
    use HasFactory;

    protected $table = 'school_settings';

    protected $fillable = ['school_id', 'key', 'value'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}