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
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Profil | Kotak Peduli</title>
        <meta name="description" content="Kotak Peduli Profile Page" />
      </Head>

      {/* Header */}
      <NavbarAfterLogin/>

      {/* Main Content */}
      <main className="flex-grow flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 border-r border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Halo, Nuky Yasuar Zamzamy</h2>
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
              <Link href="/tempat-penampungan" className="flex items-center text-amber-800 font-semibold">
                {/* <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg> */}
                Tempat Penampungan
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Section */}
        <section className="flex-grow p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Daftar Sebagai Tempat Penampungan (Disetujui)
          </h1>
          <p className="text-gray-600 mb-6">
            Fitur ini hanya tersedia untuk pendaftaran tempat penampungan yang sudah disetujui oleh admin platform. Tekan tombol dibawah untuk mengakses halaman DASHBOARD TEMPAT PENAMPUNG.
          </p>
          <button className="bg-amber-300 text-amber-800 px-6 py-3 rounded-md font-semibold hover:bg-amber-400">
            DASHBOARD TEMPAT PENAMPUNG
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}