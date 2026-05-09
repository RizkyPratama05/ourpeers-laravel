import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';

export default function Edit({ auth, product }) {
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
                                        onChange={(e) => setData('gambar', e.target.files[0])}
                                    />
                                    {errors.gambar && <div className="text-red-500 text-xs mt-1">{errors.gambar}</div>}
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
