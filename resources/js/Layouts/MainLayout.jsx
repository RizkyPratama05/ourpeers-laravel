import { Link } from '@inertiajs/react';

export default function MainLayout({ children }) {
    return (
        <div className="font-sans text-slate-800 antialiased selection:bg-brand-lime selection:text-brand-navy">
            {/* === NAVBAR === */}
            <nav className="fixed w-full bg-white/70 backdrop-blur-md z-50 top-0 border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="group text-2xl font-black text-brand-navy flex items-center tracking-tighter">
                        OURPEERS <span className="text-brand-lime ml-1 group-hover:rotate-12 transition-transform duration-300">KONVEKSI</span>
                    </Link>
                    <div className="hidden md:flex space-x-10 text-brand-navy/70 font-semibold text-sm uppercase tracking-widest">
                        <Link href="/" className="hover:text-brand-lime transition-colors duration-300 relative group">
                            Beranda
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/products" className="hover:text-brand-lime transition-colors duration-300 relative group">
                            Katalog
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/about" className="hover:text-brand-lime transition-colors duration-300 relative group">
                            Tentang
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/status" className="hover:text-brand-lime transition-colors duration-300 relative group">
                            Cek Status
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-lime transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    <Link
                        href="/products"
                        className="bg-brand-navy text-white font-bold px-7 py-2.5 rounded-full hover:bg-brand-lime hover:text-brand-navy transition-all duration-500 shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:shadow-brand-lime/30 active:scale-95"
                    >
                        Pesan Sekarang
                    </Link>
                </div>
            </nav>

            <main>{children}</main>

            {/* FOOTER */}
            <footer className="bg-brand-navy text-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <p>© 2026 Ourpeers Konveksi. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
