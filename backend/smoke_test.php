<?php
/**
 * Smoke test: log in as each role and hit every GET endpoint,
 * reporting status codes and error messages.
 */

$base = 'http://127.0.0.1:8000/api';

function req(string $method, string $url, array $body = [], ?string $token = null): array
{
    $ch = curl_init($url);
    $headers = ['Accept: application/json', 'Content-Type: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer '.$token;
    }
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
    ]);
    if ($body !== []) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $raw = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    return ['code' => $code, 'body' => $raw === false ? "CURL ERROR: $err" : $raw];
}

$accounts = [
    'super_admin' => 'superadmin@skoolms.com',
    'school_admin' => 'admin@greenwood.com',
    'teacher' => 'teacher@greenwood.com',
    'student' => 'student@greenwood.com',
    'parent' => 'parent@greenwood.com',
];

$tokens = [];
foreach ($accounts as $role => $email) {
    $r = req('POST', $base.'/login', ['email' => $email, 'password' => 'password123']);
    $j = json_decode($r['body'], true);
    $token = $j['token'] ?? null;
    if (! $token) {
        echo "LOGIN FAILED [$role] code={$r['code']} body={$r['body']}\n";
        continue;
    }
    $tokens[$role] = $token;
    echo "LOGIN OK [$role]\n";
}

$groups = [
    'super_admin' => [
        'GET /me',
        'GET /notifications', 'GET /notifications/unread-count',
        'GET /super-admin/stats', 'GET /super-admin/reports?months=12',
        'GET /super-admin/schools', 'GET /super-admin/schools/1',
        'GET /super-admin/schools/1/summary',
        'GET /super-admin/contracts', 'GET /super-admin/contracts/1',
        'GET /super-admin/payments', 'GET /super-admin/ledger',
        'GET /super-admin/expenses',
        'GET /super-admin/tickets', 'GET /super-admin/tickets/stats',
        'GET /super-admin/tickets/1',
    ],
    'school_admin' => [
        'GET /me',
        'GET /notifications', 'GET /notifications/unread-count',
        'GET /admin/stats', 'GET /admin/activity',
        'GET /admin/students', 'GET /admin/students/1',
        'GET /admin/students/1/diaries',
        'GET /admin/teachers', 'GET /admin/teachers/1',
        'GET /admin/profile', 'GET /admin/settings',
        'GET /admin/academic-years',
        'GET /admin/classes', 'GET /admin/sections', 'GET /admin/subjects',
        'GET /admin/attendance/students?date='.date('Y-m-d').'&class_id=1',
        'GET /admin/attendance/teachers?date='.date('Y-m-d'),
        'GET /admin/attendance/unmarked',
        'GET /admin/reports/attendance',
        'GET /admin/fees/structures', 'GET /admin/fees/invoices', 'GET /admin/fees/payments',
        'GET /admin/reports/fees',
        'GET /admin/exams', 'GET /admin/exam-schedules', 'GET /admin/marks?exam_id=1&class_id=1&subject_id=1',
        'GET /admin/reports/results', 'GET /admin/reports/summary',
        'GET /admin/notices',
        'GET /admin/timetable',
        'GET /admin/expenses',
        'GET /admin/events',
        'GET /admin/leaves',
    ],
    'teacher' => [
        'GET /me',
        'GET /notifications', 'GET /notifications/unread-count',
        'GET /teacher/stats',
        'GET /teacher/assignments',
        'GET /teacher/classes', 'GET /teacher/classes/1/students',
        'GET /teacher/attendance', 'GET /teacher/attendance/summary',
        'GET /teacher/marks', 'GET /teacher/marks/mark-sheet?exam_id=1&class_id=1&subject_id=1',
        'GET /teacher/performance',
        'GET /teacher/reviews',
        'GET /teacher/diaries',
        'GET /teacher/subjects', 'GET /teacher/sections', 'GET /teacher/exams',
    ],
    'student' => [
        'GET /me',
        'GET /notifications', 'GET /notifications/unread-count',
        'GET /student/stats', 'GET /student/my-students',
        'GET /student/assignments', 'GET /student/diaries',
        'GET /student/attendance', 'GET /student/attendance/summary',
        'GET /student/marks', 'GET /student/marks/summary',
        'GET /student/exams', 'GET /student/announcements',
        'GET /student/invoices', 'GET /student/invoices/summary',
        'GET /student/fee-structures',
        'GET /student/courses', 'GET /student/timetable',
        'GET /student/leaves',
    ],
];

$groups['parent'] = $groups['student'];

$fails = 0;
foreach ($groups as $role => $paths) {
    if (! isset($tokens[$role])) {
        continue;
    }
    echo "\n───── $role ─────\n";
    foreach ($paths as $p) {
        [$method, $path] = explode(' ', $p, 2);
        $r = req($method, $base.$path, [], $tokens[$role]);
        $ok = $r['code'] >= 200 && $r['code'] < 300;
        if (! $ok) {
            $fails++;
            $j = json_decode($r['body'], true);
            $msg = $j['message'] ?? substr((string) $r['body'], 0, 400);
            printf("  [%3d] %-52s %s\n", $r['code'], $path, is_string($msg) ? $msg : json_encode($msg));
        } else {
            printf("  [%3d] %-52s ok (%d bytes)\n", $r['code'], $path, strlen((string) $r['body']));
        }
    }
}

echo "\nTOTAL FAILURES: $fails\n";