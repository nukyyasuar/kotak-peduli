"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

import { sidebarMenu } from "src/components/options";

const SidebarCustom = ({ href, menu, icon, isActive }) => {
  return (
    <Link
      href={href}
      className={`${isActive && "bg-[#FFF3E4]"} flex items-center text-[#543A14] space-x-2 cursor-pointer font-bold px-2 py-2 rounded-lg`}
    >
      <div
        className={`${isActive ? "bg-[#F0BB78]" : "bg-[#543a14]"} h-8 w-8 rounded-full flex items-center justify-center`}
      >
        <Icon icon={icon} width={20} height={20} color="white" />
      </div>
      <span>{menu}</span>
    </Link>
  );
};

export default function AkunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <section className="max-w-[1200px] py-12 mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="px-8 lg:px-0 space-y-8 min-w-60">
          <div className="text-[#543A14]">
            <h2>Halo,</h2>
            <h1 className="font-bold">Donatur</h1>
          </div>
          <div className="space-y-1 text-nowrap">
            {sidebarMenu.map(({ href, menu, icon }) => {
              const isActive = pathname === href;

              return (
                <SidebarCustom
                  key={href}
                  href={href}
                  menu={menu}
                  icon={icon}
                  isActive={isActive}
                />
              );
            })}
          </div>
        </div>

        {/* Page content */}
        <main className="w-full max-w-[calc(1200px-240px)]">{children}</main>
      </div>
    </section>
  );
}
