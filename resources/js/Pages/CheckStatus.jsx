import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Package, Truck, CheckCircle, Upload, Copy, Check, Image, AlertCircle, RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CheckStatus({ order: initialOrder }) {
    const [inputId, setInputId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [copiedText, setCopiedText] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!initialOrder || initialOrder.status !== 'menunggu_bayar') return;

        const calculateTimeLeft = () => {
            const difference = new Date(initialOrder.created_at).getTime() + 5 * 60 * 1000 - new Date().getTime();
            
            if (difference <= 0) {
                setTimeLeft('00:00');
                router.reload({ preserveScroll: true });
                return false;
            }

            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');

            setTimeLeft(`${formattedMinutes}:${formattedSeconds}`);
            return true;
        };

        const active = calculateTimeLeft();
        if (!active) return;

        const timer = setInterval(() => {
            const active = calculateTimeLeft();
            if (!active) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [initialOrder]);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopiedText(type);
        setTimeout(() => setCopiedText(''), 2000);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('bukti_transfer', file);

        router.post(`/order/${initialOrder.id}/upload-bukti`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setUploading(false);
                setFile(null);
                setPreviewUrl('');
                setShowUploadForm(false);
            },
            onError: (errors) => {
                setUploading(false);
                setModalMessage(errors.bukti_transfer || 'Gagal mengunggah bukti transfer.');
            }
        });
    };

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
                            {initialOrder.status === 'batal' && (
                                <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex gap-4 items-start">
                                    <span className="text-3xl">❌</span>
                                    <div>
                                        <h4 className="font-extrabold text-red-950 mb-1">Pesanan Dibatalkan Otomatis</h4>
                                        <p className="text-sm text-red-800 leading-relaxed">
                                            Pesanan Anda telah dibatalkan secara otomatis karena batas waktu pembayaran (5 menit) telah habis. Silakan lakukan pemesanan ulang untuk memproses pesanan baru Anda.
                                        </p>
                                    </div>
                                </div>
                            )}

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

                            {/* SECTION PEMBAYARAN MANUAL */}
                            {(initialOrder.status === 'menunggu_bayar' || initialOrder.status === 'sudah_bayar') && (
                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
                                        {/* COUNTDOWN TIMER */}
                                        {timeLeft && initialOrder.status === 'menunggu_bayar' && (
                                            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between shadow-sm animate-pulse">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="text-amber-500" size={18} />
                                                    <span className="text-xs font-black text-amber-950 uppercase tracking-widest">Sisa Waktu Pembayaran</span>
                                                </div>
                                                <div className="text-xl font-black text-amber-600 font-mono tracking-widest bg-white px-4 py-2 rounded-xl border border-amber-200/50 shadow-inner">
                                                    {timeLeft}
                                                </div>
                                            </div>
                                        )}
                                        <h4 className="text-lg font-black text-brand-navy mb-4 flex items-center gap-2">
                                            <AlertCircle className="text-amber-500" size={20} />
                                            Instruksi Pembayaran Transfer Bank
                                        </h4>
                                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                            Silakan transfer pembayaran sebesar nominal di bawah ke rekening bank Ourpeers Konveksi. Setelah transfer berhasil, silakan unggah foto atau tangkapan layar bukti transfer di kolom yang disediakan.
                                        </p>

                                        {/* DETAIL TAGIHAN */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Belanja</span>
                                                <span className="text-sm font-bold text-slate-700 mt-1">Rp {initialOrder.total_belanja.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ongkos Kirim</span>
                                                <span className="text-sm font-bold text-slate-700 mt-1">Rp {initialOrder.biaya_ongkir.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="bg-brand-navy text-white p-4 rounded-xl border border-brand-navy flex flex-col justify-between relative overflow-hidden group">
                                                <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-16 h-16 bg-brand-lime/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                                                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider z-10">Total Harus Dibayar</span>
                                                <div className="flex items-center justify-between mt-1 z-10">
                                                    <span className="text-lg font-black text-brand-lime">Rp {initialOrder.grand_total.toLocaleString('id-ID')}</span>
                                                    <button
                                                        onClick={() => handleCopy(initialOrder.grand_total, 'total')}
                                                        className="text-slate-300 hover:text-white transition"
                                                        title="Salin nominal"
                                                    >
                                                        {copiedText === 'total' ? <Check size={16} className="text-brand-lime" /> : <Copy size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* REKENING TUJUAN */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            {/* Rekening BCA */}
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-brand-lime transition-all duration-300">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-extrabold text-blue-800 tracking-wider">BANK BCA</span>
                                                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Transfer Bank</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomor Rekening</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-mono font-black text-brand-navy text-lg tracking-wide">123-456-7890</p>
                                                        <button
                                                            onClick={() => handleCopy('1234567890', 'bca')}
                                                            className="text-slate-400 hover:text-brand-navy transition"
                                                        >
                                                            {copiedText === 'bca' ? <Check size={16} className="text-brand-lime" /> : <Copy size={16} />}
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-slate-500">a.n. <span className="font-bold">Ourpeers Konveksi</span></p>
                                                </div>
                                            </div>

                                            {/* Rekening Mandiri */}
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-brand-lime transition-all duration-300">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-extrabold text-amber-800 tracking-wider">BANK MANDIRI</span>
                                                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Transfer Bank</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomor Rekening</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-mono font-black text-brand-navy text-lg tracking-wide">098-765-4321</p>
                                                        <button
                                                            onClick={() => handleCopy('0987654321', 'mandiri')}
                                                            className="text-slate-400 hover:text-brand-navy transition"
                                                        >
                                                            {copiedText === 'mandiri' ? <Check size={16} className="text-brand-lime" /> : <Copy size={16} />}
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-slate-500">a.n. <span className="font-bold">Ourpeers Konveksi</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FORM UPLOAD ATAU STATUS BUKTI */}
                                        {!initialOrder.bukti_transfer || showUploadForm ? (
                                            <form onSubmit={handleUpload} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                                <h5 className="font-bold text-brand-navy mb-4 text-sm uppercase tracking-wider">
                                                    Unggah Bukti Transfer Baru
                                                </h5>
                                                
                                                <div className="mb-5">
                                                    {!previewUrl ? (
                                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-brand-lime hover:bg-lime-50/20 transition cursor-pointer group">
                                                            <Upload className="text-slate-400 group-hover:text-brand-lime mb-3 group-hover:scale-110 transition-all" size={32} />
                                                            <span className="text-sm font-bold text-slate-600 mb-1 group-hover:text-brand-navy transition">Pilih File Gambar</span>
                                                            <span className="text-xs text-slate-400">Format JPG, JPEG, atau PNG (Maks. 2MB)</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                                required
                                                            />
                                                        </label>
                                                    ) : (
                                                        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-4">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                                    <Image size={16} className="text-brand-lime" />
                                                                    {file?.name || 'bukti-transfer.jpg'}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => { setFile(null); setPreviewUrl(''); }}
                                                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                            <img
                                                                src={previewUrl}
                                                                alt="Preview Bukti Transfer"
                                                                className="max-h-64 mx-auto rounded-lg shadow border border-slate-100 object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        type="submit"
                                                        disabled={uploading || !file}
                                                        className="flex-grow bg-brand-lime text-brand-navy font-bold py-3 rounded-lg hover:bg-lime-500 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {uploading ? (
                                                            <>
                                                                <RefreshCw size={16} className="animate-spin" />
                                                                Mengunggah...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload size={16} />
                                                                Kirim Bukti Pembayaran
                                                            </>
                                                        )}
                                                    </button>
                                                    {initialOrder.bukti_transfer && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowUploadForm(false)}
                                                            className="px-5 border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition"
                                                        >
                                                            Batal
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                                    <CheckCircle size={24} className="text-emerald-600" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h5 className="font-extrabold text-emerald-950 mb-1">
                                                        Bukti Transfer Berhasil Dikirim
                                                    </h5>
                                                    <p className="text-sm text-emerald-800 mb-4 leading-relaxed">
                                                        Bukti pembayaran Anda telah kami terima dan saat ini sedang dalam proses verifikasi oleh admin. Setelah pembayaran terverifikasi, status pesanan Anda akan diperbarui menjadi <b>Diproses</b>.
                                                    </p>
                                                    
                                                    <div className="border border-emerald-200/60 rounded-lg overflow-hidden bg-white p-3 max-w-sm mb-4">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">Pratinjau Bukti Yang Diunggah</p>
                                                        <img
                                                            src={`/storage/${initialOrder.bukti_transfer}`}
                                                            alt="Bukti Transfer terunggah"
                                                            className="w-full h-32 object-cover rounded shadow-sm hover:scale-105 transition duration-300 cursor-zoom-in"
                                                            onClick={() => window.open(`/storage/${initialOrder.bukti_transfer}`, '_blank')}
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={() => setShowUploadForm(true)}
                                                        className="text-xs font-bold text-slate-600 hover:text-brand-navy flex items-center gap-1.5 underline transition"
                                                    >
                                                        <Upload size={12} /> Unggah Ulang Bukti Lain
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {initialOrder.status !== 'menunggu_bayar' && (
                                <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
                                    <span className="text-2xl">ℹ️</span>
                                    <div>
                                        <p className="font-bold text-blue-900 text-sm">Informasi Pesanan</p>
                                        <p className="text-blue-800 text-sm mt-1">
                                            Tim kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi pengiriman atau pengambilan barang jika status sudah <b>Siap Dikirim</b>.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
