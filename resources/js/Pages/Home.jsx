import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle, DollarSign, Eye, ChevronRight } from "lucide-react";

export default function Home({ products, categories }) {
    return (
        <MainLayout>
            <Head title="Beranda" />

            {/* === HERO SECTION === */}
            <header className="relative bg-brand-navy pt-44 pb-40 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-lime/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

                <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span>
                            </span>
                            <span className="text-brand-lime text-xs font-bold uppercase tracking-widest">
                                Premium Quality Confirmed
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-white">
                            Eksplorasi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-lime-300">
                                Konveksi Custom
                            </span>{" "}
                            <br />
                            Tanpa Batas.
                        </h1>

                        <p className="text-slate-400 text-xl leading-relaxed max-w-lg">
                            Bukan sekadar marketplace. Kami menghadirkan standar
                            produksi pabrikan langsung ke genggaman Anda. Cepat,
                            Presisi, dan Berkualitas.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/products"
                                className="group relative bg-brand-lime text-brand-navy font-black px-10 py-4 rounded-2xl text-lg hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(132,204,22,0.3)] hover:shadow-white/20 active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Mulai Pesan{" "}
                                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                href="/about"
                                className="bg-white/5 border border-white/10 text-white font-bold px-10 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                            >
                                Pelajari Kami
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:block relative">
                        <div className="relative z-20 animate-float">
                            <div className="w-full aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-[40px] border border-white/20 backdrop-blur-xl p-8 shadow-2xl">
                                <div className="w-full h-full bg-brand-navy rounded-[30px] flex items-center justify-center border border-white/5 overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800"
                                        className="opacity-50 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110 object-cover w-full h-full"
                                        alt="Preview"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-lime rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </header>

            {/* === FITUR === */}
            <section className="py-32 bg-white relative">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block px-4 py-1 bg-lime-100 text-brand-lime text-xs font-bold rounded-full mb-4 uppercase tracking-tighter">
                        Our Core Values
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-4 tracking-tight">
                        Mengapa Memilih Ourpeers?
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-20">
                        Kami menggabungkan teknologi modern dengan craftsmanship
                        tradisional untuk hasil konveksi terbaik.
                    </p>

                    <div className="grid md:grid-cols-3 gap-10 mt-12">
                        {[
                            {
                                icon: <CheckCircle size={40} />,
                                title: "Custom Tanpa Batas",
                                desc: "Bebas menentukan bahan, warna, dan detail jahitan sesuai keinginan Anda.",
                            },
                            {
                                icon: <DollarSign size={40} />,
                                title: "Harga Kompetitif",
                                desc: "Sistem kalkulasi harga otomatis yang transparan tanpa biaya siluman.",
                            },
                            {
                                icon: <Eye size={40} />,
                                title: "Kontrol Produksi",
                                desc: "Pantau setiap tahap produksi pesanan Anda secara real-time dari dashboard.",
                            },
                        ].map((fitur, i) => (
                            <div
                                key={i}
                                className="group p-10 border border-slate-100 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] bg-white hover:bg-brand-navy transition-all duration-500 hover:-translate-y-4"
                            >
                                <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center rounded-3xl bg-lime-50 text-brand-lime group-hover:bg-brand-lime group-hover:text-brand-navy transition-colors duration-500">
                                    {fitur.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-brand-navy group-hover:text-white transition-colors duration-500">
                                    {fitur.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-500">
                                    {fitur.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === PRODUK UNGGULAN (3 produk terbaru) === */}
            <section
                id="produk"
                className="py-32 bg-slate-50 relative overflow-hidden"
            >
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <div className="inline-block px-4 py-1 bg-brand-navy text-white text-xs font-bold rounded-full mb-4 uppercase tracking-tighter">
                                Explore Collection
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-navy tracking-tight">
                                Produk Unggulan Kami
                            </h2>
                        </div>
                        <Link
                            href="/products"
                            className="group flex items-center gap-3 font-bold text-brand-navy hover:text-brand-lime transition-colors"
                        >
                            Lihat Semua Katalog
                            <div className="p-2 bg-brand-navy text-white rounded-full group-hover:bg-brand-lime group-hover:text-brand-navy transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {products.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* === PRODUK PER KATEGORI === */}
            {categories.map((cat) =>
                cat.products.length > 0 ? (
                    <section key={cat.id} className="py-24 bg-white">
                        <div className="container mx-auto px-6">
                            {/* Header Kategori */}
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                                <div>
                                    <div className="inline-block px-4 py-1 bg-lime-100 text-brand-lime text-xs font-bold rounded-full mb-3 uppercase tracking-tighter">
                                        Koleksi {cat.nama}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-brand-navy tracking-tight">
                                        {cat.nama}
                                    </h2>
                                </div>
                                <Link
                                    href={`/products?category=${cat.slug}`}
                                    className="group flex items-center gap-3 font-bold text-brand-navy hover:text-brand-lime transition-colors"
                                >
                                    Lihat Semua {cat.nama}
                                    <div className="p-2 bg-brand-navy text-white rounded-full group-hover:bg-brand-lime group-hover:text-brand-navy transition-all">
                                        <ChevronRight size={16} />
                                    </div>
                                </Link>
                            </div>

                            {/* Grid Produk per Kategori */}
                            <div className="grid md:grid-cols-3 gap-10">
                                {cat.products.map((item) => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </section>
                ) : null,
            )}
        </MainLayout>
    );
}

// Komponen kartu produk — dipakai ulang di "Produk Unggulan" dan tiap kategori
function ProductCard({ item }) {
    return (
        <div className="group bg-white rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(132,204,22,0.15)] transition-all duration-700 flex flex-col border border-white hover:-translate-y-4">
            <div className="h-80 bg-slate-100 overflow-hidden relative">
                {item.gambar_url ? (
                    <img
                        src={
                            item.gambar_url.startsWith("http")
                                ? item.gambar_url
                                : `/storage/${item.gambar_url}`
                        }
                        alt={item.nama_produk}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold italic">
                        No Visual
                    </div>
                )}
                <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-black text-brand-navy shadow-xl translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    STOK TERSEDIA
                </div>
            </div>
            <div className="p-10 flex flex-col flex-grow relative">
                <div className="absolute -top-10 left-10 p-4 bg-brand-lime text-brand-navy rounded-2xl shadow-xl font-black">
                    NEW
                </div>
                {/* Badge nama kategori */}
                {item.category && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime mb-1">
                        {item.category.nama}
                    </span>
                )}
                <h3 className="text-2xl font-black text-brand-navy mb-2 group-hover:text-brand-lime transition-colors">
                    {item.nama_produk}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                    Price starts from
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="text-3xl font-black text-brand-navy">
                        <span className="text-sm font-bold text-slate-300 mr-1">
                            Rp
                        </span>
                        {item.harga.toLocaleString("id-ID")}
                    </div>
                    <Link
                        href={`/product/${item.id}`}
                        className="w-14 h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center hover:bg-brand-lime hover:text-brand-navy transition-all duration-500 group-hover:rotate-12"
                    >
                        <ChevronRight size={24} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
