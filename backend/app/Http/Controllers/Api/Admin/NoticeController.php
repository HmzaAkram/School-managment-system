<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Announcement;
use Illuminate\Http\Request;

class NoticeController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Announcement::where('school_id', $schoolId)->with('creator:id,name');

        if ($request->filled('audience')) {
            $query->whereIn('target_audience', [$request->query('audience'), 'All']);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->query('category'));
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->query('priority'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->boolean('pinned')) {
            $query->where('pinned', true);
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $paginator = $query->orderByDesc('pinned')->orderByDesc('created_at')
            ->paginate($this->perPage($request));

        return response()->json([
            'data' => collect($paginator->items())->map(fn (Announcement $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'content' => $a->content,
                'description' => $a->description,
                'category' => $a->category,
                'priority' => $a->priority,
                'pinned' => (bool) $a->pinned,
                'target_audience' => $a->target_audience,
                'class_id' => $a->class_id,
                'publish_date' => $a->publish_date?->toDateString(),
                'expiry_date' => $a->expiry_date?->toDateString(),
                'status' => $a->status,
                'created_by' => $a->creator?->name,
                'created_at' => $a->created_at?->toIso8601String(),
            ])->all(),
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_audience' => 'required|in:All,Students,Teachers,Parents',
            'priority' => 'required|in:Low,Medium,High',
            'category' => 'nullable|string|max:50',
            'pinned' => 'nullable|boolean',
            'class_id' => 'nullable|exists:classes,id',
            'publish_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:publish_date',
        ]);

        $notice = Announcement::create([
            'school_id' => $schoolId,
            'title' => $data['title'],
            'content' => $data['content'],
            'target_audience' => $data['target_audience'],
            'priority' => $data['priority'] ?? 'Medium',
            'category' => $data['category'] ?? 'General',
            'pinned' => $data['pinned'] ?? false,
            'class_id' => $data['class_id'] ?? null,
            'publish_date' => $data['publish_date'] ?? now()->toDateString(),
            'expiry_date' => $data['expiry_date'] ?? null,
            'created_by' => $request->user()?->id,
            'status' => 'Published',
            'is_published' => true,
        ]);

        $this->log($request, 'created', Announcement::class, $notice->id, $notice->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Announcement posted',
            'notice' => $notice,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $notice = Announcement::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'target_audience' => 'sometimes|in:All,Students,Teachers,Parents',
            'priority' => 'sometimes|in:Low,Medium,High',
            'category' => 'nullable|string|max:50',
            'pinned' => 'sometimes|boolean',
            'class_id' => 'nullable|exists:classes,id',
            'publish_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:publish_date',
            'status' => 'sometimes|in:Draft,Published,Archived',
        ]);

        $old = $notice->only(array_keys($data));
        $notice->update($data);

        $this->log($request, 'updated', Announcement::class, $notice->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Announcement updated',
            'notice' => $notice->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        Announcement::where('school_id', $schoolId)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Announcement deleted']);
    }
}