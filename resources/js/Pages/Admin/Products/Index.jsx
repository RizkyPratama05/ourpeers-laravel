import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Package, AlertCircle, CheckCircle, Boxes, Tag } from 'lucide-react';

export default function Index({ auth, products }) {
    const deleteProduct = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    const lowStockCount = products.filter(p => p.stok < 10).length;

    return (
        <AuthenticatedLayout
            header="Katalog Produk"
        >
            <Head title="Admin - Produk" />

            <div className="space-y-10">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Total Produk', value: products.length, icon: <Boxes />, color: 'bg-brand-navy', text: 'text-white' },
                        { label: 'Stok Menipis', value: lowStockCount, icon: <AlertCircle />, color: 'bg-red-500/10', text: 'text-red-500' },
                        { label: 'Kategori Aktif', value: 'Konveksi', icon: <Tag />, color: 'bg-brand-lime/10', text: 'text-brand-lime' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} p-8 rounded-[3rem] shadow-sm border border-slate-100/10 flex items-center gap-6 group hover:shadow-xl transition-all duration-500`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.text} bg-white/10 group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${stat.text === 'text-white' ? 'text-white/60' : 'text-slate-400'}`}>{stat.label}</p>
                                <p className={`text-3xl font-black ${stat.text === 'text-white' ? 'text-white' : 'text-brand-navy'}`}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-lime/10 transition-colors"></div>
                    <div className="relative">
                        <h3 className="text-2xl font-black text-brand-navy tracking-tight uppercase">Inventaris Produk</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola stok dan katalog penjualan Anda</p>
                    </div>
                    <Link
                        href={route('admin.products.create')}
                        className="bg-brand-navy text-white px-10 py-5 rounded-[2rem] flex items-center gap-3 hover:bg-brand-lime hover:text-brand-navy transition-all duration-700 font-black uppercase text-xs tracking-widest shadow-[0_20px_40px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_40px_rgba(132,204,22,0.3)] hover:-translate-y-1 relative z-10"
                    >
                        <Plus size={18} /> Tambah Item Baru
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-[4rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-700">
                            <div className="h-64 bg-slate-100 relative overflow-hidden">
                                {product.gambar_url ? (
                                    <img src={product.gambar_url.startsWith('http') ? product.gambar_url : `/storage/${product.gambar_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50"><Package size={64} strokeWidth={1} /></div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.stok > 10 ? 'bg-brand-lime' : 'bg-red-500'} animate-pulse`}></div>
                                        <span className="text-[10px] font-black text-brand-navy uppercase tracking-widest">Stok: {product.stok}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-10 relative">
                                <div className="absolute -top-10 left-10 bg-brand-lime w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                    <Package className="text-brand-navy" size={32} />
                                </div>
                                
                                <div className="mt-8">
                                    <h4 className="text-xl font-black text-brand-navy mb-2 tracking-tight group-hover:text-brand-lime transition-colors duration-300 uppercase">{product.nama_produk}</h4>
                                    <div className="flex items-baseline gap-1 text-2xl font-black text-brand-navy">
                                        <span className="text-xs text-slate-300 uppercase tracking-widest">IDR</span>
                                        {product.harga.toLocaleString('id-ID')}
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex gap-3">
                                    <Link
                                        href={route('admin.products.edit', product.id)}
                                        className="flex-grow bg-slate-50 text-slate-600 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-brand-navy hover:text-white transition-all duration-500 shadow-sm"
                                    >
                                        <Edit size={14} /> Detail / Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="w-14 h-14 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500 shadow-sm hover:shadow-red-200"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

