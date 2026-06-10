<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat akun admin default
        User::factory()->create([
            'name'  => 'Admin Ourpeers',
            'email' => 'admin@ourpeers.com',
        ]);

        $this->call([
            CategorySeeder::class, // ← harus sebelum ProductSeeder
            ProductSeeder::class,
        ]);
    }
}