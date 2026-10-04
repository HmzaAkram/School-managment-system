<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\ApiController;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Key/value settings for a school. Unknown keys are accepted so the settings
 * page can persist new preferences without a schema migration.
 */
class SchoolSettingController extends ApiController
{
    public function show(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $rows = Setting::where('school_id', $schoolId)->get();

        return response()->json([
            'settings' => $rows->mapWithKeys(fn (Setting $s) => [$s->key => $s->value])->all(),
        ]);
    }

    public function update(Request $request)
    {
        $schoolId = $this->requireSchoolId($request);

        $data = $request->validate([
            'settings' => 'required|array',
        ]);

        $settings = $data['settings'];

        DB::transaction(function () use ($schoolId, $settings, $request) {
            foreach ($settings as $key => $value) {
                if (! is_string($key) || $key === '') {
                    continue;
                }

                // A null value means "unset this preference".
                if ($value === null) {
                    Setting::where('school_id', $schoolId)->where('key', $key)->delete();
                    continue;
                }

                Setting::updateOrCreate(
                    ['school_id' => $schoolId, 'key' => $key],
                    ['value' => is_array($value) ? json_encode($value) : (string) $value]
                );
            }
        });

        $this->log($request, 'updated_settings', Setting::class, $schoolId, ['keys' => array_keys($settings)]);

        return response()->json([
            'status' => 'success',
            'message' => 'Settings saved',
            'settings' => Setting::where('school_id', $schoolId)
                ->get()->mapWithKeys(fn (Setting $s) => [$s->key => $s->value])->all(),
        ]);
    }
}