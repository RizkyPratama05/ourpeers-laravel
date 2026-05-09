import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CustomOrder({ product }) {
    // State Pilihan User
    const [bahan, setBahan] = useState('');
    const [warna, setWarna] = useState('');
    const [ukuran, setUkuran] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
    const [catatan, setCatatan] = useState('');

    const stringToArray = (str) =>
        str ? str.split(',').map((s) => s.trim()) : [];

    const materialPrices = {
        'Cotton Combed 24s': 5000,
        'Cotton Bamboo': 10000,
        'Drill Premium': 15000,
    };

    const totalQty = Object.values(ukuran).reduce((a, b) => a + b, 0);
    const basePrice = product ? product.harga : 0;
    const extraPrice = materialPrices[bahan] || 0;
    const unitPrice = basePrice + extraPrice;
    const totalPrice = unitPrice * totalQty;

    const handleQtyChange = (size, value) => {
        const val = parseInt(value);
        setUkuran({ ...ukuran, [size]: val >= 0 ? val : 0 });
    };

    const handleLanjut = () => {
        if (!bahan || !warna || totalQty === 0) {
            alert('Mohon pilih bahan, warna, dan minimal 1 ukuran (jumlah pcs).');
            return;
        }

        const orderSummary = {
            product,
            bahan,
            warna,
            ukuran,
            totalQty,
            unitPrice,
            totalPrice,
            catatan,
        };

        localStorage.setItem('tempOrder', JSON.stringify(orderSummary));
        window.location.href = '/checkout'; // Or use router.visit
    };

    const listBahan = product.bahan ? stringToArray(product.bahan) : ['Standar'];
    const listWarna = product.warna ? stringToArray(product.warna) : ['Default'];

    return (
        <MainLayout>
            <Head title={`Custom ${product.nama_produk}`} />

            <div className="container mx-auto px-6 pt-32">
                <div className="text-sm text-gray-400 mb-6 flex gap-2 items-center">
                    <Link href="/products">Produk</Link> /<span>{product.nama_produk}</span>{' '}
                    /<span className="text-brand-navy font-bold">Customisasi</span>
                </div>

                <h1 className="text-3xl font-bold text-brand-navy mb-8">
                    Customisasi {product.nama_produk}
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-brand-navy mb-4 flex justify-between">
                                Pilih Bahan <span className="text-red-500">*</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {listBahan.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setBahan(item)}
                                        className={`relative p-4 rounded-lg border-2 text-left transition ${
                                            bahan === item
                                                ? 'border-brand-lime bg-lime-50 text-brand-navy'
                                                : 'border-gray-100 hover:border-brand-lime/50'
                                        }`}
                                    >
                                        <div className="font-bold text-sm">{item}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {materialPrices[item]
                                                ? `+ Rp ${materialPrices[item].toLocaleString('id-ID')}`
                                                : 'Harga Standar'}
                                        </div>
                                        {bahan === item && (
                                            <div className="absolute top-2 right-2 text-brand-lime">
                                                <Check size={16} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-brand-navy mb-4">
                                Pilih Warna <span className="text-red-500">*</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {listWarna.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setWarna(c)}
                                        className={`px-6 py-2 rounded-lg border text-sm font-medium transition ${
                                            warna === c
                                                ? 'bg-brand-navy text-white border-brand-navy'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-navy'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-brand-navy mb-4">
                                Ukuran & Jumlah <span className="text-red-500">*</span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.keys(ukuran).map((size) => (
                                    <div key={size}>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">
                                            {size}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={ukuran[size]}
                                            onChange={(e) => handleQtyChange(size, e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-2 text-center focus:border-brand-lime focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-brand-navy mb-4">
                                Catatan Tambahan (Opsional)
                            </h3>
                            <textarea
                                rows="3"
                                placeholder="Contoh: Logo di dada kiri, Nama 'Budi' di punggung..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:border-brand-lime focus:outline-none"
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-24">
                            <h3 className="font-bold text-lg text-brand-navy mb-6">
                                Ringkasan Pesanan
                            </h3>

                            <div className="space-y-4 mb-6 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Produk</p>
                                    <p className="font-bold text-brand-navy text-base">
                                        {product.nama_produk}
                                    </p>
                                </div>

                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Bahan</span>
                                    <span className="font-medium text-right">{bahan || '-'}</span>
                                </div>

                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Harga Satuan</span>
                                    <span className="font-medium">
                                        Rp {unitPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Warna</span>
                                    <span className="font-medium">{warna || '-'}</span>
                                </div>
                            </div>

                            <div className="mb-6 bg-slate-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500">Total Jumlah</span>
                                    <span className="font-bold">{totalQty} pcs</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-gray-600 font-bold">Total Harga</span>
                                    <span className="text-2xl font-bold text-brand-lime">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleLanjut}
                                className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition flex justify-center items-center gap-2 shadow-lg"
                            >
                                Lanjutkan Pemesanan <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
