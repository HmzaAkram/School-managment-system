<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Wraps Laravel's polymorphic `notifications` table so it can be queried
 * fluently through Eloquent like the other models in this project.
 */
class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id', 'type', 'notifiable_type', 'notifiable_id', 'data', 'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'notifiable_id')
            ->where('notifiable_type', User::class);
    }

    public function scopeForUser($query, $user)
    {
        return $query->where('notifiable_type', User::class)
            ->where('notifiable_id', $user->id);
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function getTitleAttribute(): ?string
    {
        return $this->data['title'] ?? null;
    }

    public function getMessageAttribute(): ?string
    {
        return $this->data['message'] ?? ($this->data['body'] ?? null);
    }

    public function getLinkAttribute(): ?string
    {
        return $this->data['link'] ?? ($this->data['url'] ?? null);
    }
}