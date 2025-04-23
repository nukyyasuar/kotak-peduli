'use client';

import Image from 'next/image';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { setupRecaptcha, verifyPhoneCode, sendPhoneVerificationCode } from '../auth/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { getConfirmationResult, clearConfirmationResult } from '../auth/authStore';
import { registerWithEmail } from '../auth/auth';

export default function OtpLogin() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone') || 'nomor telepon anda';
  const recaptchaContainerRef = useRef(null);
  const inputRefs = useRef([]);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!recaptchaContainerRef.current) return;

    let isMounted = true;

    const initializeRecaptcha = async () => {
      try {
        await setupRecaptcha(recaptchaContainerRef.current.id);
        console.log('reCAPTCHA initialized in OtpLogin');
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
  }, [recaptchaContainerRef]);

  // Check confirmation result
  useEffect(() => {
    const confirmation = getConfirmationResult();
    if (confirmation && typeof confirmation.confirm === 'function') {
      setConfirmationResult(confirmation);
    } else {
      setError('Tidak ada permintaan verifikasi ditemukan. Silakan daftar ulang.');
    }
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
    setError('');
    setIsLoading(true);
    const code = otp.join('');
    if (!code || code.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      setIsLoading(false);
      return;
    }

    if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
      setError('Tidak ada permintaan verifikasi ditemukan. Silakan daftar ulang.');
      setIsLoading(false);
      return;
    }

    try {
      const user = await verifyPhoneCode(confirmationResult, code);
      console.log('OTP verification successful:', user);

      const pendingRegistration = JSON.parse(localStorage.getItem('pendingRegistration'));
      if (!pendingRegistration) {
        setError('Data pendaftaran tidak ditemukan. Silakan daftar ulang.');
        setIsLoading(false);
        return;
      }

      const registrationResult = await registerWithEmail({
        firstName: pendingRegistration.firstName,
        lastName: pendingRegistration.lastName,
        phoneNumber: pendingRegistration.phoneNumber,
        email: pendingRegistration.email,
        password: pendingRegistration.password,
      });
      console.log('Registration successful:', registrationResult);

      localStorage.removeItem('pendingRegistration');
      clearConfirmationResult();

      alert('Pendaftaran berhasil!');
      router.push('/login');
    } catch (err) {
      console.error('Error during OTP verification or registration:', err);
      switch (err.code) {
        case 'auth/invalid-verification-code':
          setError('Kode OTP salah');
          break;
        case 'auth/session-expired':
          setError('Sesi OTP telah kedaluwarsa. Silakan minta kode baru.');
          break;
        default:
          setError(err.message || 'Gagal memverifikasi OTP atau mendaftar');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    if (!phoneNumber) {
      setError('Nomor telepon tidak tersedia. Silakan daftar ulang.');
      return;
    }

    try {
      setConfirmationResult(null);
      clearConfirmationResult();

      if (!recaptchaContainerRef.current) {
        setError('reCAPTCHA container tidak ditemukan.');
        return;
      }

      await setupRecaptcha(recaptchaContainerRef.current.id, true);
      console.log('reCAPTCHA reinitialized for resend OTP');

      const confirmation = await sendPhoneVerificationCode(phoneNumber);
      setConfirmationResult(confirmation);
      setTimer(60);
      setIsTimerRunning(true);
      setOtp(['', '', '', '', '', '']);
      alert('Kode OTP baru telah dikirim.');
    } catch (err) {
      console.error('Resend OTP error:', err);
      switch (err.code) {
        case 'auth/invalid-phone-number':
          setError('Format nomor telepon salah');
          break;
        case 'auth/too-many-requests':
          setError('Terlalu banyak permintaan. Silakan coba lagi nanti.');
          break;
        case 'auth/quota-exceeded':
          setError('Kuota SMS telah habis. Hubungi dukungan.');
          break;
        default:
          setError(err.message || 'Gagal mengirim ulang OTP');
      }
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Head>
        <title>Verifikasi OTP - Beri Barang</title>
        <meta name="description" content="Verifikasi OTP untuk donasi di Beri Barang" />
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

      <div className="flex max-w-3xl w-full">
        <div className="w-1/2 p-6 flex items-center justify-center bg-[#FFF5E1] rounded-l-lg">
          <div className="relative w-full h-80">
            <Image
              src="/Main Design Frame.webp"
              alt="Donation Illustration"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Verifikasi OTP</h2>

          <p className="text-gray-600 text-base mb-4 text-center">
            Masukkan kode OTP yang telah dikirimkan ke {phoneNumber}
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
            onClick={() => {
              console.log('Konfirmasi clicked');
              handleVerifyOtp();
            }}
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
            disabled={isTimerRunning}
            className={`w-full mt-2 px-7 py-2 text-[#131010] text-xs border border-[#F0BB78] rounded-md transition-colors font-bold ${
              isTimerRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            Kirim Ulang Kode ({formatTimer(timer)})
          </button>

          {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}