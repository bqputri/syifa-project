import React from 'react';
import { PieChart } from 'lucide-react';

const formatNominal = (n) => Math.abs(n).toLocaleString('id-ID');

export default function Analytics({ transactions }) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);

  const catTotals = {};
  expenses.forEach(t => {
    catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="holo-card p-6 md:p-10">
        <h4 className="text-xs font-bold uppercase tracking-[0.4em] mb-8 holo-text">Alokasi Kategori</h4>
        {totalExp === 0 ? (
          <p className="text-slate-400 text-center py-10 text-xs font-bold uppercase tracking-widest">
            Belum ada pengeluaran
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(catTotals).map(([cat, amt]) => {
              const percent = (amt / totalExp * 100).toFixed(1);
              return (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-slate-600">{cat}</span>
                    <span className="text-xs font-black text-slate-400">{percent}% ({formatNominal(amt)})</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="holo-card p-6 md:p-10 flex flex-col items-center justify-center text-center">
        <PieChart className="w-24 h-24 holo-text mb-6 stroke-[1.5]" />
        <h4 className="text-2xl font-bold mb-2 uppercase tracking-tighter">Insight Keuangan</h4>
        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
          Tambahkan lebih banyak transaksi pengeluaran untuk melihat analisis cerdas.
        </p>
      </div>
    </div>
  );
}
