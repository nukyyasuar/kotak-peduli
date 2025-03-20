'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  registerWithEmail,
  loginWithGoogle,
  onAuthStateChange,
} from '../auth/auth';

// Define validation schema with Yup
const registrationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Nama depan wajib diisi')
    .min(2, 'Nama depan minimal 2 karakter'),
  lastName: Yup.string()
    .required('Nama belakang wajib diisi')
    .min(2, 'Nama belakang minimal 2 karakter'),
  phone: Yup.string()
    .required('Nomor telepon wajib diisi')
    .matches(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
    .min(10, 'Nomor telepon minimal 10 digit'),
  email: Yup.string()
    .required('Email wajib diisi')
    .email('Email tidak valid'),
  password: Yup.string()
    .required('Password wajib diisi')
    .min(8, 'Password minimal 8 karakter'),
});

export default function Registration() {
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
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
      const { email, password, firstName, lastName, phone } = data;
      const result = await registerWithEmail(email, password, firstName, lastName, phone);
      
      console.log('Registration successful:', result);
      reset();
      router.push('/homepage');
    } catch (err) {
      setError(err.message || 'Something went wrong');
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

  // The JSX remains largely the same, only the validation logic changes
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
        {/* Logo Section - unchanged */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center">
            <div className="h-10 w-10">
              <Image
                src="/logo.png"
                alt="Beri Barang Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <span className="ml-2 text-amber-800 font-bold text-xl">
              Beri Barang
            </span>
          </div>
        </div>

        {/* Illustration Section - unchanged */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="bg-amber-50 rounded-lg p-8 max-w-md">
            <div className="relative">
              <Image
                src="/donation-illustration.png"
                alt="Donation Illustration"
                width={400}
                height={400}
                className="object-contain"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-lg border-2 border-amber-400">
                <p className="text-amber-800 font-bold">YUK, DONASI!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 md:pl-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DAFTAR</h1>
          <p className="text-gray-700 mb-6">
            Bersama menyejahterakan masyarakat
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
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
                  Nama Depan
                </label>
                <input
                  {...register("firstName")}
                  id="firstName"
                  placeholder="Matthew"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
                  Nama Belakang
                </label>
                <input
                  {...register("lastName")}
                  id="lastName"
                  placeholder="Emmanuel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
                Nomor Telepon (Whatsapp)
              </label>
              <input
                {...register("phone")}
                id="phone"
                placeholder="081246875123"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                placeholder="example@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                placeholder="Masukkan minimum 8 karakter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-medium rounded-md transition duration-200"
            >
              Buat Akun
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">
                atau menggunakan
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-gray-300 flex justify-center items-center gap-2 rounded-md hover:bg-gray-50 transition duration-200"
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