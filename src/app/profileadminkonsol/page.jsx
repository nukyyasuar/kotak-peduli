'use client'

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../footer/page';
import NavbarAfterLogin from '../navbarAfterLogin/page';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: 'Nuky',
    lastName: 'Yasuar Zamzamy',
    phone: '+6281246875124',
    email: 'nuky@email.com',
    address: 'Jl. Lorem Ipsum'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>Profil | Kotak Peduli</title>
        <meta name="description" content="Kotak Peduli Profile Page" />
      </Head>

      {/* Header */}
      <NavbarAfterLogin />

      {/* Main Content */}
      <main className="flex-grow flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 border-r border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Halo, Nuky Yasuar Zamzamy
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Fitur ini hanya tersedia untuk pengguna yang memiliki Superadmin. Tekan tombol dibawah untuk mengakses halaman Superadmin.
          </p>
          <ul className="space-y-4">
            <li>
              <Link href="/informasi-akun" className="flex items-center text-gray-700 hover:text-amber-800">
                {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg> */}
                Informasi Akun
              </Link>
            </li>
            <li>
              <Link href="/riwayat-donasi" className="flex items-center text-gray-700 hover:text-amber-800">
                {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg> */}
                Riwayat Donasi
              </Link>
            </li>
            <li>
            <Link href="/admin-konsol" className="flex items-center text-gray-700 hover:text-amber-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                </svg>
                Tempat Penampung
              </Link>
            </li>
            <li>
              <Link href="/admin-konsol" className="flex items-center text-gray-700 hover:text-amber-800">
                {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"></path>
                </svg> */}
                Admin Konsol
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Section */}
        <section className="flex-grow p-8 bg-white">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Admin Konsol
          </h1>
          <p className="text-gray-600 mb-6">
            Fitur ini hanya tersedia untuk pengguna yang memiliki Superadmin. Tekan tombol dibawah untuk mengakses halaman Superadmin.
          </p>
          <button className="bg-amber-300 text-amber-800 px-6 py-3 rounded-md font-semibold hover:bg-amber-400">
            Admin Konsol
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}