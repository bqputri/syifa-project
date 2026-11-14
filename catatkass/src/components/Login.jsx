import React from 'react';
import { LogIn, Info } from 'lucide-react';

export default function Login({ login, error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-50 bg-transparent overflow-hidden">
      <div className="liquid-bg-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="holo-card p-8 md:p-12 w-full max-w-md relative overflow-hidden flex flex-col items-center">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--soft-purple)] rounded-full blur-[60px] opacity-30 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--soft-blue)] rounded-full blur-[60px] opacity-30 pointer-events-none"></div>

        <h1 className="text-4xl font-extrabold italic tracking-tighter mb-2 z-10">
          <span className="holo-text">CatatKas.</span>
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10 z-10 text-center">
          Sign In to Dashboard
        </p>

        {error && (
          <div className="w-full p-4 mb-4 text-xs text-red-500 bg-red-100 rounded-xl font-bold z-10">
            {error}
          </div>
        )}

        <div className="w-full space-y-6 z-10 flex flex-col items-center mt-6">
          <button 
            onClick={login}
            className="w-full flex items-center justify-center gap-4 py-4 holo-btn shadow-xl text-lg tracking-widest px-2 text-white"
          >
            <LogIn className="w-6 h-6" /> <span className="whitespace-nowrap">LOGIN</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold mt-4 flex items-center gap-1">
            <Info className="w-3 h-3" /> Otentikasi menggunakan akun Google
          </p>
        </div>
      </div>
    </div>
  );
}
