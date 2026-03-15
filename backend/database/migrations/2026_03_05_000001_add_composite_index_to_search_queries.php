<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add composite index for faster quota lookups.
     */
    public function up(): void
    {
        Schema::table('search_queries', function (Blueprint $table) {
            $table->index(['ip_address', 'created_at'], 'search_queries_ip_created_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('search_queries', function (Blueprint $table) {
            $table->dropIndex('search_queries_ip_created_idx');
        });
    }
};
