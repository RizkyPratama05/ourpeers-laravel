<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Sertakan nama kategori agar bisa ditampilkan di tabel admin
        return Inertia::render('Admin/Products/Index', [
            'products' => Product::with('category')->latest()->get(),
            'categories' => Category::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            // Kirim daftar kategori untuk dropdown di form tambah produk
            'categories' => Category::orderBy('nama')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'deskripsi'   => 'required|string',
            'bahan'       => 'nullable|string',
            'warna'       => 'nullable|string',
            'keunggulan'  => 'nullable|string',
            'gambar'      => 'nullable|image|max:2048',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data = $request->except('gambar');

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('products', 'public');
            $data['gambar_url'] = $path;
        }

        Product::create($data);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product'    => Product::with('category')->findOrFail($id),
            // Kirim daftar kategori untuk dropdown di form edit produk
            'categories' => Category::orderBy('nama')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'deskripsi'   => 'required|string',
            'bahan'       => 'nullable|string',
            'warna'       => 'nullable|string',
            'keunggulan'  => 'nullable|string',
            'gambar'      => 'nullable|image|max:2048',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data = $request->except('gambar');

        if ($request->hasFile('gambar')) {
            // Hapus foto lama dari storage jika bukan URL eksternal
            if ($product->gambar_url && !str_starts_with($product->gambar_url, 'http')) {
                Storage::disk('public')->delete($product->gambar_url);
            }
            $path = $request->file('gambar')->store('products', 'public');
            $data['gambar_url'] = $path;
        }

        $product->update($data);

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Hapus foto dari storage jika bukan URL eksternal
        if ($product->gambar_url && !str_starts_with($product->gambar_url, 'http')) {
            Storage::disk('public')->delete($product->gambar_url);
        }

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}