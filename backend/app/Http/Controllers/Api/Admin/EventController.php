<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends ApiController
{
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Event::where('school_id', $schoolId)->with('creator:id,name');

        if ($request->filled('event_type')) {
            $query->where('event_type', $request->query('event_type'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = trim((string) $request->query('search'));
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }

        if ($request->filled('upcoming')) {
            $query->whereDate('start_date', '>=', now()->toDateString());
        }

        return response()->json($query->orderBy('start_date')->get());
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'event_type' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'audience' => 'nullable|in:All,Students,Teachers,Parents',
            'status' => 'nullable|in:Upcoming,Ongoing,Completed,Cancelled',
        ]);

        $event = Event::create([
            'school_id' => $schoolId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
            'location' => $data['location'] ?? null,
            'event_type' => $data['event_type'] ?? 'General',
            'color' => $data['color'] ?? '#6366f1',
            'audience' => $data['audience'] ?? 'All',
            'status' => $data['status'] ?? 'Upcoming',
            'is_published' => true,
            'created_by' => $request->user()?->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Event created',
            'event' => $event,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $event = Event::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'event_type' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'audience' => 'nullable|in:All,Students,Teachers,Parents',
            'status' => 'nullable|in:Upcoming,Ongoing,Completed,Cancelled',
        ]);

        $event->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Event updated',
            'event' => $event->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        Event::where('school_id', $schoolId)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Event deleted']);
    }
}