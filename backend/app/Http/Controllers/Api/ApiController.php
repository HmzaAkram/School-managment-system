<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class ApiController extends Controller
{
    /** Resolve the school id the current user is scoped to (null for super admins). */
    protected function schoolId(Request $request): ?int
    {
        return $request->user()?->school_id !== null
            ? (int) $request->user()->school_id
            : null;
    }

    /** Clamp a client supplied per-page value into a sane range. */
    protected function perPage(Request $request, int $default = 15, int $max = 200): int
    {
        $value = (int) $request->query('per_page', $request->query('perPage', $default));

        return max(1, min($value, $max));
    }

    /** Wrap a query for a school-scoped model, guarding against null school ids. */
    protected function scopeToSchool(Builder $query, Request $request, string $column = 'school_id'): Builder
    {
        $schoolId = $this->schoolId($request);

        return $schoolId === null ? $query : $query->where($column, $schoolId);
    }

    /**
     * Resolve the school id for authenticated, non-super-admin users.
     * Returns 422 when the account has no school attached.
     */
    protected function requireSchoolId(Request $request): int
    {
        $schoolId = $this->schoolId($request);

        abort_if($schoolId === null, 422, 'Your account is not linked to a school.');

        return $schoolId;
    }

    protected function currentAcademicYear(int $schoolId): ?AcademicYear
    {
        return AcademicYear::where('school_id', $schoolId)
            ->where('is_current', true)
            ->first()
            ?: AcademicYear::where('school_id', $schoolId)
                ->orderByDesc('start_date')
                ->first();
    }

    /** Record an audit trail entry; failures here must never break the request. */
    protected function log(Request $request, string $action, string $entityType, ?int $entityId = null, array $new = [], array $old = []): void
    {
        try {
            AuditLog::create([
                'user_id' => $request->user()?->id,
                'school_id' => $request->user()?->school_id,
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'old_data' => $old ? json_encode($old) : null,
                'new_data' => $new ? json_encode($new) : null,
                'ip_address' => $request->ip(),
            ]);
        } catch (\Throwable $e) {
            // auditing is best-effort
        }
    }

    /** Build a date range from `from`/`to` (or `date`) query params. */
    protected function dateRange(Request $request, string $column = 'created_at'): array
    {
        $from = $request->query('from', $request->query('start_date', $request->query('date_from')));
        $to = $request->query('to', $request->query('end_date', $request->query('date_to')));

        return [trim((string) $from) ?: null, trim((string) $to) ?: null];
    }

    protected function applyDateRange(Builder $query, Request $request, string $column, array $range): Builder
    {
        [$from, $to] = $range;

        if ($from) {
            $query->whereDate($column, '>=', $from);
        }

        if ($to) {
            $query->whereDate($column, '<=', $to);
        }

        return $query;
    }
}