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
} from 'firebase/auth';

// Firebase configuration
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

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Setup reCAPTCHA verifier
let recaptchaVerifier;

export const setupRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved - allows SMS sending
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

// Send verification code to phone number
export const sendPhoneVerificationCode = async (phoneNumber) => {
  
    const verifier = setupRecaptcha();
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`; // Ensure phone number format with country code
    
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      verifier
    );
    
    return confirmationResult;
  }

// Verify OTP code
export const verifyPhoneCode = async (confirmationResult, verificationCode) => {
  try {
    const result = await confirmationResult.confirm(verificationCode);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account', // Forces Google account chooser
    });
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login with email and password using API endpoint
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

    // Store token or user data in localStorage (adjust based on backend response)
    localStorage.setItem('authToken', result.token || result.accessToken);
    return result.user || result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Register with email using API endpoint
export const registerWithEmail = async ({email, password, firstName, lastName, phoneNumber}) => {
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

    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      credentials: 'include' // Include cookies in the request
    };

    const response = await fetch("http://localhost:5000/auth/register", requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    // Optionally store token if registration auto-logs in
    if (result.token || result.accessToken) {
      localStorage.setItem('authToken', result.token || result.accessToken);
    }
    return result.user || result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logout = async () => {
  try {
    // Optionally call a logout endpoint
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem('authToken')}`);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow"
    };

    await fetch("http://localhost:5000/auth/logout", requestOptions);
    localStorage.removeItem('authToken');
  } catch (error) {
    throw new Error(error.message);
  }
};

// Check auth state (replace Firebase's onAuthStateChange)
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
}