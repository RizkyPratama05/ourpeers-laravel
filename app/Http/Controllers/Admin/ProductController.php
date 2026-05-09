<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'deskripsi' => 'required|string',
            'bahan' => 'nullable|string',
            'warna' => 'nullable|string',
            'keunggulan' => 'nullable|string',
            'gambar' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('gambar');

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('products', 'public');
            $data['gambar_url'] = $path;
        }

        Product::create($data);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => Product::findOrFail($id),
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|max:2048',
        ]);

        $data = $request->except('gambar');

        if ($request->hasFile('gambar')) {
            // Delete old image
            if ($product->gambar_url) {
                Storage::disk('public')->delete($product->gambar_url);
            }
            $path = $request->file('gambar')->store('products', 'public');
            $data['gambar_url'] = $path;
        }

        $product->update($data);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->gambar_url) {
            Storage::disk('public')->delete($product->gambar_url);
        }
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
