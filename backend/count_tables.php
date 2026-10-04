<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$db = DB::connection()->getDatabaseName();

$tables = DB::select('SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME', [$db]);
foreach ($tables as $t) {
    $name = $t->TABLE_NAME;
    if (str_starts_with($name, 'migrations') || str_starts_with($name, 'cache') || str_starts_with($name, 'jobs') || str_starts_with($name, 'sessions') || str_starts_with($name, 'password_')) continue;
    try { $n = DB::table($name)->count(); } catch (\Throwable $e) { $n = 'ERR'; }
    echo "== $name (rows=$n)\n";
    $cols = DB::select('SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION', [$db, $name]);
    foreach ($cols as $c) {
        $def = $c->COLUMN_DEFAULT === null ? '' : " DEFAULT '" . $c->COLUMN_DEFAULT . "'";
        echo "   {$c->COLUMN_NAME} {$c->COLUMN_TYPE} null={$c->IS_NULLABLE} key={$c->COLUMN_KEY}{$def} {$c->EXTRA}\n";
    }
    $fk = DB::select('SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL', [$db, $name]);
    foreach ($fk as $f) {
        echo "   FK {$f->COLUMN_NAME} -> {$f->REFERENCED_TABLE_NAME}.{$f->REFERENCED_COLUMN_NAME}\n";
    }
}