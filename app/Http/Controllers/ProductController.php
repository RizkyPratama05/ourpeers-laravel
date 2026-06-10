<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Ambil semua kategori untuk tombol filter
        $categories = Category::all();

        // Ambil produk dengan relasi kategori, filter jika ada query ?category=slug
        $products = Product::with('category')
            ->when($request->category, function ($query, $slug) {
                $query->whereHas('category', fn($q) => $q->where('slug', $slug));
            })
            ->latest()
            ->get();

        return Inertia::render('Products', [
            'products'         => $products,
            'categories'       => $categories,
            'selectedCategory' => $request->category ?? null,
        ]);
    }

    public function show($id)
    {
        // Eager load kategori agar bisa ditampilkan di halaman detail
        $product = Product::with('category')->findOrFail($id);

        return Inertia::render('ProductDetail', [
            'product' => $product,
        ]);
    }

    public function custom($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return Inertia::render('CustomOrder', [
            'product' => $product,
        ]);
    }
}