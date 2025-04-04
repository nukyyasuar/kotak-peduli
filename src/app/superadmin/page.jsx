"use client";

import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import NavbarAfterLogin from "../navbarAfterLogin/page";
import Footer from "../footer/page";

export default function Superadmin() {
  // State to manage dropdown visibility for each row
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  // State to manage detail modal visibility and selected shelter data
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  // State to manage confirmation modal visibility for approval
  const [isApproveConfirmModalOpen, setIsApproveConfirmModalOpen] = useState(false);
  const [shelterToApprove, setShelterToApprove] = useState(null);
  // State to manage confirmation modal visibility for rejection
  const [isRejectConfirmModalOpen, setIsRejectConfirmModalOpen] = useState(false);
  const [shelterToReject, setShelterToReject] = useState(null);
  // State to manage current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State to manage filter status (null for all, "Disetujui", or "Ditolak")
  const [filterStatus, setFilterStatus] = useState(null); // Default to null to show all data
  // State to manage search query
  const [searchQuery, setSearchQuery] = useState("");

  // Items per page
  const itemsPerPage = 10;

  // Sample data for shelters (15 items with mixed statuses to demonstrate filtering)
  const [shelters, setShelters] = useState(
    [...Array(15)].map((_, index) => ({
      id: index,
      nama: `Tempat Penampungan Alsut ${index + 1}`,
      email: `tempat-penampungan-${index + 1}@alsut.id`,
      noTelepon: `+62812312312${index < 10 ? "0" + index : index}`,
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      penjemputan: "Tersedia",
      barangDiterima: "Pakaian, Elektronik, Mainan, Buku",
      status: index % 2 === 0 ? "Disetujui" : "Ditolak", // Only "Disetujui" or "Ditolak"
      //image: "https://via.placeholder.com/300x150", // Placeholder image URL
    }))
  );

  // Filter shelters based on the selected status and search query
  const filteredShelters = shelters
    .filter((shelter) => {
      // Apply status filter (if any)
      if (filterStatus) {
        return shelter.status === filterStatus;
      }
      return true; // Show all if no status filter is applied
    })
    .filter((shelter) => {
      // Apply search filter
      if (searchQuery) {
        return shelter.nama.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true; // Show all if no search query
    });

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);

  // Get the current page's data from filtered shelters
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShelters = filteredShelters.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search query changes
  };

  // Function to toggle dropdown for a specific row
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Function to open the detail modal with the selected shelter's data
  const openDetailModal = (shelter) => {
    setSelectedShelter(shelter);
    setIsDetailModalOpen(true);
    setOpenDropdownIndex(null); // Close the dropdown
  };

  // Function to close the detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedShelter(null);
  };

  // Function to open the confirmation modal for approval
  const openApproveConfirmModal = (shelter) => {
    setShelterToApprove(shelter);
    setIsApproveConfirmModalOpen(true);
    setOpenDropdownIndex(null); // Close the dropdown
  };

  // Function to close the confirmation modal for approval
  const closeApproveConfirmModal = () => {
    setIsApproveConfirmModalOpen(false);
    setShelterToApprove(null);
  };

  // Function to confirm approval and update the shelter's status
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

  // Function to open the confirmation modal for rejection
  const openRejectConfirmModal = (shelter) => {
    setShelterToReject(shelter);
    setIsRejectConfirmModalOpen(true);
    setOpenDropdownIndex(null); // Close the dropdown
  };

  // Function to close the confirmation modal for rejection
  const closeRejectConfirmModal = () => {
    setIsRejectConfirmModalOpen(false);
    setShelterToReject(null);
  };

  // Function to confirm rejection and update the shelter's status
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
    <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
      {/* Header */}
      <NavbarAfterLogin />

      {/* Main Content */}
      <main className="p-6 flex-1">
        {/* Summary Cards */}
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Ringkasan Data</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#8B5A2B] text-white p-6 rounded-lg shadow">
            <h2 className="text-4xl font-bold">10</h2>
            <p className="mt-2">Tempat Penampungan</p>
          </div>
          <div className="bg-[#8B5A2B] text-white p-6 rounded-lg shadow">
            <h2 className="text-4xl font-bold">100</h2>
            <p className="mt-2">Donasi Diterima</p>
          </div>
          <div className="bg-[#8B5A2B] text-white p-6 rounded-lg shadow">
            <h2 className="text-4xl font-bold">90</h2>
            <p className="mt-2">Donasi Telah Disalurkan</p>
          </div>
        </div>

        {/* Table Section */}
        <h2 className="text-xl font-bold mb-4 text-center md:text-left">Tempat Penampungan</h2>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Cari Tempat Penampungan"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
          />
          <div>
            <button
              onClick={() => handleFilterChange("Disetujui")}
              className={`border px-4 py-2 rounded mr-2 ${
                filterStatus === "Disetujui"
                  ? "bg-[#8B5A2B] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Disetujui
            </button>
            <button
              onClick={() => handleFilterChange("Ditolak")}
              className={`border px-4 py-2 rounded ${
                filterStatus === "Ditolak"
                  ? "bg-[#8B5A2B] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">No. Telepon</th>
                <th className="px-4 py-2 text-left">Penjemputan</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Menu</th>
              </tr>
            </thead>
            <tbody>
              {currentShelters.map((shelter, index) => (
                <tr key={shelter.id} className="border-t">
                  <td className="px-4 py-2">{shelter.nama}</td>
                  <td className="px-4 py-2">{shelter.email}</td>
                  <td className="px-4 py-2">{shelter.noTelepon}</td>
                  <td className="px-4 py-2">{shelter.penjemputan}</td>
                  <td className="px-4 py-2 text-green-600">{shelter.status}</td>
                  <td className="px-4 py-2 relative">
                    {/* Dropdown Button */}
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-600 focus:outline-none"
                    >
                      ⋮
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdownIndex === index && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                        <ul className="text-gray-700">
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
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === index + 1 ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 border rounded ${
              currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>

        {/* Detail Modal for Shelter Details */}
        {isDetailModalOpen && selectedShelter && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
              {/* Close Button */}
              <button
                onClick={closeDetailModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-4">Detail Informasi Tempat Penampungan</h3>

              {/* Shelter Image and Details in a Flex Row */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Shelter Image (Left) */}
                <div className="md:w-1/3">
                  <Image
                    src={selectedShelter.image}
                    alt={selectedShelter.nama}
                    width={300}
                    height={150}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Shelter Details (Right) */}
                <div className="md:w-2/3 space-y-2">
                  <p>
                    <strong>Nama:</strong> {selectedShelter.nama}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedShelter.email}
                  </p>
                  <p>
                    <strong>No. Telepon:</strong> {selectedShelter.noTelepon}
                  </p>
                  <p>
                    <strong>Alamat:</strong> {selectedShelter.alamat}
                  </p>
                  <p>
                    <strong>Penjemputan:</strong> {selectedShelter.penjemputan}
                    <br />
                    <span className="text-gray-500 text-sm">
                      Tanggal Pengiriman/Penjemputan: Menunggu konfirmasi donatur
                    </span>
                  </p>
                  <p>
                    <strong>Barang yang Diterima:</strong> {selectedShelter.barangDiterima}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedShelter.status}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Setujui
                </button>
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Tolak
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Approval */}
        {isApproveConfirmModalOpen && shelterToApprove && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              {/* Close Button */}
              <button
                onClick={closeApproveConfirmModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-2">Pendaftaran Tempat Penampungan</h3>
              <p className="text-green-600 font-semibold mb-2">(DISETUJUI)</p>
              <p className="text-gray-600 mb-4">
                Apakah Anda yakin ingin menyetujui pendaftaran tempat penampungan ini? Setelah disetujui, tempat penampungan dapat mulai menerima dan menyalurkan donasi.
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={confirmApproval}
                  className="px-4 py-2 bg-[#8B5A2B] text-white rounded hover:bg-[#6B4A1B]"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={closeApproveConfirmModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Rejection */}
        {isRejectConfirmModalOpen && shelterToReject && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
              {/* Close Button */}
              <button
                onClick={closeRejectConfirmModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold mb-2">Pendaftaran Tempat Penampungan</h3>
              <p className="text-red-600 font-semibold mb-2">(DITOLAK)</p>
              <p className="text-gray-600 mb-4">
                Apakah Anda yakin ingin menolak pendaftaran tempat penampungan ini? Tempat penampungan tidak akan dapat menerima donasi melalui platform ini.
              </p>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={confirmRejection}
                  className="px-4 py-2 bg-[#8B5A2B] text-white rounded hover:bg-[#6B4A1B]"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={closeRejectConfirmModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}