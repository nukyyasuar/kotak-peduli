'use client'

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,        
  signInWithPopup
} from 'firebase/auth';

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyCAeCE6eEwhhNaUY77yvN2BFbfBvFqF1O0",
  authDomain: "sms-otp-51501.firebaseapp.com",
  projectId: "sms-otp-51501",
  storageBucket: "sms-otp-51501.firebasestorage.app",
  messagingSenderId: "722120791860",
  appId: "1:722120791860:web:5bfb70ee6223ea488cf761",
  measurementId: "G-CD2Z5818LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Inisialisasi Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Login with Google
export const loginWithGoogle = async () => {
  try {
    // Force the account picker by setting the prompt option
    googleProvider.setCustomParameters({
      prompt: 'select_account', // This forces the Google account chooser
    });
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login with email
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Register with email
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};