"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { confirmEmail } from "src/services/api/verifyEmail";

export default function ConfirmEmail() {
  const token = new URLSearchParams(window.location.search).get("token");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const confirmationEmail = async () => {
      try {
        if (!token || typeof token !== "string") return;
        const payload = {
          token: token,
        };

        const response = await confirmEmail(payload);

        if (response) {
          toast.success("Email berhasil diverifikasi.");
          setStatus("success");
        } else {
          toast.error("Verifikasi gagal. Silakan coba lagi.");
          setStatus("error");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
        setStatus("error");
      }
    };

    confirmationEmail();
  }, [token]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-20 text-black">
      <div>
        {status === "loading" && <p>Memverifikasi email...</p>}
        {status === "success" && <p>Email berhasil diverifikasi. 🎉</p>}
        {status === "error" && (
          <p>Verifikasi gagal. Coba lagi atau hubungi admin.</p>
        )}
      </div>
    </div>
  );
}
