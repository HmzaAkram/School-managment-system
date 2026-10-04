<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\GradeScale;
use App\Http\Controllers\Api\ApiController;
use App\Models\Mark;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends ApiController
{
    /** Academic results report: per-subject and per-student aggregates. */
    public function results(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $examId = $request->query('exam_id');
        $classId = $request->query('class_id');
        $sectionId = $request->query('section_id');

        $query = Mark::where('school_id', $schoolId)
            ->with(['subject:id,name,code,credits,total_marks', 'exam:id,name,term', 'student:id,first_name,last_name,roll_number']);

        if ($examId) {
            $query->where('exam_id', $examId);
        }

        if ($classId) {
            $query->whereHas('student', fn ($s) => $s->where('class_id', $classId));
        }

        if ($sectionId) {
            $query->whereHas('student', fn ($s) => $s->where('section_id', $sectionId));
        }

        $marks = $query->get();

        // Per-subject performance.
        $bySubject = $marks->groupBy('subject_id')->map(function ($group, $subjectId) {
            $first = $group->first();
            $avgObtained = (float) $group->avg('marks_obtained');
            $avgTotal = (float) $group->avg('total_marks');
            $highest = (float) $group->max('marks_obtained');
            $lowest = (float) $group->min('marks_obtained');
            $passed = $group->filter(fn (Mark $m) => (float) $m->marks_obtained >= 33)->count();

            return [
                'subject_id' => $subjectId,
                'subject' => $first?->subject?->name ?? '—',
                'code' => $first?->subject?->code,
                'credits' => $first?->subject?->credits,
                'entries' => $group->count(),
                'average' => round($avgObtained, 2),
                'max' => round($avgTotal, 2),
                'percentage' => $avgTotal > 0 ? round($avgObtained / $avgTotal * 100, 1) : null,
                'highest' => round($highest, 2),
                'lowest' => round($lowest, 2),
                'passed' => $passed,
                'failed' => $group->count() - $passed,
                'pass_rate' => $group->count() > 0 ? round($passed / $group->count() * 100, 1) : null,
            ];
        })->values()->sortByDesc('percentage')->all();

        // Per-student totals.
        $perStudent = $marks->groupBy('student_id')->map(function ($group) {
            $obtained = (float) $group->sum('marks_obtained');
            $total = (float) $group->sum('total_marks');
            $percent = $total > 0 ? ($obtained / $total) * 100 : 0;
            $scale = GradeScale::forPercentage($percent);
            $first = $group->first();

            return [
                'student_id' => $first?->student_id,
                'name' => $first?->student?->full_name ?? '—',
                'roll_number' => $first?->student?->roll_number,
                'subjects' => $group->count(),
                'obtained' => round($obtained, 2),
                'total' => round($total, 2),
                'percentage' => round($percent, 2),
                'grade' => $scale['grade'],
                'gpa' => round((float) $group->avg('gpa_point'), 2),
                'result' => $percent >= 33 ? 'Pass' : 'Fail',
            ];
        })->values()->sortByDesc('percentage')->all();

        $passed = collect($perStudent)->where('result', 'Pass')->count();

        return response()->json([
            'filters' => ['exam_id' => $examId, 'class_id' => $classId, 'section_id' => $sectionId],
            'summary' => [
                'entries' => $marks->count(),
                'students' => count($perStudent),
                'subjects' => count($bySubject),
                'passed' => $passed,
                'failed' => count($perStudent) - $passed,
                'pass_rate' => $perStudent ? round($passed / count($perStudent) * 100, 1) : null,
                'class_average' => $marks->count() > 0
                    ? round($marks->avg(fn (Mark $m) => (float) $m->total_marks > 0
                        ? (float) $m->marks_obtained / (float) $m->total_marks * 100
                        : 0), 1)
                    : null,
            ],
            'by_subject' => $bySubject,
            'per_student' => $perStudent,
            'grade_distribution' => $marks->groupBy('grade')->map->count()->all(),
        ]);
    }

    /** Enrolment / staff / performance summary for the school. */
    public function summary(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);
        $academicYear = $this->currentAcademicYear($schoolId);

        $byClass = DB::table('classes')
            ->leftJoin('student_profiles', 'student_profiles.class_id', '=', 'classes.id')
            ->where('classes.school_id', $schoolId)
            ->whereNull('classes.deleted_at')
            ->groupBy('classes.id', 'classes.name', 'classes.section', 'classes.capacity')
            ->select('classes.id')
            ->selectRaw("CONCAT(classes.name,'-',classes.section) as class_name")
            ->selectRaw('classes.capacity')
            ->selectRaw('COUNT(student_profiles.id) as students')
            ->orderBy('classes.numeric_level')
            ->get()
            ->map(fn ($r) => [
                'class_id' => $r->id,
                'class' => $r->class_name,
                'capacity' => (int) $r->capacity,
                'students' => (int) $r->students,
                'fill_rate' => (int) $r->capacity > 0
                    ? round((int) $r->students / (int) $r->capacity * 100, 1)
                    : null,
            ])->all();

        $genderSplit = DB::table('student_profiles')
            ->where('school_id', $schoolId)
            ->whereNull('deleted_at')
            ->select('gender')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('gender')
            ->pluck('total', 'gender');

        return response()->json([
            'academic_year' => $academicYear,
            'enrolment' => [
                'total_students' => Student::where('school_id', $schoolId)->count(),
                'active_students' => Student::where('school_id', $schoolId)->where('status', 'Active')->count(),
                'by_gender' => $genderSplit,
                'by_class' => $byClass,
            ],
            'staff' => DB::table('teachers')
                ->where('school_id', $schoolId)
                ->whereNull('deleted_at')
                ->select('status')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'grades_available' => GradeScale::grades(),
        ]);
    }
}