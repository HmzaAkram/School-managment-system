<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Api\ApiController;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class SupportTicketController extends ApiController
{
    public function stats(Request $request)
    {
        $query = SupportTicket::query();

        if (! $request->user()->isSuperAdmin()) {
            $query->where('school_id', $request->user()->school_id);
        }

        return response()->json([
            'total' => (clone $query)->count(),
            'open' => (clone $query)->where('status', 'Open')->count(),
            'in_progress' => (clone $query)->where('status', 'In Progress')->count(),
            'resolved' => (clone $query)->where('status', 'Resolved')->count(),
            'closed' => (clone $query)->where('status', 'Closed')->count(),
            'by_priority' => (clone $query)->select('priority')->selectRaw('COUNT(*) as total')->groupBy('priority')->pluck('total', 'priority'),
        ]);
    }

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
            'created_by' => $request->user()->id,
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
