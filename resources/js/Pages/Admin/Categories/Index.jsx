import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Tag, Plus, Pencil, Trash2, Check, X, Layers } from "lucide-react";
import { useState } from "react";

export default function Index({ categories }) {
    // State untuk form tambah kategori baru
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: "",
    });

    // State untuk edit inline
    const [editingId, setEditingId] = useState(null);
    const [editNama, setEditNama] = useState("");

    // Kirim form tambah
    const handleAdd = (e) => {
        e.preventDefault();
        post(route("admin.categories.store"), {
            onSuccess: () => reset(),
        });
    };

    // Mulai mode edit
    const startEdit = (cat) => {
        setEditingId(cat.id);
        setEditNama(cat.nama);
    };

    // Batalkan edit
    const cancelEdit = () => {
        setEditingId(null);
        setEditNama("");
    };

    // Simpan perubahan nama kategori
    const saveEdit = (id) => {
        router.put(
            route("admin.categories.update", id),
            { nama: editNama },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setEditNama("");
                },
            },
        );
    };

    // Hapus kategori
    const handleDelete = (id, nama, productCount) => {
        const warning =
            productCount > 0
                ? `Kategori "${nama}" memiliki ${productCount} produk. Produk-produk tersebut akan kehilangan kategorinya. Lanjutkan?`
                : `Hapus kategori "${nama}"?`;

        if (confirm(warning)) {
            router.delete(route("admin.categories.destroy", id));
        }
    };

    return (
        <AuthenticatedLayout header="Kelola Kategori">
            <Head title="Admin - Kategori" />

            <div className="space-y-8">
                {/* === STATS === */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-navy p-8 rounded-[3rem] flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                            <Layers size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                Total Kategori
                            </p>
                            <p className="text-3xl font-black text-white">
                                {categories.length}
                            </p>
                        </div>
                    </div>
                    <div className="bg-brand-lime/10 p-8 rounded-[3rem] flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand-lime/20 flex items-center justify-center text-brand-lime">
                            <Tag size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Total Produk Terkategorisasi
                            </p>
                            <p className="text-3xl font-black text-brand-navy">
                                {categories.reduce(
                                    (sum, c) => sum + c.products_count,
                                    0,
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* === FORM TAMBAH KATEGORI === */}
                <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100">
                    <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Plus size={18} className="text-brand-lime" /> Tambah
                        Kategori Baru
                    </h3>
                    <form
                        onSubmit={handleAdd}
                        className="flex gap-4 items-start"
                    >
                        <div className="flex-grow">
                            <input
                                type="text"
                                placeholder="Nama kategori (contoh: Kaos, Hoodie, Korsa...)"
                                className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-transparent placeholder:text-slate-300"
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                required
                            />
                            {errors.nama && (
                                <p className="text-red-500 text-xs mt-2 font-semibold">
                                    {errors.nama}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-brand-navy text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-lime hover:text-brand-navy transition-all duration-500 disabled:opacity-50 whitespace-nowrap shadow-lg"
                        >
                            <Plus size={16} /> Tambah
                        </button>
                    </form>
                </div>

                {/* === DAFTAR KATEGORI === */}
                <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-50">
                        <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest">
                            Daftar Kategori
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Klik ikon pensil untuk edit nama kategori
                        </p>
                    </div>

                    {categories.length === 0 ? (
                        <div className="py-20 text-center text-slate-400">
                            <Tag
                                size={48}
                                strokeWidth={1}
                                className="mx-auto mb-4 opacity-30"
                            />
                            <p className="font-bold">
                                Belum ada kategori. Tambahkan kategori pertama
                                di atas.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {categories.map((cat) => (
                                <li
                                    key={cat.id}
                                    className="flex items-center gap-4 px-10 py-6 hover:bg-slate-50/50 transition-colors group"
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-2xl bg-brand-lime/10 flex items-center justify-center text-brand-lime flex-shrink-0">
                                        <Tag size={18} />
                                    </div>

                                    {/* Nama — mode normal atau edit inline */}
                                    <div className="flex-grow">
                                        {editingId === cat.id ? (
                                            <input
                                                type="text"
                                                className="border border-brand-lime rounded-xl px-4 py-2 text-sm font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-lime w-full max-w-xs"
                                                value={editNama}
                                                onChange={(e) =>
                                                    setEditNama(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter")
                                                        saveEdit(cat.id);
                                                    if (e.key === "Escape")
                                                        cancelEdit();
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <div>
                                                <p className="font-black text-brand-navy uppercase tracking-wide">
                                                    {cat.nama}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    slug: {cat.slug}{" "}
                                                    &nbsp;·&nbsp;{" "}
                                                    {cat.products_count} produk
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tombol aksi */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {editingId === cat.id ? (
                                            <>
                                                {/* Simpan edit */}
                                                <button
                                                    onClick={() =>
                                                        saveEdit(cat.id)
                                                    }
                                                    className="w-10 h-10 bg-brand-lime text-brand-navy rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                                                    title="Simpan"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                {/* Batal edit */}
                                                <button
                                                    onClick={cancelEdit}
                                                    className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                                                    title="Batal"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* Tombol edit */}
                                                <button
                                                    onClick={() =>
                                                        startEdit(cat)
                                                    }
                                                    className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-brand-navy hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                    title="Edit nama"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                {/* Tombol hapus */}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            cat.id,
                                                            cat.nama,
                                                            cat.products_count,
                                                        )
                                                    }
                                                    className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                                                    title="Hapus kategori"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
