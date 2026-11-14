import React from 'react';

export default function Notification({ notif }) {
  if (!notif.show) return null;
  
  return (
    <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[200] transition-opacity duration-300`}>
      <div className="holo-card px-8 py-4 pointer-events-none shadow-2xl bg-[var(--bg-dark)]">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
          {notif.message}
        </p>
      </div>
    </div>
  );
}
