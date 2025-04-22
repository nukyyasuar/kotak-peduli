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
    try {
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired, resetting...');
          recaptchaVerifier.clear();
          recaptchaVerifier = null;
        }
      });
      console.log('reCAPTCHA verifier initialized');
      return recaptchaVerifier.render().then(() => recaptchaVerifier);
    } catch (error) {
      console.error('reCAPTCHA initialization failed:', error);
      throw new Error('Failed to initialize reCAPTCHA: ' + error.message);
    }
  }
  return Promise.resolve(recaptchaVerifier);
};

// Send verification code to phone number
export const sendPhoneVerificationCode = async (phoneNumber) => {
  try {
    const verifier = await setupRecaptcha();
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`; // Ensure phone number format with country code
    
    console.log('Sending OTP to:', formattedPhoneNumber);
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      verifier
    );
    
    console.log('ConfirmationResult created:', confirmationResult);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending phone verification code:', error);
    switch (error.code) {
      case 'auth/invalid-phone-number':
        throw new Error('Nomor telepon tidak valid. Pastikan format benar (contoh: +6281234567890).');
      case 'auth/too-many-requests':
        throw new Error('Terlalu banyak permintaan. Coba lagi nanti.');
      case 'auth/quota-exceeded':
        throw new Error('Kuota SMS terlampaui. Hubungi dukungan.');
      default:
        throw new Error('Gagal mengirim kode OTP: ' + error.message);
    }
  }
};

// Verify OTP code
export const verifyPhoneCode = async (confirmationResult, verificationCode) => {
  try {
    if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
      throw new Error('Invalid confirmation result. Please request a new OTP.');
    }
    console.log('Verifying OTP code:', verificationCode);
    const result = await confirmationResult.confirm(verificationCode);
    console.log('OTP verification successful, user:', result.user);
    return result.user;
  } catch (error) {
    console.error('Error verifying OTP code:', error);
    switch (error.code) {
      case 'auth/invalid-verification-code':
        throw new Error('Kode OTP tidak valid.');
      case 'auth/session-expired':
        throw new Error('Sesi OTP telah kedaluwarsa. Silakan minta kode baru.');
      default:
        throw new Error('Gagal memverifikasi OTP: ' + error.message);
    }
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

    console.log('Registering user:', raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      credentials: 'include'
    };

    const response = await fetch("http://localhost:5000/auth/register", requestOptions);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

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

// Check auth state
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};