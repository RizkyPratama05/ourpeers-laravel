import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut, Menu, X, Home, ChevronRight } from 'lucide-react';

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
        <div className="min-h-screen bg-[#F1F5F9] flex font-sans selection:bg-brand-lime selection:text-brand-navy relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-brand-navy text-white transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] fixed h-full z-50 flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.1)] border-r border-white/5`}
            >
                <div className="p-8 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <Link href="/" className="font-black text-3xl tracking-tighter flex items-center group">
                            OURPEERS<span className="text-brand-lime transition-transform group-hover:scale-125 duration-300 ml-1">.</span>
                        </Link>
                    ) : (
                        <div className="w-10 h-10 bg-brand-lime rounded-xl flex items-center justify-center mx-auto">
                            <span className="font-black text-brand-navy text-xl">O</span>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="w-full flex items-center justify-center p-3 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group"
                    >
                        {isSidebarOpen ? <X size={18} className="text-slate-400 group-hover:text-white" /> : <Menu size={18} className="text-brand-lime" />}
                    </button>
                </div>

                <nav className="flex-grow px-6 py-8 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 p-4 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${
                                item.active 
                                ? 'bg-brand-lime text-brand-navy font-black shadow-[0_15px_30px_rgba(132,204,22,0.3)] scale-[1.02]' 
                                : 'hover:bg-white/5 text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className={`${item.active ? 'text-brand-navy' : 'text-slate-500 group-hover:text-brand-lime'} transition-colors duration-300`}>
                                {item.icon}
                            </span>
                            {isSidebarOpen && <span className="tracking-wide uppercase text-xs font-black">{item.name}</span>}
                            {item.active && isSidebarOpen && (
                                <ChevronRight size={16} className="ml-auto animate-pulse" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5 space-y-3">
                    <Link
                        href="/"
                        className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <Home size={18} className="group-hover:text-brand-lime transition-colors" />
                        {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Web Utama</span>}
                    </Link>
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400/60 hover:text-white hover:bg-red-500 transition-all group"
                    >
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Keluar Sesi</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-grow transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSidebarOpen ? 'ml-80' : 'ml-24'} p-10 relative z-10`}>
                {header && (
                    <header className="mb-12 flex justify-between items-center bg-white/70 backdrop-blur-2xl p-10 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white/50 ring-1 ring-black/[0.02]">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-brand-lime rounded-full animate-ping"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Administrator System</p>
                            </div>
                            <div className="text-4xl font-black text-brand-navy tracking-tighter uppercase">{header}</div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-black text-brand-navy tracking-tight uppercase">{user.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-brand-lime rounded-[1.5rem] blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="w-16 h-16 bg-brand-navy rounded-[1.5rem] flex items-center justify-center font-black text-brand-lime text-2xl shadow-xl relative border border-white/10 group-hover:scale-105 transition-transform cursor-pointer">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </header>
                )}
                
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                    {children}
                </div>
            </main>
        </div>
    );
}


