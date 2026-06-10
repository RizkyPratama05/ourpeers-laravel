import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Upload, Copy, Check, Image, AlertCircle, RefreshCw, CreditCard, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Success({ id, order }) {
    const [copiedText, setCopiedText] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!order || order.status !== 'menunggu_bayar') return;

        const calculateTimeLeft = () => {
            const difference = new Date(order.created_at).getTime() + 5 * 60 * 1000 - new Date().getTime();
            
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
    }, [order]);

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

        router.post(`/order/${order.id}/upload-bukti`, formData, {
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

    return (
        <MainLayout>
            <Head title="Pesanan Berhasil" />
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 max-w-3xl w-full shadow-xl">
                    <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-lime">
                        <CheckCircle size={64} strokeWidth={3} />
                    </div>

                    <h1 className="text-3xl font-bold text-brand-navy mb-2">
                        Pesanan Berhasil Dikirim!
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Terima kasih telah memesan di Ourpeers Konveksi
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 max-w-md mx-auto">
                        <p className="text-sm text-gray-400 mb-1">Nomor Pesanan Anda</p>
                        <div className="text-3xl font-bold text-brand-lime tracking-wider">
                            {id || "OP-ERROR"}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Simpan nomor ini untuk mengecek status pesanan secara berkala.
                        </p>
                    </div>

                    {order && order.status === 'batal' && (
                        <div className="mt-8 mb-8 text-left bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 flex gap-4 items-start">
                            <span className="text-3xl">❌</span>
                            <div>
                                <h4 className="font-extrabold text-red-950 mb-1">Pesanan Dibatalkan Otomatis</h4>
                                <p className="text-sm text-red-800 leading-relaxed">
                                    Pesanan Anda telah dibatalkan secara otomatis karena batas waktu pembayaran (5 menit) telah habis. Silakan lakukan pemesanan ulang untuk memproses pesanan baru Anda.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* SECTION PEMBAYARAN MANUAL - LANGSUNG SETELAH CHECKOUT */}
                    {order && (order.status === 'menunggu_bayar' || order.status === 'sudah_bayar') && (
                        <div className="mt-8 mb-8 text-left bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8">
                            {/* COUNTDOWN TIMER */}
                            {timeLeft && order.status === 'menunggu_bayar' && (
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
                                    <span className="text-sm font-bold text-slate-700 mt-1">Rp {order.total_belanja.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ongkos Kirim</span>
                                    <span className="text-sm font-bold text-slate-700 mt-1">Rp {order.biaya_ongkir.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="bg-brand-navy text-white p-4 rounded-xl border border-brand-navy flex flex-col justify-between relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 w-16 h-16 bg-brand-lime/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                                    <span className="text-xs text-slate-300 font-bold uppercase tracking-wider z-10">Total Harus Dibayar</span>
                                    <div className="flex items-center justify-between mt-1 z-10">
                                        <span className="text-lg font-black text-brand-lime">Rp {order.grand_total.toLocaleString('id-ID')}</span>
                                        <button
                                            onClick={() => handleCopy(order.grand_total, 'total')}
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
                            {!order.bukti_transfer || showUploadForm ? (
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
                                        {order.bukti_transfer && (
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
                                                src={`/storage/${order.bukti_transfer}`}
                                                alt="Bukti Transfer terunggah"
                                                className="w-full h-32 object-cover rounded shadow-sm hover:scale-105 transition duration-300 cursor-zoom-in"
                                                onClick={() => window.open(`/storage/${order.bukti_transfer}`, '_blank')}
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
                    )}

                    <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                        <Link
                            href="/status"
                            className="flex-1 bg-brand-lime text-brand-navy font-bold py-3 rounded-lg hover:bg-lime-500 transition shadow-lg block text-center"
                        >
                            Cek Status Pesanan
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition block text-center"
                        >
                            Kembali ke Beranda
                        </Link>
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
