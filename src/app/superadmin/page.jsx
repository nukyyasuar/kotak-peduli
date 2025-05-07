"use client";

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";
import { Icon } from "@iconify/react"; // Import Iconify

export default function Superadmin() {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [isApproveConfirmModalOpen, setIsApproveConfirmModalOpen] = useState(false);
  const [shelterToApprove, setShelterToApprove] = useState(null);
  const [isRejectConfirmModalOpen, setIsRejectConfirmModalOpen] = useState(false);
  const [shelterToReject, setShelterToReject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const itemsPerPage = 10;

  const [shelters, setShelters] = useState(
    [...Array(15)].map((_, index) => ({
      id: index,
      nama: `Tempat Penampungan Alsut`,
      email: `tempat-penampungan@alsut.id`,
      noTelepon: `+62812312312${index < 10 ? "0" + index : index}`,
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      penjemputan: "Tersedia",
      barangDiterima: "Pakaian, Elektronik, Mainan, Buku",
      status: index % 2 === 0 ? "Disetujui" : "Ditolak",
      jarakPenjemputan: "10",
      waktuOperasional: {
        senin: "10.00-17.00 WIB",
        selasa: "10.00-17.00 WIB",
        rabu: "10.00-17.00 WIB",
      },
      deskripsi:
        "Kami adalah lembaga kemasyarakatan yang berfokus pada penanganan bencana alam, peduli terhadap lingkungan, dan membantu masyarakat yang terkena bencana alam. Donasi yang kami terima akan disalurkan langsung kepada masyarakat yang membutuhkan.",
      foto: "/placeholder-image.jpg",
    }))
  );

  const filteredShelters = shelters
    .filter((shelter) => {
      if (filterStatus.length > 0) {
        return filterStatus.includes(shelter.status);
      }
      return true;
    })
    .filter((shelter) => {
      if (searchQuery) {
        return shelter.nama.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

  const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShelters = filteredShelters.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const openDetailModal = (shelter) => {
    setSelectedShelter(shelter);
    setIsDetailModalOpen(true);
    setOpenDropdownIndex(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedShelter(null);
  };

  const openApproveConfirmModal = (shelter) => {
    setShelterToApprove(shelter);
    setIsApproveConfirmModalOpen(true);
    setOpenDropdownIndex(null);
  };

  const closeApproveConfirmModal = () => {
    setIsApproveConfirmModalOpen(false);
    setShelterToApprove(null);
  };

  const confirmApproval = () => {
    setShelters((prevShelters) =>
      prevShelters.map((shelter) =>
        shelter.id === shelterToApprove.id
          ? { ...shelter, status: "Disetujui" }
          : shelter
      )
    );
    closeApproveConfirmModal();
  };

  const openRejectConfirmModal = (shelter) => {
    setShelterToReject(shelter);
    setIsRejectConfirmModalOpen(true);
    setOpenDropdownIndex(null);
  };

  const closeRejectConfirmModal = () => {
    setIsRejectConfirmModalOpen(false);
    setShelterToReject(null);
  };

  const confirmRejection = () => {
    setShelters((prevShelters) =>
      prevShelters.map((shelter) =>
        shelter.id === shelterToReject.id
          ? { ...shelter, status: "Ditolak" }
          : shelter
      )
    );
    closeRejectConfirmModal();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
    <div className="sticky top-0 z-50">
      <NavbarAfterLogin />
    </div>

      {/* Summary Cards Section */}
      <section className="container mx-auto px-6 p-7">
        <h1 className="text-[28px] font-bold mb-6 uppercase tracking-wide text-[#131010] text-center">
          Ringkasan Data
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#5C4033] text-white p-6 rounded-lg shadow text-center">
            <h2 className="text-[40px] font-bold leading-tight text-[#F0BB78]">10</h2>
            <p className="mt-2 text-sm leading-tight font-bold">Tempat Penampungan</p>
          </div>
          <div className="bg-[#5C4033] text-white p-6 rounded-lg shadow text-center">
            <h2 className="text-[40px] font-bold leading-tight text-[#F0BB78]">100</h2>
            <p className="mt-2 text-sm leading-tight font-bold">Donasi Diterima</p>
          </div>
          <div className="bg-[#5C4033] text-white p-6 rounded-lg shadow text-center">
            <h2 className="text-[40px] font-bold leading-tight text-[#F0BB78]">90</h2>
            <p className="mt-2 text-sm leading-tight font-bold">Donasi Telah Disalurkan</p>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-[#FFF0DC] w-full">
        <div className="flex-grow px-8 py-6">
          <h2 className="text-[22px] font-bold mb-4 text-center uppercase tracking-wide text-[#131010]">
            Tempat Penampung
          </h2>
          <div className="relative">
            <div className="flex justify-between items-center mb-6 text-[#c2c2c2]">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search courses"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="p-2 pl-10 rounded-lg shadow-sm focus:outline-none bg-white text-sm"
                />
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C2C2C2] w-5 h-5"
                />
              </div>
              <div className="space-x-4 flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filterStatus.includes("Disetujui")}
                    onChange={() => handleFilterChange("Disetujui")}
                    className="form-checkbox h-5 w-5 accent-[#543A14]"
                  />
                  <span className="text-sm font-medium text-[#232323]">Disetujui</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filterStatus.includes("Ditolak")}
                    onChange={() => handleFilterChange("Ditolak")}
                    className="form-checkbox h-5 w-5 accent-[#543A14]"
                  />
                  <span className="text-sm font-medium text-[#232323]">Ditolak</span>
                </label>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-2 text-left font-semibold text-[#232323] text-sm uppercase">
                      Nama
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[#232323] text-sm uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[#232323] text-sm uppercase">
                      No Telepon
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[#232323] text-sm uppercase">
                      Penjemputan
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[#232323] text-sm uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[#232323] text-sm uppercase">
                      Menu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentShelters.map((shelter, index) => (
                    <tr key={shelter.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-[#232323]">{shelter.nama}</td>
                      <td className="px-4 py-2 text-sm text-[#232323]">{shelter.email}</td>
                      <td className="px-4 py-2 text-sm text-[#232323]">{shelter.noTelepon}</td>
                      <td className="px-4 py-2 text-sm text-[#232323]">{shelter.penjemputan}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            shelter.status === "Disetujui"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {shelter.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 relative">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="text-[#232323] focus:outline-none"
                        >
                          <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                        </button>
                        {openDropdownIndex === index && (
                          <div className="absolute right-2 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                            <ul className="text-[#232323] text-sm">
                              <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => openDetailModal(shelter)}
                              >
                                Lihat Detail
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => openApproveConfirmModal(shelter)}
                              >
                                Setujui
                              </li>
                              <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => openRejectConfirmModal(shelter)}
                              >
                                Tolak
                              </li>
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!isLoading && (
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-[#4A2C2A] text-sm flex items-center ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              } active:border-none active:bg-transparent`}
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-1" />
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  currentPage === page
                    ? "bg-[#4A2C2A] text-white"
                    : "border border-[#4A2C2A] text-[#4A2C2A] hover:bg-[#8B5A2B] hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-[#4A2C2A] text-sm flex items-center ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              } active:border-none active:bg-transparent`}
            >
              Next
              <Icon icon="mdi:arrow-right" className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedShelter && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#131010]">Detail Tempat Penampung</h2>
              <button
                onClick={closeDetailModal}
                className="text-[#232323] hover:text-gray-600 focus:outline-none"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Section - Photo Placeholder */}
              <div className="w-full md:w-1/3">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Foto Placeholder</span>
                </div>
              </div>

              {/* Right Section - Details */}
              <div className="w-full md:w-2/3">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#131010] mb-2">
                    Informasi Tempat Penampung
                  </h3>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Nama:</span> {selectedShelter.nama}
                  </p>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Email:</span> {selectedShelter.email}
                  </p>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">No Telepon:</span> {selectedShelter.noTelepon}
                  </p>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Alamat:</span> {selectedShelter.alamat}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[#131010] mb-2">Penjemputan:</h4>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Status:</span> {selectedShelter.penjemputan}
                  </p>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Batas Jarak Penjemputan (km):</span>{" "}
                    {selectedShelter.jarakPenjemputan}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[#131010] mb-2">Waktu Operasional:</h4>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Senin:</span>{" "}
                    {selectedShelter.waktuOperasional.senin}
                  </p>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Selasa:</span>{" "}
                    {selectedShelter.waktuOperasional.selasa}
                  </p>
                  <p className="text-sm text-[#232323] mb-1">
                    <span className="font-medium">Rabu:</span>{" "}
                    {selectedShelter.waktuOperasional.rabu}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#131010] mb-2">
                    Barang yang Diterima
                  </h3>
                  <p className="text-sm text-[#232323]">{selectedShelter.barangDiterima}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#131010] mb-2">Deskripsi Singkat:</h3>
                  <p className="text-sm text-[#232323]">{selectedShelter.deskripsi}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  openApproveConfirmModal(selectedShelter);
                  closeDetailModal();
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
              >
                Setujui (Pemeriksaan)
              </button>
              <button
                onClick={() => {
                  openRejectConfirmModal(selectedShelter);
                  closeDetailModal();
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
              >
                Tolak (Pemeriksaan)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {isApproveConfirmModalOpen && shelterToApprove && (
        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#131010] mb-4">
              Pendaftaran Tempat Penampungan (Disetujui)
            </h2>
            <p className="text-sm text-[#232323] mb-6">
              Apakah Anda yakin ingin menyetujui pendaftaran tempat penampungan ini? Setelah
              disetujui, tempat penampungan dapat mulai menerima dan mengelola donasi.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmApproval}
                className="bg-[#5C4033] text-white px-4 py-2 rounded-lg hover:bg-[#4A3226] focus:outline-none"
              >
                Konfirmasi
              </button>
              <button
                onClick={closeApproveConfirmModal}
                className="bg-gray-200 text-[#232323] px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectConfirmModalOpen && shelterToReject && (
        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-[#131010] mb-4">
              Pendaftaran Tempat Penampungan (Ditolak)
            </h2>
            <p className="text-sm text-[#232323] mb-6">
              Apakah Anda yakin ingin menolak pendaftaran tempat penampungan ini?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmRejection}
                className="bg-[#5C4033] text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
              >
                Konfirmasi
              </button>
              <button
                onClick={closeRejectConfirmModal}
                className="bg-gray-200 text-[#232323] px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none"
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