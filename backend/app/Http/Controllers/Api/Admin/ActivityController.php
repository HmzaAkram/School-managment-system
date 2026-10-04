<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Announcement;
use App\Models\AssignmentSubmission;
use App\Models\AuditLog;
use App\Models\ExamSchedule;
use App\Models\Expense;
use App\Models\FeePayment;
use App\Models\Student;
use App\Models\StudentLeave;
use App\Models\Teacher;
use Illuminate\Http\Request;

class ActivityController extends ApiController
{
    /**
     * Unified activity feed for the school. Optionally filtered by `type`.
     * Types: student_enrolled, teacher_added, payment, expense, announcement,
     *        exam_schedule, leave, grade, audit.
     */
    public function index(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);
        $limit = min((int) $request->query('limit', 50), 200);
        $type = $request->query('type');

        $items = [];

        if ($type === null || $type === 'student_enrolled') {
            Student::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (Student $s) => $items[] = $this->item(
                    'student_enrolled',
                    $s->full_name.' was enrolled',
                    $s->admission_number,
                    $s->created_at
                ));
        }

        if ($type === null || $type === 'teacher_added') {
            Teacher::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (Teacher $t) => $items[] = $this->item(
                    'teacher_added',
                    $t->full_name.' joined the staff',
                    $t->employee_id,
                    $t->created_at
                ));
        }

        if ($type === null || $type === 'payment') {
            FeePayment::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (FeePayment $p) => $items[] = $this->item(
                    'payment',
                    'Fee payment received',
                    (float) $p->amount.' via '.$p->payment_method,
                    $p->created_at
                ));
        }

        if ($type === null || $type === 'expense') {
            Expense::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (Expense $e) => $items[] = $this->item(
                    'expense',
                    $e->title,
                    (float) $e->amount,
                    $e->created_at
                ));
        }

        if ($type === null || $type === 'announcement') {
            Announcement::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (Announcement $a) => $items[] = $this->item(
                    'announcement',
                    'Announcement: '.$a->title,
                    $a->target_audience,
                    $a->created_at
                ));
        }

        if ($type === null || $type === 'exam_schedule') {
            ExamSchedule::whereHas('exam', fn ($q) => $q->where('school_id', $schoolId))
                ->with('exam:id,name')->latest('date')->limit($limit)->get()
                ->each(fn (ExamSchedule $s) => $items[] = $this->item(
                    'exam_schedule',
                    ($s->exam?->name ?? 'Exam').' schedule published',
                    $s->date?->format('d M Y'),
                    $s->created_at
                ));
        }

        if ($type === null || $type === 'leave') {
            StudentLeave::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (StudentLeave $l) => $items[] = $this->item(
                    'leave',
                    'Leave request '.$l->status,
                    $l->leave_type.' · '.$l->from_date?->format('d M Y'),
                    $l->created_at
                ));
        }

        if ($type === null || $type === 'grade') {
            AssignmentSubmission::whereHas('assignment', fn ($q) => $q->where('school_id', $schoolId))
                ->where('status', 'Graded')
                ->latest('graded_at')->limit($limit)->get()
                ->each(fn (AssignmentSubmission $s) => $items[] = $this->item(
                    'grade',
                    'Assignment graded',
                    (float) $s->score.' marks',
                    $s->graded_at ?? $s->created_at
                ));
        }

        if ($type === null || $type === 'audit') {
            AuditLog::where('school_id', $schoolId)->latest()->limit($limit)->get()
                ->each(fn (AuditLog $a) => $items[] = $this->item(
                    'audit',
                    $a->action,
                    $a->entity_type.($a->entity_id ? ' #'.$a->entity_id : ''),
                    $a->created_at
                ));
        }

        usort($items, fn ($a, $b) => ($b['at'] ?? '') <=> ($a['at'] ?? ''));

        return response()->json(array_slice($items, 0, $limit));
    }

    private function item(string $type, string $title, ?string $meta, $at): array
    {
        return [
            'type' => $type,
            'title' => $title,
            'meta' => $meta,
            'at' => $at?->toIso8601String(),
        ];
    }
}