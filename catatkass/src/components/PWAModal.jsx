import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export default function PWAModal({ deferredPrompt, onClose, onInstall }) {
  if (!deferredPrompt) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="holo-card p-8 md:p-10 w-full max-w-sm relative slide-up-animation animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all bg-white/20 dark:bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/30"
        >
          <X size={18} />
        </button>
        
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#FF9A9E] via-[#C29EFF] to-[#9EFFFF] p-1 shadow-[0_10px_30px_rgba(194,158,255,0.4)] mb-6">
            <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-[#C29EFF]" strokeWidth={1.5} />
            </div>
          </div>
          
          <h4 className="text-2xl font-black uppercase tracking-widest mb-2 text-slate-900 dark:text-white drop-shadow-sm">
            Install Aplikasi
          </h4>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#FF9A9E] via-[#C29EFF] to-[#9EFFFF] mb-4"></div>
          <p className="text-base text-slate-700 dark:text-slate-200 font-semibold mb-8 leading-relaxed px-2">
            Pasang <strong className="text-[#C29EFF] dark:text-[#C29EFF]">CatatKas</strong> di layar utama untuk akses instan dan pengalaman lebih mulus.
          </p>
          
          <div className="w-full flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-slate-200/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-300/90 dark:hover:bg-slate-600/80 text-sm font-bold uppercase tracking-wider transition-all border border-slate-300/50 dark:border-white/10 shadow-sm"
            >
              Nanti
            </button>
            <button 
              onClick={onInstall}
              className="flex-[1.5] py-4 holo-btn shadow-[0_10px_25px_rgba(255,158,229,0.4)] text-sm text-white font-extrabold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <Download size={18} strokeWidth={2.5} /> Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
