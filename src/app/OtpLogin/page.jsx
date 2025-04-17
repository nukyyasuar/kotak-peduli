'use client'

import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { verifyPhoneCode, sendPhoneVerificationCode, setupRecaptcha } from '../auth/auth';
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpLogin() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize reCAPTCHA and handle phone number
  useEffect(() => {
    const initializeRecaptcha = async () => {
      if (document.getElementById('recaptcha-container')) {
        try {
          await setupRecaptcha();
          console.log('reCAPTCHA initialized in OtpLogin');
        } catch (err) {
          console.error('reCAPTCHA initialization failed:', err);
          setError('Gagal menginisialisasi reCAPTCHA. Silakan muat ulang halaman.');
        }
      } else {
        console.log('reCAPTCHA container not found, retrying...');
        setTimeout(initializeRecaptcha, 100);
      }
    };
    initializeRecaptcha();

    const phone = searchParams.get('phone');
    if (phone) {
      const decodedPhone = decodeURIComponent(phone);
      if (/^\+62[8][0-9]{8,11}$/.test(decodedPhone)) {
        setPhoneNumber(decodedPhone);
        sendInitialOtp(decodedPhone);
      } else {
        setError('Nomor telepon tidak valid. Silakan daftar ulang.');
        setTimeout(() => router.push('/registration'), 2000);
      }
    } else {
      setError('Nomor telepon tidak ditemukan. Silakan daftar ulang.');
      setTimeout(() => router.push('/registration'), 2000);
    }
  }, [searchParams, router]);

  // Countdown timer logic
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

  const sendInitialOtp = async (phone, retryCount = 0) => {
    setError('');
    if (!document.getElementById('recaptcha-container')) {
      setError('reCAPTCHA container tidak ditemukan. Silakan muat ulang halaman.');
      return;
    }
    try {
      const confirmation = await sendPhoneVerificationCode(phone);
      setConfirmationResult(confirmation);
      console.log('Initial OTP sent to:', phone);
    } catch (err) {
      console.error('Error sending initial OTP:', err);
      if (retryCount < 2 && err.code !== 'auth/quota-exceeded' && err.code !== 'auth/invalid-phone-number') {
        console.log('Retrying OTP send, attempt:', retryCount + 1);
        setTimeout(() => sendInitialOtp(phone, retryCount + 1), 1000);
      } else {
        switch (err.code) {
          case 'auth/invalid-phone-number':
            setError('Nomor telepon tidak valid. Silakan daftar ulang.');
            setTimeout(() => router.push('/registration'), 2000);
            break;
          case 'auth/quota-exceeded':
            setError('Kuota SMS telah habis. Silakan hubungi dukungan atau gunakan nomor pengujian.');
            break;
          case 'auth/too-many-requests':
            setError('Terlalu banyak permintaan. Silakan coba lagi nanti.');
            break;
          case 'auth/error-code:-39':
            setError('Masalah dengan verifikasi keamanan. Silakan coba kirim ulang kode atau muat ulang halaman.');
            break;
          default:
            setError(err.message || 'Gagal mengirim OTP. Silakan coba kirim ulang.');
        }
      }
    }
  };

  const handleOtpChange = (element, index) => {
    const value = element.value;
    const newOtp = [...otp];

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && element.nextSibling) {
      element.nextSibling.focus();
    }

    if (!value && element.previousSibling && (element.value === '' || event.key === 'Backspace')) {
      element.previousSibling.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      event.target.previousSibling.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.target.previousSibling.focus();
    } else if (event.key === 'ArrowRight' && index < otp.length - 1) {
      event.target.nextSibling.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    const code = otp.join('');
    if (!code || code.length !== 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }

    if (!confirmationResult) {
      setError('Tidak ada permintaan verifikasi. Silakan coba kirim ulang kode.');
      return;
    }

    try {
      console.log('Attempting to verify OTP with confirmationResult:', confirmationResult);
      const user = await verifyPhoneCode(confirmationResult, code);
      console.log('User signed in:', user);
      alert('Verifikasi berhasil!');
      router.push('/login');
    } catch (err) {
      console.error('Error verifying OTP:', err);
      switch (err.code) {
        case 'auth/invalid-verification-code':
          setError('Kode OTP salah. Silakan masukkan kode yang benar.');
          break;
        case 'auth/session-expired':
          setError('Sesi OTP telah kedaluwarsa. Silakan minta kode baru.');
          break;
        case 'auth/error-code:-39':
          setError('Masalah dengan verifikasi keamanan. Silakan coba kirim ulang kode atau muat ulang halaman.');
          break;
        case 'auth/network-request-failed':
          setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
          break;
        default:
          setError(err.message || 'Gagal memverifikasi OTP. Silakan coba lagi.');
      }
    }
  };

  const handleResendOtp = async () => {
    setError('');
    if (!phoneNumber) {
      setError('Nomor telepon tidak ditemukan. Silakan daftar ulang.');
      setTimeout(() => router.push('/registration'), 2000);
      return;
    }
    if (!document.getElementById('recaptcha-container')) {
      setError('reCAPTCHA container tidak ditemukan. Silakan muat ulang halaman.');
      return;
    }
    try {
      const confirmation = await sendPhoneVerificationCode(phoneNumber);
      setConfirmationResult(confirmation);
      setTimer(60);
      setIsTimerRunning(true);
      setOtp(['', '', '', '', '', '']);
      console.log('OTP resent to:', phoneNumber);
    } catch (err) {
      console.error('Error resending OTP:', err);
      switch (err.code) {
        case 'auth/invalid-phone-number':
          setError('Nomor telepon tidak valid. Silakan daftar ulang.');
          setTimeout(() => router.push('/registration'), 2000);
          break;
        case 'auth/too-many-requests':
          setError('Terlalu banyak permintaan. Silakan coba lagi nanti.');
          break;
        case 'auth/quota-exceeded':
          setError('Kuota SMS telah habis. Silakan hubungi dukungan.');
          break;
        case 'auth/error-code:-39':
          setError('Masalah dengan verifikasi keamanan. Silakan muat ulang halaman.');
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
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>

        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Verifikasi OTP</h2>

          <p className="text-gray-600 text-base mb-4 text-center">
            Masukkan kode OTP yang telah dikirimkan ke {phoneNumber || 'nomor telepon anda'}
          </p>

          <div className="flex space-x-2 mb-4 justify-center">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
                style={{
                  color: data ? '#131010' : '#000',
                  outlineColor: data ? '#131010' : '#C2C2C2',
                }}
              />
            ))}
          </div>

          <div id="recaptcha-container" className="normal"></div>

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-[#F5A623] text-white py-2 rounded-md hover:bg-[#e69520] transition-colors text-sm"
          >
            Konfirmasi
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

          {error && (
            <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}