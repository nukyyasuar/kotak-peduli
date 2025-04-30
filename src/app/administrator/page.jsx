"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import Footer from "../footer/page";
import NavbarAfterLoginAdmin from "../../components/navbarAfterLoginAdmin";
import { Icon } from "@iconify/react";

export default function AdminPage() {
  // Static admin data
  const [admins, setAdmins] = useState([
    {
      nama: "Matthew Emmanuel",
      email: "matthew.emmanuel@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Utama",
    },
    {
      nama: "John Doe",
      email: "john.doe@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Donasi",
    },
    {
      nama: "Jane Smith",
      email: "jane.smith@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Event",
    },
    {
      nama: "Alice Brown",
      email: "alice.brown@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Cabang/Drop Point",
    },
  ]);

  // State for filters
  const [isAdminUtama, setIsAdminUtama] = useState(false);
  const [isAdminDonasi, setIsAdminDonasi] = useState(false);
  const [isAdminEvent, setIsAdminEvent] = useState(false);
  const [isAdminCabang, setIsAdminCabang] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for modals and dropdowns
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);

  // State for form data
  const [tambahFormData, setTambahFormData] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    penempatan: "",
    role: "",
  });

  const [ubahFormData, setUbahFormData] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    penempatan: "",
    role: "",
  });

  // State for custom roles
  const [customRoles, setCustomRoles] = useState([]);
  const [newRoleData, setNewRoleData] = useState({
    name: "",
    permissions: {
      barangDonasi: false,
      melihatDataDonasi: false,
      mengaturTanggalPenjemputan: false,
      mengubahStatusDonasi: false,
      mengaturTanggalPengiriman: false,
    },
  });

  // Filter admins based on role and search query
  const filteredAdmins = admins.filter((admin) => {
    let matchesRole = false;
    if (!isAdminUtama && !isAdminDonasi && !isAdminEvent && !isAdminCabang) {
      matchesRole = true;
    } else {
      matchesRole =
        (isAdminUtama && admin.role === "Admin Utama") ||
        (isAdminDonasi && admin.role === "Admin Donasi") ||
        (isAdminEvent && admin.role === "Admin Event") ||
        (isAdminCabang && admin.role === "Admin Cabang/Drop Point") ||
        customRoles.includes(admin.role);
    }

    const matchesSearch = searchQuery
      ? admin.nama.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesRole && matchesSearch;
  });

  // Loading effect for filtering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, isAdminUtama, isAdminDonasi, isAdminEvent, isAdminCabang, admins]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  // Handlers
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
        email: "",
        noTelepon: "",
        penempatan: "",
        role: "",
      });
    }
  };

  const toggleUbahModal = (index) => {
    if (index !== null) {
      const admin = admins[index];
      setUbahFormData({
        nama: admin.nama,
        email: admin.email,
        noTelepon: admin.noTelepon,
        penempatan: admin.penempatan,
        role: admin.role,
      });
      setSelectedAdminIndex(index);
    }
    setIsUbahModalOpen(!isUbahModalOpen);
    setOpenDropdownIndex(null);
  };

  const toggleCreateRoleModal = () => {
    setIsCreateRoleModalOpen(!isCreateRoleModalOpen);
    if (isCreateRoleModalOpen) {
      setNewRoleData({
        name: "",
        permissions: {
          barangDonasi: false,
          melihatDataDonasi: false,
          mengaturTanggalPenjemputan: false,
          mengubahStatusDonasi: false,
          mengaturTanggalPengiriman: false,
        },
      });
    }
  };

  const handleTambahInputChange = (e) => {
    const { name, value } = e.target;
    setTambahFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUbahInputChange = (e) => {
    const { name, value } = e.target;
    setUbahFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    if (role === "Buat Role Baru") {
      toggleCreateRoleModal();
    } else {
      setTambahFormData((prev) => ({ ...prev, role }));
      setUbahFormData((prev) => ({ ...prev, role }));
    }
  };

  const handleNewRoleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setNewRoleData((prev) => ({
        ...prev,
        permissions: { ...prev.permissions, [name]: checked },
      }));
    } else {
      setNewRoleData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTambahSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAdmins((prev) => [...prev, tambahFormData]);
    toggleTambahModal();
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleUbahSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAdmins((prev) => {
      const updatedAdmins = [...prev];
      updatedAdmins[selectedAdminIndex] = ubahFormData;
      return updatedAdmins;
    });
    toggleUbahModal(null);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    setCustomRoles((prev) => [...prev, newRoleData.name]);
    setTambahFormData((prev) => ({ ...prev, role: newRoleData.name }));
    setUbahFormData((prev) => ({ ...prev, role: newRoleData.name }));
    toggleCreateRoleModal();
  };

  const handleDelete = (index) => {
    setAdmins((prev) => prev.filter((_, i) => i !== index));
    setOpenDropdownIndex(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4A2C2A] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5E9D4] font-sans">
      <Head>
        <title>Kotak Peduli - Administrator</title>
        <meta name="description" content="Administrator page for Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarAfterLoginAdmin />

      <main className="px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A] uppercase">Administrator</h1>

        <div className="flex justify-between items-center mb-6 text-[#C2C2C2]">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search Course"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pl-10 rounded-lg shadow-sm focus:outline-none bg-white text-sm text-black"
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
                checked={isAdminUtama}
                onChange={(e) => handleFilterChange(setIsAdminUtama)(e.target.checked)}
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Admin Utama</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdminDonasi}
                onChange={(e) => handleFilterChange(setIsAdminDonasi)(e.target.checked)}
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Admin Donasi</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdminEvent}
                onChange={(e) => handleFilterChange(setIsAdminEvent)(e.target.checked)}
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Admin Event</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdminCabang}
                onChange={(e) => handleFilterChange(setIsAdminCabang)(e.target.checked)}
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Admin Cabang</span>
            </label>
            <button
              onClick={toggleTambahModal}
              className="px-4 py-1.5 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] shadow-sm uppercase"
            >
              Tambah Administrator
            </button>
          </div>
        </div>

        {/* Tambah Modal */}
        {isTambahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">Tambah Administrator</h2>
              <form onSubmit={handleTambahSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={tambahFormData.nama}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Matthew Emmanuel"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={tambahFormData.email}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: matthew.emmanuel@email.com"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">No. Telepon</label>
                  <input
                    type="text"
                    name="noTelepon"
                    value={tambahFormData.noTelepon}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: +6281212312312"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Penempatan</label>
                  <input
                    type="text"
                    name="penempatan"
                    value={tambahFormData.penempatan}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Cabang Bekasi"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Role</label>
                  <div
                    onClick={() => setOpenDropdownIndex(openDropdownIndex === "role" ? null : "role")}
                    className="border border-gray-300 rounded-lg p-2 w-full text-[#4A2C2A] text-sm flex justify-between items-center cursor-pointer"
                  >
                    <span>{tambahFormData.role || "Pilih role yang sesuai"}</span>
                    <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                  </div>
                  {openDropdownIndex === "role" && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleRoleSelect("Admin Utama")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Utama
                      </button>
                      <button
                        onClick={() => handleRoleSelect("Admin Donasi")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Donasi
                      </button>
                      <button
                        onClick={() => handleRoleSelect("Admin Event")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Event
                      </button>
                      <button
                        onClick={() => handleRoleSelect("Admin Cabang/Drop Point")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Cabang/Drop Point
                      </button>
                      {customRoles.map((role, index) => (
                        <button
                          key={index}
                          onClick={() => handleRoleSelect(role)}
                          className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                        >
                          {role}
                        </button>
                      ))}
                      <button
                        onClick={() => handleRoleSelect("Buat Role Baru")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Buat Role Baru
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    Tambah Administrator
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

        {/* Ubah Modal */}
        {isUbahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">Ubah Data Administrator</h2>
              <form onSubmit={handleUbahSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={ubahFormData.nama}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={ubahFormData.email}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">No. Telepon</label>
                  <input
                    type="text"
                    name="noTelepon"
                    value={ubahFormData.noTelepon}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Penempatan</label>
                  <input
                    type="text"
                    name="penempatan"
                    value={ubahFormData.penempatan}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Role</label>
                  <div
                    onClick={() => setOpenDropdownIndex(openDropdownIndex === "role-ubah" ? null : "role-ubah")}
                    className="border border-gray-300 rounded-lg p-2 w-full text-[#4A2C2A] text-sm flex justify-between items-center cursor-pointer"
                  >
                    <span>{ubahFormData.role || "Pilih role yang sesuai"}</span>
                    <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                  </div>
                  {openDropdownIndex === "role-ubah" && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleRoleSelect("Admin Utama")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Utama
                      </button>
                      <button
                        onClick={() => handleRoleSelect("Admin Donasi")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Donasi
                      </button>
                      <button
                        onClick={() => handleRoleSelect("Admin Event")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Event
                      </button>
                      <button
                        onClick={() => handleRoleSelect("Admin Cabang/Drop Point")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Admin Cabang/Drop Point
                      </button>
                      {customRoles.map((role, index) => (
                        <button
                          key={index}
                          onClick={() => handleRoleSelect(role)}
                          className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                        >
                          {role}
                        </button>
                      ))}
                      <button
                        onClick={() => handleRoleSelect("Buat Role Baru")}
                        className="block w-full text-left px-4 py-2 text-[#4A2C2A] text-sm hover:bg-[#F5E9D4]"
                      >
                        Buat Role Baru
                      </button>
                    </div>
                  )}
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

        {/* Create Role Modal */}
        {isCreateRoleModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">Buat Role Baru</h2>
              <form onSubmit={handleCreateRoleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Nama Role</label>
                  <input
                    type="text"
                    name="name"
                    value={newRoleData.name}
                    onChange={handleNewRoleInputChange}
                    placeholder="Contoh: Custom Role"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Pilih Akses</label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="barangDonasi"
                      checked={newRoleData.permissions.barangDonasi}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-sm text-[#4A2C2A]">Barang Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="melihatDataDonasi"
                      checked={newRoleData.permissions.melihatDataDonasi}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-sm text-[#4A2C2A]">Melihat Data Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="mengaturTanggalPenjemputan"
                      checked={newRoleData.permissions.mengaturTanggalPenjemputan}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-sm text-[#4A2C2A]">Mengatur Tanggal Penjemputan</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="mengubahStatusDonasi"
                      checked={newRoleData.permissions.mengubahStatusDonasi}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-sm text-[#4A2C2A]">Mengubah Status Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="mengaturTanggalPengiriman"
                      checked={newRoleData.permissions.mengaturTanggalPengiriman}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-sm text-[#4A2C2A]">Mengatur Tanggal Pengiriman</span>
                  </label>
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
                    onClick={toggleCreateRoleModal}
                    className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white text-[#4A2C2A] font-semibold uppercase">
                  <th className="p-3 w-1/5">Nama</th>
                  <th className="p-3 w-1/5">Email</th>
                  <th className="p-3 w-1/5">No. Telepon</th>
                  <th className="p-3 w-1/5">Penempatan</th>
                  <th className="p-3 w-1/5">Role</th>
                  <th className="p-3 w-1/12">Menu</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((admin, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-3 text-black">{admin.nama}</td>
                      <td className="p-3 text-black">{admin.email}</td>
                      <td className="p-3 text-black">{admin.noTelepon}</td>
                      <td className="p-3 text-black">{admin.penempatan}</td>
                      <td className="p-3 text-black">{admin.role}</td>
                      <td className="p-3 relative">
                        <button
                          onClick={() => toggleDropdown(indexOfFirstItem + index)}
                          className="text-[#4A2C2A] hover:text-[#8B5A2B]"
                          aria-label="Menu"
                        >
                          <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                        </button>
                        {openDropdownIndex === indexOfFirstItem + index && (
                          <div className="absolute right-4 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <ul className="text-sm text-[#4A2C2A]">
                              <li
                                onClick={() => toggleUbahModal(indexOfFirstItem + index)}
                                className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                              >
                                Ubah Data
                              </li>
                              <li
                                onClick={() => handleDelete(indexOfFirstItem + index)}
                                className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                              >
                                Hapus Data
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
                      Tidak ada data yang sesuai dengan pencarian.
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
              className={`px-3 py-1 border border-[#4A2C2A] rounded-lg text-[#4A2C2A] text-sm ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#8B5A2B] hover:text-white"
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
                    : "border border-[#4A2C2A] text-[#4A2C2A] hover:bg-[#8B5A2B] hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border border-[#4A2C2A] rounded-lg text-[#4A2C2A] text-sm ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#8B5A2B] hover:text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}