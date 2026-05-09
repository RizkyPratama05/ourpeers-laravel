import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function ProductDetail({ product }) {
    const stringToArray = (str) => {
        if (!str) return [];
        return str.split(',').map((item) => item.trim());
    };

    const listBahan = product.bahan
        ? stringToArray(product.bahan)
        : ['Standar (Default)'];
    const listWarna = product.warna
        ? stringToArray(product.warna)
        : ['Hitam', 'Putih'];
    const listKeunggulan = product.keunggulan
        ? stringToArray(product.keunggulan)
        : ['Bahan Berkualitas', 'Jahitan Rapi'];

    return (
        <MainLayout>
            <Head title={product.nama_produk} />

            {/* KONTEN UTAMA */}
            <div className="container mx-auto px-6 pt-32 pb-20">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-400 mb-6 flex gap-2">
                    <Link href="/" className="hover:text-brand-lime">
                        Beranda
                    </Link>
                    /
                    <Link href="/products" className="hover:text-brand-lime">
                        Produk
                    </Link>
                    /
                    <span className="text-brand-navy font-semibold">
                        {product.nama_produk}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* KIRI: Foto Produk */}
                    <div className="bg-gray-100 rounded-2xl h-[400px] md:h-[500px] flex items-center justify-center shadow-inner overflow-hidden border border-gray-200">
                        {product.gambar_url ? (
                            <img
                                src={`/storage/${product.gambar_url}`}
                                alt={product.nama_produk}
                                className="w-full h-full object-contain hover:scale-105 transition duration-500"
                            />
                        ) : (
                            <span className="text-gray-400 font-medium">Tidak ada foto</span>
                        )}
                    </div>

                    {/* KANAN: Detail Info */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-2">
                            {product.nama_produk}
                        </h1>

                        <p className="text-sm text-gray-500 mb-1">Harga Mulai Dari</p>
                        <div className="text-3xl font-bold text-brand-lime mb-6">
                            Rp {product.harga.toLocaleString('id-ID')}
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-brand-navy mb-2">Deskripsi</h3>
                            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                {product.deskripsi}
                            </p>
                        </div>

                        {/* Pilihan Bahan (Dinamis dari DB) */}
                        <div className="mb-6">
                            <h3 className="font-bold text-brand-navy mb-3">Pilihan Bahan</h3>
                            <div className="flex flex-wrap gap-3">
                                {listBahan.map((bahan, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50"
                                    >
                                        {bahan}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Pilihan Warna (Dinamis dari DB) */}
                        <div className="mb-6">
                            <h3 className="font-bold text-brand-navy mb-3">Pilihan Warna</h3>
                            <div className="flex flex-wrap gap-3">
                                {listWarna.map((warna, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50"
                                    >
                                        {warna}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Keunggulan (Dinamis dari DB) */}
                        <div className="mb-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-brand-navy mb-3">
                                Keunggulan Produk Ini
                            </h3>
                            <ul className="space-y-2">
                                {listKeunggulan.map((poin, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm text-gray-600">
                                        <CheckCircle
                                            size={18}
                                            className="text-brand-lime flex-shrink-0"
                                        />
                                        {poin}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* TOMBOL KE CUSTOM ORDER */}
                        <Link
                            href={`/product/${product.id}/custom`}
                            className="block text-center w-full bg-brand-lime text-brand-navy font-bold py-4 rounded-xl text-lg hover:bg-lime-500 transition shadow-xl shadow-lime-200/50"
                        >
                            Custom & Pesan Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
