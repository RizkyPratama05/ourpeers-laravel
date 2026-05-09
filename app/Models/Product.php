<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'nama_produk',
        'harga',
        'stok',
        'deskripsi',
        'bahan',
        'warna',
        'keunggulan',
        'gambar_url',
    ];}
