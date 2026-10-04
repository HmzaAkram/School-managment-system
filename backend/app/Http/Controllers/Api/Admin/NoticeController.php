<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = $request->user()->school_id;
        $query = Announcement::where('school_id', $schoolId);

        if ($request->filled('audience')) {
            $query->whereIn('target_audience', [$request->audience, 'All']);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $schoolId = $request->user()->school_id;

        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'target_audience' => 'required|in:All,Students,Teachers,Parents',
        ]);

        $notice = Announcement::create([
            'school_id' => $schoolId,
            'title' => $request->title,
            'content' => $request->content,
            'target_audience' => $request->target_audience,
            'publish_date' => $request->publish_date ?? now(),
            'expiry_date' => $request->expiry_date,
            'created_by' => $request->user()->id,
            'status' => 'Published',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Announcement posted',
            'notice' => $notice
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $schoolId = $request->user()->school_id;
        Announcement::where('school_id', $schoolId)->findOrFail($id)->delete();
        return response()->json(['message' => 'Announcement deleted']);
    }
}
