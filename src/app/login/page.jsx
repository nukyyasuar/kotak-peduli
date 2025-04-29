'use client'

import Image from 'next/image';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import {
  registerWithEmail,
  loginWithEmail,
  logout,
  onAuthStateChange,
  loginWithGoogle,
} from '../auth/auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define Yup validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email tidak valid')
    .required('Email wajib diisi'),
  password: Yup.string()
    .min(6, 'Password minimal 6 karakter')
    .required('Password wajib diisi'),
  firstName: Yup.string().when('$isLogin', {
    is: false,
    then: (schema) => schema.required('Nama depan wajib diisi'),
    otherwise: (schema) => schema.notRequired(),
  }),
  lastName: Yup.string().when('$isLogin', {
    is: false,
    then: (schema) => schema.required('Nama belakang wajib diisi'),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneNumber: Yup.string().when('$isLogin', {
    is: false,
    then: (schema) => schema
      .matches(/^\+?\d{10,}$/, 'Nomor telepon tidak valid')
      .required('Nomor telepon wajib diisi'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function Login() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false); // Loading state for form submission
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Loading state for Google login
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm({
    resolver: yupResolver(validationSchema, { context: { isLogin } }),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    }
  });

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChange((currentUser) => {
  //     setUser(currentUser);
  //     if (currentUser) {
  //       router.push('/');
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [router]);

  const onSubmit = async (data) => {
    setError('');
    setIsFormLoading(true); // Start form loading
    try {
      if (isLogin) {
        await loginWithEmail(data.email, data.password);
      } else {
        await registerWithEmail(
          data.email,
          data.password,
          data.firstName,
          data.lastName,
          data.phoneNumber
        );
      }
      reset();
      router.push('/homepage');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFormLoading(false); // Stop form loading
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true); // Start Google loading
    try {
      await loginWithGoogle();
      router.push('/homepage');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGoogleLoading(false); // Stop Google loading
    }
  };

  const handleLogout = async () => {
    setError('');
    setIsFormLoading(true); // Start form loading for logout
    try {
      await logout();
      setUser(null);
      reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFormLoading(false); // Stop form loading
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Head>
        <title>Beri Barang - {isLogin ? 'Login' : 'Register'}</title>
        <meta name="description" content={isLogin ? 'Login to Beri Barang' : 'Register to Beri Barang'} />
      </Head>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center p-4">
        {/* Left side with illustration */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <div className="p-4">
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
            <div className="bg-[#FDF6E7] rounded-2xl p-4">
              <div className="relative h-80 w-full">
                <Image
                  src="/Main Design Frame.webp"
                  alt="Donation Illustration"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="w-full md:w-1/2 p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-center mb-1 text-black">HALO,</h1>
            <p className="text-center mb-8 text-black">
              {isLogin ? 'Selamat datang kembali!' : 'Buat akun baru Anda!'}
            </p>
            
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}
            
            {user && (
              <div className="text-center mb-4">
                <p className="text-green-500 mb-2">
                  Anda sudah login sebagai {user.email}.
                </p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-amber-600 underline"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? 'Memproses...' : 'Gunakan akun lain'}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {!isLogin && (
                <>
                  <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 mb-2">Nama Depan</label>
                    <input
                      type="text"
                      id="firstName"
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                        errors.firstName ? 'border-red-500' : ''
                      }`}
                      placeholder="Masukkan nama depan"
                      {...register('firstName')}
                      disabled={isFormLoading}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 mb-2">Nama Belakang</label>
                    <input
                      type="text"
                      id="lastName"
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                        errors.lastName ? 'border-red-500' : ''
                      }`}
                      placeholder="Masukkan nama belakang"
                      {...register('lastName')}
                      disabled={isFormLoading}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                        errors.phoneNumber ? 'border-red-500' : ''
                      }`}
                      placeholder="+6281234567890"
                      {...register('phoneNumber')}
                      disabled={isFormLoading}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </>
              )}

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-bold">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="example@email.com"
                  {...register('email')}
                  disabled={isFormLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2 font-bold">Password</label>
                <input
                  type="password"
                  id="password"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Masukkan minimum 6 karakter"
                  {...register('password')}
                  disabled={isFormLoading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#F2CB92] hover:bg-amber-400 transition text-black py-3 chase:animate-pulse px-4 rounded-lg font-medium mb-4 flex items-center justify-center"
                disabled={isFormLoading}
              >
                {isFormLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-black"
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
                  isLogin ? 'Masuk' : 'Buat Akun'
                )}
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <div className="h-px bg-gray-300 flex-1"></div>
                <p className="mx-4 text-sm text-gray-500">atau</p>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium mb-4"
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-gray-700"
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
                  <>
                    <FcGoogle size={20} />
                    <span className='ml-2 font-bold'>Google</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-gray-600 hover:text-amber-600"
                disabled={isFormLoading || isGoogleLoading}
              >
                {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}