'use client';
import React, { useState, useRef } from "react";
import Image from "next/image";
import NavbarAfterLoginAdmin from '../NavbarAfterLoginAdmin/page';
import Footer from '../Footer/page';

const Home = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isOperationalHoursOpen, setIsOperationalHoursOpen] = useState(false);
  const [operationalHours, setOperationalHours] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const toggleOperationalHours = () => {
    setIsOperationalHoursOpen(!isOperationalHoursOpen);
  };

  const addOperationalDay = () => {
    setOperationalHours([...operationalHours, { day: "Senin", start: "08:00", end: "17:00" }]);
  };

  const removeOperationalDay = (index) => {
    setOperationalHours(operationalHours.filter((_, i) => i !== index));
  };

  const updateOperationalDay = (index, field, value) => {
    const updatedHours = [...operationalHours];
    updatedHours[index][field] = value;
    setOperationalHours(updatedHours);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <NavbarAfterLoginAdmin />

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-black">Informasi Tempat Penampung</h1>
        <div className="flex space-x-6">
          {/* Image Upload Section */}
          <div className="w-1/3">
            <div
              className="bg-white border border-gray-200 rounded-lg p-4 h-48 flex items-center justify-center shadow-sm cursor-pointer"
              style={{
                backgroundImage: !image
                  ? "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAB5JREFUOE9jZKAQMFKon4GBgYGBgYGBgYGBgYGBgQEA0u4G/5q0m0IAAAAASUVORK5CYII=')"
                  : "none",
                backgroundSize: "20px 20px",
              }}
              onClick={handleButtonClick} // Image container remains clickable
            >
              {image ? (
                <Image
                  src={image}
                  alt="Uploaded Image"
                  width={200}
                  height={200}
                  className="object-cover h-full w-full rounded-lg"
                />
              ) : (
                <div className="text-gray-300"></div>
              )}
            </div>
            <button
              onClick={handleButtonClick}
              className="mt-4 bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 w-full shadow-sm"
            >
              Ubah Gambar
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>

          {/* Form Section */}
          <div className="w-2/3 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6">
              {/* Nama Tempat Penampung */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Nama Tempat Penampung
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none placeholder-gray-300"
                  placeholder="Field description"
                />
              </div>

              {/* No. Telepon */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  No. Telepon
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none placeholder-gray-300"
                  placeholder="Field description"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none placeholder-gray-300"
                  placeholder="Field description"
                />
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none placeholder-gray-300"
                  placeholder="Field description"
                />
              </div>

              {/* Ketersediaan Penjemputan */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Ketersediaan Penjemputan
                </label>
                <select
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none text-gray-300 appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A9A9A9' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1em",
                  }}
                >
                  <option>Field description</option>
                  <option>Available</option>
                  <option>Not Available</option>
                </select>
              </div>

              {/* Batas Jarak Penjemputan */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Batas Jarak Penjemputan (km)
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none placeholder-gray-300"
                  placeholder="Field description"
                />
              </div>

              {/* Waktu Operasional */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600">
                  Waktu Operasional (WIB)
                </label>
                <div
                  className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none text-gray-300 cursor-pointer"
                  onClick={toggleOperationalHours}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23A9A9A9' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1em",
                  }}
                >
                  {operationalHours.length > 0
                    ? `${operationalHours.length} hari dipilih`
                    : "Field description"}
                </div>
                {isOperationalHoursOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    {operationalHours.map((dayData, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <select
                          value={dayData.day}
                          onChange={(e) => updateOperationalDay(index, "day", e.target.value)}
                          className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600"
                        >
                          <option>Senin</option>
                          <option>Selasa</option>
                          <option>Rabu</option>
                          <option>Kamis</option>
                          <option>Jumat</option>
                          <option>Sabtu</option>
                          <option>Minggu</option>
                        </select>
                        <input
                          type="time"
                          value={dayData.start}
                          onChange={(e) => updateOperationalDay(index, "start", e.target.value)}
                          className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600"
                        />
                        <span className="text-gray-600">-</span>
                        <input
                          type="time"
                          value={dayData.end}
                          onChange={(e) => updateOperationalDay(index, "end", e.target.value)}
                          className="border border-gray-200 rounded-lg p-2 text-sm text-gray-600"
                        />
                        <button
                          onClick={() => removeOperationalDay(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addOperationalDay}
                      className="mt-2 bg-orange-800 text-white px-4 py-2 rounded-lg hover:bg-orange-900 w-full"
                    >
                      + Tambah Hari
                    </button>
                  </div>
                )}
              </div>

              {/* Jenis Barang yang Diterima */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Jenis Barang yang Diterima
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 border-gray-200 rounded focus:ring-orange-200"
                    />
                    Pakaian
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 border-gray-200 rounded focus:ring-orange-200"
                    />
                    Elektronik
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 border-gray-200 rounded focus:ring-orange-200"
                    />
                    Mainan
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 border-gray-200 rounded focus:ring-orange-200"
                    />
                    Buku
                  </label>
                </div>
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-600">
                Deskripsi Singkat
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-200 rounded-lg p-3 focus:ring focus:ring-orange-200 focus:outline-none placeholder-gray-300"
                rows={3}
                placeholder="Field description"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex space-x-4">
              <button className="bg-orange-200 text-orange-800 px-6 py-2 rounded-lg hover:bg-orange-300 shadow-sm">
                Simpan Perubahan
              </button>
              <button className="bg-white border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 shadow-sm">
                Batal
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;