"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import NavbarAfterLogin from "../../components/navbarAfterLogin";
import Footer from "../footer/page";
import eventService from "../../service/eventService";
import {format} from 'date-fns';
// import {utcToZonedTime} from 'date-fns-tz';
import { toZonedTime } from 'date-fns-tz';
import {formatInTimeZone} from 'date-fns-tz'


export default function Home() {
  const [isAktif, setIsAktif] = useState(false);
  const [isSelesai, setIsSelesai] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventToFinishId, setEventToFinishId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);
  const eventsPerPage = 10;

  const [tambahFormData, setTambahFormData] = useState({
    nama: "",
    alamat: "",
    akhirPenerimaan: "",
    barang: { pakaian: false, elektronik: false, mainan: false, buku: false },
  });

  const [ubahFormData, setUbahFormData] = useState({
    nama: "",
    alamat: "",
    akhirPenerimaan: "",
    barang: { pakaian: false, elektronik: false, mainan: false, buku: false },
  });

  const [events, setEvents] = useState([]);
  const timeZone = toZonedTime(new Date(), 'Asia/Jakarta')

  // Fetch events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileData = await eventService.getUserCollectionCenter();
      const centerId = profileData?.id;
      console.log("Collection Center ID:", centerId);
      if (!centerId) throw new Error("No collection center ID found in profile");

      const data = await eventService.getEvents(centerId);
      console.log("Raw API Events:", data);

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response: Expected an array of events");
      }

      const mappedEvents = data.map(({id, name, address, endDate, types, isActive}) => {
        // if (!event.id || !event.nama || !event.alamat || !event.akhirPenerimaan || !event.barang) {
        //   console.warn("Invalid event data:", event);
        //   return null;
        // }
        console.log("Event Data:", {id, name, address, endDate, types, isActive});
        return {
           id,
           name,
           address,
           endDate: endDate !== null && formatInTimeZone(new Date(endDate || null ), 'Asia/Jakarta', 'dd/MM/yyyy'),
          types,
          status: !isActive ? "Selesai" : "Aktif",
        };
      }).filter((event) => event !== null);

      console.log("Mapped Events:", mappedEvents);
      setEvents(mappedEvents);
      if (mappedEvents.length === 0) {
        setError("No events found for this collection center.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.meta?.message?.join(", ") || err.message || "Failed to fetch events";
      setError(errorMessage);
      console.error("Fetch Events Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    let matchesStatus = false;
    if (!isAktif && !isSelesai) matchesStatus = true;
    else if (isAktif && isSelesai) matchesStatus = true;
    else if (isAktif) matchesStatus = event.status === "Aktif";
    else if (isSelesai) matchesStatus = event.status === "Selesai";

    const matchesSearch = searchQuery
      ? event.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.endDate);
    const dateB = new Date(b.endDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const toggleTambahModal = () => {
    setIsTambahModalOpen(!isTambahModalOpen);
    if (isTambahModalOpen) {
      setTambahFormData({
        nama: "",
        alamat: "",
        akhirPenerimaan: "",
        barang: { pakaian: false, elektronik: false, mainan: false, buku: false },
      });
    }
  };

  const toggleUbahModal = (index) => {
    if (index !== null && currentEvents[index]) {
      const event = currentEvents[index];
      setUbahFormData({
        nama: event.name,
        alamat: event.address,
        akhirPenerimaan: event.endDate,
        barang: {
          pakaian: event.items.includes("pakaian"),
          elektronik: event.items.includes("elektronik"),
          mainan: event.items.includes("mainan"),
          buku: event.items.includes("buku"),
        },
      });
      setSelectedEventId(event.id);
    }
    setIsUbahModalOpen(!isUbahModalOpen);
    setOpenDropdownIndex(null);
  };

  const toggleConfirmModal = (index) => {
    if (index !== null && currentEvents[index]) {
      setEventToFinishId(currentEvents[index].id);
    }
    setIsConfirmModalOpen(!isConfirmModalOpen);
    setOpenDropdownIndex(null);
  };

  const handleConfirmFinish = async () => {
    if (eventToFinishId !== null) {
      setIsLoading(true);
      try {
        const profileData = await eventService.getUserCollectionCenter();
        const centerId = profileData.id;
        if (!centerId) throw new Error("No collection center ID found in profile");
        await eventService.finishEvent(centerId, eventToFinishId);
        await fetchEvents();
        setError(null);
      } catch (err) {
        setError("Failed to finish event. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setEventToFinishId(null);
      }
    }
  };

  const handleTambahInputChange = (e) => {
    const { name, value } = e.target;
    setTambahFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTambahCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTambahFormData((prev) => ({
      ...prev,
      barang: { ...prev.barang, [name]: checked },
    }));
  };

  const handleTambahSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profileData = await eventService.getUserCollectionCenter();
      const centerId = profileData.id;
      if (!centerId) throw new Error("No collection center ID found in profile");
      const eventData = {
        nama: tambahFormData.nama || "Contoh: Banjir Bekasi",
        alamat: tambahFormData.alamat || "Contoh: Jl. Lorem ipsum...",
        akhirPenerimaan: tambahFormData.akhirPenerimaan || "2025-03-20",
        barang: tambahFormData.barang,
      };
      await eventService.createEvent(centerId, eventData);
      await fetchEvents();
      toggleTambahModal();
      setError(null);
    } catch (err) {
      setError("Failed to create event. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUbahInputChange = (e) => {
    const { name, value } = e.target;
    setUbahFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUbahCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUbahFormData((prev) => ({
      ...prev,
      barang: { ...prev.barang, [name]: checked },
    }));
  };

  const handleUbahSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profileData = await eventService.getUserCollectionCenter();
      const centerId = profileData.id;
      if (!centerId) throw new Error("No collection center ID found in profile");
      const eventData = {
        nama: ubahFormData.nama,
        alamat: ubahFormData.alamat,
        akhirPenerimaan: ubahFormData.akhirPenerimaan,
        barang: ubahFormData.barang,
      };
      await eventService.updateEvent(centerId, selectedEventId, eventData);
      await fetchEvents();
      toggleUbahModal(null);
      setError(null);
    } catch (err) {
      setError("Failed to update event. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#543A14] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5E9D4]">
      <div className="sticky top-0 z-50">
        <NavbarAfterLogin />
      </div>
      <main className="flex-grow px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A] uppercase">Event</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6 text-[#C2C2C2]">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pl-10 rounded-lg shadow-sm focus:outline-none bg-white text-sm"
            />
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C2C2C2] w-5 h-5"
            />
          </div>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAktif}
                onChange={(e) => handleFilterChange(setIsAktif)(e.target.checked)}
                className="h-4 w-4 accent-[#543A14]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Aktif</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelesai}
                onChange={(e) => handleFilterChange(setIsSelesai)(e.target.checked)}
                className="h-4 w-4 accent-[#543A14]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Selesai</span>
            </label>
            <button
              onClick={toggleTambahModal}
              className="px-4 py-1.5 bg-[#543A14] text-white rounded-lg text-sm font-bold hover:bg-[#8B5A2B]"
            >
              Tambah Event
            </button>
          </div>
        </div>

        {isTambahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#543A14] mb-4">Tambah Event</h2>
              <form onSubmit={handleTambahSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#543A14] mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={tambahFormData.nama}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Banjir Bekasi"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    name="alamat"
                    value={tambahFormData.alamat}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Jl. Lorem ipsum..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Akhir Penerimaan (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    name="akhirPenerimaan"
                    value={tambahFormData.akhirPenerimaan}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: 2025-03-20"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Barang yang Dibutuhkan</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pakaian"
                        checked={tambahFormData.barang.pakaian}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Pakaian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="elektronik"
                        checked={tambahFormData.barang.elektronik}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Elektronik</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="mainan"
                        checked={tambahFormData.barang.mainan}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Mainan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="buku"
                        checked={tambahFormData.barang.buku}
                        onChange={handleTambahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#4A2C2A]">Buku</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#543A14] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
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

        {isUbahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">Ubah Informasi Event</h2>
              <form onSubmit={handleUbahSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={ubahFormData.nama}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    name="alamat"
                    value={ubahFormData.alamat}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1">Akhir Penerimaan (YYYY-MM-DD)</label>
                  <input
                    type="text"
                    name="akhirPenerimaan"
                    value={ubahFormData.akhirPenerimaan}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1">Barang yang Dibutuhkan</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pakaian"
                        checked={ubahFormData.barang.pakaian}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Pakaian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="elektronik"
                        checked={ubahFormData.barang.elektronik}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Elektronik</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="mainan"
                        checked={ubahFormData.barang.mainan}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Mainan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="buku"
                        checked={ubahFormData.barang.buku}
                        onChange={handleUbahCheckboxChange}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Buku</span>
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

        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-red-600 mb-4">Status Event (SELESAI)</h2>
              <p className="text-sm text-[#4A2C2A] mb-6">
                Status event yang telah diubah menjadi <span className="font-semibold">SELESAI</span>,
                akan ditampilkan dengan warna yang berbeda dari halaman yang ditampilkan kepada donatur
                dan tidak dapat dipilih akhir penerimaan. Pastikan event yang selesai sesuai dengan
                tanggal akhir penerimaan.
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

        <div className="bg-white rounded-lg shadow-md">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white text-[#4A2C2A] font-bold">
                  <th className="p-3 w-1/6">Nama</th>
                  <th className="p-3 w-1/4">Alamat</th>
                  <th className="p-3 w-1/6 cursor-pointer" onClick={handleSort}>
                    <div className="flex items-center">
                      Akhir Penerimaan
                      <Icon
                        icon={sortOrder === "asc" ? "mdi:sort-ascending" : "mdi:sort-descending"}
                        className="ml-2 w-4 h-4"
                      />
                    </div>
                  </th>
                  <th className="p-3 w-1/4">Jenis Barang</th>
                  <th className="p-3 w-1/6">Status</th>
                  <th className="p-3 w-1/12">Menu</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.length > 0 ? (
                  currentEvents.map((event, index) => (
                    <tr key={event.id} className="border-t border-gray-200">
                      <td className="p-3 text-black">{event.name}</td>
                      <td className="p-3 text-black">{event.address}</td>
                      <td className="p-3 text-black">{event.endDate}</td>
                      <td className="p-3 text-black">{event.types}</td>
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
                          aria-label="Menu"
                        >
                          <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                        </button>
                        {openDropdownIndex === index && (
                          <div className="absolute right-4 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <ul className="text-sm text-[#4A2C2A]">
                              <li
                                onClick={() => toggleUbahModal(index)}
                                className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                              >
                                Ubah Data
                              </li>
                              <li
                                onClick={() => toggleConfirmModal(index)}
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
                    <td colSpan="6" className="p-3 text-center text-black">
                      Tidak ada event yang sesuai dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

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
      </main>

      <Footer />
    </div>
  );
}