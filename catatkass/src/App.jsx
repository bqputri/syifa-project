import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Savings from './components/Savings';
import Settings from './components/Settings';
import Notification from './components/Notification';
import ConfirmModal from './components/ConfirmModal';
import PWAModal from './components/PWAModal';

const titles = { dashboard: 'Pengelola Cerdas!', analisis: 'Insight Keuangan', simpanan: 'Target Impian', pengaturan: 'Kustomisasi' };
const descs = {
    dashboard: 'Lacak setiap transaksi dengan estetika hologram.',
    analisis: 'Lihat ke mana uangmu mengalir setiap bulannya.',
    simpanan: 'Atur target tabungan untuk masa depan cerah.',
    pengaturan: 'Sesuaikan tema dan warna aplikasimu.'
};

function App() {
  const { user, loading, error, login, logout } = useAuth();
  const [currentTab, setTab] = useState('dashboard');
  const [notif, setNotif] = useState({ show: false, message: '' });
  const [confirmState, setConfirmState] = useState({ show: false, title: '', desc: '', action: null });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaModal, setShowPwaModal] = useState(false);

  const { 
    transactions, savings, categories, categoriesLoaded,
    addTransaction, updateTransaction, deleteTransaction,
    addSaving, updateSaving, deleteSaving,
    addCategory, updateCategory, deleteCategory, initializeDefaultCategories
  } = useFirestore(user?.uid);

  useEffect(() => {
    if (user && categoriesLoaded && categories.length === 0) {
      const initKey = `cat_init_${user.uid}`;
      if (!localStorage.getItem(initKey)) {
        initializeDefaultCategories().then(() => {
          localStorage.setItem(initKey, 'true');
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, categoriesLoaded, categories.length]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Testing only: expose globally
    window.showPWAModalTest = () => {
      setDeferredPrompt({
        prompt: () => console.log('Mock prompt triggered'),
        userChoice: Promise.resolve({ outcome: 'accepted' })
      });
      setShowPwaModal(true);
    };

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPwaModal(false);
  };

  const showNotif = (message) => {
    setNotif({ show: true, message });
    setTimeout(() => setNotif({ show: false, message: '' }), 3000);
  };

  const showConfirm = (title, desc, action) => {
    setConfirmState({ show: true, title, desc, action });
  };

  const handleLogout = () => {
    showConfirm(
      'Keluar Akun',
      'Apakah Anda yakin ingin keluar dari sesi ini?',
      async () => {
        await logout();
        showNotif('Berhasil keluar dari akun.');
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden">
        <div className="liquid-bg-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="holo-card p-12 text-center animate-pulse z-10">
          <h1 className="text-3xl font-extrabold italic tracking-tighter holo-text">Memuat...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login login={login} error={error} />
        {showPwaModal && (
          <PWAModal 
            deferredPrompt={deferredPrompt} 
            onClose={() => setShowPwaModal(false)} 
            onInstall={handleInstallClick} 
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-slate-800 transition-colors duration-500 relative">
      <div className="liquid-bg-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <Sidebar currentTab={currentTab} setTab={setTab} logout={handleLogout} />
      
      <main className="flex-1 p-6 md:p-14 overflow-y-auto pb-24 md:pb-14">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex justify-between items-center bg-white/70 dark:bg-slate-900/40 p-4 rounded-3xl backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white capitalize">
                {currentTab === 'dashboard' ? 'Ringkasan' : currentTab}
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF9A9E] to-[#a1c4fd] p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </header>

          <div className="transition-opacity duration-300">
            {currentTab === 'dashboard' && <Dashboard transactions={transactions} addTransaction={addTransaction} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} showNotif={showNotif} showConfirm={showConfirm} customCategories={categories} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />}
            {currentTab === 'analisis' && <Analytics transactions={transactions} />}
            {currentTab === 'simpanan' && <Savings savings={savings} addSaving={addSaving} updateSaving={updateSaving} deleteSaving={deleteSaving} showNotif={showNotif} showConfirm={showConfirm} />}
            {currentTab === 'pengaturan' && <Settings customCategories={categories} deleteCategory={deleteCategory} showNotif={showNotif} showConfirm={showConfirm} />}
          </div>
        </div>
      </main>

      <MobileNav currentTab={currentTab} setTab={setTab} logout={handleLogout} />
      
      <Notification notif={notif} />
      <ConfirmModal confirmState={confirmState} setConfirmState={setConfirmState} />
      {showPwaModal && (
        <PWAModal 
          deferredPrompt={deferredPrompt} 
          onClose={() => setShowPwaModal(false)} 
          onInstall={handleInstallClick} 
        />
      )}
    </div>
  );
}

export default App;
