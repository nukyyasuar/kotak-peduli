'use client'

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../footer/page';
import NavbarAfterLogin from '../navbarAfterLogin/page';
import { Icon } from '@iconify/react'; // Impor Iconify

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
                <Icon icon="heroicons:user-circle" className="w-5 h-5 mr-2" />
                Informasi Akun
              </Link>
            </li>
            <li>
              <Link href="/riwayat-donasi" className="flex items-center text-gray-700 hover:text-amber-800">
                <Icon icon="heroicons:clock" className="w-5 h-5 mr-2" />
                Riwayat Donasi
              </Link>
            </li>
            <li>
              <Link href="/admin-konsol" className="flex items-center text-gray-700 hover:text-amber-800">
                <Icon icon="heroicons:home" className="w-5 h-5 mr-2" />
                Tempat Penampung
              </Link>
            </li>
            <li>
              <Link href="/admin-konsol" className="flex items-center text-gray-700 hover:text-amber-800">
                <Icon icon="heroicons:cog" className="w-5 h-5 mr-2" />
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