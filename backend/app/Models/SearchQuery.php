<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * SearchQuery — menyimpan setiap pencarian user untuk
 * keperluan analytics dan audit trail.
 */
class SearchQuery extends Model
{
    protected $fillable = [
        'ip_address',
        'session_id',
        'query',
        'result',
        'response_time_ms',
    ];

    protected function casts(): array
    {
        return [
            'result' => 'array',
        ];
    }
}
