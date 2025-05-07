"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

function NavBtn({ href, text, variant = "nav" }) {
  const baseClasses = "px-7 rounded-lg flex items-center";

  const variants = {
    nav: "py-2 text-[#4A2C2A] hover:bg-[#FFF0DC]",
    btn: "border-2 border-[#F0BB78] text-[#131010] font-bold hover:bg-[#F0BB78] hover:text-white",
  };

  return (
    <Link href={href} className={`${baseClasses} ${variants[variant]}`}>
      {text}
    </Link>
  );
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("null");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      if (userRole) {
        setRole(userRole); // admin ato user
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  return (
    <nav className="bg-white h-20 fixed top-0 z-10 w-full">
      <div className="flex items-center justify-center h-full">
        <div className="flex justify-between w-[1200px]">
          <div className="flex items-center gap-7">
            {/* Logo */}
            <div className="flex items-center cursor-pointer">
              <Link href="/">
                <Image
                  src="/logo_kotakPeduli.svg"
                  alt="Kotak Peduli Logo"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            {/* Navigasi */}
            <div className="flex gap-2">
              {role === "admin" ? (
                <>
                  <NavBtn href="/" text="Barang Donasi" />
                  <NavBtn href="/" text="Event" />
                  <NavBtn href="/" text="Cabang" />
                  <NavBtn href="/" text="Administrator" />
                </>
              ) : (
                <>
                  <NavBtn href="/about" text="Cerita Kami" />
                  <NavBtn href="/tempat-penampung" text="Tempat Penampung" />
                </>
              )}
            </div>
          </div>

          {/* Tombol */}
          <div className="flex gap-3">
            {role === "admin" ? null : (
              <Link
                href="/donasi"
                className="text-[#FFF0DC] font-bold h-10 px-7 bg-[#543a14] flex items-center rounded-lg hover:bg-[#6B4D20]"
              >
                Donasi Sekarang
              </Link>
            )}
            {isLoggedIn ? (
              <Link href="/profile">
                <Link href="/profile">
                  <div className="w-10 h-10 bg-[#543a14] hover:bg-[#6B4D20] flex items-center justify-center rounded-full">
                    <Icon icon="mdi:user" width={30} height={30} />
                  </div>
                </Link>
              </Link>
            ) : (
              <>
                <NavBtn href="/login" text="Masuk" variant="btn" />
                <NavBtn href="/registration" text="Daftar" variant="btn" />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
