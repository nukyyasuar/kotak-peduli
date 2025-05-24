"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBtn({ href, text, variant = "nav" }) {
  const pathname = usePathname();

  const baseClasses = "rounded-lg flex items-center transition";

  const variants = {
    nav: "py-1 rounded-none hover:border-b-3 hover:border-[#543a14] hover:font-bold hover:text-[#543a14]",
    btn: "border-2 border-[#F0BB78] text-[#131010] font-bold hover:bg-[#F0BB78] hover:text-white px-7",
    active: "border-b-3 border-[#543a14] rounded-none font-bold text-[#543a14]",
  };

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variants[variant]} ${isActive ? variants.active : "text-black"}`}
    >
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

export { NavBtn, LogoutMenu };
