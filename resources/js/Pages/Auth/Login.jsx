import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand-lime selection:text-brand-navy">
            <Head title="Admin Login" />

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-lime transition-colors mb-8 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                    </Link>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        PANEL <span className="text-brand-lime">ADMIN</span>
                    </h1>
                    <p className="text-slate-400">Masuk untuk mengelola pesanan & produk</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl">
                    {status && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-2xl text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="email"
                                    placeholder="admin@ourpeers.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <div className="text-red-400 text-xs mt-2 ml-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-all"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.password && <div className="text-red-400 text-xs mt-2 ml-1">{errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-brand-lime focus:ring-brand-lime transition-all cursor-pointer"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Ingat Saya</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-slate-400 hover:text-brand-lime transition-colors"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-brand-lime text-brand-navy font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all duration-500 shadow-[0_20px_40px_rgba(132,204,22,0.2)] disabled:opacity-50"
                        >
                            {processing ? 'Mencoba Masuk...' : <><LogIn size={20} /> Masuk Sekarang</>}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-10 text-slate-500 text-sm">
                    © 2026 Ourpeers Konveksi. Sistem Manajemen Internal.
                </p>
            </div>
        </div>
    );
}

