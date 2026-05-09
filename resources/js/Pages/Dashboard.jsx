import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Package, ShoppingBag, Clock, Eye, ExternalLink, Plus, User } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            header="Dashboard Overview"
        >
            <Head title="Dashboard" />

            <div className="grid grid-cols-12 gap-6">
                {/* Main Stats - Bento Style */}
                <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-6">
                    <div className="col-span-2 bg-gradient-to-br from-brand-navy to-slate-800 p-10 rounded-[40px] text-white relative overflow-hidden shadow-xl group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Revenue Overview</h3>
                            <p className="text-5xl font-black text-brand-lime">Rp {stats.total_revenue.toLocaleString('id-ID')}</p>
                            <div className="mt-8 flex gap-4">
                                <Link href={route('admin.orders.index')} className="bg-brand-lime text-brand-navy px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white transition-colors">
                                    Lihat Semua Pesanan
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:border-brand-lime transition-colors">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Package size={28} />
                        </div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Produk</h4>
                        <p className="text-3xl font-black text-brand-navy">{stats.total_products}</p>
                    </div>

                    <div className="col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:border-brand-lime transition-colors">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShoppingBag size={28} />
                        </div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Pesanan</h4>
                        <p className="text-3xl font-black text-brand-navy">{stats.total_orders}</p>
                    </div>
                </div>

                {/* Side Bento - Urgent Actions */}
                <div className="col-span-12 md:col-span-4 space-y-6">
                    <div className="bg-brand-lime p-8 rounded-[40px] shadow-lg shadow-brand-lime/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-brand-navy text-white rounded-xl">
                                    <Clock size={24} />
                                </div>
                                <span className="text-[10px] font-black bg-brand-navy/10 px-2 py-1 rounded-full text-brand-navy">URGENT</span>
                            </div>
                            <h4 className="text-brand-navy font-black text-xl mb-1">Perlu Diproses</h4>
                            <p className="text-brand-navy/60 text-sm mb-6 font-medium">Ada {stats.pending_orders} pesanan baru yang menunggu konfirmasi Anda.</p>
                            <Link href={route('admin.orders.index')} className="block w-full bg-brand-navy text-white text-center py-4 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity">
                                Proses Sekarang
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                        <h4 className="font-bold text-brand-navy mb-6 flex items-center gap-2">
                             Quick Links <ExternalLink size={16} className="text-slate-300" />
                        </h4>
                        <div className="space-y-3">
                            <Link href={route('admin.products.create')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                <span className="text-sm font-bold text-slate-600">Tambah Produk Baru</span>
                                <Plus size={16} className="text-slate-400 group-hover:text-brand-navy transition-colors" />
                            </Link>
                            <Link href={route('profile.edit')} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                <span className="text-sm font-bold text-slate-600">Pengaturan Profil</span>
                                <User size={16} className="text-slate-400 group-hover:text-brand-navy transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
