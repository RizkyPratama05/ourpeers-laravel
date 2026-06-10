<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Eager loading: ambil semua kategori beserta max 3 produknya
        $categories = Category::with(['products' => function ($q) {
            $q->latest()->take(3);
        }])->get();

        return Inertia::render('Home', [
            'products'   => Product::latest()->take(3)->get(), // tetap ada untuk hero section
            'categories' => $categories,
        ]);
    }
}