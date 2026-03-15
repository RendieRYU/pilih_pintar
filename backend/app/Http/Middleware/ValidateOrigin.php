<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * ValidateOrigin — lightweight server-side origin check.
 *
 * Blocks requests from unknown origins to prevent API abuse
 * from scrapers and bots (CORS is browser-only).
 */
class ValidateOrigin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip check in local/testing
        if (app()->environment('local', 'testing')) {
            return $next($request);
        }

        $allowedOrigins = array_filter([
            config('app.frontend_url'),
            config('app.url'),
        ]);

        $origin  = $request->header('Origin');
        $referer = $request->header('Referer');

        // If no origin/referer headers, it's likely a server-to-server call — allow
        if (!$origin && !$referer) {
            return $next($request);
        }

        // Check Origin header
        if ($origin && $this->isAllowed($origin, $allowedOrigins)) {
            return $next($request);
        }

        // Check Referer header
        if ($referer && $this->isAllowed($referer, $allowedOrigins)) {
            return $next($request);
        }

        return response()->json([
            'error'   => 'forbidden',
            'message' => 'Origin tidak diizinkan.',
        ], 403);
    }

    private function isAllowed(string $url, array $allowedOrigins): bool
    {
        $parsed = parse_url($url);
        $origin = ($parsed['scheme'] ?? 'http') . '://' . ($parsed['host'] ?? '');

        if (isset($parsed['port'])) {
            $origin .= ':' . $parsed['port'];
        }

        foreach ($allowedOrigins as $allowed) {
            if (str_starts_with($origin, rtrim($allowed, '/'))) {
                return true;
            }
        }

        return false;
    }
}
