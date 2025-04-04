'use client'

import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { sendPhoneVerificationCode, setupRecaptcha, verifyPhoneCode } from '../auth/auth'; // Sesuaikan path
import { useRouter } from "next/navigation";

export default function Home() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const router = useRouter(); // Inisialisasi router

  // Setup reCAPTCHA verifier saat komponen dimuat
  useEffect(() => {
    try {
      setupRecaptcha();
    } catch (err) {
      setError('Failed to initialize reCAPTCHA: ' + err.message);
    }
  }, []);

  // Handle OTP input change
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // Mengirim OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); // Reset error sebelum mencoba
    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      const formattedPhone = phoneNumber.startsWith('+62') 
        ? phoneNumber 
        : '+62' + phoneNumber.replace(/^0/, ''); // Ganti 0 di awal dengan +62

      const confirmation = await sendPhoneVerificationCode(formattedPhone);
      console.log('Confirmation Result:', confirmation); 
      setConfirmationResult(confirmation);
      setIsSent(true);
    } catch (err) {
      // Menangani error spesifik dari Firebase
      switch (err.code) {
        case 'auth/invalid-phone-number':
          setError('Invalid phone number format');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        case 'auth/quota-exceeded':
          setError('SMS quota exceeded. Contact support.');
          break;
        default:
          setError(err.message || 'Failed to send OTP');
      }
    }
  };

  // Memverifikasi OTP
  const handleVerifyOtp = async () => {
    setError(''); // Reset error sebelum mencoba
    const code = otp.join('');
    console.log('OTP Code:', code); 
    if (!code || code.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    if (!confirmationResult) {
      setError('No verification request found. Please resend OTP.');
      return;
    }

    try {
      const user = await verifyPhoneCode(confirmationResult, code);
      console.log('User signed in:', user);
      alert('Verifikasi berhasil!'); 
      // Redirect atau handle verifikasi sukses di sini
      router.push('/homepage'); // Ganti '/homepage' dengan path yang sesuai
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-verification-code':
          setError('Invalid OTP');
          break;
        case 'auth/session-expired':
          setError('OTP session expired. Please request a new one.');
          break;
        default:
          setError(err.message || 'Failed to verify OTP');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>Verifikasi OTP - Beri Barang</title>
        <meta name="description" content="Verifikasi OTP untuk donasi di Beri Barang" />
      </Head>

      <div className="bg-white rounded-lg shadow-lg flex max-w-4xl w-full">
        {/* Left Section: Illustration */}
        <div className="w-1/2 p-8 flex items-center justify-center bg-[#FFF5E1] rounded-l-lg">
          <div className="relative w-full h-64">
            <Image
              src="/illustration.png"
              alt="Donation Illustration"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>

        {/* Right Section: OTP Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifikasi OTP</h2>
          
          {!isSent ? (
            <>
              <p className="text-gray-600 mb-6">
                Masukkan nomor telepon Anda untuk menerima kode OTP
              </p>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#F5A623]"
                placeholder="+6281234567890"
              />
              <button
                onClick={handleSendOtp}
                className="w-full bg-[#F5A623] text-white py-3 rounded-lg hover:bg-[#e69520] transition-colors"
              >
                Kirim OTP
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Masukkan kode OTP yang telah dikirimkan ke {phoneNumber}
              </p>
              
              <div className="flex space-x-4 mb-6">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#F5A623] transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={()=> {
                  console.log('Konfirmasi clicked'); // Tambahkan ini
                  handleVerifyOtp();
                }}
                className="w-full bg-[#F5A623] text-white py-3 rounded-lg hover:bg-[#e69520] transition-colors"
              >
                Konfirmasi
              </button>
            </>
          )}

          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
          
          <div id="recaptcha-container" />
        </div>
      </div>
    </div>
  );
}