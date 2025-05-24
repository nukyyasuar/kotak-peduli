"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

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

  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.meta.message[0] === "Request successful") {
        toast.success("Logout successful");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("collectionCenterId");
        window.location.href = "/";
        setIsLoggedIn(false);
        setRole(null);
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Logout failed:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setDataProfile(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
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
    <nav className="bg-white h-20 fixed top-0 z-10 w-full">
      <div className="flex items-center justify-center h-full">
        <div className="flex justify-between w-[1200px]">
          <div className="flex items-center gap-10">
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
            <div className="flex gap-8">
              {pathname.includes("/admin")
                ? baseMenuList.map((item, index) => {
                    if (item.type === "admin") {
                      if (item.permission && !hasPermission(item.permission))
                        return null;

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
                      if (item.permission && !hasPermission(item.permission))
                        return null;

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
                href={authToken ? "/donasi" : "/login"}
                className="text-[#FFF0DC] font-bold h-10 px-7  border bg-[#543a14] flex items-center rounded-lg hover:bg-[#6B4D20] z-10 transition"
              >
                Donasi Sekarang
              </Link>
            )}

            {/* Avatar || Button Login Register */}
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
