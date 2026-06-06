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
            'gambar_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
        ]);

        Product::create([
            'nama_produk' => 'Jaket Hoodie Custom',
            'harga' => 125000,
            'stok' => 50,
            'deskripsi' => 'Hoodie berkualitas tinggi dengan bahan Fleece yang hangat dan tebal.',
            'bahan' => 'Cotton Fleece, Baby Terry',
            'warna' => 'Hitam, Abu-abu, Hijau Botol',
            'keunggulan' => 'Hangat, Trendy, Bordir komputer',
            'gambar_url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
        ]);

        Product::create([
            'nama_produk' => 'Kemeja PDL Lapangan',
            'harga' => 110000,
            'stok' => 75,
            'deskripsi' => 'Kemeja PDL tangguh untuk kegiatan outdoor dan organisasi.',
            'bahan' => 'American Drill, Japan Drill',
            'warna' => 'Khaki, Biru Benhur, Hitam',
            'keunggulan' => 'Kuat, Banyak saku, Ventilasi udara',
            'gambar_url' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
        ]);
    }
}
