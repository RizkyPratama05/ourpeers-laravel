import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function Success({ id }) {
    return (
        <MainLayout>
            <Head title="Pesanan Berhasil" />
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white border-2 border-brand-lime rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-xl">
                    <div className="w-24 h-24 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-lime">
                        <CheckCircle size={64} strokeWidth={3} />
                    </div>

                    <h1 className="text-3xl font-bold text-brand-navy mb-2">
                        Pesanan Berhasil Dikirim!
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Terima kasih telah memesan di Ourpeers Konveksi
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <p className="text-sm text-gray-400 mb-1">Nomor Pesanan Anda</p>
                        <div className="text-3xl font-bold text-brand-lime tracking-wider">
                            {id || "OP-ERROR"}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Simpan nomor ini untuk mengecek status pesanan secara berkala.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/status"
                            className="w-full bg-brand-lime text-brand-navy font-bold py-3 rounded-lg hover:bg-lime-500 transition shadow-lg"
                        >
                            Cek Status Pesanan
                        </Link>
                        <Link
                            href="/"
                            className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
