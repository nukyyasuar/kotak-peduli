'use client'

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";
import { Icon } from '@iconify/react'; // Added Iconify import

export default function Shelter() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    availability: "Tersedia",
    items: [],
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, items: [...formData.items, value] });
    } else {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item !== value),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nama Tempat Penampungan wajib diisi";
    if (!formData.address) newErrors.address = "Alamat Lengkap wajib diisi";
    if (!formData.phone) newErrors.phone = "No. Telepon wajib diisi";
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email tidak valid";
    if (formData.items.length === 0)
      newErrors.items = "Pilih setidaknya satu jenis barang";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null);
    setSubmissionMessage("");

    if (!validateForm()) {
      setSubmissionStatus("error");
      setSubmissionMessage("Harap lengkapi semua field yang diperlukan.");
      return;
    }

    try {
      const response = await fetch("/api/shelter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionStatus("success");
        setSubmissionMessage("Tempat penampungan berhasil didaftarkan!");
        setFormData({
          name: "",
          address: "",
          phone: "",
          email: "",
          availability: "Tersedia",
          items: [],
          photo: null,
        });
      } else {
        setSubmissionStatus("error");
        setSubmissionMessage(result.message || "Terjadi kesalahan saat mendaftarkan tempat penampungan.");
      }
    } catch (error) {
      setSubmissionStatus("error");
      setSubmissionMessage("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Tempat Penampungan - Kotak Peduli</title>
        <meta name="description" content="Daftar sebagai tempat penampungan di Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarAfterLogin />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex">
              <div className="w-1/4 pr-6">
                <h2 className="text-lg font-semibold text-gray-800">Halo, Nuky Yasuar Zamzamy</h2>
                <div className="space-y-4">
                  <Link href="/riwayat-donasi">
                    <div className="flex items-center text-amber-800 space-x-2 cursor-pointer">
                      <div className="bg-amber-800 rounded-full p-1">
                        <Icon icon="mdi:account" className="h-5 w-5 text-white" />
                      </div>
                      <span>Informasi Akun</span>
                    </div>
                  </Link>

                  <Link href="/riwayatdonasi">
                    <div className="flex items-center text-amber-800 space-x-2 cursor-pointer">
                      <div className="bg-amber-800 rounded-full p-1">
                        <Icon icon="mdi:history" className="h-5 w-5 text-white" />
                      </div>
                      <span>Riwayat Donasi</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="w-3/4">
                <h2 className="text-xl font-bold text-gray-800">Daftar Sebagai Tempat Penampungan</h2>
                <p className="text-gray-600 mt-2">
                  Silakan lengkapi formulir di bawah untuk mendaftarkan tempat penampungan Anda. 
                  Setelah pendaftran, akan dilakukan peninjauan untuk persetujuan secepatnya.
                </p>

                {submissionStatus && (
                  <div
                    className={`mt-4 p-4 rounded-md ${
                      submissionStatus === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {submissionMessage}
                  </div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Tempat Penampungan</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tempat Penampungan Alust"
                      className={`mt-1 block w-full border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md p-2 focus:ring-brown-500 focus:border-brown-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit"
                      className={`mt-1 block w-full border ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      } rounded-md p-2 focus:ring-brown-500 focus:border-brown-500`}
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">No. Telepon (WhatsApp)</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+628212312312"
                        className={`mt-1 block w-full border ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-md p-2 focus:ring-brown-500 focus:border-brown-500`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tempat.penampungan@alust.id"
                        className={`mt-1 block w-full border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md p-2 focus:ring-brown-500 focus:border-brown-500`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">Ketersediaan Penerima</label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-brown-500 focus:border-brown-500"
                      >
                        <option>Tersedia</option>
                        <option>Tidak Tersedia</option>
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700">Jenis Barang Yang Diterima</label>
                      <div className="mt-1 flex space-x-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value="Pakaian"
                            onChange={handleCheckboxChange}
                            checked={formData.items.includes("Pakaian")}
                            className="form-checkbox text-brown-600"
                          />
                          <span className="ml-2 text-gray-700">Pakaian</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value="Elektronik"
                            onChange={handleCheckboxChange}
                            checked={formData.items.includes("Elektronik")}
                            className="form-checkbox text-brown-600"
                          />
                          <span className="ml-2 text-gray-700">Elektronik</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value="Mainan"
                            onChange={handleCheckboxChange}
                            checked={formData.items.includes("Mainan")}
                            className="form-checkbox text-brown-600"
                          />
                          <span className="ml-2 text-gray-700">Mainan</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            value="Buku"
                            onChange={handleCheckboxChange}
                            checked={formData.items.includes("Buku")}
                            className="form-checkbox text-brown-600"
                          />
                          <span className="ml-2 text-gray-700">Buku</span>
                        </label>
                      </div>
                      {errors.items && <p className="mt-1 text-sm text-red-500">{errors.items}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Foto Tempat Penampungan</label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="text"
                        placeholder="tempat-penampungan.jpg"
                        className="block w-full border border-gray-300 rounded-md p-2 focus:ring-brown-500 focus:border-brown-500"
                        disabled
                      />
                      <button
                        type="button"
                        className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                      >
                        Pilih file
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#F0BB78] text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
                    >
                      Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}