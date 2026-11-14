import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const formatNominal = (n) => Math.abs(n).toLocaleString('id-ID');

export default function Savings({ savings, addSaving, updateSaving, deleteSaving, showNotif, showConfirm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [icon, setIcon] = useState('🎯');
  const [name, setName] = useState('');
  const [type, setType] = useState('Impian');
  const [color, setColor] = useState('#9EFFFF');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');

  const openModal = (s = null) => {
    if (s) {
      setEditingId(s.id);
      setIcon(s.icon);
      setName(s.name);
      setType(s.type);
      setColor(s.color || '#9EFFFF');
      setTarget(s.target);
      setSaved(s.saved);
    } else {
      setEditingId(null);
      setIcon('🎯');
      setName('');
      setType('Impian');
      setColor('#9EFFFF');
      setTarget('');
      setSaved('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      icon, name, type, color,
      target: parseFloat(target),
      saved: parseFloat(saved) || 0
    };
    if (editingId) {
      await updateSaving(editingId, data);
      showNotif('Target diperbarui');
    } else {
      await addSaving(data);
      showNotif('Target ditambahkan');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    showConfirm(
      'Hapus Target',
      'Yakin ingin menghapus target simpanan ini beserta riwayat nominalnya?',
      async () => {
        await deleteSaving(id);
        showNotif('Target dihapus');
      }
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {savings.map(s => {
          const percent = s.target > 0 ? (s.saved / s.target * 100).toFixed(1) : 0;
          return (
            <div key={s.id} className="holo-card p-6 md:p-10 flex flex-col justify-between min-h-[250px] group">
              <div className="relative">
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-all">
                  <button onClick={() => openModal(s)} className="w-8 h-8 rounded-full bg-white/40 border border-white/70 text-slate-400 hover:text-[var(--soft-blue)] transition-all flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-full bg-white/40 border border-white/70 text-slate-400 hover:text-red-400 transition-all flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-start mb-6 pr-8">
                  <div className="p-4 bg-white/40 rounded-2xl border border-white/70 text-3xl leading-none">
                    {s.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: s.color }}>
                    {s.type}
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-1">{s.name}</h4>
                <p className="text-xs text-slate-400 uppercase font-black tracking-widest">
                  Terkumpul: {formatNominal(s.saved)} / {formatNominal(s.target)}
                </p>
              </div>
              <div className="mt-8">
                <div className="progress-bar mb-3">
                  <div className="progress-fill" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>{percent}% Selesai</span>
                  <span>{formatNominal(Math.max(s.target - s.saved, 0))} Lagi</span>
                </div>
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => openModal()}
          className="holo-card border-dashed border-white/50 flex flex-col items-center justify-center p-6 md:p-10 hover:border-white transition-all group min-h-[250px]"
        >
          <div className="w-14 h-14 rounded-full border border-white/70 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="text-slate-400 w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Tambah Target Baru</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="holo-card p-10 w-full max-w-md relative bg-[var(--bg-dark)]">
            <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 transition-all">
              <X className="w-6 h-6" />
            </button>
            <h4 className="text-xl font-bold uppercase tracking-widest mb-8 holo-text">
              {editingId ? 'Edit Target' : 'Tambah Target'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <input 
                  type="text" placeholder="Ikon" required
                  value={icon} onChange={e => setIcon(e.target.value)}
                  className="w-20 input-holo text-2xl text-center placeholder:text-slate-400" 
                />
                <input 
                  type="text" placeholder="Nama Target" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="flex-1 input-holo text-base text-slate-800 placeholder:text-slate-400" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={type} onChange={e => setType(e.target.value)}
                  className="w-full input-holo text-base appearance-none bg-[var(--bg-dark)]" required
                >
                  <option value="Impian">Impian</option>
                  <option value="Target">Target</option>
                </select>
                <div className="flex items-center gap-3 px-4 input-holo">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Warna</label>
                  <input 
                    type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="w-full h-8 bg-transparent border-0 cursor-pointer"
                  />
                </div>
              </div>
              <input 
                type="number" placeholder="Target Nominal" required
                value={target} onChange={e => setTarget(e.target.value)}
                className="w-full input-holo font-extrabold text-2xl placeholder:text-slate-400" 
              />
              <input 
                type="number" placeholder="Terkumpul Saat Ini" required
                value={saved} onChange={e => setSaved(e.target.value)}
                className="w-full input-holo font-extrabold text-2xl text-[#00B4D8] placeholder:text-slate-400" 
              />
              <button type="submit" className="w-full py-4 holo-btn shadow-xl text-lg mt-4 text-white">
                {editingId ? 'Update Target' : 'Simpan Target'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
