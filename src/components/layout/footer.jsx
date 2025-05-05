"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaWhatsapp, FaYoutube, FaTwitter } from "react-icons/fa";

function SosmedIcon({ icon: Icon, href }) {
  return (
    <Link href={href}>
      <Icon size={30} className="text-[#FFF0DC] hover:text-white" />
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#F0BB78] py-6 flex justify-center">
      <div className="flex items-center justify-between w-[1200px]">
        <p className="text-sm text-[#FFF0DC] font-bold w-56">
          "Dari bekas menjadi berkah, membantu sesama"
        </p>
        <Image
          src="/kotak-peduli-logo-v.webp"
          alt="Kotak Peduli Logo"
          width={58}
          height={58}
        />
        <div className="flex space-x-8">
          <SosmedIcon icon={FaInstagram} href="https://instagram.com" />
          <SosmedIcon icon={FaYoutube} href="https://youtube.com" />
          <SosmedIcon icon={FaWhatsapp} href="https://whatsapp.com" />
          <SosmedIcon icon={FaTwitter} href="https://x.com" />
        </div>
      </div>
    </footer>
  );
}
