import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function CheckStatus({ order: initialOrder }) {
    const [inputId, setInputId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = () => {
        if (!inputId) return;
        setLoading(true);
        setError('');
        
        router.get(`/order/${inputId}`, {}, {
            preserveState: true,
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
                setError('Pesanan tidak ditemukan. Pastikan Nomor Pesanan (Order ID) Anda benar.');
            }
        });
    };

    const getProgressWidth = (status) => {
        switch (status) {
            case 'selesai': return '100%';
            case 'siap': return '50%';
            case 'diproses': return '10%';
            default: return '5%';
        }
    };

    return (
        <MainLayout>
            <Head title="Cek Status Pesanan" />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="text-3xl font-bold text-center text-brand-navy mb-8">
                    Cek Status Pesanan
                </h1>

                {/* INPUT PENCARIAN */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex gap-4 p-2 bg-white border border-gray-300 rounded-xl shadow-sm focus-within:border-brand-lime focus-within:ring-2 focus-within:ring-lime-100 transition">
                        <input
                            type="text"
                            placeholder="Masukkan Nomor Pesanan (Contoh: INV-...)"
                            className="flex-grow p-3 outline-none rounded-lg text-slate-700 font-medium"
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                        />
                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className="bg-brand-lime text-brand-navy font-bold px-8 py-3 rounded-lg hover:bg-lime-500 transition shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Mencari..." : <><Search size={20} /> Cek Status</>}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-600 text-center rounded-lg border border-red-100 font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {initialOrder && (
                    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex flex-wrap justify-between items-end gap-4 bg-slate-50">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-navy mb-1">
                                    Pesanan Konveksi
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Nomor Pesanan: <span className="font-mono font-bold text-brand-navy text-lg">#{initialOrder.id}</span>
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Dipesan pada: {new Date(initialOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                                <p className="text-3xl font-bold text-brand-lime">
                                    Rp {initialOrder.grand_total.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="font-bold text-brand-navy mb-8 text-center text-lg">
                                Lacak Posisi Pesanan
                            </h3>

                            <div className="relative flex justify-between items-center mb-8 px-4 md:px-12">
                                <div className="absolute left-0 top-1/2 w-full h-2 bg-gray-100 -z-10 rounded-full"></div>
                                <div
                                    className="absolute left-0 top-1/2 h-2 bg-brand-lime -z-10 transition-all duration-1000 ease-out rounded-full"
                                    style={{ width: getProgressWidth(initialOrder.status) }}
                                ></div>

                                <div className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${['diproses', 'siap', 'selesai'].includes(initialOrder.status) ? 'border-brand-lime bg-lime-50 text-brand-lime' : 'border-gray-200 bg-white text-gray-300'}`}>
                                        <Package size={28} />
                                    </div>
                                    <p className={`text-sm font-bold mt-3 ${['diproses', 'siap', 'selesai'].includes(initialOrder.status) ? 'text-brand-navy' : 'text-gray-400'}`}>Diproses</p>
                                </div>

                                <div className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${['siap', 'selesai'].includes(initialOrder.status) ? 'border-brand-lime bg-lime-50 text-brand-lime' : 'border-gray-200 bg-white text-gray-300'}`}>
                                        <Truck size={28} />
                                    </div>
                                    <p className={`text-sm font-bold mt-3 ${['siap', 'selesai'].includes(initialOrder.status) ? 'text-brand-navy' : 'text-gray-400'}`}>Siap Dikirim</p>
                                </div>

                                <div className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${initialOrder.status === 'selesai' ? 'border-brand-lime bg-lime-50 text-brand-lime' : 'border-gray-200 bg-white text-gray-300'}`}>
                                        <CheckCircle size={28} />
                                    </div>
                                    <p className={`text-sm font-bold mt-3 ${initialOrder.status === 'selesai' ? 'text-brand-navy' : 'text-gray-400'}`}>Selesai</p>
                                </div>
                            </div>

                            <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
                                <span className="text-2xl">ℹ️</span>
                                <div>
                                    <p className="font-bold text-blue-900 text-sm">Informasi Pesanan</p>
                                    <p className="text-blue-800 text-sm mt-1">
                                        Tim kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi pengiriman atau pengambilan barang jika status sudah <b>Siap Dikirim</b>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
