import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ShoppingBag, Clock, Package, CheckCircle, Truck, Hash, User, Calendar, CreditCard } from 'lucide-react';

export default function Index({ auth, orders }) {
    const updateStatus = (id, status) => {
        router.put(route('admin.orders.update', id), { status });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu_bayar': 
                return { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', icon: <Clock size={14} />, label: 'Menunggu Pembayaran' };
            case 'diproses': 
                return { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', icon: <Package size={14} />, label: 'Sedang Diproses' };
            case 'siap': 
                return { bg: 'bg-purple-500/10', text: 'text-purple-600', dot: 'bg-purple-500', icon: <Truck size={14} />, label: 'Siap Dikirim' };
            case 'selesai': 
                return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', icon: <CheckCircle size={14} />, label: 'Selesai' };
            default: 
                return { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500', icon: <Clock size={14} />, label: 'Unknown' };
        }
    };

    return (
        <AuthenticatedLayout
            header="Manajemen Pesanan"
        >
            <Head title="Admin - Pesanan" />

            <div className="space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Pesanan', value: orders.length, icon: <ShoppingBag />, color: 'text-blue-500' },
                        { label: 'Menunggu', value: orders.filter(o => o.status === 'menunggu_bayar').length, icon: <Clock />, color: 'text-amber-500' },
                        { label: 'Diproses', value: orders.filter(o => o.status === 'diproses').length, icon: <Package />, color: 'text-purple-500' },
                        { label: 'Selesai', value: orders.filter(o => o.status === 'selesai').length, icon: <CheckCircle />, color: 'text-emerald-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                            <div className={`w-14 h-14 rounded-2xl ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-brand-navy">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xl font-black text-brand-navy tracking-tight uppercase">Daftar Transaksi Baru</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
                            <div className="w-2 h-2 bg-brand-lime rounded-full animate-pulse"></div>
                            Live Update
                        </div>
                    </div>

                    <div className="overflow-x-auto px-6 py-6">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <th className="px-6 py-4">ID Transaksi</th>
                                    <th className="px-6 py-4">Detail Pelanggan</th>
                                    <th className="px-6 py-4 text-center">Total Bayar</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => {
                                        const style = getStatusStyle(order.status);
                                        return (
                                            <tr key={order.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                                <td className="px-6 py-6 bg-slate-50/30 group-hover:bg-white rounded-l-[2rem] border-y border-l border-transparent group-hover:border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center text-brand-lime shadow-lg">
                                                            <Hash size={16} />
                                                        </div>
                                                        <span className="font-black text-brand-navy text-sm">#{order.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 border-y border-transparent group-hover:border-slate-100">
                                                    <div className="space-y-2">
                                                        {order.items.map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center text-[10px] font-black text-slate-500">{item.qty}</div>
                                                                <span className="text-xs font-bold text-slate-600">{item.product?.nama_produk}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 bg-slate-50 w-fit px-2 py-1 rounded-lg">
                                                            <User size={10} /> {order.nama_penerima || 'Customer'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 border-y border-transparent group-hover:border-slate-100 text-center">
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy/5 rounded-2xl border border-brand-navy/5">
                                                        <CreditCard size={14} className="text-brand-navy/30" />
                                                        <span className="font-black text-brand-navy">Rp {order.grand_total.toLocaleString('id-ID')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 border-y border-transparent group-hover:border-slate-100 text-center">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${style.bg} ${style.text} text-[10px] font-black uppercase tracking-widest border border-current/10`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`}></div>
                                                        {style.icon}
                                                        {style.label}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 bg-slate-50/30 group-hover:bg-white rounded-r-[2rem] border-y border-r border-transparent group-hover:border-slate-100 text-right">
                                                    <select
                                                        className="text-[10px] font-black uppercase tracking-widest bg-white border-slate-200 rounded-xl focus:border-brand-lime focus:ring-4 focus:ring-brand-lime/10 transition-all cursor-pointer shadow-sm hover:border-brand-lime"
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    >
                                                        <option value="menunggu_bayar">Menunggu Bayar</option>
                                                        <option value="diproses">Proses Pesanan</option>
                                                        <option value="siap">Siap Dikirim</option>
                                                        <option value="selesai">Selesaikan Order</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <ShoppingBag size={48} className="text-slate-200" />
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Belum ada pesanan masuk</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

