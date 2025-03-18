'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo dan Teks Kotak Peduli - Dapat diklik untuk kembali ke homepage */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <Image src="/logo.png" alt="Kotak Peduli Logo" width={40} height={40} />
            <span className="font-bold text-[#4A2C2A]">Kotak Peduli</span>
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

        {/* Tombol */}
        <div className="flex space-x-2">
          <Link href="/donasi">
            <button className="bg-[#F5E5C5] text-[#4A2C2A] px-4 py-2 rounded">
              Donasi Sekarang
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-white border border-[#4A2C2A] text-[#4A2C2A] px-4 py-2 rounded">
              Masuk
            </button>
          </Link>
          <Link href="/registration">
            <button className="bg-white border border-[#4A2C2A] text-[#4A2C2A] px-4 py-2 rounded">
              Daftar
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}