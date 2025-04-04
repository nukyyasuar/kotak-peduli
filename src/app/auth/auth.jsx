'use client'

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from 'firebase/auth';

// Konfigurasi Firebase Anda (sama seperti sebelumnya)
const firebaseConfig = {
  apiKey: "AIzaSyCAeCE6eEwhhNaUY77yvN2BFbfBvFqF1O0",
  authDomain: "sms-otp-51501.firebaseapp.com",
  projectId: "sms-otp-51501",
  storageBucket: "sms-otp-51501.firebasestorage.app",
  messagingSenderId: "722120791860",
  appId: "1:722120791860:web:5bfb70ee6223ea488cf761",
  measurementId: "G-CD2Z5818LY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Inisialisasi Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Setup reCAPTCHA verifier
let recaptchaVerifier;

export const setupRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved - akan memungkinkan pengiriman SMS
      },
      'expired-callback': () => {
        // Response expired. Reset reCAPTCHA
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
      }
    });
  }
  return recaptchaVerifier;
};

// Mengirim kode verifikasi ke nomor telepon
export const sendPhoneVerificationCode = async (phoneNumber) => {
  try {
    const verifier = setupRecaptcha();
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`; // Pastikan format nomor telepon dengan kode negara
    
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      verifier
    );
    
    return confirmationResult;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Memverifikasi kode OTP
export const verifyPhoneCode = async (confirmationResult, verificationCode) => {
  try {
    const result = await confirmationResult.confirm(verificationCode);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// // Contoh fungsi alternatif dengan backend API Anda
// export const sendPhoneVerificationCodeWithAPI = async (phoneNumber) => {
//   try {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       phoneNumber: phoneNumber
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };

//     const response = await fetch("http://localhost:5000/auth/send-phone-verification", requestOptions);
//     const result = await response.json();
    
//     if (!response.ok) {
//       throw new Error(result.message || 'Failed to send verification code');
//     }

//     return result;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

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

// Login dengan email dan password menggunakan API endpoint
export const loginWithEmail = async (email, password) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      password
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch("http://localhost:5000/auth/login", requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    // Optional: Jika Anda juga ingin menggunakan Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;

  } catch (error) {
    throw new Error(error.message);
  }
};

// Register dengan email
export const registerWithEmail = async (email, password, firstName, lastName, phoneNumber) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch("http://localhost:5000/auth/register", requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
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