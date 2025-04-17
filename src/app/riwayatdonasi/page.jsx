'use client'

// pages/index.js
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaYoutube, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import { Icon } from '@iconify/react'; // Added Iconify import

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Kotak Peduli</title>
        <meta name="description" content="Platform donasi Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white py-4 px-6 flex justify-between items-center border-b">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="bg-amber-800 w-8 h-8 rounded-sm"></div>
            <span className="font-bold text-amber-800">Kotak Peduli</span>
          </div>
        </div>
        <div className="flex space-x-8">
          <Link href="/about" className="text-gray-800">
            Cerita Kami
          </Link>
          <Link href="/tempatpenampungan" className="text-gray-800">
            Tempat Penampungan
          </Link>
        </div>
        <div className="flex space-x-4 items-center">
          <button className="bg-amber-800 text-white px-4 py-2 rounded-md">
            Donasi Sekarang
          </button>
          <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
            <Icon icon="mdi:account" className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 flex-grow bg-white">
        {/* User Info */}
        <div className="mb-8">
          <p className="text-gray-800 font-normal">Halo,</p>
          <h1 className="text-amber-800 text-xl font-bold">Nuky Yasuar Zamzamy</h1>
        </div>

        {/* Sidebar and Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/5">
            <div className="flex flex-col space-y-4">
              <button className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100">
                <div className="bg-amber-800 rounded-full p-1">
                  <Icon icon="mdi:account" className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-800 font-medium">Informasi Akun</span>
              </button>
              <button className="flex items-center space-x-2 p-2">
                <div className="bg-amber-800 rounded-full p-1">
                  <Icon icon="mdi:history" className="h-5 w-5 text-white" />
                </div>
                <span className="text-amber-800 font-medium">Riwayat Donasi</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-4/5">
            <div className="mb-6">
              <h2 className="text-amber-800 text-2xl font-bold">Riwayat Donasi</h2>
              <p className="text-gray-600 text-sm">Daftar barang donasi yang telah anda kirim sesuai dengan statusnya</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Semua
              </button>
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Pemeriksaan Digital
              </button>
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Pengiriman
              </button>
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Penjemputan
              </button>
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Diterima
              </button>
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Pemeriksaan Fisik
              </button>
              <button className="px-4 py-2 border border-amber-800 rounded-md text-sm text-gray-600">
                Disetujui
              </button>
            </div>

            {/* Donation Items */}
            <div className="space-y-8">
              {/* Item 1 */}
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/5">
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-full bg-[url('/checkerboard.png')]"></div>
                  </div>
                </div>
                <div className="md:w-4/5">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Pakaian</h3>
                      <p className="text-gray-600 text-sm mt-1">Tempat Penampungan 1</p>
                      <p className="text-gray-600 text-sm">Jl. pahlawan</p>
                      <div className="mt-4 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-16">Jumlah:</span>
                          <span className="text-gray-600 font-medium">10</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-16">Berat:</span>
                          <span className="text-gray-600 font-medium">10 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="mt-4 flex justify-end">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                          Pemeriksaan Digital
                        </button>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Metode Pengiriman:</span>
                          <span className="font-medium">Dikirim sendiri</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tanggal Pengiriman:</span>
                          <span className="font-medium">10/04/2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button className="border border-amber-800 text-amber-800 px-4 py-2 rounded-md text-sm">
                      Hubungi Tempat Penampung
                    </button>
                    <button className="bg-amber-300 text-amber-800 px-4 py-2 rounded-md text-sm">
                      Atur Tanggal Pengiriman
                    </button>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/5">
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-full bg-[url('/checkerboard.png')]"></div>
                  </div>
                </div>
                <div className="md:w-4/5">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">Buku</h3>
                      <p className="text-gray-600 text-sm mt-1">Tempat Penampungan 2</p>
                      <p className="text-gray-600 text-sm">Jl. pandanaran</p>
                      <div className="mt-4 space-y-1 text-sm">
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-16">Jumlah:</span>
                          <span className="text-gray-600 font-medium">10</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-16">Berat:</span>
                          <span className="text-gray-600 font-medium">10 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Metode Pengiriman:</span>
                          <span className="font-medium">Penjemputan</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tanggal Pengiriman:</span>
                          <span className="font-medium">Menunggu konfirmasi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button className="border border-amber-800 text-amber-800 px-4 py-2 rounded-md text-sm">
                      Hubungi Tempat Penampung
                    </button>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="bg-amber-800 text-white px-4 py-2 rounded-md text-sm">
                      Penjemputan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-amber-300 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-amber-800 font-medium">
                "Dari bekas menjadi berkah, membantu sesama"
              </p>
            </div>

            <div className="mb-4 md:mb-0">
              <div className="flex items-center justify-center">
                <div className="mb-6 md:mb-0">
                  <Image
                    src="/logo-white.png"
                    alt="Kotak Peduli Logo"
                    width={150}
                    height={60}
                  />
                </div>
                <span className="ml-2 text-amber-800 font-bold">Kotak Peduli</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaInstagram size={24} />
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaYoutube size={24} />
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaWhatsapp size={24} />
              </Link>
              <Link href="#" className="text-amber-800 hover:text-amber-900">
                <FaTwitter size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}