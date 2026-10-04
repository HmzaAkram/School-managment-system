<?php

namespace App\Helpers;

/**
 * Central mapping from a percentage score to a letter grade + GPA point.
 * Every panel uses this so grades are consistent across the application.
 */
class GradeScale
{
    /** [min_pct, grade, gpa_point] ordered high -> low. */
    private const SCALE = [
        [90, 'A+', 4.0],
        [80, 'A', 3.7],
        [70, 'B+', 3.3],
        [65, 'B', 3.0],
        [60, 'C+', 2.7],
        [55, 'C', 2.3],
        [50, 'D+', 2.0],
        [45, 'D', 1.7],
        [0, 'F', 0.0],
    ];

    public static function forPercentage(float $percent): array
    {
        foreach (self::SCALE as [$min, $grade, $gpa]) {
            if ($percent >= $min) {
                return ['grade' => $grade, 'gpa_point' => $gpa];
            }
        }

        return ['grade' => 'F', 'gpa_point' => 0.0];
    }

    /** All grades, highest first — used by filters and legends. */
    public static function grades(): array
    {
        return array_values(array_unique(array_column(self::SCALE, 'grade')));
    }
}