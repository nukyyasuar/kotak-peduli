'use client'

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaBook, FaGamepad, FaLaptop, FaTshirt } from 'react-icons/fa';
import Footer from '../footer/page';
import NavbarAfterLogin from '../navbarAfterLogin/page';

export default function Home() {
  const donationPoints = [
    {
      id: 1,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 2,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 3,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 4,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 5,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 6,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 7,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 8,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 9,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
    {
      id: 10,
      title: 'Tempat Penampung 1',
      address: 'Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      phone: '+6282121233212',
      distance: 'Maks. 10km',
      dropPoint: '3 Drop Point Terdekat',
      events: '5 Event Berlangsung',
      image: '/warehouse.jpg',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Kotak Peduli - Tempat Penampungan</title>
        <meta name="description" content="Kotak Peduli - Tempat penampungan donasi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <NavbarAfterLogin/>

      {/* Main Section */}
      <main className="flex-grow container mx-auto px-6 py-10">
        <h1 className="text-5xl font-extrabold text-center mb-1">Tempat Penampung Yang</h1>
        <h1 className="text-5xl font-extrabold text-center mb-12">Sudah Bekerjasama</h1>

        {/* Filter Section */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <p className="font-semibold text-xl">Jenis Barang yang Diterima:</p>
            <div className="flex items-center">
              <div className="bg-amber-800 text-white rounded-full p-3 mr-2">
                <FaBook size={18} />
              </div>
              <span className="text-base">Buku</span>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-800 text-white rounded-full p-3 mr-2">
                <FaGamepad size={18} />
              </div>
              <span className="text-base">Mainan</span>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-800 text-white rounded-full p-3 mr-2">
                <FaLaptop size={18} />
              </div>
              <span className="text-base">Alat Elektronik</span>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-800 text-white rounded-full p-3 mr-2">
                <FaTshirt size={18} />
              </div>
              <span className="text-base">Pakaian</span>
            </div>
          </div>
        </div>

        {/* Donation Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {donationPoints.map((point) => (
            <div key={point.id} className="border-2 border-amber-300 rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src={point.image}
                  alt={point.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2">{point.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{point.address}</p>
                <p className="text-sm text-gray-600 mb-1">{point.phone}</p>
                <p className="text-sm text-gray-600 mb-1">{point.distance}</p>
                <p className="text-sm text-amber-700 mb-1">★ {point.dropPoint}</p>
                <p className="text-sm text-amber-700 mb-4">★ {point.events}</p>
                <div className="flex space-x-2">
                  <div className="bg-amber-800 text-white rounded-full p-2">
                    <FaBook size={14} />
                  </div>
                  <div className="bg-amber-800 text-white rounded-full p-2">
                    <FaGamepad size={14} />
                  </div>
                  <div className="bg-amber-800 text-white rounded-full p-2">
                    <FaLaptop size={14} />
                  </div>
                  <div className="bg-amber-800 text-white rounded-full p-2">
                    <FaTshirt size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
    <Footer/>
    </div>
  );
}