import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

export default function Index({ auth, products }) {
    const deleteProduct = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header="Katalog Produk"
        >
            <Head title="Admin - Produk" />

            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <div>
                        <h3 className="text-xl font-black text-brand-navy">Daftar Produk Aktif</h3>
                        <p className="text-sm text-slate-400">Total {products.length} produk dalam katalog.</p>
                    </div>
                    <Link
                        href={route('admin.products.create')}
                        className="bg-brand-navy text-white px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-brand-lime hover:text-brand-navy transition-all duration-500 font-bold shadow-lg"
                    >
                        <Plus size={20} /> Tambah Produk
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="group bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {product.gambar_url ? (
                                    <img src={`/storage/${product.gambar_url}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 italic"><Package size={48} /></div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-brand-navy">
                                    STOK: {product.stok}
                                </div>
                            </div>
                            <div className="p-8">
                                <h4 className="text-lg font-black text-brand-navy mb-1 group-hover:text-brand-lime transition-colors">{product.nama_produk}</h4>
                                <p className="text-xl font-bold text-brand-navy mb-6">
                                    <span className="text-xs text-slate-300 font-bold mr-1">Rp</span>
                                    {product.harga.toLocaleString('id-ID')}
                                </p>
                                
                                <div className="flex gap-2">
                                    <Link
                                        href={route('admin.products.edit', product.id)}
                                        className="flex-grow bg-slate-50 text-slate-600 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-navy hover:text-white transition-all duration-300"
                                    >
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300"
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
