import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Save, ArrowLeft, X, Tag } from "lucide-react";
import { useState } from "react";

export default function Edit({ product, categories }) {
    const [imagePreview, setImagePreview] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        nama_produk: product.nama_produk,
        category_id: product.category_id ?? "", // ← BARU, pre-fill nilai saat ini
        harga: product.harga,
        stok: product.stok,
        deskripsi: product.deskripsi,
        bahan: product.bahan || "",
        warna: product.warna || "",
        keunggulan: product.keunggulan || "",
        gambar: null,
        _method: "PUT",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.products.update", product.id));
    };

    return (
        <AuthenticatedLayout header={`Edit Produk`}>
            <Head title={`Admin - Edit ${product.nama_produk}`} />

            <div className="max-w-4xl">
                <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                    <Link
                        href={route("admin.products.index")}
                        className="text-slate-400 flex items-center gap-2 mb-8 hover:text-brand-navy transition text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Kembali ke Produk
                    </Link>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Nama Produk */}
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Nama Produk
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                    value={data.nama_produk}
                                    onChange={(e) =>
                                        setData("nama_produk", e.target.value)
                                    }
                                    required
                                />
                                {errors.nama_produk && (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">
                                        {errors.nama_produk}
                                    </p>
                                )}
                            </div>

                            {/* Kategori — BARU, nilai saat ini sudah terpilih */}
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Tag size={12} /> Kategori
                                </label>
                                <select
                                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent bg-white"
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData("category_id", e.target.value)
                                    }
                                >
                                    <option value="">— Tanpa Kategori —</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nama}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            {/* Harga */}
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Harga (Rp)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                    value={data.harga}
                                    onChange={(e) =>
                                        setData("harga", e.target.value)
                                    }
                                    required
                                />
                                {errors.harga && (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">
                                        {errors.harga}
                                    </p>
                                )}
                            </div>

                            {/* Stok */}
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Stok (pcs)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                    value={data.stok}
                                    onChange={(e) =>
                                        setData("stok", e.target.value)
                                    }
                                    required
                                />
                                {errors.stok && (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">
                                        {errors.stok}
                                    </p>
                                )}
                            </div>

                            {/* Upload Foto */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Foto Produk (kosongkan jika tidak diganti)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-brand-lime hover:file:bg-lime-100"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("gambar", file);
                                        setImagePreview(
                                            file
                                                ? URL.createObjectURL(file)
                                                : null,
                                        );
                                    }}
                                />
                                {errors.gambar && (
                                    <p className="text-red-500 text-xs mt-1 font-semibold">
                                        {errors.gambar}
                                    </p>
                                )}
                                {/* Foto saat ini */}
                                {product.gambar_url && !imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            Foto Saat Ini:
                                        </p>
                                        <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                                            <img
                                                src={
                                                    product.gambar_url.startsWith(
                                                        "http",
                                                    )
                                                        ? product.gambar_url
                                                        : `/storage/${product.gambar_url}`
                                                }
                                                className="w-full h-full object-cover"
                                                alt="Current"
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Preview foto baru */}
                                {imagePreview && (
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                            Preview Foto Baru:
                                        </p>
                                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                                            <img
                                                src={imagePreview}
                                                className="w-full h-full object-cover"
                                                alt="Preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData("gambar", null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                rows="4"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Bahan (pisahkan koma)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Cotton Combed 24s, Drifit..."
                                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                    value={data.bahan}
                                    onChange={(e) =>
                                        setData("bahan", e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                    Warna (pisahkan koma)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Hitam, Navy, Merah..."
                                    className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                    value={data.warna}
                                    onChange={(e) =>
                                        setData("warna", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                                Keunggulan (pisahkan koma)
                            </label>
                            <input
                                type="text"
                                placeholder="Bahan lembut, Jahitan rapi..."
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent"
                                value={data.keunggulan}
                                onChange={(e) =>
                                    setData("keunggulan", e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-navy text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-lime hover:text-brand-navy transition-all duration-500 shadow-lg disabled:opacity-50 uppercase tracking-widest text-sm"
                        >
                            <Save size={18} /> Simpan Perubahan
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
