<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'nama_produk' => 'Kaos Polos Premium',
            'harga' => 45000,
            'stok' => 100,
            'deskripsi' => 'Kaos polos dengan bahan Cotton Combed 24s yang nyaman dan menyerap keringat.',
            'bahan' => 'Cotton Combed 24s, Cotton Combed 30s',
            'warna' => 'Hitam, Putih, Navy, Maroon',
            'keunggulan' => 'Bahan lembut, Jahitan rapi, Tidak mudah luntur',
            'gambar_url' => 'kaos_premium.png',
        ]);

        Product::create([
            'nama_produk' => 'Jaket Hoodie Custom',
            'harga' => 125000,
            'stok' => 50,
            'deskripsi' => 'Hoodie berkualitas tinggi dengan bahan Fleece yang hangat dan tebal.',
            'bahan' => 'Cotton Fleece, Baby Terry',
            'warna' => 'Hitam, Abu-abu, Hijau Botol',
            'keunggulan' => 'Hangat, Trendy, Bordir komputer',
            'gambar_url' => 'hoodie_custom.png',
        ]);

        Product::create([
            'nama_produk' => 'Kemeja PDL Lapangan',
            'harga' => 110000,
            'stok' => 75,
            'deskripsi' => 'Kemeja PDL tangguh untuk kegiatan outdoor dan organisasi.',
            'bahan' => 'American Drill, Japan Drill',
            'warna' => 'Khaki, Biru Benhur, Hitam',
            'keunggulan' => 'Kuat, Banyak saku, Ventilasi udara',
            'gambar_url' => 'kemeja_pdl.png',
        ]);
    }
}
