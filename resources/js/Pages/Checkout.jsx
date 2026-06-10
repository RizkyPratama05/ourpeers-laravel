import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Checkout() {
    const [orderData, setOrderData] = useState(null);

    // State untuk Form Pemesan
    const [formData, setFormData] = useState({
        nama: '',
        whatsapp: '',
        email: '',
        organisasi: '',
        alamat: '',
    });

    useEffect(() => {
        const data = localStorage.getItem('tempOrder');
        if (data) {
            setOrderData(JSON.parse(data));
        } else {
            window.location.href = '/';
        }
    }, []);

    if (!orderData) return null;

    const handleSubmit = () => {
        if (!formData.nama || !formData.whatsapp || !formData.alamat || !formData.email) {
            alert('Mohon lengkapi Nama, WhatsApp, Email, dan Alamat.');
            return;
        }

        const payload = {
            user_id: 1, // Placeholder
            alamat: formData.alamat,
            kurir: 'JNE',
            items: [
                {
                    id: orderData.product.id,
                    harga: orderData.product.harga,
                    qty: orderData.totalQty,
                    detail: {
                        bahan: orderData.bahan,
                        warna: orderData.warna,
                        ukuran: orderData.ukuran,
                        catatan: orderData.catatan,
                        desain: orderData.desain || null,
                    },
                },
            ],
            customer_info: formData,
        };

        router.post('/checkout', payload, {
            onSuccess: (page) => {
                // Success logic
                localStorage.removeItem('tempOrder');
                // router will automatically navigate if the controller redirects
            },
            onError: (errors) => {
                console.error(errors);
                alert('Terjadi kesalahan saat memproses pesanan.');
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Form Pemesanan" />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="text-3xl font-bold text-brand-navy mb-8">
                    Form Pemesanan
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm">
                            <h3 className="font-bold text-lg text-brand-navy mb-6">
                                Data Pemesan
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-brand-lime"
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Nomor HP/WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-brand-lime"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-brand-lime"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Nama Organisasi/Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nama organisasi (opsional)"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-brand-lime"
                                        value={formData.organisasi}
                                        onChange={(e) => setFormData({ ...formData, organisasi: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Alamat Pengiriman <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows="3"
                                        placeholder="Alamat lengkap untuk pengiriman"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-brand-lime"
                                        value={formData.alamat}
                                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="border border-gray-200 rounded-xl p-6 sticky top-24 bg-white shadow-lg">
                            <h3 className="font-bold text-lg text-brand-navy mb-4">
                                Ringkasan Pesanan
                            </h3>

                            <div className="space-y-4 mb-6 text-sm">
                                <div className="pb-4 border-b border-gray-100">
                                    <p className="text-gray-400 text-xs">Produk</p>
                                    <p className="font-bold text-brand-navy text-lg">
                                        {orderData.product.nama_produk}
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Bahan</span>
                                    <span className="font-medium">{orderData.bahan}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Warna</span>
                                    <span className="font-medium">{orderData.warna}</span>
                                </div>

                                {orderData.desain?.dada_kiri?.url && (
                                    <div className="pb-2 border-b border-gray-100 space-y-1">
                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Desain Depan</p>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={orderData.desain.dada_kiri.url}
                                                alt="Desain Depan"
                                                className="w-10 h-10 object-cover rounded border border-slate-100"
                                            />
                                            <span className="text-xs font-medium text-slate-600">
                                                Ukuran: {orderData.desain.dada_kiri.size || 'Standar'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {orderData.desain?.belakang?.url && (
                                    <div className="pb-2 border-b border-gray-100 space-y-1">
                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Desain Belakang</p>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={orderData.desain.belakang.url}
                                                alt="Belakang"
                                                className="w-10 h-10 object-cover rounded border border-slate-100"
                                            />
                                            <span className="text-xs font-medium text-slate-600">
                                                Ukuran: {orderData.desain.belakang.size || 'Standar'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Jumlah</span>
                                    <span className="font-bold">{orderData.totalQty} pcs</span>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 space-y-1">
                                    <p className="font-bold mb-1">Detail Ukuran:</p>
                                    {Object.entries(orderData.ukuran).map(
                                        ([size, qty]) =>
                                            qty > 0 && (
                                                <div key={size} className="flex justify-between">
                                                    <span>Size {size}</span>
                                                    <span>{qty} pcs</span>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-500">Estimasi Total</span>
                                    <span className="text-2xl font-bold text-brand-lime">
                                        Rp {orderData.totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 italic text-right mb-4">
                                    *Harga final akan dikonfirmasi oleh tim kami
                                </p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-brand-lime text-brand-navy font-bold py-3 rounded-lg hover:bg-lime-500 transition shadow-lg"
                            >
                                Kirim Pesanan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
