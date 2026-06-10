<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil ID kategori berdasarkan slug agar tidak hardcode angka
        $kaos   = Category::where('slug', 'kaos')->first()->id;
        $hoodie = Category::where('slug', 'hoodie')->first()->id;
        $korsa  = Category::where('slug', 'korsa')->first()->id;
        $kemeja = Category::where('slug', 'kemeja')->first()->id;

        // === KAOS ===
        Product::create([
            'category_id' => $kaos,
            'nama_produk' => 'Kaos Polos Premium',
            'harga'       => 45000,
            'stok'        => 100,
            'deskripsi'   => 'Kaos polos dengan bahan Cotton Combed 24s yang nyaman dan menyerap keringat.',
            'bahan'       => 'Cotton Combed 24s, Cotton Combed 30s',
            'warna'       => 'Hitam, Putih, Navy, Maroon',
            'keunggulan'  => 'Bahan lembut, Jahitan rapi, Tidak mudah luntur',
            'gambar_url'  => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
        ]);

        Product::create([
            'category_id' => $kaos,
            'nama_produk' => 'Kaos Cotton Combed 20s',
            'harga'       => 64998,
            'stok'        => 80,
            'deskripsi'   => 'Kaos tebal berbahan Cotton Combed 20s, cocok untuk sablon dan bordir.',
            'bahan'       => 'Cotton Combed 20s',
            'warna'       => 'Hitam, Putih, Abu-abu, Navy',
            'keunggulan'  => 'Lebih tebal, Tidak transparan, Awet dicuci',
            'gambar_url'  => 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800',
        ]);

        // === HOODIE ===
        Product::create([
            'category_id' => $hoodie,
            'nama_produk' => 'Jaket Hoodie Custom',
            'harga'       => 125000,
            'stok'        => 50,
            'deskripsi'   => 'Hoodie berkualitas tinggi dengan bahan Fleece yang hangat dan tebal.',
            'bahan'       => 'Cotton Fleece, Baby Terry',
            'warna'       => 'Hitam, Abu-abu, Hijau Botol',
            'keunggulan'  => 'Hangat, Trendy, Bordir komputer',
            'gambar_url'  => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
        ]);

        Product::create([
            'category_id' => $hoodie,
            'nama_produk' => 'Hoodie Zipper Fleece',
            'harga'       => 145000,
            'stok'        => 40,
            'deskripsi'   => 'Hoodie resleting dengan bahan Fleece premium, nyaman untuk aktivitas sehari-hari.',
            'bahan'       => 'Fleece Premium',
            'warna'       => 'Hitam, Navy, Maroon',
            'keunggulan'  => 'Ada resleting, Saku depan, Bahan anti pilling',
            'gambar_url'  => 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
        ]);

        // === KORSA ===
        Product::create([
            'category_id' => $korsa,
            'nama_produk' => 'Jaket Korsa Organisasi',
            'harga'       => 135000,
            'stok'        => 60,
            'deskripsi'   => 'Jaket korsa ideal untuk seragam organisasi, komunitas, dan kampus.',
            'bahan'       => 'Bahan Parasut, Taslan',
            'warna'       => 'Hitam, Navy, Biru Royal',
            'keunggulan'  => 'Ringan, Tahan angin, Sablon awet',
            'gambar_url'  => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        ]);

        Product::create([
            'category_id' => $korsa,
            'nama_produk' => 'Korsa Varsity Custom',
            'harga'       => 160000,
            'stok'        => 35,
            'deskripsi'   => 'Jaket varsity dua warna dengan aksen kontras, cocok untuk angkatan dan komunitas.',
            'bahan'       => 'Drill, Rib',
            'warna'       => 'Hitam-Merah, Navy-Putih, Hijau-Kuning',
            'keunggulan'  => 'Dua warna, Bordir nama, Desain eksklusif',
            'gambar_url'  => 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=800',
        ]);

        // === KEMEJA ===
        Product::create([
            'category_id' => $kemeja,
            'nama_produk' => 'Kemeja PDL Lapangan',
            'harga'       => 110000,
            'stok'        => 75,
            'deskripsi'   => 'Kemeja PDL tangguh untuk kegiatan outdoor dan organisasi.',
            'bahan'       => 'American Drill, Japan Drill',
            'warna'       => 'Khaki, Biru Benhur, Hitam',
            'keunggulan'  => 'Kuat, Banyak saku, Ventilasi udara',
            'gambar_url'  => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
        ]);

        Product::create([
            'category_id' => $kemeja,
            'nama_produk' => 'Kemeja Seragam Kantor',
            'harga'       => 95000,
            'stok'        => 90,
            'deskripsi'   => 'Kemeja seragam kerja dengan potongan formal dan bahan yang adem.',
            'bahan'       => 'Tropical, Tetoron',
            'warna'       => 'Putih, Biru Muda, Abu-abu',
            'keunggulan'  => 'Anti kusut, Mudah disetrika, Potongan slim fit',
            'gambar_url'  => 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=800',
        ]);
    }
}