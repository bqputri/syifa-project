import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCJ9cb2RzL9OWUlD4QASOWln-QWqcSsgg0",
    authDomain: "catatkass.firebaseapp.com",
    projectId: "catatkass",
    storageBucket: "catatkass.firebasestorage.app",
    messagingSenderId: "947845281367",
    appId: "1:947845281367:web:bcfe7949a03c236e58d512",
    measurementId: "G-VEBJXCQ1SN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export {
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult,
    onAuthStateChanged,
    signOut
};
