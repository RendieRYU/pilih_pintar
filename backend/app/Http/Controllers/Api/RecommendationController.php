<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SearchQuery;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * RecommendationController — endpoint utama untuk pencarian rekomendasi.
 *
 * Flow:
 * 1. Validasi input
 * 2. Kirim ke GeminiService
 * 3. Simpan ke database (audit trail)
 * 4. Return JSON ke frontend
 */
class RecommendationController extends Controller
{
    /**
     * POST /api/recommendations
     *
     * Body: { "query": "Cari mouse gaming under 500rb" }
     */
    public function search(Request $request): JsonResponse
    {
        // ── 1. Validasi input ────────────────────────────────
        $validated = $request->validate([
            'query' => 'required|string|min:5|max:500',
        ], [
            'query.required' => 'Teks pencarian wajib diisi.',
            'query.min'      => 'Teks pencarian minimal 5 karakter.',
            'query.max'      => 'Teks pencarian terlalu panjang (maks 500 karakter).',
        ]);

        $ip        = $request->ip();
        $sessionId = $request->header('X-Session-Id', $ip);

        // ── 2. Kirim ke Gemini AI (dengan cache) ───────────
        $startTime = microtime(true);
        $normalizedQuery = preg_replace('/\s+/', ' ', mb_strtolower(trim($validated['query'])));
        $cacheKey  = 'gemini:' . md5($normalizedQuery);

        try {
            $result = Cache::remember($cacheKey, 3600, function () use ($validated) {
                $gemini = new GeminiService();
                return $gemini->getRecommendations($validated['query']);
            });
        } catch (\Exception $e) {
            Log::error('Recommendation search failed', [
                'query' => $validated['query'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error'   => 'ai_error',
                'message' => 'Maaf, terjadi kesalahan saat memproses permintaan. Coba lagi nanti.',
            ], 500);
        }

        $responseTimeMs = (int) ((microtime(true) - $startTime) * 1000);

        // ── 2b. Tambahkan link e-commerce (search URL) ──────
        if (isset($result['recommendations'])) {
            $result['recommendations'] = array_map(function (array $product) {
                $q = urlencode($product['name'] ?? '');
                $product['links'] = [
                    [
                        'store' => 'Tokopedia',
                        'url'   => "https://www.tokopedia.com/search?q={$q}",
                    ],
                    [
                        'store' => 'Shopee',
                        'url'   => "https://shopee.co.id/search?keyword={$q}",
                    ],
                    [
                        'store' => 'Blibli',
                        'url'   => "https://www.blibli.com/jual/{$q}",
                    ],
                ];
                return $product;
            }, $result['recommendations']);
        }

        // ── 3. Simpan ke database ────────────────────────────
        SearchQuery::create([
            'ip_address'      => $ip,
            'session_id'      => $sessionId,
            'query'           => $validated['query'],
            'result'          => $result,
            'response_time_ms' => $responseTimeMs,
        ]);

        // ── 4. Return response ───────────────────────────────
        return response()->json([
            'data'  => $result,
            'meta' => [
                'response_time_ms' => $responseTimeMs,
            ],
        ]);
    }
}
