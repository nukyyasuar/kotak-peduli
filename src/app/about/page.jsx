'use client'

// pages/about.js
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaYoutube, FaWhatsapp, FaTwitter } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white py-4 px-6 sm:px-10 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Kotak Peduli" width={30} height={30} />
            <span className="ml-2 text-[#5B4224] font-bold">Kotak Peduli</span>
          </Link>
          <nav className="hidden md:block ml-8">
            <ul className="flex space-x-6">
              <li><Link href="/cerita-kami" className="text-gray-700">Cerita Kami</Link></li>
              <li><Link href="/tempat-penampungan" className="text-gray-700">Tempat Penampungan</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex space-x-3">
          <Link href="/donasi" className="bg-[#5B4224] text-white px-4 py-2 rounded text-sm">
            Donasi Sekarang
          </Link>
          <Link href="/masuk" className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm">
            Masuk
          </Link>
          <Link href="/daftar" className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm">
            Daftar
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Beri Barang Logo */}
        <div className="flex flex-col items-center mt-4 mb-8">
          <div className="relative w-16 h-16">
            <Image 
              src="/beri-barang-logo.png" 
              alt="Beri Barang Logo" 
              fill 
              style={{objectFit: "contain"}}
            />
          </div>
          <h1 className="text-[#5B4224] text-2xl font-bold mt-4">Tentang Kami</h1>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-[#5B4224] text-white p-6 rounded">
            <h2 className="text-lg font-medium mb-3">"Membantu Sesama dengan Barang yang Lebih Bermakna"</h2>
            <p className="text-sm">
              Kami adalah platform yang memudahkan Anda untuk berdonasi barang layak pakai ke 
              tempat penampungan pilihan. Barang yang Anda sumbangkan akan melalui proses seleksi 
              dan penyimpanan sebelum akhirnya disalurkan kepada individu atau keluarga yang 
              benar-benar membutuhkan.
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-[#5B4224] text-white p-6 rounded">
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h2 className="text-lg font-medium mb-3">Visi</h2>
                <p className="text-sm">
                  Menciptakan budaya berbagi untuk kesejahteraan bersama.
                </p>
              </div>
              <div className="w-1/2 pl-4">
                <h2 className="text-lg font-medium mb-3">Misi</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#5B4224]"></div>
                      </div>
                    </div>
                    <p className="text-sm ml-2">Memfasilitasi donasi barang dengan mudah</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#5B4224]"></div>
                      </div>
                    </div>
                    <p className="text-sm ml-2">Memastikan barang diterima oleh mereka yang membutuhkan</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#5B4224]"></div>
                      </div>
                    </div>
                    <p className="text-sm ml-2">Mengurangi limbah dengan memanfaatkan kembali barang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donation Flow */}
        <div className="bg-[#5B4224] text-white p-6 rounded mt-6">
          <h2 className="text-xl font-bold text-center mb-6">Alur Donasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mx-auto mb-2">
                <span className="text-[#5B4224] text-sm font-bold">1</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Isi Form Donasi</h3>
              <p className="text-xs">Pilih jenis barang donasi, tempat penampungan yang dituju, dan data barang</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mx-auto mb-2">
                <span className="text-[#5B4224] text-sm font-bold">2</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Pengiriman/Penjemputan</h3>
              <p className="text-xs">Mengirim sendiri atau dijemput oleh tempat penampung jika tersedia</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mx-auto mb-2">
                <span className="text-[#5B4224] text-sm font-bold">3</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Pemeriksaan Kelayakan</h3>
              <p className="text-xs">Kondisi barang diperiksa oleh tempat penampung</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mx-auto mb-2">
                <span className="text-[#5B4224] text-sm font-bold">4</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Penyimpanan Sementara</h3>
              <p className="text-xs">Barang masuk inventaris tempat penampung sebelum disalurkan</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center mx-auto mb-2">
                <span className="text-[#5B4224] text-sm font-bold">5</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Penyaluran Barang</h3>
              <p className="text-xs">Barang disalurkan ke pihak yang membutuhkan oleh tempat penampung</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-[#5B4224] text-white p-6 rounded mt-6">
          <h2 className="text-xl font-bold text-center mb-6">Tim Kami</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 rounded-full bg-[#F3E9D7] overflow-hidden mx-auto mb-2">
                  {/* Replace with actual team member images */}
                  <Image 
                    src={`/team-member-${i}.jpg`} 
                    alt={`Team Member ${i}`} 
                    width={128} 
                    height={128} 
                  />
                </div>
                <p className="font-semibold text-sm">2502073794</p>
                <p className="text-sm">Nuky Yasuar Zamzamy</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image src="/logo.png" alt="Beri Barang Logo" width={40} height={40} />
              <div className="flex flex-col">
                <span className="font-bold text-amber-700">Beri Barang</span>
                <p className="text-xs text-gray-600 max-w-xs">
                  Dari bekas menjadi berkah<br />
                  Mari bantu sesama dengan mendonasikan barang bekas layak pakai kepada orang yang membutuhkan
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-gray-600 hover:text-amber-600">
                <FaInstagram size={24} />
              </Link>
              <Link href="https://whatsapp.com" className="text-gray-600 hover:text-amber-600">
                <FaWhatsapp size={24} />
              </Link>
              <Link href="https://youtube.com" className="text-gray-600 hover:text-amber-600">
                <FaYoutube size={24} />
              </Link>
              <Link href="https://twitter.com" className="text-gray-600 hover:text-amber-600">
                <FaTwitter size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}