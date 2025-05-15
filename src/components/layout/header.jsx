"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

import { logout } from "src/services/api/logout";
import { getProfile } from "src/services/api/profile";
import { toast } from "react-toastify";

const baseMenuList = [
  { href: "/cerita-kami", text: "Cerita Kami" },
  { href: "/tempat-penampung", text: "Tempat Penampung" },
  { href: "/", text: "Barang Donasi", type: "admin" },
  { href: "/", text: "Event", type: "admin" },
  { href: "/", text: "Cabang", type: "admin" },
  { href: "/", text: "Administrator", type: "admin" },
];

const buttonMenuList = [
  { href: "/daftar", text: "Daftar" },
  { href: "/login", text: "Masuk" },
];

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

const LogoutMenu = ({ handleLogout }) => {
  return (
    <div className="absolute w-10 h-12 py-2 text-black">
      <div className="absolute bg-white shadow-lg border border-[#C2C2C2] rounded-lg z-20 w-fit right-0">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm w-full hover:bg-[#E52020] hover:text-white cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("null");
  const [showLogout, setShowLogout] = useState(false);
  const [dataProfile, setDataProfile] = useState(null);

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.meta.message[0] === "Request successful") {
        toast.success("Logout successful");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        // window.location.href = "/";
        setIsLoggedIn(false);
        setRole(null);
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      if (userRole) {
        setRole(userRole);
      }
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setDataProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
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
              {role === "admin"
                ? baseMenuList.map((item, index) => {
                    if (item.type === "admin") {
                      return (
                        <NavBtn
                          key={index}
                          index={index}
                          href={item.href}
                          text={item.text}
                        />
                      );
                    }
                  })
                : baseMenuList.map((item, index) => {
                    if (item.type !== "admin") {
                      return (
                        <NavBtn
                          key={index}
                          index={index}
                          href={item.href}
                          text={item.text}
                        />
                      );
                    }
                  })}
            </div>
          </div>

          {/* Tombol */}
          <div className="flex gap-3">
            {role === "admin" ? null : (
              <Link
                href="/donasi"
                // href={localStorage.getItem("authToken") ? "/donasi" : "/login"}
                className="text-[#FFF0DC] font-bold h-10 px-7 bg-[#543a14] flex items-center rounded-lg hover:bg-[#6B4D20] z-10"
              >
                Donasi Sekarang
              </Link>
            )}
            {isLoggedIn ? (
              <div
                className="relative z-0"
                onMouseEnter={() => setShowLogout(true)}
                onMouseLeave={() => setShowLogout(false)}
              >
                <Link
                  href="/akun"
                  className="w-10 h-10 bg-[#543a14] hover:bg-[#6B4D20] flex items-center justify-center rounded-full cursor-pointer"
                >
                  {dataProfile?.avatar?.file ? (
                    <Image
                      src={dataProfile.avatar.file.path}
                      alt="profile"
                      className="rounded-full object-cover aspect-square"
                      fill="true"
                    />
                  ) : (
                    <Icon icon="mdi:user" width={30} height={30} />
                  )}
                </Link>

                {showLogout && <LogoutMenu handleLogout={handleLogout} />}
              </div>
            ) : (
              buttonMenuList.map((item, index) => {
                return (
                  <NavBtn
                    key={index}
                    index={index}
                    href={item.href}
                    text={item.text}
                    variant="btn"
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
