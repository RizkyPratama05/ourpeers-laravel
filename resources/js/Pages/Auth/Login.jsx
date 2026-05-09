import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';
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
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand-lime selection:text-brand-navy">
            <Head title="Admin Login" />

            {/* Premium Animated Background */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-lime opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-600 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-lime transition-all mb-10 group bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                        <span className="text-sm font-bold">Kembali ke Beranda</span>
                    </Link>
                    
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 bg-brand-lime rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(132,204,22,0.3)] rotate-12 hover:rotate-0 transition-all duration-500 group">
                            <ShieldCheck size={40} className="text-brand-navy group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    <h1 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none">
                        OURPEERS<span className="text-brand-lime">.</span>
                    </h1>
                    <p className="text-slate-400 font-medium tracking-wide">PANEL MANAJEMEN INTERNAL</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                    {status && (
                        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-2xl text-center font-bold">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-7">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-lime transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="admin@ourpeers.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-lime focus:ring-4 focus:ring-brand-lime/10 transition-all"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <div className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.email}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-lime transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-lime focus:ring-4 focus:ring-brand-lime/10 transition-all"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.password && <div className="text-red-400 text-[10px] font-bold mt-2 ml-1 uppercase tracking-wider">{errors.password}</div>}
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border border-white/10 bg-white/5 checked:bg-brand-lime transition-all focus:outline-none"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <CheckCircle size={14} className="absolute left-[3px] text-brand-navy opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                                <span className="ms-3 text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-widest">Ingat Saya</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs font-bold text-slate-500 hover:text-brand-lime transition-colors uppercase tracking-widest"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <div className="bg-brand-lime text-brand-navy font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(132,204,22,0.4)] group-hover:shadow-[0_20px_40px_-5px_rgba(132,204,22,0.6)] group-hover:-translate-y-1 active:translate-y-0 disabled:opacity-50">
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-4 border-brand-navy/30 border-t-brand-navy rounded-full animate-spin"></div>
                                        MEMVERIFIKASI...
                                    </span>
                                ) : (
                                    <>
                                        <LogIn size={20} className="group-hover:translate-x-1 transition-transform" /> 
                                        <span className="tracking-[0.1em]">MASUK SEKARANG</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </form>
                </div>

                <p className="text-center mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                    &copy; 2026 OURPEERS KONVEKSI &bull; SECURE ACCESS
                </p>
            </div>
        </div>
    );
}

function CheckCircle({ size, className }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}


