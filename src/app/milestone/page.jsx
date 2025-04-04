'use client'

import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Footer from "../footer/page";

export default function Home() {
  // State for checkboxes
  const [isAktif, setIsAktif] = useState(false);
  const [isSelesai, setIsSelesai] = useState(false);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for dropdown visibility (one for each row)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // State for modals visibility
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // New state for confirmation modal
  const [selectedEventIndex, setSelectedEventIndex] = useState(null);
  const [eventToFinishIndex, setEventToFinishIndex] = useState(null); // Track the event to be marked as "Selesai"

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  // State for form data (Tambah Event)
  const [tambahFormData, setTambahFormData] = useState({
    nama: "",
    alamat: "",
    akhirPenerimaan: "",
    barang: {
      pakaian: false,
      elektronik: false,
      mainan: false,
      buku: false,
    },
  });

  // State for form data (Ubah Data)
  const [ubahFormData, setUbahFormData] = useState({
    nama: "",
    alamat: "",
    akhirPenerimaan: "",
    barang: {
      pakaian: false,
      elektronik: false,
      mainan: false,
      buku: false,
    },
  });

  // Generate sample event data using a loop
  const generateEvents = (count) => {
    const events = [];
    const itemsList = ["Pakaian", "Buku", "Makanan", "Elektronik"];
    for (let i = 1; i <= count; i++) {
      events.push({
        name: `Banjir di Bekasi ${i}`,
        address: i % 2 === 0 ? "JL. Lorem Ipsum No. X, Bekasi..." : "Bekasi, Jawa Barat",
        endDate: "20/03/2025",
        items: itemsList.slice(0, Math.floor(Math.random() * itemsList.length) + 1).join(", "),
        status: i % 3 === 0 ? "Selesai" : "Aktif", // Mixed statuses: "Aktif" for most, "Selesai" for every third event
      });
    }
    return events;
  };

  // Initial event data (generate 20 events for testing pagination)
  const [events, setEvents] = useState(generateEvents(20));

  // Filter events based on checkbox states and search query
  const filteredEvents = events.filter((event) => {
    // Status filtering
    let matchesStatus = false;
    if (!isAktif && !isSelesai) matchesStatus = true; // Show all if neither is checked (default)
    else if (isAktif && isSelesai) matchesStatus = true; // Show all if both are checked
    else if (isAktif) matchesStatus = event.status === "Aktif";
    else if (isSelesai) matchesStatus = event.status === "Selesai";

    // Search filtering (case-insensitive, partial match on name)
    const matchesSearch = searchQuery
      ? event.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true; // If searchQuery is empty, match all events

    // Event must match both status and search criteria
    return matchesStatus && matchesSearch;
  });

  // Log filtered events whenever searchQuery, isAktif, or isSelesai changes
  useEffect(() => {
    console.log("Filtered Events:", filteredEvents);
  }, [searchQuery, isAktif, isSelesai, events]);

  // Pagination logic for filtered events
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Reset to page 1 when filters or search query change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 when search query changes
    console.log("Search Query:", query); // Debugging: Log the search query
  };

  // Toggle dropdown for a specific row
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Toggle Tambah Event modal visibility
  const toggleTambahModal = () => {
    setIsTambahModalOpen(!isTambahModalOpen);
    // Reset form data when closing the modal
    if (isTambahModalOpen) {
      setTambahFormData({
        nama: "",
        alamat: "",
        akhirPenerimaan: "",
        barang: {
          pakaian: false,
          elektronik: false,
          mainan: false,
          buku: false,
        },
      });
    }
  };

  // Toggle Ubah Data modal visibility
  const toggleUbahModal = (index) => {
    if (index !== null) {
      const event = events[index];
      const itemsArray = event.items.split(", ");
      setUbahFormData({
        nama: event.name,
        alamat: event.address,
        akhirPenerimaan: event.endDate,
        barang: {
          pakaian: itemsArray.includes("Pakaian"),
          elektronik: itemsArray.includes("Elektronik"),
          mainan: itemsArray.includes("Mainan"),
          buku: itemsArray.includes("Buku"),
        },
      });
      setSelectedEventIndex(index);
    }
    setIsUbahModalOpen(!isUbahModalOpen);
    setOpenDropdownIndex(null); // Close the dropdown when opening the modal
  };

  // Toggle Confirmation modal visibility
  const toggleConfirmModal = (index) => {
    setEventToFinishIndex(index);
    setIsConfirmModalOpen(!isConfirmModalOpen);
    setOpenDropdownIndex(null); // Close the dropdown when opening the modal
  };

  // Handle confirmation to mark event as "Selesai"
  const handleConfirmFinish = () => {
    if (eventToFinishIndex !== null) {
      setEvents((prev) => {
        const updatedEvents = [...prev];
        updatedEvents[eventToFinishIndex] = {
          ...updatedEvents[eventToFinishIndex],
          status: "Selesai",
        };
        return updatedEvents;
      });
    }
    setIsConfirmModalOpen(false);
    setEventToFinishIndex(null);
  };

  // Handle form input changes (Tambah Event)
  const handleTambahInputChange = (e) => {
    const { name, value } = e.target;
    setTambahFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes (Tambah Event)
  const handleTambahCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTambahFormData((prev) => ({
      ...prev,
      barang: {
        ...prev.barang,
        [name]: checked,
      },
    }));
  };

  // Handle form submission (Tambah Event)
  const handleTambahSubmit = (e) => {
    e.preventDefault();
    const selectedItems = Object.keys(tambahFormData.barang)
      .filter((key) => tambahFormData.barang[key])
      .join(", ");
    const newEvent = {
      name: tambahFormData.nama || "Contoh: Banjir Bekasi",
      address:
        tambahFormData.alamat ||
        "Contoh: Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      endDate: tambahFormData.akhirPenerimaan || "20/03/2025",
      items: selectedItems || "Pakaian, Buku, Makanan, Elektronik",
      status: "Aktif",
    };
    setEvents((prev) => [...prev, newEvent]);
    toggleTambahModal(); // Close the modal after submission
  };

  // Handle form input changes (Ubah Data)
  const handleUbahInputChange = (e) => {
    const { name, value } = e.target;
    setUbahFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes (Ubah Data)
  const handleUbahCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUbahFormData((prev) => ({
      ...prev,
      barang: {
        ...prev.barang,
        [name]: checked,
      },
    }));
  };

  // Handle form submission (Ubah Data)
  const handleUbahSubmit = (e) => {
    e.preventDefault();
    const selectedItems = Object.keys(ubahFormData.barang)
      .filter((key) => ubahFormData.barang[key])
      .join(", ");
    const updatedEvent = {
      name: ubahFormData.nama,
      address: ubahFormData.alamat,
      endDate: ubahFormData.akhirPenerimaan,
      items: selectedItems || "Pakaian, Buku, Makanan, Elektronik",
      status: events[selectedEventIndex].status, // Preserve the original status
    };
    setEvents((prev) => {
      const updatedEvents = [...prev];
      updatedEvents[selectedEventIndex] = updatedEvent;
      return updatedEvents;
    });
    toggleUbahModal(null); // Close the modal after submission
  };

  // Handle pagination navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-[#F5E9D4] font-sans">
      <Head>
        <title>Kotak Peduli - Event</title>
        <meta name="description" content="Event page for Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-[#F5E9D4] border-b border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png" // Replace with your logo path
              alt="Kotak Peduli Logo"
              width={30}
              height={30}
            />
            <span className="text-lg font-semibold text-[#4A2C2A] tracking-wide">
              KOTAK PEDULI
            </span>
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="text-[#4A2C2A] text-sm hover:text-[#8B5A2B]">
              Barang Donasi
            </a>
            <a
              href="#"
              className="text-[#4A2C2A] text-sm font-bold border-b-2 border-[#4A2C2A]"
            >
              Event
            </a>
            <a href="#" className="text-[#4A2C2A] text-sm hover:text-[#8B5A2B]">
              Pos
            </a>
            <a href="#" className="text-[#4A2C2A] text-sm hover:text-[#8B5A2B]">
              Administrator
            </a>
          </nav>
        </div>
        <div>
          <Image
            src="/profile.png" // Replace with your profile icon path
            alt="Profile"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A]">
          EVENT
        </h1>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari berdasarkan nama event"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] text-sm"
            />
            <svg
              className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              /> */}
            </svg>
          </div>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAktif}
                onChange={(e) => handleFilterChange(setIsAktif)(e.target.checked)}
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Aktif</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelesai}
                onChange={(e) => handleFilterChange(setIsSelesai)(e.target.checked)}
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">
                Selesai
              </span>
            </label>
            <button
              onClick={toggleTambahModal}
              className="px-4 py-1.5 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] shadow-sm"
            >
              Tambah Event
            </button>
          </div>
        </div>

        {/* Tambah Event Modal */}
        {isTambahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">
                Tambah Event
              </h2>
              <form onSubmit={handleTambahSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={tambahFormData.nama}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Banjir Bekasi"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={tambahFormData.alamat}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Akhir Penerimaan
                  </label>
                  <input
                    type="text"
                    name="akhirPenerimaan"
                    value={tambahFormData.akhirPenerimaan}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: 20/03/2025"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Barang yang Dibutuhkan
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pakaian"
                        checked={tambahFormData.barang.pakaian}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Pakaian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="elektronik"
                        checked={tambahFormData.barang.elektronik}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">
                        Elektronik
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="mainan"
                        checked={tambahFormData.barang.mainan}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Mainan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="buku"
                        checked={tambahFormData.barang.buku}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Buku</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    Tambah Event
                  </button>
                  <button
                    type="button"
                    onClick={toggleTambahModal}
                    className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ubah Data Modal */}
        {isUbahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">
                Ubah Informasi Event
              </h2>
              <form onSubmit={handleUbahSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={ubahFormData.nama}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={ubahFormData.alamat}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Akhir Penerimaan
                  </label>
                  <input
                    type="text"
                    name="akhirPenerimaan"
                    value={ubahFormData.akhirPenerimaan}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Barang yang Dibutuhkan
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pakaian"
                        checked={ubahFormData.barang.pakaian}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Pakaian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="elektronik"
                        checked={ubahFormData.barang.elektronik}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">
                        Elektronik
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="mainan"
                        checked={ubahFormData.barang.mainan}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Mainan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="buku"
                        checked={ubahFormData.barang.buku}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Buku</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleUbahModal(null)}
                    className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal for "Selesai" */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-red-600 mb-4">
                Status Event (SELESAI)
              </h2>
              <p className="text-sm text-[#4A2C2A] mb-6">
                Status event yang telah diubah menjadi <span className="font-semibold">SELESAI</span>, akan ditampilkan dengan warna yang berbeda dari halaman yang ditampilkan kepada donatur dan tidak dapat dipilih akhir penerimaan. Pastikan event yang selesai sesuai dengan tanggal akhir penerimaan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmFinish}
                  className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={() => toggleConfirmModal(null)}
                  className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#F5E9D4] text-[#4A2C2A] font-semibold">
                <th className="p-3 w-1/6">NAMA</th>
                <th className="p-3 w-1/4">ALAMAT</th>
                <th className="p-3 w-1/6">AKHIR PENERIMAAN</th>
                <th className="p-3 w-1/4">JENIS BARANG</th>
                <th className="p-3 w-1/6">STATUS</th>
                <th className="p-3 w-1/12">MENU</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="p-3">{event.name}</td>
                    <td className="p-3">{event.address}</td>
                    <td className="p-3">{event.endDate}</td>
                    <td className="p-3">{event.items}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          event.status === "Aktif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="p-3 relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="text-[#4A2C2A] hover:text-[#8B5A2B]"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          /> */}
                        </svg>
                      </button>
                      {openDropdownIndex === index && (
                        <div className="absolute right-4 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                          <ul className="text-sm text-[#4A2C2A]">
                            <li
                              onClick={() => toggleUbahModal(indexOfFirstEvent + index)}
                              className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                            >
                              Ubah Data
                            </li>
                            <li
                              onClick={() => toggleConfirmModal(indexOfFirstEvent + index)}
                              className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                            >
                              Selesai
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-[#4A2C2A]">
                    Tidak ada event yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#8B5A2B] hover:text-white"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === page
                  ? "bg-[#4A2C2A] text-white"
                  : "border border-gray-300 text-[#4A2C2A] hover:bg-[#8B5A2B] hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-[#8B5A2B] hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}