import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, Plus, X } from 'lucide-react';

const formatNominal = (n) => Math.abs(n).toLocaleString('id-ID');

const EMOJI_LIST = ['☕','🚕','🎮','👕','✨','💵','🧧','💎','📂','🍔','✈️','🏠','💊','📚','🎁','🐾','🛒','🔧','❤️','🔥'];

export default function Dashboard({ transactions, addTransaction, updateTransaction, deleteTransaction, showNotif, showConfirm, customCategories = [], addCategory, updateCategory, deleteCategory }) {
  const [mode, setMode] = useState('expense');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cat, setCat] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isEditCatMode, setIsEditCatMode] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [newCatIcon, setNewCatIcon] = useState('✨');
  const [newCatName, setNewCatName] = useState('');

  const activeCats = customCategories.filter(c => c.type === mode);

  useEffect(() => {
    if (activeCats.length > 0) {
      const exists = activeCats.find(c => `${c.icon} ${c.name}` === cat);
      if (!exists) {
        setCat(`${activeCats[0].icon} ${activeCats[0].name}`);
      }
    } else {
      setCat('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, customCategories.length]);

  const handleCatChange = (e) => {
    if (e.target.value === 'ADD_NEW') {
      openAddCatModal();
      if (activeCats.length > 0) e.target.value = cat;
    } else {
      setCat(e.target.value);
    }
  };

  const openAddCatModal = () => {
    setIsEditCatMode(false);
    setEditCatId(null);
    setNewCatIcon('✨');
    setNewCatName('');
    setIsCatModalOpen(true);
  };

  const openEditCatModal = (catObj) => {
    setIsEditCatMode(true);
    setEditCatId(catObj.id);
    setNewCatIcon(catObj.icon);
    setNewCatName(catObj.name);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (newCatName.trim() === '') return;
    
    if (isEditCatMode && editCatId) {
      await updateCategory(editCatId, { icon: newCatIcon, name: newCatName });
      setCat(`${newCatIcon} ${newCatName}`);
      showNotif('Kategori diperbarui');
    } else {
      await addCategory({ icon: newCatIcon, name: newCatName, type: mode });
      setCat(`${newCatIcon} ${newCatName}`);
      showNotif('Kategori baru ditambahkan');
    }
    setIsCatModalOpen(false);
  };

  const handleDeleteSelectedCat = () => {
    const customCatObj = activeCats.find(c => `${c.icon} ${c.name}` === cat);
    if (!customCatObj) return;

    showConfirm(
      'Hapus Kategori',
      `Yakin ingin menghapus kategori "${customCatObj.name}"? Transaksi lama dengan nama kategori ini tidak akan terhapus.`,
      async () => {
        await deleteCategory(customCatObj.id);
        if (activeCats.length > 1) {
          const fallback = activeCats.find(c => c.id !== customCatObj.id);
          setCat(fallback ? `${fallback.icon} ${fallback.name}` : '');
        } else {
          setCat('');
        }
        showNotif('Kategori dihapus');
      }
    );
  };

  const handleEditSelectedCat = () => {
    const customCatObj = activeCats.find(c => `${c.icon} ${c.name}` === cat);
    if (!customCatObj) return;
    openEditCatModal(customCatObj);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cat) {
      showNotif('Silakan buat kategori terlebih dahulu');
      return;
    }
    const data = { desc, amount: parseFloat(amount), date, type: mode, cat };
    
    if (editingId) {
      await updateTransaction(editingId, data);
      setEditingId(null);
      showNotif('Transaksi berhasil diubah');
    } else {
      await addTransaction(data);
      showNotif('Transaksi berhasil ditambahkan');
    }
    
    setDesc('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleEdit = (tx) => {
    setEditingId(tx.id);
    setDesc(tx.desc);
    setAmount(tx.amount);
    setDate(tx.date);
    setMode(tx.type);
    setCat(tx.cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    showConfirm(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus catatan transaksi ini secara permanen?',
      async () => {
        await deleteTransaction(id);
        showNotif('Transaksi dihapus');
      }
    );
  };

  const totalIn = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalEx = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBal = totalIn - totalEx;

  const currentCustomCat = activeCats.find(c => `${c.icon} ${c.name}` === cat);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="holo-card p-10 border-b-2 border-[var(--soft-purple)]">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em] mb-6">Saldo Utama</p>
          <h3 className="text-4xl font-extrabold tracking-tighter holo-text">{formatNominal(totalBal)}</h3>
        </div>
        <div className="holo-card p-10 border-b-2 border-[#00B4D8]">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em] mb-6">Pemasukan</p>
          <h3 className="text-3xl font-extrabold text-[#00B4D8]">{formatNominal(totalIn)}</h3>
        </div>
        <div className="holo-card p-10 border-b-2 border-[#D53F8C]">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em] mb-6">Pengeluaran</p>
          <h3 className="text-3xl font-extrabold text-[#D53F8C]">{formatNominal(totalEx)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-5">
          <div className="holo-card p-6 md:p-10">
            <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-10 holo-text">Input Transaksi</h4>
            <div className="flex p-1.5 bg-slate-100/80 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 rounded-2xl mb-8">
              <button 
                type="button"
                onClick={() => setMode('expense')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === 'expense' ? 'bg-white/50 shadow-lg border border-white/50 text-slate-800' : 'text-slate-400 hover:text-slate-800 border border-transparent'}`}
              >
                Keluar
              </button>
              <button 
                type="button"
                onClick={() => setMode('income')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === 'income' ? 'bg-white/50 shadow-lg border border-white/50 text-slate-800' : 'text-slate-400 hover:text-slate-800 border border-transparent'}`}
              >
                Masuk
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <input 
                type="text" placeholder="Contoh: Kopi Sore..." required
                value={desc} onChange={(e) => setDesc(e.target.value)}
                className="w-full input-holo text-sm md:text-base placeholder:text-slate-400"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input 
                  type="date" required
                  value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full input-holo text-sm md:text-base"
                />
                <div className="flex flex-col gap-2">
                  <select 
                    value={cat} onChange={handleCatChange}
                    className="w-full input-holo text-sm md:text-base appearance-none"
                  >
                    {activeCats.length === 0 && <option disabled value="">Belum ada kategori</option>}
                    {activeCats.map(c => {
                      const val = `${c.icon} ${c.name}`;
                      return <option key={c.id} value={val}>{val}</option>;
                    })}
                    <option disabled value="">──────────</option>
                    <option value="ADD_NEW">+ Tambah Kategori Baru</option>
                  </select>
                  {currentCustomCat && (
                    <div className="flex items-center gap-1.5">
                      <button 
                        type="button" 
                        onClick={handleEditSelectedCat} 
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white dark:text-slate-300 bg-blue-500 dark:bg-slate-800/40 hover:bg-blue-600 dark:hover:bg-blue-900/20 border border-blue-600 dark:border-white/10 rounded-xl transition-all shadow-sm"
                        title="Edit Kategori Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={handleDeleteSelectedCat} 
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white dark:text-slate-300 bg-red-500 dark:bg-slate-800/40 hover:bg-red-600 dark:hover:bg-red-900/20 border border-red-600 dark:border-white/10 rounded-xl transition-all shadow-sm"
                        title="Hapus Kategori Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <input 
                type="number" placeholder="Jumlah Nominal" required
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full input-holo text-sm md:text-base text-2xl font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal placeholder:text-base"
              />
              <button type="submit" className="w-full py-4 holo-btn shadow-xl text-sm mt-4">
                {editingId ? 'Simpan Perubahan' : 'Catat Transaksi'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setDesc(''); setAmount(''); }} className="w-full py-3 mt-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">
                  Batal Edit
                </button>
              )}
            </form>
          </div>
        </div>
        
        <div className="xl:col-span-7">
          <div className="holo-card p-6 md:p-10 h-full">
            <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-10 holo-text">Riwayat Transaksi</h4>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Belum ada transaksi</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="group bg-white/60 dark:bg-slate-800/40 p-4 md:p-5 rounded-3xl border border-slate-200/60 dark:border-white/10 flex items-center gap-3 transition-all hover:bg-white/80 dark:hover:bg-slate-700/50 hover:shadow-lg">
                    <div className="w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-2xl bg-white/70 dark:bg-slate-900/50 flex items-center justify-center text-xl md:text-2xl shadow-inner border border-slate-200/50 dark:border-white/10">
                      {tx.cat.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white text-sm md:text-base leading-tight truncate">{tx.desc}</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">
                        {tx.cat.split(' ').slice(1).join(' ')} • {tx.date}
                      </p>
                    </div>
                    <p className={`font-black text-base md:text-lg shrink-0 ${tx.type === 'income' ? 'text-[#00B4D8]' : 'text-[#D53F8C]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatNominal(tx.amount)}
                    </p>
                    <div className="flex items-center gap-0.5 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(tx)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white/30 dark:hover:bg-blue-900/30 rounded-xl transition-all" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(tx.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white/30 dark:hover:bg-red-900/30 rounded-xl transition-all" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="holo-card p-8 w-full max-w-sm animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-widest text-sm">
                {isEditCatMode ? 'Edit Kategori' : 'Kategori Baru'}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div className="flex gap-4">
                <input 
                  type="text" placeholder="Ikon" required maxLength={2}
                  value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)}
                  className="w-16 input-holo text-2xl text-center placeholder:text-slate-400 p-2" 
                />
                <input 
                  type="text" placeholder="Nama Kategori" required
                  value={newCatName} onChange={e => setNewCatName(e.target.value)}
                  className="flex-1 input-holo text-base text-slate-800 placeholder:text-slate-400" 
                />
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pilih Ikon Cepat</p>
                <div className="grid grid-cols-5 gap-2">
                  {EMOJI_LIST.map(emoji => (
                    <button
                      key={emoji} type="button"
                      onClick={() => setNewCatIcon(emoji)}
                      className={`p-2 text-xl rounded-xl border transition-all ${newCatIcon === emoji ? 'border-[var(--soft-purple)] bg-white/40 shadow-inner' : 'border-transparent hover:bg-white/20'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-4 holo-btn shadow-xl text-xs flex justify-center items-center gap-2">
                {isEditCatMode ? 'Simpan Perubahan' : <><Plus className="w-4 h-4"/> Tambahkan</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
