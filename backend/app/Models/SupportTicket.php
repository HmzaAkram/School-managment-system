<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupportTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id', 'school_id', 'user_id', 'created_by', 'subject', 'category',
        'priority', 'status', 'description', 'assigned_to',
    ];

    protected $appends = ['reference_number'];

    public function getReferenceNumberAttribute(): string
    {
        return $this->ticket_id ?: ('#'.$this->id);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
