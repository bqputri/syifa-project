import React, { useState, useEffect } from 'react';
import { Sun, Moon, Palette, Pipette, Check, Trash2, Tag } from 'lucide-react';

export default function Settings({ customCategories = [], deleteCategory, showNotif, showConfirm }) {
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'dark');
  const [palette, setPaletteState] = useState(localStorage.getItem('colorPalette') || 'pink');
  const [customColor, setCustomColor] = useState(localStorage.getItem('customColor') || '#9EFFFF');

  const palettes = {
    pink: { main: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 40%, #a1c4fd 100%)', p: '#FF9A9E', b: '#a1c4fd' },
    blue: { main: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 50%, #03045E 100%)', p: '#0077B6', b: '#00B4D8' },
    orange: { main: 'linear-gradient(135deg, #FF7B54 0%, #FFB26B 50%, #FFD56F 100%)', p: '#FF7B54', b: '#FFD56F' },
    green: { main: 'linear-gradient(135deg, #06D6A0 0%, #118AB2 50%, #073B4C 100%)', p: '#06D6A0', b: '#118AB2' }
  };

  const applyColorDirect = (main, pink, blue) => {
    document.documentElement.style.setProperty('--holo-main', main);
    document.documentElement.style.setProperty('--soft-pink', pink);
    document.documentElement.style.setProperty('--soft-blue', blue);
  };

  const setTheme = (mode) => {
    setThemeState(mode);
    if (mode === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', mode);
  };

  const setColor = (key) => {
    setPaletteState(key);
    const p = palettes[key];
    if (p) applyColorDirect(p.main, p.p, p.b);
    localStorage.setItem('colorPalette', key);
    localStorage.removeItem('customColor');
  };

  const applyCustomColor = () => {
    const main = `linear-gradient(135deg, ${customColor} 0%, rgba(255,255,255,0.3) 100%)`;
    applyColorDirect(main, customColor, customColor);
    localStorage.setItem('customColor', customColor);
    localStorage.removeItem('colorPalette');
    setPaletteState('');
  };

  useEffect(() => {
    setTheme(theme);
    if (localStorage.getItem('customColor')) {
      applyCustomColor();
    } else {
      setColor(palette);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteCategory = (cat) => {
    showConfirm(
      'Hapus Kategori',
      `Yakin ingin menghapus kategori kustom "${cat.name}"? Ini tidak akan menghapus transaksi lama Anda.`,
      async () => {
        await deleteCategory(cat.id);
        showNotif('Kategori dihapus');
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 pb-10">
      <div className="holo-card p-6 md:p-8">
        <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-6 holo-text flex items-center gap-2">
          <Sun className="w-4 h-4" /> Mode Tampilan
        </h4>
        <div className="flex justify-center">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="glass-toggle group"
            aria-label="Toggle theme"
          >
            <span className={`glass-toggle-label transition-all duration-300 ${theme === 'dark' ? 'text-white font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
              <Moon className="w-4 h-4" /> Gelap
            </span>
            <span className={`glass-toggle-label transition-all duration-300 ${theme === 'light' ? 'text-slate-800 font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>
              <Sun className="w-4 h-4" /> Terang
            </span>
            <div className={`glass-toggle-knob ${theme === 'light' ? 'translate-x-full' : 'translate-x-0'}`}>
              <div className="glass-toggle-knob-inner"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="holo-card p-6 md:p-8">
        <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-6 holo-text flex items-center gap-2">
          <Palette className="w-4 h-4" /> Warna Aksen
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(palettes).map(([key, p]) => (
            <button 
              key={key} onClick={() => setColor(key)}
              className={`py-4 rounded-2xl border flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 ${palette === key ? 'border-[var(--soft-purple)] bg-white/10 shadow-lg text-[var(--soft-purple)]' : 'border-white/30 text-slate-400'}`}
            >
              <div className="w-6 h-6 rounded-full shadow-md" style={{ background: p.main }}></div> 
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="holo-card p-6 md:p-8">
        <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-6 holo-text flex items-center gap-2">
          <Pipette className="w-4 h-4" /> Warna Bebas
        </h4>
        <div className="flex items-center gap-4">
          <label className="w-14 h-14 shrink-0 rounded-2xl border-2 border-white/40 dark:border-white/20 overflow-hidden cursor-pointer relative shadow-inner hover:scale-105 transition-transform">
            <input 
              type="color" value={customColor} onChange={e => setCustomColor(e.target.value)}
              className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] cursor-pointer border-0 bg-transparent"
            />
          </label>
          <div className="flex-1 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Warna Terpilih: <span className="text-slate-600 dark:text-slate-300">{customColor}</span></p>
            <button onClick={applyCustomColor} className="w-full py-3.5 holo-btn shadow-xl text-xs flex justify-center items-center gap-2">
              <Check className="w-4 h-4" /> Terapkan Warna
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
