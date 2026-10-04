<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$db = DB::connection()->getDatabaseName();

foreach (['attendances','marks','timetables','diaries','fee_payments','fee_invoices','student_reviews','student_leaves','assignment_submissions','notifications','school_settings'] as $t) {
    $idx = DB::table('information_schema.statistics')
        ->where('table_schema', $db)->where('table_name', $t)
        ->where('non_unique', 0)->orderBy('seq_in_index')
        ->select('index_name', 'column_name')->get();

    echo str_pad($t, 24).': ';
    $groups = [];
    foreach ($idx as $r) { $groups[$r->index_name][] = $r->column_name; }
    $out = [];
    foreach ($groups as $name => $cols) { $out[] = $name.'(' . implode(',', $cols) . ')'; }
    echo ($out ? implode(' | ', $out) : 'NO UNIQUE INDEXES')."\n";
}

echo "\n--- models present ---\n";
foreach (['Event','StudentLeave','StudentReview','Setting','Notification'] as $m) {
    echo str_pad($m, 16).': '.(class_exists("App\\Models\\$m") ? 'yes' : 'NO')."\n";
}