import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Products({ products, categories, selectedCategory }) {
    const [search, setSearch] = useState("");

    // Filter produk berdasarkan search input (dijalankan di sisi klien)
    const filteredProducts = products.filter((item) =>
        item.nama_produk.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <MainLayout>
            <Head title="Katalog Produk" />

            {/* === HEADER KATALOG === */}
            <div className="bg-brand-navy pt-32 pb-16 px-6 text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Katalog Produk Lengkap
                </h1>
                <p className="text-slate-300 max-w-xl mx-auto mb-8">
                    Temukan berbagai pilihan konveksi berkualitas untuk
                    kebutuhan komunitas dan perusahaan Anda.
                </p>

                {/* Search Bar */}
                <div className="max-w-lg mx-auto relative">
                    <input
                        type="text"
                        placeholder="Cari produk (misal: Kemeja, Kaos...)"
                        className="w-full py-3 px-5 rounded-full text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-lime"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute right-4 top-3 text-gray-400">
                        <Search size={20} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                {/* === TOMBOL FILTER KATEGORI === */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {/* Tombol "Semua" */}
                    <Link
                        href="/products"
                        className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                            !selectedCategory
                                ? "bg-brand-navy text-white border-brand-navy shadow-md"
                                : "bg-white text-slate-600 border-slate-200 hover:border-brand-navy hover:text-brand-navy"
                        }`}
                    >
                        Semua
                    </Link>

                    {/* Tombol per kategori */}
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className={`px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                                selectedCategory === cat.slug
                                    ? "bg-brand-navy text-white border-brand-navy shadow-md"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-navy hover:text-brand-navy"
                            }`}
                        >
                            {cat.nama}
                        </Link>
                    ))}
                </div>

                {/* Jumlah hasil */}
                <p className="text-sm text-slate-400 mb-6">
                    Menampilkan{" "}
                    <span className="font-bold text-brand-navy">
                        {filteredProducts.length}
                    </span>{" "}
                    produk
                    {selectedCategory && (
                        <span>
                            {" "}
                            dalam kategori{" "}
                            <span className="font-bold text-brand-lime capitalize">
                                {selectedCategory}
                            </span>
                        </span>
                    )}
                </p>

                {/* === GRID PRODUK === */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition flex flex-col border border-gray-100 group"
                            >
                                {/* Gambar Produk */}
                                <div className="h-60 w-full bg-gray-200 overflow-hidden flex items-center justify-center relative">
                                    {item.gambar_url ? (
                                        <img
                                            src={
                                                item.gambar_url.startsWith(
                                                    "http",
                                                )
                                                    ? item.gambar_url
                                                    : `/storage/${item.gambar_url}`
                                            }
                                            alt={item.nama_produk}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    ) : (
                                        <span className="text-gray-400 font-medium">
                                            No Image
                                        </span>
                                    )}
                                    {/* Badge Stok */}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm">
                                        Stok: {item.stok}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    {/* Badge Kategori */}
                                    {item.category && (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime mb-1">
                                            {item.category.nama}
                                        </span>
                                    )}

                                    <h3 className="text-lg font-bold text-brand-navy mb-1 line-clamp-1">
                                        {item.nama_produk}
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Mulai dari
                                    </p>

                                    <div className="text-xl font-bold text-brand-lime mb-4">
                                        Rp {item.harga.toLocaleString("id-ID")}
                                    </div>

                                    <Link
                                        href={`/product/${item.id}`}
                                        className="mt-auto w-full bg-brand-navy text-white font-medium py-2 rounded-lg hover:bg-brand-lime hover:text-brand-navy transition text-center text-sm flex items-center justify-center gap-1"
                                    >
                                        Detail & Custom{" "}
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <p className="text-xl font-bold mb-2">
                                Produk tidak ditemukan
                            </p>
                            <p>
                                Coba kata kunci lain atau hubungi kami untuk
                                custom request.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
