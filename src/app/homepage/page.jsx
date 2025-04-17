"use client";

// pages/homepage.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavbarBeforeLogin from "../navbarBeforeLogin/page";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

export default function Home() {
  // Data testimonial
  const testimonials = [
    {
      name: "Fulani",
      role: "Ketua Pengurus",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis eget nibh nec porttitor. Etiam.",
      image: "/Rectangle 40 from Figma.webp",
    },
    {
      name: "Siti",
      role: "Anggota Komunitas",
      text: "Donasi kalian telah mengubah hidup kami, memberikan harapan baru setiap hari. Terima kasih atas kebaikan hati!",
      image: "/testimonial-person-2.jpg",
    },
    {
      name: "Budi",
      role: "Relawan",
      text: "Melihat senyum anak-anak yang menerima bantuan adalah hadiah terbesar. Bersama, kita wujudkan perubahan!",
      image: "/testimonial-person-3.jpg",
    },
  ];

  // State untuk testimonial aktif
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Ganti setiap 5 detik
    return () => clearInterval(interval); 
  }, [testimonials.length]);

  // Fungsi untuk navigasi manual
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <>
      <NavbarBeforeLogin />

      {/* Hero Section */}
<section className="relative w-full h-[600px]">
  <Image
    src="/Poor Child Landfill Hope.webp"
    alt="Children collecting waste"
    layout="fill"
    objectFit="cover"
    priority
  />
  <div className="absolute inset-0 flex items-start justify-end pt-8">
    <div className="flex flex-col gap-4">
      <div className="bg-[#5C3D15] bg-opacity-90 p-6 text-white mb-6">
        <h2 className="text-3xl font-bold mb-2 whitespace-nowrap">
          Dari bekas menjadi berkah.
        </h2>
        <p className="text-lg whitespace-nowrap">Mari bantu sesama demi Indonesia makmur</p>
      </div>
      <div className="bg-[#5C3D15] bg-opacity-90 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 whitespace-nowrap">
          Donasikan barang layak pakaimu
        </h2>
        <p className="text-sm whitespace-nowrap">
          Apapun itu sangat berarti bagi mereka yang membutuhkan
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-10">
          <h2 className="text-center text-3xl mb-12 text-[#F0BB78] font-bold">
            INDAHNYA BERDONASI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Kotak 1 */}
            <div className="flex flex-col items-center text-center bg-[#F0BB78] rounded-lg shadow-md p-6">
              <div className="mb-10 -ml-30">
                <Image
                  src="/Main Design Skripsi Love.webp"
                  alt="Love Icon"
                  width={40}
                  height={40}
                />
              </div>
              <p className="text-sm text-[#FFFFFF] text-left">
                Berdonasi adalah wujud kasih sayang dan kepedulian, menghadirkan
                kebahagiaan bagi mereka yang membutuhkan.
              </p>
            </div>
            {/* Kotak 2 */}
            <div className="flex flex-col items-center text-center bg-[#F0BB78] rounded-lg shadow-md p-6">
              <div className="mb-8 -ml-30">
                <Image
                  src="/Main Design Skripsi Vector People.webp"
                  alt="Family Icon"
                  width={40}
                  height={40}
                />
              </div>
              <p className="text-sm text-[#FFFFFF] text-left">
                Setiap bantuan yang diberikan dapat meringankan beban keluarga
                yang membutuhkan dan membawa harapan baru.
              </p>
            </div>
            {/* Kotak 3 */}
            <div className="flex flex-col items-center text-center bg-[#F0BB78] rounded-lg shadow-md p-6">
              <div className="mb-7 -ml-30">
                <Image
                  src="/Main Design Skripsi Vector Growth.webp"
                  alt="Growth Icon"
                  width={40}
                  height={40}
                />
              </div>
              <p className="text-sm text-[#FFFFFF] text-left">
                Donasi tidak hanya membantu individu, tetapi juga berkontribusi
                pada kesejahteraan dan kebaikan masyarakat luas.
              </p>
            </div>
            {/* Kotak 4 */}
            <div className="flex flex-col items-center text-center bg-[#F0BB78] rounded-lg shadow-md p-6">
              <div className="mb-9 -ml-30">
                <Image
                  src="/Main Design Skripsi Family.webp"
                  alt="Health Icon"
                  width={40}
                  height={40}
                />
              </div>
              <p className="text-sm text-[#FFFFFF] text-left">
                Berbagi dengan orang lain dapat mengurangi stres, menurunkan
                tekanan darah, dan meningkatkan kualitas hidup secara
                keseluruhan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 bg-[#543A14]">
        <div className="container mx-auto px-7">
          <h2 className="text-center text-2xl mb-8 text-[#FFF0DC] font-bold">
            TERIMAKASIH PARA DONATUR
          </h2>
          {/* Donatur Statistics */}
          <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="flex items-center space-x-3">
              <span className="bg-[#FFF0DC] rounded-2xl shadow-md px-4 py-2">
                <h3 className="text-3xl font-bold text-[#543A14]">999</h3>
              </span>
              <p className="text-[#FFF0DC] text-sm">Barang Donasi</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-[#FFF0DC] rounded-2xl shadow-md px-4 py-2">
                <h3 className="text-3xl font-bold text-[#543A14]">999</h3>
              </span>
              <p className="text-[#FFF0DC] text-sm">Telah Disalurkan</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-[#FFF0DC] rounded-2xl shadow-md px-4 py-2">
                <h3 className="text-3xl font-bold text-[#543A14]">999</h3>
              </span>
              <p className="text-[#FFF0DC] text-sm">Tempat Penampungan</p>
            </div>
          </div>
          <div className="bg-[#FFF0DC] rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-4 md:mb-0 flex items-center">
                <button
                  className="text-[#543A14] text-5xl mr-4"
                  onClick={handlePrev}
                >
                  <Icon icon="mdi:chevron-left" />
                </button>
                <Image
                  src={testimonials[activeIndex].image}
                  alt="Testimonial"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-2/3 md:pl-6 flex items-center">
                <div>
                  <p className="text-gray-600 mb-4">
                    {testimonials[activeIndex].text}
                  </p>
                  <p className="text-[#543A14] font-medium">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {testimonials[activeIndex].role}
                  </p>
                </div>
                <button
                  className="text-[#543A14] text-5xl ml-4"
                  onClick={handleNext}
                >
                  <Icon icon="mdi:chevron-right" />
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeIndex ? "bg-[#543A14]" : "bg-white"
                  }`}
                  onClick={() => setActiveIndex(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kriteria Barang Layak Donasi Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-medium text-[#F0BB78] mb-10">
            KRITERIA BARANG LAYAK DONASI
          </h2>
          <div className="flex flex-row flex-wrap justify-center gap-8">
            {/* Pakaian */}
            <div className="flex flex-col items-center w-48">
              <Image
                src="/T-Shirt Design.webp"
                alt="Pakaian"
                width={150}
                height={150}
                className="object-contain mb-6"
              />
              <h3 className="text-[#F0BB78] font-medium text-xl mb-4">
                Pakaian
              </h3>
              <div className="w-full">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Bersih</span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Layak Pakai</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tidak Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Robek atau Bolong
                      </span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Kotor atau Rusak
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buku */}
            <div className="flex flex-col items-center w-48">
              <Image
                src="/Reading Concept with Books.webp"
                alt="Buku"
                width={93}
                height={93}
                className="object-contain mb-6"
              />
              <h3 className="text-[#F0BB78] font-medium text-xl mb-4">Buku</h3>
              <div className="w-full">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Terbaca Jelas
                      </span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Cover Utuh</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tidak Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Basah</span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Sobek</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Elektronik */}
            <div className="flex flex-col items-center w-48">
              <Image
                src="/Main Desain Skripsi Eelektronik.webp"
                alt="Elektronik"
                width={150}
                height={150}
                className="object-contain mb-6"
              />
              <h3 className="text-[#F0BB78] font-medium text-xl mb-4">
                Elektronik
              </h3>
              <div className="w-full">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Berfungsi</span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Bersih</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tidak Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Komponen Hilang
                      </span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Rusak</span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Kotor Parah</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mainan */}
            <div className="flex flex-col items-center w-48">
              <Image
                src="/Cute Plush Toys Arrangement.webp"
                alt="Mainan"
                width={100}
                height={100}
                className="object-contain mb-6"
              />
              <h3 className="text-[#F0BB78] font-medium text-xl mb-4">
                Mainan
              </h3>
              <div className="w-full">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Berfungsi</span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#1F7D53] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Aman untuk Anak
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tidak Diterima:
                  </p>
                  <ul>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Berbahaya</span>
                    </li>
                    <li className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:close-circle"
                        className="text-[#E52020] w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Rusak Parah</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
