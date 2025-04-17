"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaWhatsapp, FaTwitter } from "react-icons/fa";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <NavbarAfterLogin />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Beri Barang Logo */}
        <div className="flex flex-col items-center mt-4 mb-10">
          <div className="relative w-[120px] h-[124px]">
            <Image
              src="/Main Desain Skripsi Group Beri Barang.webp"
              alt="Beri Barang Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <h1 className="text-[#5B4224] text-3xl font-bold mt-4">
            Tentang Kami
          </h1>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-[#5B4224] text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">
              "Membantu Sesama dengan Barang yang Lebih Bermakna"
            </h2>
            <p className="text-base leading-relaxed">
              Kami adalah platform yang memudahkan Anda untuk berdonasi barang
              layak pakai ke tempat penampungan pilihan. Barang yang Anda
              sumbangkan akan melalui proses seleksi dan penyimpanan sebelum
              akhirnya disalurkan kepada individu atau keluarga yang benar-benar
              membutuhkan.
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-[#5B4224] text-white p-6 rounded-lg">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-6 md:mb-0">
                <h2 className="text-xl font-semibold mb-3">Visi</h2>
                <p className="text-base leading-relaxed">
                  Menciptakan budaya berbagi untuk kesejahteraan bersama.
                </p>
              </div>
              <div className="w-full md:w-1/2 pl-0 md:pl-4">
                <h2 className="text-xl font-semibold mb-3">Misi</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <Image
                          src="/Main Design Skripsi Vector List.webp"
                          alt="Beri Barang Logo"
                          width={14}
                          height={14}
                        />
                      </div>
                    </div>
                    <p className="text-base ml-3">
                      Memfasilitasi donasi barang dengan mudah
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <Image
                          src="/Main Design Skripsi Vector Love.webp"
                          alt="Beri Barang Logo"
                          width={14}
                          height={14}
                        />
                      </div>
                    </div>
                    <p className="text-base ml-3">
                      Memastikan barang diterima oleh mereka yang membutuhkan
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <Image
                          src="/Main Design Skripsi Vector Trash.webp"
                          alt="Beri Barang Logo"
                          width={14}
                          height={14}
                        />
                      </div>
                    </div>
                    <p className="text-base ml-3">
                      Mengurangi limbah dengan memanfaatkan kembali barang
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Flow */}
        <div className="bg-[#5B4224] text-white p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold text-center mb-8">Alur Donasi</h2>
          <div className="space-y-6">
            {/* First Row: Steps 1, 2, and 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="text-center px-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#5B4224] text-lg font-bold">1</span>
                </div>
                <h3 className="font-semibold text-base mb-2">Isi Form Donasi</h3>
                <p className="text-sm leading-relaxed">
                  Pilih jenis barang donasi, tempat penampungan yang dituju, dan data barang
                </p>
              </div>
              {/* Step 2 */}
              <div className="text-center px-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#5B4224] text-lg font-bold">2</span>
                </div>
                <h3 className="font-semibold text-base mb-2">Pengiriman/Penjemputan</h3>
                <p className="text-sm leading-relaxed">
                  Mengirim sendiri atau dijemput oleh tempat penampung jika tersedia
                </p>
              </div>
              {/* Step 3 */}
              <div className="text-center px-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#5B4224] text-lg font-bold">3</span>
                </div>
                <h3 className="font-semibold text-base mb-2">Pemeriksaan Kelayakan</h3>
                <p className="text-sm leading-relaxed">
                  Kondisi barang diperiksa oleh tempat penampung
                </p>
              </div>
            </div>

            {/* Second Row: Steps 4 and 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-2xl md:mx-auto">
              {/* Step 4 */}
              <div className="text-center px-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#5B4224] text-lg font-bold">4</span>
                </div>
                <h3 className="font-semibold text-base mb-2">Penyimpanan Sementara</h3>
                <p className="text-sm leading-relaxed">
                  Barang masuk inventaris tempat penampung sebelum disalurkan
                </p>
              </div>
              {/* Step 5 */}
              <div className="text-center px-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#5B4224] text-lg font-bold">5</span>
                </div>
                <h3 className="font-semibold text-base mb-2">Penyaluran Barang</h3>
                <p className="text-sm leading-relaxed">
                  Barang disalurkan ke pihak yang membutuhkan oleh tempat penampung
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-[#5B4224] text-white p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-bold text-center mb-6">Tim Kami</h2>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-[#FFF0DC] overflow-hidden mx-auto mb-3">
                <Image
                  src="/image 3.png"
                  alt="Team Member 1"
                  width={128}
                  height={128}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="font-semibold text-base">2502014975</p>
              <p className="text-base">Steven Farrelio Jorgensen</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-[#FFF0DC] overflow-hidden mx-auto mb-3">
                <Image
                  src="/Group 465.png"
                  alt="Team Member 2"
                  width={128}
                  height={128}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="font-semibold text-base">2502073794</p>
              <p className="text-base">Nuky Yasuar Zamzamy</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-[#FFF0DC] overflow-hidden mx-auto mb-3">
                <Image
                  src="/image 4.png"
                  alt="Team Member 3"
                  width={128}
                  height={128}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="font-semibold text-base">2504016241</p>
              <p className="text-base">Matthew Emmanuel</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}