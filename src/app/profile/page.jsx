'use client'

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NavbarAfterLogin from '../navbarAfterLogin/page';
import Footer from '../footer/page';
import { Icon } from '@iconify/react'; // Import Iconify

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: 'Matthew',
    lastName: 'Emmanuel',
    phone: '+6281246875124',
    email: 'matt@email.com',
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

      <NavbarAfterLogin/>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="mb-6">
              <h2 className="text-lg text-amber-800">Halo,</h2>
              <h1 className="font-bold text-xl text-amber-800">Nuky Yasuar Zamzamy</h1>
            </div>
            
            <div className="space-y-4">
              <Link href="/riwayat-donasi">
                <div className="flex items-center text-amber-800 space-x-2 cursor-pointer">
                  <div className="bg-amber-800 rounded-full p-1">
                    <Icon icon="mdi:account" className="h-5 w-5 text-white" />
                  </div>
                  <span>Informasi Akun</span>
                </div>
              </Link>
              
              <Link href="/riwayatdonasi">
                <div className="flex items-center text-amber-800 space-x-2 cursor-pointer">
                  <div className="bg-amber-800 rounded-full p-1">
                    <Icon icon="mdi:credit-card-outline" className="h-5 w-5 text-white" />
                  </div>
                  <span>Riwayat Donasi</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-800">Profil</h2>
              <p className="text-gray-600">Sesuaikan informasi data diri Anda</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/3">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <label htmlFor="firstName" className="block text-gray-700 mb-2">Nama Depan</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label htmlFor="lastName" className="block text-gray-700 mb-2">Nama Belakang</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Nomor Telepon (Whatsapp)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-gray-700 mb-2">Alamat</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-amber-400 hover:bg-amber-500 text-amber-800 font-medium py-2 px-4 rounded"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </div>
              
              <div className="w-full md:w-1/3 flex flex-col items-center mt-4 md:mt-0">
                <div className="w-32 h-32 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                  <Icon icon="mdi:account" className="h-16 w-16 text-gray-300" />
                </div>
                <button
                  type="button"
                  className="text-amber-800 border border-amber-800 px-3 py-1 rounded text-sm"
                >
                  Ubah Gambar
                </button>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  <p>*Ukuran maksimal 1MB</p>
                  <p>*Format .jpg atau .png</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}