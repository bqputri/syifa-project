import React from 'react';
import { LayoutDashboard, TrendingUp, Wallet, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ currentTab, setTab, logout }) {
  const navItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'analisis', label: 'Analisis', icon: TrendingUp },
    { id: 'simpanan', label: 'Simpanan', icon: Wallet },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="w-72 hidden md:flex flex-col p-10 border-r border-white/50 bg-white/30">
      <div className="mb-16">
        <h1 className="text-3xl font-extrabold italic tracking-tighter">
          <span className="holo-text">CatatKas.</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full p-4 flex items-center gap-4 text-xs font-bold uppercase tracking-widest transition-all
              ${currentTab === item.id ? 'nav-link active' : 'nav-link text-slate-500 hover:text-slate-800'}`}
          >
            <item.icon className="w-5 h-5" /> {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-white/50 flex flex-col gap-6">
        <button
          onClick={logout}
          className="w-full p-4 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
        <div className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">
          Hologram Pastel React
        </div>
      </div>
    </aside>
  );
}
