"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import Header from "src/components/layout/header";
import Footer from "src/components/layout/footer";
import { AuthProvider } from "src/services/auth/AuthContext";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showLayout = pathname !== "/login" && pathname !== "/daftar";

  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {showLayout && <Header />}

          <div className={`min-h-[80dvh] ${showLayout && "mt-20"}`}>
            {children}
          </div>

          <ToastContainer position="top-right" autoClose={1000} />

          {showLayout && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
