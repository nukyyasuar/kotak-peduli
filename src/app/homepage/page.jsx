"use client";

// pages/homepage.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavbarBeforeLogin from "../navbarBeforeLogin/page";
import NavbarAfterLogin from "../navbarAfterLogin/page"; 
import Footer from "../footer/page";

//pake react-hooks from
//validasi pake yup
//mau kirim axios
//payload alamat donatur dan alamat tempat tujuan tujuan

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Beri Barang - Donasi untuk Indonesia</title>
        <meta
          name="description"
          content="Platform donasi barang untuk Indonesia"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarAfterLogin />

      {/* Hero Section */}
      <section className="relative w-full h-[600px]">
        <Image
          src="/hero-bg.jpg"
          alt="Children collecting waste"
          layout="fill"
          objectFit="cover"
          priority
        />

        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="bg-brown-800 bg-opacity-80 p-6 text-white max-w-md">
              <h2 className="text-3xl font-bold mb-4">
                Dari bekas menjadi berkah.
              </h2>
              <p className="text-lg">Mari bantu sesama demi Indonesia makmur</p>
            </div>
            <div className="bg-brown-800 bg-opacity-80 p-6 text-white max-w-md mt-4">
              <h2 className="text-2xl font-bold mb-4">
                Donasikan barang layak pakaimu
              </h2>
              <p className="text-sm">
                Apapun itu sangat berarti bagi mereka yang membutuhkan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-light mb-12 text-amber-700">
            INDAHNYA BERDONASI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/icon-love.png"
                  alt="Love Icon"
                  width={80}
                  height={80}
                />
              </div>
              <p className="text-sm text-gray-700">
                Berdonasi adalah wujud kasih sayang dan kepedulian.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/icon-family.png"
                  alt="Family Icon"
                  width={80}
                  height={80}
                />
              </div>
              <p className="text-sm text-gray-700">
                Setiap bantuan dapat dibagikan kepada keluarga yang membutuhkan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/icon-growth.png"
                  alt="Growth Icon"
                  width={80}
                  height={80}
                />
              </div>
              <p className="text-sm text-gray-700">
                Donasi tidak hanya membantu individu, tetapi juga berkontribusi
                pada kesejahteraan masyarakat luas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src="/icon-health.png"
                  alt="Health Icon"
                  width={80}
                  height={80}
                />
              </div>
              <p className="text-sm text-gray-700">
                Berbagi dapat mengurangi stres dan meningkatkan kualitas hidup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donatur Statistics */}
      <section className="bg-amber-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-amber-700">999</h3>
              <p className="text-gray-700">Barang Donasi</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-amber-700">999</h3>
              <p className="text-gray-700">Telah Disalurkan</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-amber-700">999</h3>
              <p className="text-gray-700">Tempat Penampungan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 bg-amber-100">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl mb-8 text-amber-700">
            TERIMAKASIH PARA DONATUR
          </h2>

          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <Image
                  src="/testimonial-person.jpg"
                  alt="Testimonial"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-2/3 md:pl-6">
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris iaculis eget nibh nec porttitor. Etiam.
                </p>
                <p className="text-amber-500 font-medium">Fulani</p>
                <p className="text-gray-500 text-sm">Ketua Pengurus</p>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              <button className="w-2 h-2 rounded-full bg-amber-300"></button>
              <button className="w-2 h-2 rounded-full bg-amber-200"></button>
              <button className="w-2 h-2 rounded-full bg-amber-200"></button>
            </div>

            <div className="flex justify-between mt-4">
              <button className="text-amber-400 hover:text-amber-600">
                &lt;
              </button>
              <button className="text-amber-400 hover:text-amber-600">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
