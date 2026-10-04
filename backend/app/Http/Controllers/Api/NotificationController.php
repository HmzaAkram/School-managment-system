<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NotificationController extends ApiController
{
    public function index(Request $request)
    {
        $perPage = $this->perPage($request, 20, 100);
        $unreadOnly = $request->boolean('unread');

        $query = Notification::forUser($request->user())
            ->when($unreadOnly, fn ($q) => $q->unread())
            ->orderByDesc('created_at');

        if ($request->filled('type')) {
            $query->where('type', $request->query('type'));
        }

        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => collect($paginator->items())->map(fn ($n) => $this->present($n))->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'unread_count' => Notification::forUser($request->user())->unread()->count(),
        ]);
    }

    public function unreadCount(Request $request)
    {
        return response()->json([
            'unread_count' => Notification::forUser($request->user())->unread()->count(),
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        $notification = Notification::forUser($request->user())->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'status' => 'success',
            'notification' => $this->present($notification->fresh()),
            'unread_count' => Notification::forUser($request->user())->unread()->count(),
        ]);
    }

    public function markAllRead(Request $request)
    {
        Notification::forUser($request->user())
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'status' => 'success',
            'unread_count' => 0,
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $notification = Notification::forUser($request->user())->findOrFail($id);
        $notification->delete();

        return response()->json([
            'status' => 'success',
            'unread_count' => Notification::forUser($request->user())->unread()->count(),
        ]);
    }

    /**
     * Convenience helper used by the backend to push a notification to a user.
     */
    public static function push(User $user, string $title, string $message, array $data = []): Notification
    {
        return Notification::create([
            'id' => (string) Str::uuid(),
            'type' => $data['type'] ?? 'general',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => array_merge(['title' => $title, 'message' => $message], $data),
        ]);
    }

    private function present(Notification $n): array
    {
        return [
            'id' => $n->id,
            'title' => $n->data['title'] ?? 'Notification',
            'message' => $n->data['message'] ?? ($n->data['body'] ?? ''),
            'type' => $n->type,
            'link' => $n->data['link'] ?? null,
            'data' => $n->data,
            'read_at' => $n->read_at?->toIso8601String(),
            'is_read' => $n->read_at !== null,
            'created_at' => $n->created_at?->toIso8601String(),
        ];
    }
}