<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['school_id', 'key', 'value', 'type', 'group'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
