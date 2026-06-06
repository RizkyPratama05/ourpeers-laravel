import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ auth, product }) {
    const [imagePreview, setImagePreview] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        nama_produk: product.nama_produk,
        harga: product.harga,
        stok: product.stok,
        deskripsi: product.deskripsi,
        bahan: product.bahan || '',
        warna: product.warna || '',
        keunggulan: product.keunggulan || '',
        gambar: null,
        _method: 'PUT', // For spoofing PUT in multipart/form-data
    });

    const submit = (e) => {
        e.preventDefault();
        // Use post with _method PUT because Laravel doesn't handle files in native PUT requests easily
        post(route('admin.products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Produk</h2>}
        >
            <Head title={`Admin - Edit ${product.nama_produk}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <Link href={route('admin.products.index')} className="text-gray-500 flex items-center gap-2 mb-6 hover:text-brand-navy transition">
                            <ArrowLeft size={18} /> Kembali
                        </Link>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                        value={data.nama_produk}
                                        onChange={(e) => setData('nama_produk', e.target.value)}
                                        required
                                    />
                                    {errors.nama_produk && <div className="text-red-500 text-xs mt-1">{errors.nama_produk}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                        value={data.harga}
                                        onChange={(e) => setData('harga', e.target.value)}
                                        required
                                    />
                                    {errors.harga && <div className="text-red-500 text-xs mt-1">{errors.harga}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Stok (pcs)</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                        value={data.stok}
                                        onChange={(e) => setData('stok', e.target.value)}
                                        required
                                    />
                                    {errors.stok && <div className="text-red-500 text-xs mt-1">{errors.stok}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Foto Produk (Kosongkan jika tidak diganti)</label>
                                    <input
                                        type="file"
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-brand-lime hover:file:bg-lime-100"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setData('gambar', file);
                                            if (file) {
                                                setImagePreview(URL.createObjectURL(file));
                                            } else {
                                                setImagePreview(null);
                                            }
                                        }}
                                    />
                                    {errors.gambar && <div className="text-red-500 text-xs mt-1">{errors.gambar}</div>}

                                    {/* Current Image */}
                                    {product.gambar_url && !imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-xs font-bold text-gray-500 mb-2">Foto Saat Ini:</p>
                                            <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={`/storage/${product.gambar_url}`} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    )}

                                    {/* New Image Preview */}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-xs font-bold text-gray-500 mb-2">Preview Foto Baru:</p>
                                            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData('gambar', null);
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

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                                <textarea
                                    rows="4"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Bahan (Pisahkan dengan koma)</label>
                                    <input
                                        type="text"
                                        placeholder="Cotton Combed 24s, Drifit..."
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                        value={data.bahan}
                                        onChange={(e) => setData('bahan', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Warna (Pisahkan dengan koma)</label>
                                    <input
                                        type="text"
                                        placeholder="Hitam, Navy, Merah..."
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                        value={data.warna}
                                        onChange={(e) => setData('warna', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Keunggulan (Pisahkan dengan koma)</label>
                                <input
                                    type="text"
                                    placeholder="Bahan lembut, Jahitan rapi, Tidak mudah luntur..."
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-lime focus:ring-brand-lime"
                                    value={data.keunggulan}
                                    onChange={(e) => setData('keunggulan', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
                            >
                                <Save size={20} /> Simpan Perubahan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
