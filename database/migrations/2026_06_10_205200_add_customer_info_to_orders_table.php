<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('nama_pemesan')->nullable()->after('user_id');
            $table->string('whatsapp_pemesan')->nullable()->after('nama_pemesan');
            $table->string('email_pemesan')->nullable()->after('whatsapp_pemesan');
            $table->string('organisasi_pemesan')->nullable()->after('email_pemesan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['nama_pemesan', 'whatsapp_pemesan', 'email_pemesan', 'organisasi_pemesan']);
        });
    }
};
