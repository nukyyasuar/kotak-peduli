"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import Footer from "../footer/page"; // Verify this path is correct
import NavbarAfterLoginAdmin from "../../components/navbarAfterLoginAdmin"; // Verify this path is correct
import { Icon } from "@iconify/react"; // Ensure @iconify/react is installed

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
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
    if (index !== null && admins[index]) {
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
    if (!/^\S+@\S+\.\S+$/.test(tambahFormData.email)) {
      alert("Invalid email format");
      return;
    }
    setIsLoading(true);
    setAdmins((prev) => [...prev, tambahFormData]);
    toggleTambahModal();
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleUbahSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(ubahFormData.email)) {
      alert("Invalid email format");
      return;
    }
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
    if (!newRoleData.name.trim()) {
      alert("Role name cannot be empty");
      return;
    }
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

  const handleResetFilters = () => {
    setIsAdminUtama(false);
    setIsAdminDonasi(false);
    setIsAdminEvent(false);
    setIsAdminCabang(false);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4A2C2A] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5E9D4]">
      <Head>
        <title>Kotak Peduli - Administrator</title>
        <meta name="description" content="Administrator page for Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavbarAfterLoginAdmin />

      <main className="flex-grow px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A] uppercase">Administrator</h1>

        <div className="flex justify-between items-center mb-6">
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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleFilterDropdown}
                className="flex items-center px-4 py-1.5 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium bg-white"
              >
                Filter
                <Icon icon="mdi:chevron-down" className="ml-2 w-5 h-5" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <label className="flex items-center space-x-2 px-4 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdminUtama}
                      onChange={(e) => handleFilterChange(setIsAdminUtama)(e.target.checked)}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Utama</span>
                  </label>
                  <label className="flex items-center space-x-2 px-4 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdminDonasi}
                      onChange={(e) => handleFilterChange(setIsAdminDonasi)(e.target.checked)}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 px-4 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdminEvent}
                      onChange={(e) => handleFilterChange(setIsAdminEvent)(e.target.checked)}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Event</span>
                  </label>
                  <label className="flex items-center space-x-2 px-4 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdminCabang}
                      onChange={(e) => handleFilterChange(setIsAdminCabang)(e.target.checked)}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Admin Cabang / Drop Point</span>
                  </label>
                  <div className="flex justify-between px-4 py-2">
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium"
                    >
                      Filter
                    </button>
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleTambahModal}
              className="px-4 py-1.5 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] shadow-sm uppercase"
            >
              Tambah Administrator
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
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

        {/* Tambah Administrator Modal */}
        {isTambahModalOpen && (
          <div className="fixed inset-0 backkdrop-brightness-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Tambah Administrator</h2>
              <form onSubmit={handleTambahSubmit}>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="tambah-nama">Nama</label>
                  <input
                    id="tambah-nama"
                    type="text"
                    name="nama"
                    value={tambahFormData.nama}
                    onChange={handleTambahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="tambah-email">Email</label>
                  <input
                    id="tambah-email"
                    type="email"
                    name="email"
                    value={tambahFormData.email}
                    onChange={handleTambahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="tambah-noTelepon">No. Telepon</label>
                  <input
                    id="tambah-noTelepon"
                    type="text"
                    name="noTelepon"
                    value={tambahFormData.noTelepon}
                    onChange={handleTambahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="tambah-penempatan">Penempatan</label>
                  <input
                    id="tambah-penempatan"
                    type="text"
                    name="penempatan"
                    value={tambahFormData.penempatan}
                    onChange={handleTambahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="tambah-role">Role</label>
                  <select
                    id="tambah-role"
                    name="role"
                    value={tambahFormData.role}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Pilih Role</option>
                    <option value="Admin Utama">Admin Utama</option>
                    <option value="Admin Donasi">Admin Donasi</option>
                    <option value="Admin Event">Admin Event</option>
                    <option value="Admin Cabang/Drop Point">Admin Cabang/Drop Point</option>
                    {customRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                    <option value="Buat Role Baru">Buat Role Baru</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleTambahModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#4A2C2A]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A2C2A] text-white rounded-lg"
                  >
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Ubah Data Modal */}
        {isUbahModalOpen && (
          <div className="fixed inset-0 backdrop:brightness-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Ubah Data Administrator</h2>
              <form onSubmit={handleUbahSubmit}>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="ubah-nama">Nama</label>
                  <input
                    id="ubah-nama"
                    type="text"
                    name="nama"
                    value={ubahFormData.nama}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="ubah-email">Email</label>
                  <input
                    id="ubah-email"
                    type="email"
                    name="email"
                    value={ubahFormData.email}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="ubah-noTelepon">No. Telepon</label>
                  <input
                    id="ubah-noTelepon"
                    type="text"
                    name="noTelepon"
                    value={ubahFormData.noTelepon}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="ubah-penempatan">Penempatan</label>
                  <input
                    id="ubah-penempatan"
                    type="text"
                    name="penempatan"
                    value={ubahFormData.penempatan}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="ubah-role">Role</label>
                  <select
                    id="ubah-role"
                    name="role"
                    value={ubahFormData.role}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Pilih Role</option>
                    <option value="Admin Utama">Admin Utama</option>
                    <option value="Admin Donasi">Admin Donasi</option>
                    <option value="Admin Event">Admin Event</option>
                    <option value="Admin Cabang/Drop Point">Admin Cabang/Drop Point</option>
                    {customRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                    <option value="Buat Role Baru">Buat Role Baru</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => toggleUbahModal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#4A2C2A]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A2C2A] text-white rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Buat Role Baru Modal */}
        {isCreateRoleModalOpen && (
          <div className="fixed inset-0 backdrop-brigtness-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Buat Role Baru</h2>
              <form onSubmit={handleCreateRoleSubmit}>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1" htmlFor="role-name">Nama Role</label>
                  <input
                    id="role-name"
                    type="text"
                    name="name"
                    value={newRoleData.name}
                    onChange={handleNewRoleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-2">Izin Akses</label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      name="barangDonasi"
                      checked={newRoleData.permissions.barangDonasi}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Barang Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      name="melihatDataDonasi"
                      checked={newRoleData.permissions.melihatDataDonasi}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Melihat Data Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      name="mengaturTanggalPenjemputan"
                      checked={newRoleData.permissions.mengaturTanggalPenjemputan}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Mengatur Tanggal Penjemputan</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      name="mengubahStatusDonasi"
                      checked={newRoleData.permissions.mengubahStatusDonasi}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Mengubah Status Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      name="mengaturTanggalPengiriman"
                      checked={newRoleData.permissions.mengaturTanggalPengiriman}
                      onChange={handleNewRoleInputChange}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Mengatur Tanggal Pengiriman</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={toggleCreateRoleModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#4A2C2A]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A2C2A] text-white rounded-lg"
                  >
                    Buat Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}