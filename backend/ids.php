<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

foreach (['classes', 'sections', 'exams', 'subjects', 'schools', 'student_profiles'] as $t) {
    $row = Illuminate\Support\Facades\DB::table($t)->selectRaw('MIN(id) as mn, MAX(id) as mx, COUNT(*) as c')->first();
    echo str_pad($t, 20)." min={$row->mn} max={$row->mx} count={$row->c}\n";
}