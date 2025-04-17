'use client';

import { useState, useEffect } from 'react';
import NavbarAfterLoginAdmin from '../navbarAfterLoginAdmin/page';
import Footer from '../Footer/page';

const donationDataInitial = [
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dijemput",
    tanggalPengiriman: "12/03/2025",
    status: "Pemeriksaan digital",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pemeriksaan Digital (DISETUJUI)",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pengiriman",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pengiriman",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pengiriman",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pengiriman",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pengiriman",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
  {
    tanggalDonasi: "10/03/2025",
    namaDonatur: "Nuky Yasuar Zamzamy",
    jenisBarang: "Elektronik",
    tipePengiriman: "Dikirim sendiri",
    tanggalPengiriman: "12/03/2025",
    status: "Pengiriman",
    informasiDonatur: {
      nama: "Nuky Yasuar Zamzamy",
      nomor: "+6282123123212",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    barangDonasi: "Pakaian (10pcs, 5kg)",
    detailTempatPengiriman: {
      tempat: "Tempat Penampungan Alam Satera",
      alamat: "Drop Point Tanggerang Kota Satera\nJl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    event: "Banjir Tanggerang",
    informasiPengiriman: "Dikirim sendiri oleh donatur",
    timeline: [
      { label: "Tanggal Pengajuan", date: "10/11/2025 08:00WIB" },
      { label: "Tanggal yang Dikonfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Menunggu konfirmasi", date: "10/11/2025 08:00WIB" },
      { label: "Tempat Penampungan", date: "10/11/2025 08:00WIB" },
    ],
    rejectionNote: "",
  },
];

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    pemeriksaanDigital: false,
    pengiriman: false,
    pemeriksaanFisik: false,
    ditampung: false,
    dialihkan: false,
  });
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [editStatusIndex, setEditStatusIndex] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDonationIndex, setSelectedDonationIndex] = useState(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [donationData, setDonationData] = useState(donationDataInitial);

  const statusFlow = [
    "Pemeriksaan digital",
    "Pemeriksaan Digital (DISETUJUI)",
    "Pengiriman",
    "Pemeriksaan fisik",
    "Ditampung",
    "Disalurkan",
  ];

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      pemeriksaanDigital: false,
      pengiriman: false,
      pemeriksaanFisik: false,
      ditampung: false,
      dialihkan: false,
    });
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const openDetailModal = (index) => {
    setSelectedDonationIndex(index);
    setIsDetailModalOpen(true);
    setOpenMenuIndex(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDonationIndex(null);
  };

  const openEditStatusModal = (index) => {
    if (index < 0 || index >= donationData.length) return;
    setEditStatusIndex(index);
    const currentStatus = donationData[index].status;
    const currentIndex = statusFlow.indexOf(currentStatus);
    const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : currentStatus;
    setNewStatus(nextStatus);
    setIsEditStatusModalOpen(true);
    setOpenMenuIndex(null);
    setIsDetailModalOpen(false);
  };

  const closeEditStatusModal = () => {
    setIsEditStatusModalOpen(false);
    setEditStatusIndex(null);
    setNewStatus('');
  };

  const handlePreviousStatus = () => {
    if (editStatusIndex === null || editStatusIndex < 0 || editStatusIndex >= donationData.length) return;
    const currentStatus = donationData[editStatusIndex].status;
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex > 0) {
      setNewStatus(statusFlow[currentIndex - 1]);
    }
  };

  const handleNextStatus = () => {
    if (editStatusIndex === null || editStatusIndex < 0 || editStatusIndex >= donationData.length) return;
    const currentStatus = donationData[editStatusIndex].status;
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      setNewStatus(statusFlow[currentIndex + 1]);
    }
  };

  const confirmStatusChange = () => {
    if (editStatusIndex !== null && newStatus && editStatusIndex >= 0 && editStatusIndex < donationData.length) {
      const updatedData = [...donationData];
      updatedData[editStatusIndex].status = newStatus;
      setDonationData(updatedData);
    }
    closeEditStatusModal();
  };

  const openApproveModal = (index) => {
    setSelectedDonationIndex(index);
    setIsApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setIsApproveModalOpen(false);
  };

  const handleApprove = (index) => {
    if (index < 0 || index >= donationData.length) return;
    const updatedData = [...donationData];
    const currentStatus = updatedData[index].status;
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      updatedData[index].status = statusFlow[currentIndex + 1];
      setDonationData(updatedData);
    }
    closeApproveModal();
    closeDetailModal();
  };

  const openRejectModal = (index) => {
    setSelectedDonationIndex(index);
    setRejectionNote('');
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectionNote('');
  };

  const handleReject = (index) => {
    if (index < 0 || index >= donationData.length) return;
    const updatedData = [...donationData];
    updatedData[index].status = "Ditolak";
    updatedData[index].rejectionNote = rejectionNote;
    setDonationData(updatedData);
    closeRejectModal();
    closeDetailModal();
  };

  const openDatePickerModal = () => {
    setIsDatePickerModalOpen(true);
  };

  const closeDatePickerModal = () => {
    setIsDatePickerModalOpen(false);
  };

  const handleSelectShippingDate = (index, date) => {
    if (index < 0 || index >= donationData.length) return;
    const updatedData = [...donationData];
    updatedData[index].tanggalPengiriman = date;
    updatedData[index].status = statusFlow[statusFlow.indexOf(updatedData[index].status) + 1];
    setDonationData(updatedData);
    closeDatePickerModal();
    closeDetailModal();
  };

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length;

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        if (isDatePickerModalOpen) closeDatePickerModal();
        if (isRejectModalOpen) closeRejectModal();
        if (isApproveModalOpen) closeApproveModal();
        if (isDetailModalOpen) closeDetailModal();
        if (isEditStatusModalOpen) closeEditStatusModal();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDetailModalOpen, isEditStatusModalOpen, isApproveModalOpen, isRejectModalOpen, isDatePickerModalOpen]);

  return (
    <div className="min-h-screen bg-[#F5E9D4]">
      <NavbarAfterLoginAdmin />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">BARANG DONASI</h1>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search courses"
            className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <div className="relative">
            <button
              onClick={toggleFilter}
              className="border border-gray-300 rounded-lg p-2 flex items-center bg-white text-gray-700"
            >
              {activeFilterCount > 0 ? `${activeFilterCount} Filter` : 'Filter'}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Cari filter"
                      className="w-full border border-gray-300 rounded-lg p-2 pl-8 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                    <svg
                      className="w-5 h-5 absolute left-2 top-2.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Status</h3>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.pemeriksaanDigital}
                        onChange={() => handleFilterChange('pemeriksaanDigital')}
                        className="mr-2"
                      />
                      Pemeriksaan digital
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.pengiriman}
                        onChange={() => handleFilterChange('pengiriman')}
                        className="mr-2"
                      />
                      Pengiriman
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.pemeriksaanFisik}
                        onChange={() => handleFilterChange('pemeriksaanFisik')}
                        className="mr-2"
                      />
                      Pemeriksaan fisik
                    </label>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedFilters.ditampung}
                        onChange={() => handleFilterChange('ditampung')}
                        className="mr-2"
                      />
                      Ditampung
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.dialihkan}
                        onChange={() => handleFilterChange('dialihkan')}
                        className="mr-2"
                      />
                      Dialihkan
                    </label>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={toggleFilter}
                      className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                    >
                      Filter
                    </button>
                    <button
                      onClick={handleResetFilters}
                      className="text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left font-semibold">Tanggal Donasi</th>
                <th className="p-3 text-left font-semibold">Nama Donatur</th>
                <th className="p-3 text-left font-semibold">Jenis Barang</th>
                <th className="p-3 text-left font-semibold">Tipe Pengiriman</th>
                <th className="p-3 text-left font-semibold">Tanggal Pengiriman</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Menu</th>
              </tr>
            </thead>
            <tbody>
              {donationData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.tanggalDonasi}</td>
                  <td className="p-3">{item.namaDonatur}</td>
                  <td className="p-3">{item.jenisBarang}</td>
                  <td className="p-3">{item.tipePengiriman}</td>
                  <td className="p-3">{item.tanggalPengiriman}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3 relative">
                    <button
                      onClick={() => toggleMenu(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                    {openMenuIndex === index && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        <ul className="py-2">
                          <li>
                            <button
                              onClick={() => openDetailModal(index)}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Lihat Detail
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => openEditStatusModal(index)}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Edit Status
                            </button>
                          </li>
                          {item.tipePengiriman === "Dijemput" && (
                            <li>
                              <button
                                onClick={() => {
                                  console.log("Edit Tanggal Penjemputan clicked for row", index);
                                  toggleMenu(index);
                                }}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                              >
                                Edit Tanggal Penjemputan
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <button className="p-2 text-gray-700 hover:text-gray-900">
            {"< Previous"}
          </button>
          <button className="p-2 bg-[#4A3F35] text-white rounded">1</button>
          <button className="p-2 text-gray-700 hover:text-gray-900">2</button>
          <button className="p-2 text-gray-700 hover:text-gray-900">3</button>
          <button className="p-2 text-gray-700 hover:text-gray-900">4</button>
          <button className="p-2 text-gray-700 hover:text-gray-900">
            Next {">"}
          </button>
        </div>
      </main>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedDonationIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Detail Riwayat Barang Donasi</h2>
              <span className="bg-[#4A3F35] text-white px-3 py-1 rounded-full text-sm">
                {donationData[selectedDonationIndex].status}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              {/* Left Section: Image Placeholder */}
              <div className="w-full md:w-1/3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
                  <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
                  <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
                  <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
              {/* Right Section: Details */}
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Tanggal Donasi:</h3>
                  <p className="text-sm text-black">
                    {new Date(donationData[selectedDonationIndex].tanggalDonasi).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Informasi Donatur:</h3>
                  <p className="text-sm text-black">
                    {donationData[selectedDonationIndex].informasiDonatur.nama}
                    <br />
                    {donationData[selectedDonationIndex].informasiDonatur.nomor}
                    <br />
                    {donationData[selectedDonationIndex].informasiDonatur.alamat}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Barang Donasi:</h3>
                  <p className="text-sm text-black">{donationData[selectedDonationIndex].barangDonasi}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Detail Tempat Pengiriman:</h3>
                  <p className="text-sm text-black">
                    {donationData[selectedDonationIndex].detailTempatPengiriman.tempat}
                    <br />
                    {donationData[selectedDonationIndex].detailTempatPengiriman.alamat}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Event:</h3>
                  <p className="text-sm text-black">{donationData[selectedDonationIndex].event}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Informasi Pengiriman:</h3>
                  <p className="text-sm text-black">{donationData[selectedDonationIndex].informasiPengiriman}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Timeline:</h3>
                  <div className="space-y-2">
                    {donationData[selectedDonationIndex].timeline.map((entry, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-black">
                        <span>{entry.label}</span>
                        <span>{entry.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {donationData[selectedDonationIndex].rejectionNote && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Catatan Penolakan:</h3>
                    <p className="text-sm text-black">{donationData[selectedDonationIndex].rejectionNote}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => openEditStatusModal(selectedDonationIndex)}
                className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                aria-label="Edit status of donation"
              >
                Edit Status
              </button>
              {donationData[selectedDonationIndex].status === "Pemeriksaan Digital (DISETUJUI)" ? (
                <button
                  onClick={openDatePickerModal}
                  className="bg-[#D4A373] text-white px-4 py-2 rounded-lg"
                  aria-label="Choose shipping date"
                >
                  Pilih Tanggal Pengiriman
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openApproveModal(selectedDonationIndex)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    aria-label="Approve donation"
                  >
                    Setuju (Pemeriksaan)
                  </button>
                  <button
                    onClick={() => openRejectModal(selectedDonationIndex)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    aria-label="Reject donation"
                  >
                    Tolak (Pemeriksaan)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && selectedDonationIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-center mb-4">
              Pemeriksaan Digital (DISETUJUI)
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Setelah disetujui, barang donasi akan masuk ke tahapan selanjutnya yaitu tahap penjemputan. Apakah ingin melanjutkan?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleApprove(selectedDonationIndex)}
                className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                aria-label="Confirm approval"
              >
                Konfirmasi
              </button>
              <button
                onClick={closeApproveModal}
                className="text-gray-700 px-4 py-2 rounded-lg"
                aria-label="Cancel approval"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectModalOpen && selectedDonationIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-center mb-4">
              Pemeriksaan Digital (DITOLAK)
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Setelah ditolak, barang donasi tidak akan lanjut ke tahapan selanjutnya dan status akan diubah kembali. Apakah ingin melanjutkan?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Field description"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                rows="3"
                aria-label="Rejection note"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleReject(selectedDonationIndex)}
                className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                aria-label="Confirm rejection"
              >
                Simpan
              </button>
              <button
                onClick={closeRejectModal}
                className="text-gray-700 px-4 py-2 rounded-lg"
                aria-label="Cancel rejection"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal (Placeholder) */}
      {isDatePickerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-center mb-4">
              Pilih Tanggal Pengiriman
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              This is a placeholder for the date picker modal. Please provide the design to implement the date selection functionality.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSelectShippingDate(selectedDonationIndex, "15/03/2025")}
                className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                aria-label="Confirm date selection"
              >
                Simpan
              </button>
              <button
                onClick={closeDatePickerModal}
                className="text-gray-700 px-4 py-2 rounded-lg"
                aria-label="Cancel date selection"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditStatusModalOpen && editStatusIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-2">Ubah Status Barang</h2>
            <p className="text-sm text-gray-600 mb-4">
              Status barang donasi akan diperbarui ke tahapan selanjutnya. Pastikan perubahan status sesuai dengan kondisi aktual barang.
            </p>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePreviousStatus}
                className="text-gray-500 hover:text-gray-700"
                disabled={statusFlow.indexOf(donationData[editStatusIndex]?.status) === 0}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {donationData[editStatusIndex]?.status || 'N/A'}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-sm font-medium">{newStatus || 'N/A'}</span>
              </div>
              <button
                onClick={handleNextStatus}
                className="text-gray-500 hover:text-gray-700"
                disabled={statusFlow.indexOf(donationData[editStatusIndex]?.status) === statusFlow.length - 1}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={confirmStatusChange}
                className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
              >
                Konfirmasi
              </button>
              <button
                onClick={closeEditStatusModal}
                className="text-gray-700 px-4 py-2 rounded-lg"
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