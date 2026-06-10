<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Kaos', 'Hoodie', 'Korsa', 'Kemeja'];

        foreach ($categories as $nama) {
            Category::create([
                'nama' => $nama,
                'slug' => Str::slug($nama),
            ]);
        }
    }
}