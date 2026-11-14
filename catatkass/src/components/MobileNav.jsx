import React from 'react';
import { LayoutDashboard, TrendingUp, Wallet, Settings, LogOut } from 'lucide-react';

export default function MobileNav({ currentTab, setTab, logout }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'analisis', icon: TrendingUp },
    { id: 'simpanan', icon: Wallet },
    { id: 'pengaturan', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-6 right-6 p-4 holo-card flex justify-around items-center z-50 border-white shadow-2xl bg-[var(--bg-dark)]/95">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          className={`transition-all ${currentTab === item.id ? 'text-[var(--soft-purple)] drop-shadow-[0_0_8px_var(--soft-purple)] scale-110' : 'text-slate-400 hover:text-slate-500'}`}
        >
          <item.icon className="w-6 h-6" />
        </button>
      ))}
      <button onClick={logout} className="text-red-400/60 hover:text-red-400 transition-all">
        <LogOut className="w-6 h-6" />
      </button>
    </nav>
  );
}
