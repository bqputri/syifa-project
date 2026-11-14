import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestore(userId) {
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setSavings([]);
      setCategories([]);
      setCategoriesLoaded(false);
      return;
    }

    const txQuery = query(collection(db, "transactions"), where("userId", "==", userId));
    const unsubTx = onSnapshot(txQuery, (snapshot) => {
      const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      txData.sort((a, b) => {
        if (a.date === b.date) return b.createdAt - a.createdAt;
        return new Date(b.date) - new Date(a.date);
      });
      setTransactions(txData);
    });

    const svQuery = query(collection(db, "savings"), where("userId", "==", userId));
    const unsubSv = onSnapshot(svQuery, (snapshot) => {
      setSavings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const catQuery = query(collection(db, "categories"), where("userId", "==", userId));
    const unsubCat = onSnapshot(catQuery, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCategoriesLoaded(true);
    });

    return () => {
      unsubTx();
      unsubSv();
      unsubCat();
    };
  }, [userId]);

  const addTransaction = async (data) => addDoc(collection(db, "transactions"), { ...data, userId, createdAt: Date.now() });
  const updateTransaction = async (id, data) => updateDoc(doc(db, "transactions", id), data);
  const deleteTransaction = async (id) => deleteDoc(doc(db, "transactions", id));

  const addSaving = async (data) => addDoc(collection(db, "savings"), { ...data, userId, createdAt: Date.now() });
  const updateSaving = async (id, data) => updateDoc(doc(db, "savings", id), data);
  const deleteSaving = async (id) => deleteDoc(doc(db, "savings", id));

  const addCategory = async (data) => addDoc(collection(db, "categories"), { ...data, userId, createdAt: Date.now() });
  const updateCategory = async (id, data) => updateDoc(doc(db, "categories", id), data);
  const deleteCategory = async (id) => deleteDoc(doc(db, "categories", id));

  const initializeDefaultCategories = async () => {
    const defaultCats = [
      { type: 'expense', icon: '☕', name: 'Konsumsi' },
      { type: 'expense', icon: '🚕', name: 'Transport' },
      { type: 'expense', icon: '🎮', name: 'Hiburan' },
      { type: 'expense', icon: '👕', name: 'Belanja' },
      { type: 'expense', icon: '✨', name: 'Lainnya' },
      { type: 'income', icon: '💵', name: 'Gaji' },
      { type: 'income', icon: '🧧', name: 'Bonus' },
      { type: 'income', icon: '💎', name: 'Investasi' },
      { type: 'income', icon: '📂', name: 'Lainnya' }
    ];
    for (const cat of defaultCats) {
      await addDoc(collection(db, "categories"), { ...cat, userId, createdAt: Date.now() });
    }
  };

  return { 
    transactions, savings, categories, categoriesLoaded,
    addTransaction, updateTransaction, deleteTransaction,
    addSaving, updateSaving, deleteSaving,
    addCategory, updateCategory, deleteCategory, initializeDefaultCategories
  };
}
