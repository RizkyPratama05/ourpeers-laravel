import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ShoppingBag, Clock, Package, CheckCircle, Truck } from 'lucide-react';

export default function Index({ auth, orders }) {
    const updateStatus = (id, status) => {
        router.put(route('admin.orders.update', id), { status });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'menunggu_bayar': return <Clock className="text-yellow-500" />;
            case 'diproses': return <Package className="text-blue-500" />;
            case 'siap': return <Truck className="text-purple-500" />;
            case 'selesai': return <CheckCircle className="text-green-500" />;
            default: return <Clock className="text-gray-500" />;
        }
    };

    const getStatusLabel = (status) => {
        return status.replace('_', ' ').toUpperCase();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Pesanan</h2>}
        >
            <Head title="Admin - Pesanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                                        <th className="p-4">ID Pesanan</th>
                                        <th className="p-4">Detail</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="p-4 font-mono font-bold text-brand-navy">#{order.id}</td>
                                            <td className="p-4">
                                                {order.items.map((item, i) => (
                                                    <div key={i}>
                                                        {item.product?.nama_produk} ({item.qty} pcs)
                                                    </div>
                                                ))}
                                                <div className="text-xs text-gray-400 mt-1">{order.alamat_pengiriman}</div>
                                            </td>
                                            <td className="p-4 font-bold">Rp {order.grand_total.toLocaleString('id-ID')}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.status)}
                                                    <span className="font-semibold text-xs">{getStatusLabel(order.status)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <select
                                                    className="text-xs border-gray-300 rounded-lg focus:border-brand-lime focus:ring-brand-lime"
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                >
                                                    <option value="menunggu_bayar">Menunggu Bayar</option>
                                                    <option value="diproses">Diproses</option>
                                                    <option value="siap">Siap Dikirim</option>
                                                    <option value="selesai">Selesai</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
