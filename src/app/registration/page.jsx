'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  loginWithGoogle,
  onAuthStateChange,
  sendPhoneVerificationCode,
  setupRecaptcha,
  verifyPhoneCode,
  registerWithEmail
} from '../auth/auth';
import { setConfirmationResult, getConfirmationResult, clearConfirmationResult } from '../auth/authStore';

// Validation schema remains the same
const registrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Nama depan tidak boleh kosong')
    .min(3, 'Nama depan harus berisi minimal 3 karakter')
    .matches(/^[A-Za-z\s]+$/, 'Nama depan hanya boleh berisi huruf dan spasi'),
  lastName: Yup.string()
    .required('Nama belakang tidak boleh kosong')
    .min(3, 'Nama belakang harus berisi minimal 3 karakter')
    .matches(/^[A-Za-z\s]+$/, 'Nama belakang hanya boleh berisi huruf dan spasi'),
  phoneNumber: Yup.string()
    .required('Nomor telepon tidak boleh kosong')
    .matches(/^[8][0-9]{8,11}$/, 'Nomor telepon harus diawali dengan angka `8` dan berisi 9–12 digit'),
  email: Yup.string()
    .required('Email tidak boleh kosong')
    .email('Format email salah. Masukkan format email yang valid (contoh: user@example.com)'),
  password: Yup.string()
    .required('Password tidak boleh kosong')
    .min(8, 'Password harus berisi minimal 8 karakter')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung huruf besar, huruf kecil, dan angka'
    ),
});

export default function Registration() {
  // Form/Registration states
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Add new state to control view
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  // OTP states
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  
  const recaptchaContainerRef = useRef(null);
  const inputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    }
  });

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const phoneValue = watch("phoneNumber");
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Check for stored OTP state on component mount
  useEffect(() => {
    try {
      // Check if we were in OTP verification
      const storedRegistrationData = JSON.parse(localStorage.getItem('registrationData'));
      const storedVerificationState = localStorage.getItem('showOtpVerification') === 'true';
      
      if (storedRegistrationData && storedVerificationState) {
        console.log('Restoring OTP verification state after refresh');
        setRegistrationData(storedRegistrationData);
        setShowOtpVerification(true);
        
        // Retrieve confirmation result if available
        const storedConfirmation = getConfirmationResult();
        if (storedConfirmation) {
          console.log('Retrieved stored confirmation result');
          setConfirmationResult(storedConfirmation);
        } else {
          console.log('No stored confirmation result found, preparing to resend OTP');
          // Set timer for 2 seconds to allow DOM to fully render before initializing reCAPTCHA
          setTimeout(() => {
            handleResendOtp(storedRegistrationData);
          }, 2000);
        }
        
        // Start timer if needed
        setTimer(60);
        setIsTimerRunning(true);
      }
    } catch (err) {
      console.error('Error restoring verification state:', err);
      // Reset state in case of error
      localStorage.removeItem('showOtpVerification');
      localStorage.removeItem('registrationData');
      clearConfirmationResult();
    }
  }, []);

  // Initialize recaptcha when component mounts
  useEffect(() => {
    if (!recaptchaContainerRef.current || !showOtpVerification) return;

    let isMounted = true;

    const initializeRecaptcha = async () => {
      try {
        await setupRecaptcha(recaptchaContainerRef.current.id);
        console.log('reCAPTCHA initialized');
      } catch (err) {
        if (isMounted) {
          console.error('reCAPTCHA initialization error:', err);
          setError('Gagal menginisialisasi reCAPTCHA: ' + err.message);
        }
      }
    };

    initializeRecaptcha();

    return () => {
      isMounted = false;
    };
  }, [showOtpVerification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const isValidPhoneNumber = (phone) => {
    return phone && phone.startsWith('+62') && phone.length >= 12 && phone.length <= 15;
  };

  const saveRegistrationData = (data) => {
    try {
      localStorage.setItem('registrationData', JSON.stringify(data));
      const storedData = JSON.parse(localStorage.getItem('registrationData'));
      if (!storedData || !storedData.email || !storedData.password || !storedData.phoneNumber) {
        throw new Error('Gagal menyimpan data registrasi ke localStorage.');
      }
      console.log('Successfully stored registrationData:', storedData);
      return true;
    } catch (err) {
      console.error('Error saving registrationData:', err);
      throw new Error('Gagal menyimpan data registrasi: ' + err.message);
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    try {
      const formattedPhoneNumber = '+62' + data.phoneNumber;

      if (!isValidPhoneNumber(formattedPhoneNumber)) {
        throw new Error('Nomor telepon tidak valid. Pastikan nomor diawali dengan 8 dan berisi 9–12 digit.');
      }

      const registrationData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: formattedPhoneNumber,
        email: data.email,
        password: data.password,
      };

      // Validate registrationData before storing
      if (!registrationData.email || !registrationData.password || !registrationData.phoneNumber) {
        throw new Error('Data registrasi tidak lengkap. Silakan isi semua kolom.');
      }

      console.log('Preparing to store registrationData:', registrationData);

      // Attempt to save registrationData with retry
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts) {
        try {
          if (saveRegistrationData(registrationData)) {
            break;
          }
        } catch (err) {
          attempts++;
          console.warn(`Attempt ${attempts} failed to save registrationData:`, err);
          if (attempts === maxAttempts) {
            throw new Error('Gagal menyimpan data registrasi setelah beberapa percobaan.');
          }
          await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay before retry
        }
      }
      
      // Save registrationData in state as well
      setRegistrationData(registrationData);

      // Save OTP verification state to localStorage
      localStorage.setItem('showOtpVerification', 'true');
      
      // Show OTP verification screen first, then send code
      setShowOtpVerification(true);
      
      // Wait for recaptcha to initialize
      setTimeout(async () => {
        try {
          const confirmation = await sendPhoneVerificationCode(formattedPhoneNumber);
          setConfirmationResult(confirmation);
          console.log('Confirmation result stored:', confirmation);
          setIsTimerRunning(true);
        } catch (err) {
          console.error('Error during OTP sending:', err);
          setError(err.message || 'Terjadi kesalahan saat mengirim OTP');
          setShowOtpVerification(false);
          localStorage.removeItem('showOtpVerification');
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error('Error during form submission:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses pendaftaran');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      router.push('/homepage');
    } catch (err) {
      setError(err.message);
    }
  };
  
  // OTP handling functions
  const handleOtpChange = (element, index, event) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (!element.value && index > 0 && event.key === 'Backspace') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (event.key === 'ArrowRight' && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    console.log('Verifying OTP with registrationData:', registrationData);
    console.log('Confirmation Result:', confirmationResult);
    setError('');
    setIsLoading(true);
    const code = otp.join('');
    if (!code || code.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      setIsLoading(false);
      return;
    }

    if (!registrationData || Object.keys(registrationData).length === 0) {
      setError('Data registrasi tidak ditemukan. Silakan daftar ulang.');
      setIsLoading(false);
      setShowOtpVerification(false);
      return;
    }

    try {
      const user = await verifyPhoneCode(confirmationResult, code);
      console.log('OTP verification successful:', user);

      const idToken = await user.getIdToken();
      console.log('ID Token:', idToken);

      const { email, password, firstName, lastName, phoneNumber } = registrationData;

      // Require only email and password, provide defaults for others
      if (!email || !password) {
        console.warn('Missing critical registration data:', { email, password });
        throw new Error('Data registrasi tidak lengkap (email atau password hilang). Silakan daftar ulang.');
      }

      const registrationResult = await registerWithEmail({
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        phoneNumber: phoneNumber || '',
        idToken,
      });

      console.log('Registration successful:', registrationResult);

      // Clean up localStorage
      localStorage.removeItem('registrationData');
      localStorage.removeItem('showOtpVerification');
      clearConfirmationResult();

      alert('Pendaftaran berhasil!');
      router.push('/login');
    } catch (err) {
      console.error('Error during OTP verification or registration:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Kode OTP salah. Silakan coba lagi.');
      } else if (err.code === 'auth/session-expired') {
        setError('Sesi OTP telah kedaluwarsa. Silakan minta kode baru.');
      } else if (err.message.includes('Data registrasi tidak lengkap')) {
        setError(err.message);
        setShowOtpVerification(false);
        localStorage.removeItem('showOtpVerification');
      } else {
        setError('Gagal memverifikasi OTP: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modifikasi fungsi handleResendOtp untuk menerima parameter opsional
const handleResendOtp = async (dataToUse = null) => {
  const data = dataToUse || registrationData;
  console.log('Resending OTP with registrationData:', data);
  setError('');
  setIsResendLoading(true);

  const phoneNumber = data?.phoneNumber || '';
  const isValidPhoneNumber = phoneNumber && phoneNumber.startsWith('+62') && phoneNumber.length >= 12 && phoneNumber.length <= 15;

  if (!phoneNumber || !isValidPhoneNumber) {
    setError('Nomor telepon tidak valid atau tidak ditemukan. Silakan daftar ulang.');
    setIsResendLoading(false);
    setShowOtpVerification(false);
    localStorage.removeItem('showOtpVerification');
    return;
  }

  try {
    // Clear old confirmation result
    clearConfirmationResult();
    setConfirmationResult(null);

    // Wait for recaptcha container to be available
    if (!recaptchaContainerRef.current) {
      console.log('Waiting for recaptcha container...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!recaptchaContainerRef.current) {
        throw new Error('reCAPTCHA container tidak ditemukan.');
      }
    }

    // Force reinitialize reCAPTCHA
    await setupRecaptcha(recaptchaContainerRef.current.id, true);
    console.log('reCAPTCHA reinitialized for resend OTP');

    const confirmation = await sendPhoneVerificationCode(phoneNumber);
    console.log('New confirmation result obtained:', confirmation);
    setConfirmationResult(confirmation);
    
    // Store confirmation in localStorage
    setConfirmationResult(confirmation);
    
    setTimer(60);
    setIsTimerRunning(true);
    setOtp(['', '', '', '', '', '']);
    
    if (!dataToUse) { // Only show alert if user manually requested resend
      alert('Kode OTP baru telah dikirim.');
    }
  } catch (err) {
    console.error('Resend OTP error:', err);
    if (err.message.includes('reCAPTCHA has already been rendered')) {
      // Try to reset and reinitialize
      try {
        document.getElementById(recaptchaContainerRef.current.id).innerHTML = '';
        await setupRecaptcha(recaptchaContainerRef.current.id, true);
        const confirmation = await sendPhoneVerificationCode(phoneNumber);
        setConfirmationResult(confirmation);
        setTimer(60);
        setIsTimerRunning(true);
        return;
      } catch (innerErr) {
        console.error('Failed to recover from reCAPTCHA error:', innerErr);
      }
      setError('Gagal menginisialisasi reCAPTCHA. Silakan muat ulang halaman.');
    } else if (err.code === 'auth/invalid-phone-number') {
      setError('Nomor telepon tidak valid. Silakan daftar ulang.');
      setShowOtpVerification(false);
      localStorage.removeItem('showOtpVerification');
    } else if (err.code === 'auth/too-many-requests') {
      setError('Terlalu banyak permintaan. Coba lagi nanti.');
    } else if (err.code === 'auth/quota-exceeded') {
      setError('Kuota SMS telah habis. Hubungi dukungan.');
    } else {
      setError('Gagal mengirim ulang OTP: ' + err.message);
    }
  } finally {
    setIsResendLoading(false);
  }
};


  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goBackToRegistration = () => {
    setShowOtpVerification(false);
    setError('');
    localStorage.removeItem('showOtpVerification');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>{showOtpVerification ? 'Verifikasi OTP - Beri Barang' : 'Beri Barang - Daftar'}</title>
        <meta
          name="description"
          content={showOtpVerification ? 'Verifikasi OTP untuk donasi selamat datang di Beri Barang' : 'Beri Barang donation registration page'}
        />
      </Head>

      <div className="absolute top-0 left-0 cursor-pointer">
        <div className="flex items-center">
          <Image
            src="/Main Design Skripsi Frame 431.webp"
            alt="Beri Barang Logo"
            width={188}
            height={80}
          />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center w-[477px] h-[541px]">
          <div className="bg-[#FFF0DC] rounded-lg p-8 max-w-md">
            <div className="relative">
              <Image
                src="/Main Design Frame.webp"
                alt="Donation Illustration"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-12">
          {!showOtpVerification ? (
            /* REGISTRATION FORM */
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">DAFTAR</h1>
              <p className="text-gray-700 mb-6 text-center">
                Bersama menyejahterakan masyarakat
              </p>

              {error && (
                <p className="text-red-500 text-center mb-4">{error}</p>
              )}

              <div id="recaptcha-container"></div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="firstName" className="block text-gray-700 font-bold mb-1">
                      Nama Depan
                    </label>
                    <input
                      {...register("firstName")}
                      id="firstName"
                      placeholder="Matthew"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 outline outline-1"
                      style={{
                        color: firstNameValue?.length > 0 ? '#131010' : '#C2C2C2',
                        outlineColor: firstNameValue?.length > 0 ? '#131010' : '#C2C2C2'
                      }}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="lastName" className="block text-gray-700 font-bold mb-1">
                      Nama Belakang
                    </label>
                    <input
                      {...register("lastName")}
                      id="lastName"
                      placeholder="Emmanuel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 outline outline-1"
                      style={{
                        color: lastNameValue?.length > 0 ? '#131010' : '#C2C2C2',
                        outlineColor: lastNameValue?.length > 0 ? '#131010' : '#C2C2C2'
                      }}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-1">
                    Nomor Telepon (Whatsapp)
                  </label>
                  <input
                    {...register("phoneNumber")}
                    id="phoneNumber"
                    placeholder="81246875123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 outline outline-1"
                    style={{
                      color: phoneValue?.length > 0 ? '#131010' : '#C2C2C2',
                      outlineColor: phoneValue?.length > 0 ? '#131010' : '#C2C2C2'
                    }}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-bold mb-1">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    placeholder="example@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 outline outline-1"
                    style={{
                      color: emailValue?.length > 0 ? '#131010' : '#C2C2C2',
                      outlineColor: emailValue?.length > 0 ? '#131010' : '#C2C2C2'
                    }}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 font-bold mb-1">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    placeholder="Masukkan minimum 8 karakter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-1"
                    style={{
                      color: passwordValue?.length > 0 ? '#131010' : '#C2C2C2',
                      outlineColor: passwordValue?.length > 0 ? '#131010' : '#C2C2C2'
                    }}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F0BB78] text-white font-bold rounded-md transition duration-200 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    'Buat Akun'
                  )}
                </button>

                <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-3 text-[#C2C2C2] text-sm">
                    atau menggunakan
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 border border-[#FFC107] flex justify-center items-center gap-2 rounded-md transition duration-200 text-[#131010] font-bold"
                >
                  <FcGoogle size={20} />
                  <span>Google</span>
                </button>
              </form>
            </>
          ) : (
            /* OTP VERIFICATION */
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Verifikasi OTP</h2>

              <p className="text-gray-600 text-base mb-4 text-center">
                Masukkan kode OTP yang telah dikirimkan ke {registrationData?.phoneNumber || 'nomor telepon anda'}
              </p>

              <div className="flex space-x-2 mb-4 justify-center">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index, e)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
                    style={{
                      color: data ? '#131010' : '#000',
                      outlineColor: data ? '#131010' : '#C2C2C2',
                    }}
                    aria-label={`OTP digit ${index + 1}`}
                    aria-required="true"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-[#F5A623] text-white py-2 rounded-md hover:bg-[#e69520] transition-colors text-sm relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Memverifikasi...</span>
                  </div>
                ) : (
                  'Konfirmasi'
                )}
              </button>

              <button
                onClick={handleResendOtp}
                disabled={isTimerRunning || isResendLoading}
                className={`w-full mt-2 px-7 py-2 text-[#131010] text-xs border border-[#F0BB78] rounded-md transition Von-colors font-bold ${
                  isTimerRunning || isResendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
              >
                {isResendLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-[#F0BB78] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Mengirim...</span>
                  </div>
                ) : (
                  `Kirim Ulang Kode (${formatTimer(timer)})`
                )}
              </button>
              
              <button
                onClick={goBackToRegistration}
                className="w-full mt-2 text-[#131010] text-xs py-2 underline"
              >
                Kembali ke formulir pendaftaran
              </button>

              {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}