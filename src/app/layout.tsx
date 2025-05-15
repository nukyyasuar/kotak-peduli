"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import Header from "src/components/layout/header";
import Footer from "src/components/layout/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showLayout = pathname !== "/login" && pathname !== "/daftar";

  return (
    <html lang="id">
      <body>
        {showLayout && <Header />}

        <div className={`min-h-[82dvh] ${showLayout && "mt-20"}`}>
          {children}
        </div>
        <ToastContainer position="top-right" autoClose={2000} />

        {showLayout && <Footer />}
      </body>
    </html>
  );
}
