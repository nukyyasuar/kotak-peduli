"use client";

// pages/index.js
import { useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Navbar from "../navbarBeforeLogin/page";
import Footer from "../footer/page";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Pakaian");
  const [fileName, setFileName] = useState("foto_barang.jpg"); // State to store the selected file name
  const fileInputRef = useRef(null); // Ref to access the hidden file input

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Update the displayed file name
    }
  };

  // Function to trigger the file input click
  const handleFileButtonClick = () => {
    fileInputRef.current.click(); // Programmatically trigger the hidden file input
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Beri Barang - Donasi Barang</title>
        <meta name="description" content="Platform donasi barang bekas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">
            Yuk Donasikan Barangmu
          </h1>
          <p className="text-center mb-6 text-sm">
            Pilih jenis barang terlebih dahulu dari daftar dibawah (bisa lebih
            dari satu)
            <br />& tempat penampung yang dituju
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:w-2/5">
              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 focus:outline-none bg-white"
                  defaultValue="Pilih tempat penampung"
                >
                  <option>Pilih tempat penampung</option>
                  {/* Add options from backend endpoint */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:w-3/5 grid grid-cols-4 gap-2">
              {["Pakaian", "Mainan", "Alat Elektronik", "Buku"].map(
                (category) => (
                  <button
                    key={category}
                    className={`border rounded-md py-2 px-4 text-sm ${
                      selectedCategory === category
                        ? "bg-amber-800 text-white"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="bg-amber-50 rounded-md p-6">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-800 text-white text-center px-4 py-1 rounded-md">
                {selectedCategory}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  defaultValue="Matthew Emmanuel"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Jumlah Barang (satuan)
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue="1 dus"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Total Berat Barang
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-l-md p-2"
                      defaultValue="10"
                    />
                    <span className="bg-gray-200 px-2 flex items-center justify-center rounded-r-md text-gray-700">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Nomor Telpon (Whatsapp)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2"
                  defaultValue="081246875243"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Metode Pengiriman
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 focus:outline-none bg-white"
                    defaultValue="Pilih metode pengiriman barang"
                  >
                    <option>Pilih metode pengiriman barang</option>
                    {/* Add options from backend endpoint */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Alamat Lengkap{" "}
                  <span className="text-amber-500 text-xs">
                    Simpan sebagai rumah?
                  </span>
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 h-35.5"
                  defaultValue="Jl. Tanah Air, Blok A, No. 1, Alam Sutera, Tangerang Selatan, Banten"
                ></textarea>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Foto Barang
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-l-md p-2 bg-white text-gray-400"
                      readOnly
                      value={fileName}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handleFileButtonClick}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md text-sm"
                    >
                      Pilih file
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-amber-800 text-white py-3 rounded-md mt-6 font-medium">
              Kirim
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
