'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaYoutube, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#F5E5C5] py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Bagian Kiri: Teks */}
          <div className="mb-4 md:mb-0">
            <p className="text-sm italic text-[#4A2C2A]">
              "Dari bekas menjadi berkah, membantu sesama"
            </p>
          </div>

          {/* Bagian Tengah: Logo */}
          <div className="mb-4 md:mb-0">
            <Image
              src="/logo.png" // Ganti dengan path logo "Kotak Peduli"
              alt="Kotak Peduli Logo"
              width={40}
              height={40}
            />
          </div>

          {/* Bagian Kanan: Ikon Media Sosial */}
          <div className="flex space-x-4">
            <Link href="https://instagram.com" className="text-[#4A2C2A] hover:text-amber-600">
              <FaInstagram size={24} />
            </Link>
            <Link href="https://youtube.com" className="text-[#4A2C2A] hover:text-amber-600">
              <FaYoutube size={24} />
            </Link>
            <Link href="https://whatsapp.com" className="text-[#4A2C2A] hover:text-amber-600">
              <FaWhatsapp size={24} />
            </Link>
            <Link href="https://x.com" className="text-[#4A2C2A] hover:text-amber-600">
              <FaTwitter size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}