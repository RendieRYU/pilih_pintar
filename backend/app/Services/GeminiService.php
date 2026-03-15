<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

/**
 * GeminiService — berkomunikasi dengan Google Gemini API.
 *
 * Bertanggung jawab untuk:
 * 1. Menyuntikkan system prompt yang ketat
 * 2. Mengirim query user ke Gemini
 * 3. Mem-parse response JSON terstruktur
 */
class GeminiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey  = config('services.gemini.api_key');
        $this->model   = config('services.gemini.model');
        $this->baseUrl = config('services.gemini.base_url');

        if (empty($this->apiKey) || $this->apiKey === 'your-gemini-api-key-here') {
            throw new InvalidArgumentException('GEMINI_API_KEY belum dikonfigurasi di .env');
        }
    }

    /**
     * System prompt yang ketat — memastikan Gemini mengembalikan
     * data dalam format JSON yang konsisten.
     */
    private function buildSystemPrompt(): string
    {
        return <<<'PROMPT'
Kamu adalah "PilihPintar AI", sebuah mesin rekomendasi barang cerdas berbahasa Indonesia.

TUGAS:
1. Analisis kebutuhan user dari teks yang diberikan.
2. Ekstrak: kategori barang, estimasi budget, preferensi utama.
3. Berikan TEPAT 3 rekomendasi produk yang tersedia di pasar Indonesia.
4. Setiap rekomendasi harus realistis dengan harga pasar terkini.

FORMAT OUTPUT — WAJIB JSON VALID, TANPA markdown fence, TANPA teks tambahan:
{
  "intent": {
    "category": "string — kategori barang (misal: TWS, Laptop, Mouse, dll)",
    "budget": "string — estimasi budget user (misal: Under 500rb, 5-10 juta)",
    "preferences": ["string — list preferensi utama"]
  },
  "recommendations": [
    {
      "name": "string — nama produk lengkap",
      "price": "string — harga format Rupiah (misal: Rp 499.000)",
      "matchScore": number (0-100, seberapa cocok dengan kebutuhan user),
      "pros": ["string — kelebihan 1", "string — kelebihan 2"],
      "cons": ["string — kekurangan utama 1 saja"]
    }
  ]
}

ATURAN KETAT:
- Jawab HANYA dalam format JSON di atas. Tidak ada teks pengantar atau penutup.
- Urutkan dari matchScore tertinggi ke terendah.
- pros HARUS tepat 2 item, cons HARUS tepat 1 item per produk.

ATURAN MEREK:
- Jika user menyebut merek/brand tertentu (misal: ASUS, Samsung, Logitech, dll), SEMUA 3 rekomendasi HARUS dari merek tersebut. DILARANG campur dengan merek lain.
- Jika user tidak menyebut merek, boleh campuran dari berbagai merek.

ATURAN BUDGET/HARGA:
- Jika user menyebut budget (misal: "di bawah 500rb", "10 juta kebawah", "range 3-5 juta"), SEMUA rekomendasi HARUS dalam range budget tersebut. DILARANG merekomendasikan produk di luar budget.
- Harga harus dalam format Rupiah (misal: Rp 499.000) dan realistis sesuai harga pasar Indonesia saat ini.
- Jangan membulatkan harga secara drastis — gunakan harga pasaran yang mendekati kenyataan.

ATURAN PRODUK:
- Produk HARUS benar-benar ada, nyata, dan tersedia di pasar Indonesia (Tokopedia, Shopee, Blibli).
- DILARANG mengarang/menghallusinasi nama produk atau spesifikasi.
- Gunakan nama produk lengkap dan resmi termasuk kode model (misal: "ASUS Vivobook 14 X1404ZA", bukan hanya "ASUS Vivobook").
- Spesifikasi yang disebut di pros/cons harus akurat sesuai produk asli.

ATURAN RELEVANSI:
- Rekomendasi HARUS sesuai dengan kategori yang diminta. Jangan rekomendasikan laptop jika user minta mouse.
- Jika user menyebut kebutuhan spesifik (gaming, kantor, kuliah, editing, dll), prioritaskan produk yang cocok untuk kebutuhan tersebut.
- matchScore harus realistis dan mencerminkan seberapa cocok produk dengan kebutuhan spesifik user, bukan sekedar kualitas umum produk.
- Produk dengan matchScore tertinggi harus paling relevan dengan SEMUA kriteria user.

ATURAN PROS/CONS:
- Pros harus spesifik dan relevan dengan kebutuhan user, bukan generik. Contoh baik: "SSD 512GB, booting cepat dalam 10 detik". Contoh buruk: "Kualitas bagus".
- Cons harus jujur dan informatif — bantu user tahu kekurangan nyata produk.
- Jangan tulis pros/cons yang saling kontradiksi.

ATURAN INTENT:
- Field "category" harus spesifik (misal: "Laptop Gaming", "TWS", "Mouse Wireless"), bukan generik seperti "Elektronik".
- Field "budget" harus mencerminkan budget yang user sebutkan, atau tulis "Tidak disebutkan" jika user tidak menyebut budget.
- Field "preferences" harus mengekstrak semua preferensi user termasuk: merek, fitur, use-case, dan kriteria lainnya.
PROMPT;
    }

    /**
     * Kirim query user ke Gemini dan dapatkan rekomendasi produk.
     *
     * @param  string  $userQuery  Teks kebutuhan dari user
     * @return array   Parsed JSON response dari Gemini
     *
     * @throws \Exception  Jika API gagal atau response tidak valid
     */
    public function getRecommendations(string $userQuery): array
    {
        // Sanitize: strip common prompt injection patterns
        $userQuery = $this->sanitizeQuery($userQuery);

        $url = "{$this->baseUrl}/models/{$this->model}:generateContent";

        $payload = [
            'system_instruction' => [
                'parts' => [
                    ['text' => $this->buildSystemPrompt()],
                ],
            ],
            'contents' => [
                [
                    'parts' => [
                        ['text' => $userQuery],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature'     => 0.7,
                'topP'            => 0.9,
                'maxOutputTokens' => 2048,
                'responseMimeType' => 'application/json',
            ],
        ];

        Log::info('Gemini request', ['query' => $userQuery]);

        $maxRetries = 3;
        $response   = null;

        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type'   => 'application/json',
                    'x-goog-api-key' => $this->apiKey,
                ])
                ->post($url, $payload);

            if ($response->status() === 429 && $attempt < $maxRetries) {
                $delay = $attempt * 2; // 2s, 4s backoff
                Log::warning("Gemini 429 rate-limited, retry {$attempt}/{$maxRetries} in {$delay}s");
                sleep($delay);
                continue;
            }

            break;
        }

        if ($response->failed()) {
            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new \Exception('Gagal menghubungi Gemini API: ' . $response->status());
        }

        $body = $response->json();

        // Extract teks dari response Gemini
        $text = $body['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$text) {
            Log::error('Gemini: response kosong', ['body' => $body]);
            throw new \Exception('Gemini mengembalikan response kosong.');
        }

        // Bersihkan markdown fence jika ada (safety net)
        $text = preg_replace('/^```json\s*|\s*```$/m', '', trim($text));

        $parsed = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Gemini: JSON parse error', ['text' => $text]);
            throw new \Exception('Gagal mem-parse response Gemini sebagai JSON.');
        }

        // Validasi struktur dasar
        if (!isset($parsed['recommendations']) || !is_array($parsed['recommendations'])) {
            Log::error('Gemini: struktur tidak valid', ['parsed' => $parsed]);
            throw new \Exception('Response Gemini tidak memiliki field "recommendations".');
        }

        // Validate schema of each recommendation
        $parsed['recommendations'] = array_values(array_filter(
            array_map([$this, 'validateRecommendation'], $parsed['recommendations'])
        ));

        if (empty($parsed['recommendations'])) {
            Log::error('Gemini: semua rekomendasi gagal validasi', ['parsed' => $parsed]);
            throw new \Exception('Semua rekomendasi dari Gemini gagal validasi schema.');
        }

        return $parsed;
    }

    /**
     * Sanitasi query user dari pola prompt-injection yang umum.
     */
    private function sanitizeQuery(string $query): string
    {
        // Strip known injection patterns
        $patterns = [
            '/ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?)/iu',
            '/system\s*prompt/iu',
            '/you\s+are\s+now/iu',
            '/forget\s+(everything|all)/iu',
            '/\bact\s+as\b/iu',
            '/\bjailbreak\b/iu',
            '/\bDAN\b/',
        ];

        foreach ($patterns as $pattern) {
            $query = preg_replace($pattern, '', $query);
        }

        // Collapse multiple whitespace
        $query = preg_replace('/\s+/', ' ', trim($query));

        return $query;
    }

    /**
     * Validasi & normalisasi satu item rekomendasi.
     * Return null jika field wajib tidak valid.
     */
    private function validateRecommendation(array $item): ?array
    {
        // name: string, max 200 chars
        if (!isset($item['name']) || !is_string($item['name']) || mb_strlen($item['name']) > 200) {
            return null;
        }

        // price: string
        if (!isset($item['price']) || !is_string($item['price'])) {
            return null;
        }

        // matchScore: int 0-100
        $score = $item['matchScore'] ?? null;
        if (!is_numeric($score)) {
            return null;
        }
        $item['matchScore'] = (int) max(0, min(100, $score));

        // pros: array of strings (max 5)
        if (!isset($item['pros']) || !is_array($item['pros'])) {
            $item['pros'] = [];
        }
        $item['pros'] = array_slice(array_filter($item['pros'], 'is_string'), 0, 5);

        // cons: array of strings (max 3)
        if (!isset($item['cons']) || !is_array($item['cons'])) {
            $item['cons'] = [];
        }
        $item['cons'] = array_slice(array_filter($item['cons'], 'is_string'), 0, 3);

        // Truncate long strings
        $item['name']  = mb_substr($item['name'], 0, 200);
        $item['price'] = mb_substr($item['price'], 0, 50);
        $item['pros']  = array_map(fn($s) => mb_substr($s, 0, 500), $item['pros']);
        $item['cons']  = array_map(fn($s) => mb_substr($s, 0, 500), $item['cons']);

        return $item;
    }
}
