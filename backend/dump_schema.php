<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$db = DB::connection()->getDatabaseName();
$out = "DATABASE: {$db}\nGENERATED: ".date('Y-m-d H:i:s')."\n\n";

$tables = DB::table('information_schema.tables')
    ->where('table_schema', $db)
    ->where('table_type', 'BASE TABLE')
    ->orderBy('table_name')
    ->pluck('table_name');

foreach ($tables as $t) {
    $count = DB::table($t)->count();
    $out .= "== {$t} (rows={$count})\n";

    $cols = DB::table('information_schema.columns')
        ->where('table_schema', $db)->where('table_name', $t)
        ->orderBy('ordinal_position')->get();

    foreach ($cols as $c) {
        $out .= sprintf(
            "  %s %s null=%s%s key=%s%s\n",
            $c->COLUMN_NAME,
            $c->COLUMN_TYPE,
            $c->IS_NULLABLE === 'YES' ? 'YES' : 'NO',
            $c->COLUMN_DEFAULT !== null ? " default='{$c->COLUMN_DEFAULT}'" : '',
            $c->COLUMN_KEY,
            $c->COLUMN_KEY === 'PRI' ? ' auto_increment' : ''
        );
    }

    $fks = DB::table('information_schema.KEY_COLUMN_USAGE as k')
        ->where('k.table_schema', $db)->where('k.table_name', $t)
        ->whereNotNull('k.REFERENCED_TABLE_NAME')
        ->orderBy('k.ordinal_position')->get();

    foreach ($fks as $fk) {
        $out .= "  FK {$fk->COLUMN_NAME} -> {$fk->REFERENCED_TABLE_NAME}.{$fk->REFERENCED_COLUMN_NAME}\n";
    }

    $out .= "\n";
}

file_put_contents(__DIR__.'/schema.txt', $out);
echo "wrote schema.txt (".strlen($out)." bytes, {$tables->count()} tables)\n";