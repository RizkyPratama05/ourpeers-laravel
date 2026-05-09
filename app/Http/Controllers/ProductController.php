<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products', [
            'products' => Product::latest()->get(),
        ]);
    }

    public function show($id)
    {
        return Inertia::render('ProductDetail', [
            'product' => Product::findOrFail($id),
        ]);
    }

    public function custom($id)
    {
        return Inertia::render('CustomOrder', [
            'product' => Product::findOrFail($id),
        ]);
    }
}
