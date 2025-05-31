"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { Icon } from "@iconify/react";

import { confirmEmail } from "src/services/api/verifyEmail";

export default function ConfirmEmail() {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get(
      "token"
    );
    if (tokenFromUrl) setToken(tokenFromUrl);
  }, []);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    const confirmationEmail = async () => {
      try {
        if (!token || typeof token !== "string") return;
        const payload = {
          token: token,
        };

        await confirmEmail(payload);

        toast.success("Email berhasil diverifikasi.");
        setStatus("success");
        setTimeout(() => {
          window.location.href = "/akun";
        }, 1000);
      } catch (error) {
        if (error.message === "Token expired") {
          toast.error("Token sudah kadaluarsa.");
        } else {
          toast.error("Verifikasi gagal. Silakan coba lagi.");
        }
        setStatus("error");
      }
    };

    confirmationEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center bg-white z-20 text-black min-h-[80dvh]">
      <div>
        {status === "loading" && (
          <div className="text-center space-y-3 text-xl">
            <BeatLoader color="#F0BB78" size={20} />
            <p>Proses memverifikasi email Anda...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center space-y-3 text-xl">
            <Icon
              icon="icon-park-solid:check-one"
              width={60}
              height={60}
              color="#1F7D53"
            />
            <p>Selamat! Email Anda berhasil diverifikasi.</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center space-y-3 text-xl">
            <Icon
              icon="material-symbols:error"
              width={60}
              height={60}
              color="#E52020"
            />
            <p>Verifikasi gagal. Coba lagi atau hubungi admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
