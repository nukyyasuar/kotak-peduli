import { Icon } from "@iconify/react";
import Link from "next/link";

const Unauthorize = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[82dvh] text-center gap-4">
      <Icon
        icon="material-symbols:lock-outline"
        width={80}
        height={80}
        color="#543A14"
      />
      <div>
        <h1 className="text-2xl font-bold text-[#543A14]">Akses Ditolak</h1>
        <p className="mt-2 text-gray-600 max-w-md">
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi
          admin tempat penampung untuk meminta akses lebih lanjut.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-2 rounded-lg bg-[#543A14] text-white hover:bg-[#6B4D20] transition font-bold"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default Unauthorize;
