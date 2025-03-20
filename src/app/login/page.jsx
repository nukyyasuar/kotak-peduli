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
});

export default function Login() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    try {
      if (isLogin) {
        await loginWithEmail(data.email, data.password);
      } else {
        await registerWithEmail(data.email, data.password);
      }
      reset();
      router.push('/homepage');
    } catch (err) {
      setError(err.message);
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

  const handleLogout = async () => {
    try {
      setError('');
      await logout();
      setUser(null);
      reset();
    } catch (err) {
      setError(err.message);
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
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Beri Barang Logo"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>
            <div className="bg-[#FDF6E7] rounded-2xl p-4">
              <div className="relative h-80 w-full">
                <Image
                  src="/donation-illustration.png"
                  alt="Donation Illustration"
                  layout="fill"
                  objectFit="contain"
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
              <p className="text-green-500 text-center mb-4">
                Anda sudah login sebagai {user.email}. Ingin menggunakan akun lain?
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="example@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Masukkan minimum 6 karakter"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#F2CB92] hover:bg-amber-400 transition text-black py-3 px-4 rounded-lg font-medium mb-4"
              >
                {isLogin ? 'Masuk' : 'Buat Akun'}
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
              >
                <FcGoogle size={20} />
                <span className='ml-2 font-bold'>Google</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-gray-600 hover:text-amber-600"
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