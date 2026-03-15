<?php

use App\Http\Controllers\Api\RecommendationController;
use App\Http\Middleware\ValidateOrigin;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — PilihPintar.ai
|--------------------------------------------------------------------------
|
| Prefix: /api
|
*/

// ── Rekomendasi AI ───────────────────────────────────────────────────────
Route::middleware(['throttle:30,1', ValidateOrigin::class])->group(function () {
    // POST /api/recommendations — cari rekomendasi produk
    Route::post('/recommendations', [RecommendationController::class, 'search']);
});
