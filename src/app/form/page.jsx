"use client";

// pages/index.js
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import NavbarBeforeLogin from "../navbarBeforeLogin/page";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";
import { Icon } from "@iconify/react"; // Import Iconify

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fileName, setFileName] = useState(""); // State to store the selected file name
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const fileInputRef = useRef(null); // Ref to access the hidden file input
  const mapRef = useRef(null); // Ref for the map container

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

  // Function to open/close the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to initialize the Google Map
  useEffect(() => {
    if (isModalOpen && mapRef.current) {
      const loadGoogleMapsScript = () => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        window.initMap = () => {
          const location = { lat: -6.2088, lng: 106.8456 }; // Default location (Jakarta, Indonesia)
          const map = new google.maps.Map(mapRef.current, {
            center: location,
            zoom: 15,
          });

          // Add a marker at the default location
          new google.maps.Marker({
            position: location,
            map: map,
            title: "Selected Location",
          });
        };
      };

      // Load the Google Maps script only if the modal is open
      loadGoogleMapsScript();
    }
  }, [isModalOpen]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Head>
        <title>Beri Barang - Donasi Barang</title>
        <meta name="description" content="Platform donasi barang bekas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarAfterLogin />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-4xl font-bold text-center mb-2 text-[#131010]">
          Yuk Donasikan Barangmu
        </h1>
        <p className="text-center mb-8 text-[#543A14] text-sm">
          Pilih jenis barang terlebih dahulu dari daftar dibawah (bisa lebih dari satu)<br />
          & tempat penampung yang dituju
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-2 text-[#000000]">Informasi Donatur</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-bold text-[#000000]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-[#C2C2C2]"
                  defaultValue="Matthew Emmanuel"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#000000]">
                  Nomor Telpon (Whatsapp)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 text-[#C2C2C2]"
                  defaultValue="+62812468751243"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-[#000000]">
                  Alamat Lengkap{" "}
                  <span
                    className="text-[#F0BB78] text-xs cursor-pointer underline"
                    onClick={toggleModal}
                  >
                    simpan sebagai rumah?
                  </span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 text-[#C2C2C2]"
                  defaultValue="Jl. Tanah Air, Blok A, No. 1, Alam Sutera"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-[#000000]">Tujuan Donasi</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-bold text-[#000000]">
                  Tempat Penampungan
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                    defaultValue="Pilih tempat penampung tujuan donasi"
                  >
                    <option>Pilih tempat penampung tujuan donasi</option>
                    {/* Add options from backend endpoint */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-gray-700">
                  Cabang / Drop Point
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                    defaultValue="Pilih cabang atau drop point (jika tersedia)"
                  >
                    <option>Pilih cabang atau drop point (jika tersedia)</option>
                    {/* Add options from backend endpoint */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-gray-700">
                  Metode Pengiriman
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-400 bg-white focus:outline-none"
                    defaultValue="Pilih metode pengiriman barang"
                  >
                    <option>Pilih metode pengiriman barang</option>
                    {/* Add options from backend endpoint */}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-[#000000]">Jenis Barang Donasi</h3>
          <button
            className="flex items-center bg-[#F0BB78] text-[#543A14] py-2 px-4 rounded-md font-bold hover:bg-amber-200"
            onClick={() => setSelectedCategory("")}
          >
            <Icon icon="mdi:plus" className="mr-2 h-5 w-5" /> {/* Add Iconify plus icon */}
            Tambah Jenis Barang
          </button>
        </div>

        <button className="w-full bg-amber-800 text-white py-3 rounded-md font-bold">
          Kirim
        </button>
      </main>

      {/* Modal for "Simpan sebagai rumah?" */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4 text-[#000000]">Detail Alamat</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Nama Jalan, Perumahan, Komplek
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                    placeholder="Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Patokan, Blok, No. Rumah
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                    placeholder="Blok Z, No. 99"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm text-gray-700">
                    Peta (Jika tersedia)
                  </label>
                  <div
                    ref={mapRef}
                    className="border border-gray-300 rounded-md h-40 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Footer section for buttons */}
            <div className=" p-4 flex justify-end space-x-3 rounded-b-lg bg-transparent">
              <button
                className="flex-1 bg-[#F0BB78] text-[#543A14] py-2 rounded-md font-bold"
                onClick={toggleModal}
              >
                Simpan
              </button>
              <button
                className="flex-1 bg-gray-300 text-[#543A14] py-2 rounded-md font-bold"
                onClick={toggleModal}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}