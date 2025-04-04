'use client'

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaYoutube, FaWhatsapp, FaTwitter } from 'react-icons/fa';

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
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Profil | Kotak Peduli</title>
        <meta name="description" content="Kotak Peduli Profile Page" />
      </Head>

      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <Image src="/logo.png" alt="Kotak Peduli" width={40} height={40} />
              <span className="ml-2 text-amber-800 font-bold">Kotak Peduli</span>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/cerita-kami" className="text-gray-700 hover:text-amber-800">
              Cerita Kami
            </Link>
            <Link href="/tempat-penampungan" className="text-gray-700 hover:text-amber-800">
              Tempat Penampungan
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/donasi">
            <button className="bg-amber-800 text-white px-4 py-2 rounded-md hover:bg-amber-900">
              Donasi Sekarang
            </button>
          </Link>
          <div className="bg-amber-800 rounded-full w-8 h-8 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {/* <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /> */}
            </svg>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="mb-6">
              <h2 className="text-lg text-amber-800">Halo,</h2>
              <h1 className="font-bold text-xl text-amber-800">Nuky Yasuar Zamzamy</h1>
            </div>
            
            <div className="space-y-4">
              <Link href="/riwayat-donasi">
                <div className="flex items-center text-amber-800 space-x-2 cursor-pointer">
                  <div className="bg-amber-800 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Informasi Akun</span>
                </div>
              </Link>
              
              <Link href="/riwayatdonasi">
                <div className="flex items-center text-amber-800 space-x-2 cursor-pointer">
                  <div className="bg-amber-800 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Riwayat Donasi</span>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Form and Profile Picture */}
          <div className="w-full md:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-amber-800">Profil</h2>
              <p className="text-gray-600">Sesuaikan informasi data diri Anda</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Form Fields */}
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
              
              {/* Profile Picture - positioned to the right side of form */}
              <div className="w-full md:w-1/3 flex flex-col items-center mt-4 md:mt-0">
                <div className="w-32 h-32 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
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

      {/* Footer  */}
      <footer className="w-full bg-amber-300 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-amber-800 font-medium">
                "Dari bekas menjadi berkah, membantu sesama"
              </p>
            </div>
            
            <div className="mb-4 md:mb-0">
              <div className="flex items-center justify-center">
                 <div className="mb-6 md:mb-0">
                              <Image
                                src="/logo-white.png"
                                alt="Kotak Peduli Logo"
                                width={150}
                                height={60}
                              />
                            </div>
                <span className="ml-2 text-amber-800 font-bold">Kotak Peduli</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaInstagram size={24} />
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaYoutube size={24} />
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaWhatsapp size={24} />
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaTwitter size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}