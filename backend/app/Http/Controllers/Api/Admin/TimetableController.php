<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends ApiController
{
    private const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $query = Timetable::where('school_id', $schoolId)
            ->with(['class:id,name,section', 'section:id,name', 'subject:id,name,code', 'teacher:id,first_name,last_name']);

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->query('class_id'));
        }

        if ($request->filled('section_id')) {
            $query->where('section_id', $request->query('section_id'));
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->query('teacher_id'));
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->query('subject_id'));
        }

        if ($request->filled('day')) {
            $query->where('day_of_week', $request->query('day'));
        }

        $entries = $query->get()->sortBy(function (Timetable $t) {
            $dayIndex = array_search($t->day_name, self::DAYS, true);
            return [(int) ($dayIndex === false ? 99 : $dayIndex), (string) $t->start_time];
        })->values();

        // Distinct period slots so the grid can render its time axis from real data.
        $slots = Timetable::where('school_id', $schoolId)
            ->when($request->filled('class_id'), fn ($q) => $q->where('class_id', $request->query('class_id')))
            ->when($request->filled('section_id'), fn ($q) => $q->where('section_id', $request->query('section_id')))
            ->select('start_time', 'end_time')
            ->distinct()
            ->orderBy('start_time')
            ->get()
            ->map(fn ($r) => [
                'start_time' => $r->start_time,
                'end_time' => $r->end_time,
            ])
            ->values();

        return response()->json([
            'entries' => $entries->map(fn (Timetable $t) => [
                'id' => $t->id,
                'day' => $t->day_name,
                'period' => (int) $t->period,
                'type' => $t->type,
                'start_time' => $t->start_time,
                'end_time' => $t->end_time,
                'class_id' => $t->class_id,
                'class' => $t->class?->name,
                'section_id' => $t->section_id,
                'section' => $t->section?->name,
                'subject_id' => $t->subject_id,
                'subject' => $t->subject?->name,
                'subject_code' => $t->subject?->code,
                'teacher_id' => $t->teacher_id,
                'teacher' => $t->teacher?->full_name,
                'room' => $t->room_number,
            ])->all(),
            'slots' => $slots,
            'days' => self::DAYS,
        ]);
    }

    public function store(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'section_id' => 'nullable|exists:sections,id',
            'day_of_week' => 'required|in:'.implode(',', self::DAYS),
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'room_number' => 'nullable|string|max:50',
            'period' => 'nullable|integer|min:1|max:20',
            'type' => 'nullable|string|max:30',
        ]);

        $timetable = Timetable::create([
            'school_id' => $schoolId,
            'class_id' => $data['class_id'],
            'section_id' => $data['section_id'] ?? null,
            'subject_id' => $data['subject_id'],
            'teacher_id' => $data['teacher_id'],
            'day_of_week' => $data['day_of_week'],
            'day' => $data['day_of_week'],
            'period' => $data['period'] ?? $this->nextPeriod($schoolId, $data['day_of_week'], $data['start_time']),
            'type' => $data['type'] ?? 'lecture',
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'room_number' => $data['room_number'] ?? null,
        ]);

        $this->log($request, 'created', Timetable::class, $timetable->id, $timetable->toArray());

        return response()->json([
            'status' => 'success',
            'message' => 'Timetable entry added',
            'timetable' => $timetable->load(['class', 'section', 'subject', 'teacher']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        $entry = Timetable::where('school_id', $schoolId)->findOrFail($id);

        $data = $request->validate([
            'class_id' => 'sometimes|exists:classes,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'teacher_id' => 'sometimes|exists:teachers,id',
            'section_id' => 'nullable|exists:sections,id',
            'day_of_week' => 'sometimes|in:'.implode(',', self::DAYS),
            'start_time' => 'sometimes',
            'end_time' => 'sometimes',
            'room_number' => 'nullable|string|max:50',
            'period' => 'sometimes|integer|min:1|max:20',
            'type' => 'nullable|string|max:30',
        ]);

        if (isset($data['day_of_week'])) {
            $data['day'] = $data['day_of_week'];
        }

        $old = $entry->only(array_keys($data));
        $entry->update($data);

        $this->log($request, 'updated', Timetable::class, $entry->id, $data, $old);

        return response()->json([
            'status' => 'success',
            'message' => 'Timetable entry updated',
            'timetable' => $entry->fresh(),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $this->requireSchoolId($request);
        Timetable::where('school_id', $schoolId)->findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Timetable entry deleted']);
    }

    /** Delete every entry matching the given filters (bulk clear). */
    public function destroyBulk(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $count = Timetable::where('school_id', $schoolId)
            ->when($request->filled('class_id'), fn ($q) => $q->where('class_id', $request->query('class_id')))
            ->when($request->filled('section_id'), fn ($q) => $q->where('section_id', $request->query('section_id')))
            ->when($request->filled('day_of_week'), fn ($q) => $q->where('day_of_week', $request->query('day_of_week')))
            ->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Deleted {$count} timetable entries.",
            'deleted' => $count,
        ]);
    }

    /** Auto-increment period number within the day. */
    private function nextPeriod(int $schoolId, string $day, string $startTime): int
    {
        return (int) Timetable::where('school_id', $schoolId)
            ->where('day_of_week', $day)
            ->where('start_time', '<=', $startTime)
            ->max('period') + 1;
    }
}