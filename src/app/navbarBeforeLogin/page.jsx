'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function navbarBeforeLogin() {
  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo dan Navigasi dalam satu flex container */}
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <Image 
              src="/Main Desain Skripsi Frame 431.webp"  
              alt="Kotak Peduli Logo"
              width={100} 
              height={100} 
            />
          </div>

          {/* Navigasi */}
          <div className="hidden md:flex space-x-6">
            <Link href="/about" className="text-[#4A2C2A] hover:text-amber-600">
              Cerita Kami
            </Link>
            <Link href="/tempatpenampung" className="text-[#4A2C2A] hover:text-amber-600">
              Tempat Penampung
            </Link>
          </div>
        </div>

        {/* Tombol */}
        <div className="flex space-x-2">
          <Link href="/form">
            <button className="bg-[#543A14] text-[#FFF0DC] px-4 py-2 rounded">
              Donasi Sekarang
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-white border-[#F0BB78] text-[#131010] px-4 py-2 rounded font-bold border-2">
              Masuk
            </button>
          </Link>
          <Link href="/registration">
            <button className="bg-white border-[#F0BB78] text-[#131010] px-4 py-2 rounded font-bold border-2">
              Daftar
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}