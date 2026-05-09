import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <MainLayout>
            <Head title="Tentang Kami" />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <h1 className="text-4xl font-bold text-brand-navy mb-8 text-center">Tentang Ourpeers Konveksi</h1>
                <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed">
                    <p>
                        Ourpeers Konveksi adalah solusi profesional untuk pemesanan konveksi custom online. Kami berdedikasi untuk memberikan kualitas terbaik dengan proses yang transparan dan terpercaya.
                    </p>
                    <p>
                        Berbeda dengan marketplace, kami mengelola produksi secara langsung untuk memastikan setiap detail pesanan Anda terpenuhi dengan sempurna.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
