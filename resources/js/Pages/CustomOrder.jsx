import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, ChevronRight, Upload, Image, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function CustomOrder({ product }) {
    // State Pilihan User
    const [bahan, setBahan] = useState('');
    const [warna, setWarna] = useState('');
    const [ukuran, setUkuran] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
    const [catatan, setCatatan] = useState('');
    
    const [modalMessage, setModalMessage] = useState(null);

    // State Desain Custom
    const [dadaKiriFile, setDadaKiriFile] = useState(null);
    const [dadaKiriPath, setDadaKiriPath] = useState('');
    const [dadaKiriUrl, setDadaKiriUrl] = useState('');
    const [dadaKiriSize, setDadaKiriSize] = useState('');
    const [dadaKiriLoading, setDadaKiriLoading] = useState(false);

    const [belakangFile, setBelakangFile] = useState(null);
    const [belakangPath, setBelakangPath] = useState('');
    const [belakangUrl, setBelakangUrl] = useState('');
    const [belakangSize, setBelakangSize] = useState('');
    const [belakangLoading, setBelakangLoading] = useState(false);

    const handleDesignUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('design_file', file);

        if (type === 'dada_kiri') {
            setDadaKiriFile(file);
            setDadaKiriLoading(true);
        } else {
            setBelakangFile(file);
            setBelakangLoading(true);
        }

        try {
            const response = await axios.post('/upload-design', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                if (type === 'dada_kiri') {
                    setDadaKiriPath(response.data.path);
                    setDadaKiriUrl(response.data.url);
                } else {
                    setBelakangPath(response.data.path);
                    setBelakangUrl(response.data.url);
                }
            }
        } catch (error) {
            console.error(error);
            setModalMessage('Gagal mengunggah desain. Silakan coba file gambar lain.');
            if (type === 'dada_kiri') {
                setDadaKiriFile(null);
            } else {
                setBelakangFile(null);
            }
        } finally {
            if (type === 'dada_kiri') {
                setDadaKiriLoading(false);
            } else {
                setBelakangLoading(false);
            }
        }
    };

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
            setModalMessage('Mohon pilih bahan, warna, dan minimal 1 ukuran (jumlah pcs).');
            return;
        }

        if (totalQty > product.stok) {
            setModalMessage(`Mohon maaf, jumlah pesanan Anda (${totalQty} pcs) melebihi stok yang tersedia (${product.stok} pcs).`);
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
            desain: {
                dada_kiri: {
                    path: dadaKiriPath,
                    url: dadaKiriUrl,
                    size: dadaKiriSize,
                },
                belakang: {
                    path: belakangPath,
                    url: belakangUrl,
                    size: belakangSize,
                }
            }
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

                        {/* SECTION UPLOAD DESAIN CUSTOM */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-brand-navy mb-2">
                                Desain Sablon / Bordir Custom (Opsional)
                            </h3>
                            <p className="text-xs text-gray-500 mb-6">
                                Unggah logo atau desain yang ingin dipasang beserta ukurannya untuk mempermudah pengerjaan kami.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Desain Depan */}
                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                    <h4 className="text-sm font-bold text-brand-navy mb-3">
                                        Desain Depan
                                    </h4>
                                    
                                    <div className="mb-4">
                                        {!dadaKiriUrl ? (
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white hover:border-brand-lime hover:bg-lime-50/10 transition cursor-pointer group">
                                                {dadaKiriLoading ? (
                                                    <RefreshCw size={24} className="text-slate-400 animate-spin mb-2" />
                                                ) : (
                                                    <Upload size={24} className="text-slate-400 group-hover:text-brand-lime mb-2 group-hover:scale-110 transition" />
                                                )}
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-brand-navy">
                                                    {dadaKiriLoading ? "Mengunggah..." : "Pilih Desain"}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleDesignUpload(e, 'dada_kiri')}
                                                    disabled={dadaKiriLoading}
                                                />
                                            </label>
                                        ) : (
                                            <div className="relative border border-slate-200 rounded-lg bg-white p-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <img
                                                        src={dadaKiriUrl}
                                                        alt="Desain Depan"
                                                        className="w-12 h-12 object-cover rounded shadow-sm border border-slate-100"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">
                                                        {dadaKiriFile?.name || 'desain-depan.jpg'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => { setDadaKiriFile(null); setDadaKiriUrl(''); setDadaKiriPath(''); }}
                                                    className="w-6 h-6 rounded-full bg-slate-100 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">
                                            Ukuran Desain Depan (cm / A4 / dll)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: 8x8 cm"
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-brand-lime focus:outline-none"
                                            value={dadaKiriSize}
                                            onChange={(e) => setDadaKiriSize(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Desain Belakang */}
                                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                    <h4 className="text-sm font-bold text-brand-navy mb-3">
                                        Desain Belakang (Punggung)
                                    </h4>
                                    
                                    <div className="mb-4">
                                        {!belakangUrl ? (
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-white hover:border-brand-lime hover:bg-lime-50/10 transition cursor-pointer group">
                                                {belakangLoading ? (
                                                    <RefreshCw size={24} className="text-slate-400 animate-spin mb-2" />
                                                ) : (
                                                    <Upload size={24} className="text-slate-400 group-hover:text-brand-lime mb-2 group-hover:scale-110 transition" />
                                                )}
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-brand-navy">
                                                    {belakangLoading ? "Mengunggah..." : "Pilih Desain"}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleDesignUpload(e, 'belakang')}
                                                    disabled={belakangLoading}
                                                />
                                            </label>
                                        ) : (
                                            <div className="relative border border-slate-200 rounded-lg bg-white p-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <img
                                                        src={belakangUrl}
                                                        alt="Desain Belakang"
                                                        className="w-12 h-12 object-cover rounded shadow-sm border border-slate-100"
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">
                                                        {belakangFile?.name || 'desain-belakang.jpg'}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => { setBelakangFile(null); setBelakangUrl(''); setBelakangPath(''); }}
                                                    className="w-6 h-6 rounded-full bg-slate-100 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1">
                                            Ukuran Desain Belakang (cm / A4 / dll)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Contoh: A4, 25x30 cm"
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-brand-lime focus:outline-none"
                                            value={belakangSize}
                                            onChange={(e) => setBelakangSize(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-brand-navy mb-4">
                                Catatan Tambahan (Opsional)
                            </h3>
                            <textarea
                                rows="3"
                                placeholder="Contoh: Logo di bagian depan, Nama 'Budi' di punggung..."
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

                                {dadaKiriPath && (
                                    <div className="flex justify-between border-b border-gray-100 pb-2 text-xs">
                                        <span className="text-gray-500">Desain Depan</span>
                                        <span className="font-medium text-emerald-600">Terunggah ({dadaKiriSize || 'Standar'})</span>
                                    </div>
                                )}

                                {belakangPath && (
                                    <div className="flex justify-between border-b border-gray-100 pb-2 text-xs">
                                        <span className="text-gray-500">Desain Belakang</span>
                                        <span className="font-medium text-emerald-600">Terunggah ({belakangSize || 'Standar'})</span>
                                    </div>
                                )}
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
            {modalMessage && (
                <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-black text-brand-navy mb-2 uppercase tracking-wider">Pemberitahuan</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">{modalMessage}</p>
                        <button
                            onClick={() => setModalMessage(null)}
                            className="w-full bg-brand-navy text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-brand-dark transition shadow-lg cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
