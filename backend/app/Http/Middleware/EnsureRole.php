<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Normalize roles (handle hyphens/underscores and case)
        $userRole = strtolower(str_replace('-', '_', (string) $user->role));
        $allowed = array_map(fn($r) => strtolower(str_replace('-', '_', (string) $r)), $roles);

        // Super Admin has universal access across all routes
        if ($userRole === 'super_admin') {
            return $next($request);
        }

        // Direct match
        if (in_array($userRole, $allowed, true)) {
            return $next($request);
        }

        // Allow school_admin to access super_admin routes (such as creating schools)
        if ($userRole === 'school_admin' && in_array('super_admin', $allowed, true)) {
            return $next($request);
        }

        return response()->json(['message' => 'Forbidden. Insufficient role privileges.'], 403);
    }
}
