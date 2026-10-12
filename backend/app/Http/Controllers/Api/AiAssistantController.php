<?php

namespace App\Http\Controllers\Api;

use App\Services\GeminiService;
use App\Services\SchoolAssistantDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class AiAssistantController extends ApiController
{
    public function chat(Request $request, SchoolAssistantDataService $data, GeminiService $gemini): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'min:2', 'max:2000'],
            'history' => ['sometimes', 'array', 'max:8'],
            'history.*.role' => ['required', 'in:user,assistant'],
            'history.*.content' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();
        $result = $data->retrieve($user, $validated['message']);

        if (! $result['allowed'] || ! $result['supported']) {
            return response()->json(['answer' => $result['message']]);
        }

        try {
            $answer = $gemini->answer(
                $validated['message'],
                $validated['history'] ?? [],
                $result['data'],
            );

            return response()->json(['answer' => $answer]);
        } catch (RuntimeException $exception) {
            if (str_contains($exception->getMessage(), 'not configured')) {
                Log::warning('Gemini API key is not configured.');
            }

            return response()->json(['message' => $exception->getMessage()], 503);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['message' => 'The AI assistant could not complete your request. Please try again.'], 503);
        }
    }
}
