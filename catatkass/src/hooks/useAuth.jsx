import { useState, useEffect } from 'react';
import { auth, provider, onAuthStateChanged, signInWithPopup, signOut } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setError('');
      setLoading(true);
      // Menggunakan signInWithPopup agar tidak terjadi redirect loop yang dikeluhkan user
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError('Login Gagal: ' + err.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return { user, loading, error, login, logout };
}
