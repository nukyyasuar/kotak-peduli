'use client';

import { useState, useEffect } from "react";
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
} from '../auth/auth';
import { setConfirmationResult } from '../auth/authStore';

// Validation schema
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
    .matches(/^[8][0-9]{8,11}$/, 'Nomor telepon harus diawali dengan angka ‘8’ dan berisi 9–12 digit'),
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
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

      const confirmation = await sendPhoneVerificationCode(formattedPhoneNumber);
      setConfirmationResult(confirmation);
      console.log('Confirmation result stored:', confirmation);

      reset();
      router.push('/otplogin');
    } catch (err) {
      console.error('Error during OTP sending:', err);
      setError(err.message || 'Terjadi kesalahan saat mengirim OTP');
    } finally {
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

  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>Beri Barang - Daftar</title>
        <meta
          name="description"
          content="Beri Barang donation registration page"
        />
      </Head>

      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
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
        </div>
      </div>
    </div>
  );
}