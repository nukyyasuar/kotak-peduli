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
    <footer className="bg-[#F0BB78] py-6 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-screen-xl flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-0">
        {/* Logo */}
        <Image
          src="/kotak-peduli-logo-v.webp"
          alt="Kotak Peduli Logo"
          width={58}
          height={58}
          className="mx-auto md:mx-0 flex sm:hidden"
        />

        {/* Slogan */}
        <p className="text-[#FFF0DC] font-bold text-center md:text-left max-w-[250px]">
          "Dari bekas menjadi berkah, membantu sesama"
        </p>

        {/* Logo */}
        <Image
          src="/kotak-peduli-logo-v.webp"
          alt="Kotak Peduli Logo"
          width={58}
          height={58}
          className="mx-auto md:mx-0 hidden sm:flex"
        />

        {/* Social Media */}
        <div className="flex justify-center md:justify-end space-x-6">
          <SosmedIcon icon={FaInstagram} href="https://instagram.com" />
          <SosmedIcon icon={FaYoutube} href="https://youtube.com" />
          <SosmedIcon icon={FaWhatsapp} href="https://whatsapp.com" />
          <SosmedIcon icon={FaTwitter} href="https://x.com" />
        </div>
      </div>
    </footer>
  );
}
