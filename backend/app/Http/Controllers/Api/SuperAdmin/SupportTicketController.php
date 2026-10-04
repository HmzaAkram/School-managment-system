<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index(Request $request)
    {
        $query = SupportTicket::with(['school', 'user']);

        if (!$request->user()->isSuperAdmin()) {
            $query->where('school_id', $request->user()->school_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        return response()->json($query->latest()->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'category' => 'required|string',
            'priority' => 'required|in:Low,Medium,High,Urgent',
            'description' => 'required|string',
        ]);

        $ticket = SupportTicket::create([
            'ticket_id' => 'TCK-' . strtoupper(uniqid()),
            'school_id' => $request->user()->school_id,
            'user_id' => $request->user()->id,
            'subject' => $request->subject,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => 'Open',
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Support ticket submitted successfully',
            'ticket' => $ticket
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $ticket = SupportTicket::with(['school', 'user'])->findOrFail($id);

        if (!$request->user()->isSuperAdmin() && $ticket->school_id !== $request->user()->school_id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($ticket);
    }

    public function update(Request $request, $id)
    {
        $ticket = SupportTicket::findOrFail($id);

        if (!$request->user()->isSuperAdmin() && $ticket->school_id !== $request->user()->school_id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $request->validate([
            'status' => 'sometimes|in:Open,In Progress,Resolved,Closed',
            'priority' => 'sometimes|in:Low,Medium,High,Urgent',
        ]);

        $ticket->update($request->only(['status', 'priority', 'assigned_to']));

        return response()->json([
            'status' => 'success',
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $ticket = SupportTicket::findOrFail($id);
        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
