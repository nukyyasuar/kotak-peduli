'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaYoutube, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#F0BB78] py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Bagian Kiri: Teks */}
          <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
            <p className="text-sm italic text-[#FFF0DC]">
              "Dari bekas menjadi berkah,
            </p>
            <p className="text-sm text-[#FFF0DC]">
              membantu sesama"
            </p>
          </div>

          {/* Bagian Tengah: Logo */}
          <div className="mb-4 md:mb-0">
            <Image
              src="/Main Design Skripsi Frame.webp" // Ganti dengan path logo "Kotak Peduli"
              alt="Kotak Peduli Logo"
              width={50}
              height={50}
            />
          </div>

          {/* Bagian Kanan: Ikon Media Sosial */}
          <div className="flex space-x-8">
            <Link href="https://instagram.com" className="text-[#FFF0DC]">
              <FaInstagram size={30} />
            </Link>
            <Link href="https://youtube.com" className="text-[#FFF0DC]">
              <FaYoutube size={30} />
            </Link>
            <Link href="https://whatsapp.com" className="text-[#FFF0DC]">
              <FaWhatsapp size={30} />
            </Link>
            <Link href="https://x.com" className="text-[#FFF0DC]">
              <FaTwitter size={30} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}