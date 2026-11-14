import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({ confirmState, setConfirmState }) {
  if (!confirmState.show) return null;

  const handleConfirm = () => {
    if (confirmState.action) {
      confirmState.action();
    }
    setConfirmState({ show: false, title: '', desc: '', action: null });
  };

  const handleCancel = () => {
    setConfirmState({ show: false, title: '', desc: '', action: null });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="holo-card p-10 max-w-sm w-full text-center bg-[var(--bg-dark)]">
        <div className="w-16 h-16 rounded-full bg-red-100/50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-widest text-slate-800 dark:text-white mb-2">
          {confirmState.title}
        </h3>
        <p className="text-sm text-slate-500 font-bold mb-8">
          {confirmState.desc}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={handleCancel}
            className="flex-1 py-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs"
          >
            Batal
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest shadow-xl shadow-red-500/30 transition-all text-xs"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
