"use client";

import { ButtonCustom } from "src/components/button";

export default function AdminPlatform() {
  return (
    <div>
      <div className="mb-6 text-[#543A14]">
        <h2 className="text-xl font-bold">Admin Konsol</h2>
        <p className="text-base">
          Fitur ini hanya tersedia untuk pengguna yang memiliki Superadmin.
          Tekan tombol dibawah untuk mengakses halaman Superadmin.
        </p>
      </div>
      <ButtonCustom
        label="Dashboard Admin Platform"
        variant="orange"
        className="w-full"
      />
    </div>
  );
}
