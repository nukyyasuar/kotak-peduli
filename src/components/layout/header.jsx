"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { useAuth } from "src/services/auth/AuthContext";
import { logout } from "src/services/api/logout";
import { getProfile } from "src/services/api/profile";

import { NavBtn, LogoutMenu } from "./headerComp";
import { baseMenuList, buttonMenuList } from "src/components/options";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("null");
  const [showLogout, setShowLogout] = useState(false);
  const [dataProfile, setDataProfile] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const router = useRouter();

  const emailVerifiedAt = dataProfile?.emailVerifiedAt;

  const filteredMenu = baseMenuList
    .filter((item) => {
      if (pathname.includes("/admin")) return item.type === "admin";
      return item.type !== "admin";
    })
    .filter((item) => !item.permission || hasPermission(item.permission));

  const handleDonasiSekarang = () => {
    if (!authToken) {
      router.push("/login");
      toast.error("Login terlebih dahulu untuk melanjutkan ke halaman donasi.");
    } else if (!emailVerifiedAt) {
      toast.error(
        "Email belum diverifikasi. Verifikasi terlebih dahulu sebelum berdonasi."
      );
      router.push("/akun");
    } else {
      router.push("/donasi");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logout Berhasil. Anda akan diarahkan ke halaman utama.");
      setTimeout(() => {
        router.push("/");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("collectionCenterId");
        setIsLoggedIn(false);
        setRole(null);
      }, 1000);
    } catch (error) {
      toast.error("Logout Gagal. Silakan coba lagi.");
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      if (data.collectionCenterCollaborator?.collectionCenterId) {
        localStorage.setItem(
          "collectionCenterId",
          data.collectionCenterCollaborator?.collectionCenterId
        );
      }
      setDataProfile(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      fetchProfile();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [dataProfile]);

  return (
    <nav className="bg-white h-20 fixed top-0 z-10 w-full px-4 md:px-8 shadow">
      <div className="flex items-center justify-between h-full max-w-[1200px] mx-auto">
        {/* Logo + Mobile Menu Toggle */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-10">
          <Link href="/">
            <Image
              src="/logo_kotakPeduli.svg"
              alt="Kotak Peduli Logo"
              width={100}
              height={100}
            />
          </Link>

          {/* Mobile menu toggle button */}
          <button
            className="lg:hidden ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon icon="mdi:menu" width={28} color="#543A14" />
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-8">
              {filteredMenu.map((item, index) => {
                return (
                  <NavBtn
                    key={index}
                    index={index}
                    href={item.href}
                    text={item.text}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {role === "admin" ? null : (
            <button
              onClick={handleDonasiSekarang}
              className="text-[#FFF0DC] font-bold h-10 px-5 bg-[#543a14] flex items-center rounded-lg hover:bg-[#6B4D20] transition"
            >
              Donasi Sekarang
            </button>
          )}

          {isLoggedIn ? (
            <div
              className="relative"
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
                    className="rounded-full object-cover"
                    fill
                  />
                ) : (
                  <Icon icon="mdi:user" width={24} />
                )}
              </Link>

              {showLogout && <LogoutMenu handleLogout={handleLogout} />}
            </div>
          ) : (
            buttonMenuList.map((item, index) => (
              <NavBtn
                key={index}
                index={index}
                href={item.href}
                text={item.text}
                variant="btn"
              />
            ))
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white absolute top-20 left-0 w-full shadow-lg px-6 py-4 z-20 space-y-4">
          {filteredMenu.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.href}
                className="block text-[#543a14] text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.text}
              </Link>
            );
          })}

          {/* Donasi Button */}
          {role !== "admin" && (
            <Link
              href={authToken ? "/donasi" : "/login"}
              className="block text-center w-full bg-[#543a14] text-white py-2 rounded-lg font-bold hover:bg-[#6B4D20] transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Donasi Sekarang
            </Link>
          )}

          {/* Login/Register / Avatar */}
          {isLoggedIn ? (
            <div className="flex justify-between items-center gap-3">
              <Link
                href="/akun"
                className="flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {dataProfile?.avatar?.file ? (
                  <div className="w-8 h-8 relative">
                    <Image
                      src={dataProfile.avatar.file.path}
                      alt="profile"
                      className="rounded-full object-cover"
                      fill
                    />
                  </div>
                ) : (
                  <Icon icon="mdi:user" width={24} />
                )}
                <span className="text-[#543a14] font-medium">Akun Saya</span>
              </Link>
              <button
                className="text-left text-[#543a14] font-medium hover:text-[#6B4D20]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            buttonMenuList.map((item, index) => (
              <NavBtn
                key={index}
                index={index}
                href={item.href}
                text={item.text}
                variant="btn"
              />
            ))
          )}
        </div>
      )}
    </nav>
  );
}
