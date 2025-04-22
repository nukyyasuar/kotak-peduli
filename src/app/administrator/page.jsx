'use client'

import Head from "next/head";
import Link from "next/link";
import Footer from "../footer/page";
import NavbarAfterLoginAdmin from "../navbarAfterLoginAdmin/page";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function AdminPage() {
  // Static data for the table
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
    {
      nama: "Matthew Emmanuel",
      email: "matthew.emmanuel@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Utama",
    },
    {
      nama: "Matthew Emmanuel",
      email: "matthew.emmanuel@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Utama",
    },
    {
      nama: "Matthew Emmanuel",
      email: "matthew.emmanuel@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Utama",
    },
    {
      nama: "Matthew Emmanuel",
      email: "matthew.emmanuel@email.com",
      noTelepon: "+6281212312312",
      penempatan: "Cabang Bekasi",
      role: "Admin Utama",
    },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for filter dropdown visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    adminUtama: false,
    adminDonasi: false,
    adminEvent: false,
    adminCabang: false,
  });

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for menu dropdown visibility and selected row
  const [menuOpen, setMenuOpen] = useState(null);

  // State for add/edit modal visibility and form data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    penempatan: "",
    role: "",
  });

  // State for role dropdown in form
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // State for custom roles
  const [customRoles, setCustomRoles] = useState([]);

  // State for create role modal visibility and role form data
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
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

  // Toggle filter dropdown
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle filter checkbox change
  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle menu dropdown for a specific row
  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      nama: "",
      email: "",
      noTelepon: "",
      penempatan: "",
      role: "",
    });
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (index) => {
    setEditIndex(index);
    setFormData(admins[index]);
    setIsEditModalOpen(true);
    setMenuOpen(null);
  };

  // Close add/edit modal
  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditIndex(null);
  };

  // Handle form input change for add/edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for adding a new admin
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setAdmins([...admins, formData]);
    closeModal();
  };

  // Handle form submission for editing an admin
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedAdmins = [...admins];
    updatedAdmins[editIndex] = formData;
    setAdmins(updatedAdmins);
    closeModal();
  };

  // Toggle role dropdown in form
  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    if (role === "Buat Role Baru") {
      setIsCreateRoleModalOpen(true);
      setIsRoleDropdownOpen(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        role,
      }));
      setIsRoleDropdownOpen(false);
    }
  };

  // Handle input change for create role form
  const handleNewRoleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setNewRoleData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [name]: checked,
        },
      }));
    } else {
      setNewRoleData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle create role form submission
  const handleCreateRoleSubmit = (e) => {
    e.preventDefault();
    setCustomRoles([...customRoles, newRoleData.name]);
    setFormData((prev) => ({
      ...prev,
      role: newRoleData.name,
    }));
    setIsCreateRoleModalOpen(false);
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
  };

  // Close create role modal
  const closeCreateRoleModal = () => {
    setIsCreateRoleModalOpen(false);
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
  };

  // Apply filters and search to the admin data
  const filteredAdmins = admins
    .filter((admin) => {
      // Apply role filters
      if (
        !selectedFilters.adminUtama &&
        !selectedFilters.adminDonasi &&
        !selectedFilters.adminEvent &&
        !selectedFilters.adminCabang
      ) {
        return true; // Show all if no filters are selected
      }
      return (
        (selectedFilters.adminUtama && admin.role === "Admin Utama") ||
        (selectedFilters.adminDonasi && admin.role === "Admin Donasi") ||
        (selectedFilters.adminEvent && admin.role === "Admin Event") ||
        (selectedFilters.adminCabang && admin.role === "Admin Cabang/Drop Point")
      );
    })
    .filter((admin) => {
      // Apply search filter
      if (!searchQuery) return true; // Show all if search query is empty
      return admin.nama.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Pagination logic
  const totalItems = filteredAdmins.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAdmins.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Spinner component
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

      {/* Navigation Bar */}
      <NavbarAfterLoginAdmin />

      {/* Main Content */}
      <main className="px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A]">ADMINISTRATOR</h1>

        <div className="flex justify-between items-center mb-6 text-black">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari berdasarkan nama"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] text-sm"
            />
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A2C2A] w-5 h-5"
            />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={toggleFilter}
                className="px-4 py-1.5 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4] flex items-center"
              >
                Filter <Icon icon="mdi:chevron-down" className="ml-2 w-5 h-5" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="adminUtama"
                      checked={selectedFilters.adminUtama}
                      onChange={() => handleFilterChange("adminUtama")}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Utama</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="adminDonasi"
                      checked={selectedFilters.adminDonasi}
                      onChange={() => handleFilterChange("adminDonasi")}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="adminEvent"
                      checked={selectedFilters.adminEvent}
                      onChange={() => handleFilterChange("adminEvent")}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Event</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      id="adminCabang"
                      checked={selectedFilters.adminCabang}
                      onChange={() => handleFilterChange("adminCabang")}
                      className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Cabang/Drop Point</span>
                  </label>
                  <button
                    onClick={toggleFilter}
                    className="w-full py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    Terapkan Filter
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-1.5 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] shadow-sm"
            >
              Tambah Administrator
            </button>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">
                {isAddModalOpen ? "Tambah Administrator" : "Ubah Data"}
              </h2>
              <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                    value={formData.noTelepon}
                    onChange={handleInputChange}
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
                    value={formData.penempatan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Cabang Bekasi"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    required
                  />
                </div>
                <div className="mb-6 relative">
                  <label className="block text-sm text-[#4A2C2A] mb-1">Role</label>
                  <div
                    onClick={toggleRoleDropdown}
                    className="border border-gray-300 rounded-lg p-2 w-full text-[#4A2C2A] text-sm flex justify-between items-center cursor-pointer"
                  >
                    <span>{formData.role || "Pilih role yang sesuai"}</span>
                    <Icon icon="mdi:chevron-down" className="w-5 h-5" />
                  </div>
                  {isRoleDropdownOpen && (
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
                    type="button"
                    onClick={closeModal}
                    className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    {isAddModalOpen ? "Tambah Administrator" : "Simpan"}
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
                    type="button"
                    onClick={closeCreateRoleModal}
                    className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#F5E9D4] text-[#4A2C2A] font-semibold">
                <th className="p-3">NAMA</th>
                <th className="p-3">EMAIL</th>
                <th className="p-3">NO. TELEPON</th>
                <th className="p-3">PENEMPATAN</th>
                <th className="p-3">ROLE</th>
                <th className="p-3">MENU</th>
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
                        onClick={() => toggleMenu(startIndex + index)}
                        className="text-[#4A2C2A] hover:text-[#8B5A2B]"
                        aria-label="Menu"
                      >
                        <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                      </button>
                      {menuOpen === (startIndex + index) && (
                        <div className="absolute right-4 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                          <ul className="text-sm text-[#4A2C2A]">
                            <li
                              onClick={() => openEditModal(startIndex + index)}
                              className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                            >
                              Ubah Data
                            </li>
                            <li
                              onClick={() => {
                                setAdmins(admins.filter((_, i) => i !== (startIndex + index)));
                                setMenuOpen(null);
                              }}
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
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm ${
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
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#8B5A2B] hover:text-white"
            }`}
          >
            Next
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}