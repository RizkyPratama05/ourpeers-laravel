import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut, Menu, X, Home, ExternalLink } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', href: route('dashboard'), icon: <LayoutDashboard size={20} />, active: route().current('dashboard') },
        { name: 'Produk', href: route('admin.products.index'), icon: <Package size={20} />, active: route().current('admin.products.*') },
        { name: 'Pesanan', href: route('admin.orders.index'), icon: <ShoppingBag size={20} />, active: route().current('admin.orders.*') },
        { name: 'Profil', href: route('profile.edit'), icon: <User size={20} />, active: route().current('profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-brand-lime selection:text-brand-navy">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-brand-navy text-white transition-all duration-500 ease-in-out fixed h-full z-50 flex flex-col shadow-2xl`}
            >
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    {isSidebarOpen && (
                        <Link href="/" className="font-black text-2xl tracking-tighter flex items-center">
                            OURPEERS<span className="text-brand-lime ml-1">.</span>
                        </Link>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                                item.active 
                                ? 'bg-brand-lime text-brand-navy font-bold shadow-[0_10px_20px_rgba(132,204,22,0.2)]' 
                                : 'hover:bg-white/5 text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className={`${item.active ? 'text-brand-navy' : 'text-slate-500 group-hover:text-brand-lime'} transition-colors`}>
                                {item.icon}
                            </span>
                            {isSidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <Home size={20} className="group-hover:text-brand-lime transition-colors" />
                        {isSidebarOpen && <span>Kembali ke Web</span>}
                    </Link>
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:text-white hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span>Keluar</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-grow transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-20'} p-8`}>
                {header && (
                    <header className="mb-10 flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Administrator</p>
                            <div className="text-2xl font-black text-brand-navy">{header}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-brand-navy">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                            <div className="w-12 h-12 bg-brand-lime rounded-2xl flex items-center justify-center font-black text-brand-navy shadow-inner">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                    </header>
                )}
                
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}

