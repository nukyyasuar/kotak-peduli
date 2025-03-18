'use client'

// pages/tempatpenampung.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaBook, FaGamepad, FaLaptop, FaTshirt } from 'react-icons/fa';
import { FaInstagram, FaYoutube, FaWhatsapp, FaTwitter } from 'react-icons/fa';

export default function Home() {
  const donationPoints = [ /** get endpoint dari backend */ 
    {
      id: 1,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 2,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 3,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 4,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 5,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 6,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 7,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 8,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 9,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
    {
      id: 10,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      image: '/warehouse.jpg',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Kotak Peduli - Tempat Penampungan</title>
        <meta name="description" content="Kotak Peduli - Tempat penampungan donasi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white py-4 px-4 md:px-8 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.png" 
              alt="Kotak Peduli Logo"
              width={150}
              height={50}
              className="mr-4"
            />
            <nav className="hidden md:flex space-x-6">
              <Link href="/cerita" className="text-gray-700 hover:text-amber-700">
                Cerita Kami
              </Link>
              <Link href="/tempat" className="text-gray-700 hover:text-amber-700">
                Tempat Penampungan
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/donate" className="bg-amber-800 text-white px-4 py-2 rounded">
              Donasi Sekarang
            </Link>
            <Link href="/login" className="border border-amber-800 text-amber-800 px-4 py-2 rounded">
              Masuk
            </Link>
            <Link href="/register" className="border border-amber-800 text-amber-800 px-4 py-2 rounded">
              Daftar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">Tempat Penampung Yang</h1>
        <h1 className="text-3xl font-bold text-center mb-10">Sudah Bekerjasama</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <p className="font-semibold">Jenis Barang yang Diterima:</p>
            <div className="flex items-center">
              <div className="bg-amber-700 text-white rounded-full p-2 mr-1">
                <FaBook />
              </div>
              <span>Buku</span>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-700 text-white rounded-full p-2 mr-1">
                <FaGamepad />
              </div>
              <span>Mainan</span>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-700 text-white rounded-full p-2 mr-1">
                <FaLaptop />
              </div>
              <span>Alat Elektronik</span>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-700 text-white rounded-full p-2 mr-1">
                <FaTshirt />
              </div>
              <span>Pakaian</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {donationPoints.map((point) => (
            <div key={point.id} className="border border-amber-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={point.image}
                  alt={point.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{point.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{point.address}</p>
                <div className="flex space-x-1">
                  <div className="bg-amber-700 text-white rounded-full p-2">
                    <FaBook size={14} />
                  </div>
                  <div className="bg-amber-700 text-white rounded-full p-2">
                    <FaGamepad size={14} />
                  </div>
                  <div className="bg-amber-700 text-white rounded-full p-2">
                    <FaLaptop size={14} />
                  </div>
                  <div className="bg-amber-700 text-white rounded-full p-2">
                    <FaTshirt size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-amber-200 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-amber-800 font-medium">Dari bekas menjadi berkah,</p>
              <p className="text-amber-800 font-medium">membantu sesama</p>
            </div>
            <div className="mb-6 md:mb-0">
              <Image
                src="/logo-white.png"
                alt="Kotak Peduli Logo"
                width={150}
                height={60}
              />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-800 hover:text-amber-600">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-amber-800 hover:text-amber-600">
                <FaYoutube size={24} />
              </a>
              <a href="#" className="text-amber-800 hover:text-amber-600">
                <FaWhatsapp size={24} />
              </a>
              <a href="#" className="text-amber-800 hover:text-amber-600">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}