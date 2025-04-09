'use client'

// pages/admin.js
import Link from "next/link";
import Footer from "../footer/page";
import NavbarAfterLoginAdmin from "../navbarAfterLoginAdmin/page";
import { useState } from "react";

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

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Navigation Bar */}
      <NavbarAfterLoginAdmin />

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Administrator</h2>
            <button
              onClick={openAddModal}
              className="bg-[#F5E6CC] text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-[#E8D7B0] transition"
            >
              Tambah Administrator
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search courses"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border rounded-lg p-2 pl-10 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5E6CC]"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <div className="relative">
              <button
                onClick={toggleFilter}
                className="border border-gray-300 rounded-lg p-2 flex items-center text-gray-600 hover:bg-gray-100 transition"
              >
                Filter <span className="ml-2">▼</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="adminUtama"
                      checked={selectedFilters.adminUtama}
                      onChange={() => handleFilterChange("adminUtama")}
                      className="mr-2"
                    />
                    <label htmlFor="adminUtama" className="text-gray-600">
                      Admin Utama
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="adminDonasi"
                      checked={selectedFilters.adminDonasi}
                      onChange={() => handleFilterChange("adminDonasi")}
                      className="mr-2"
                    />
                    <label htmlFor="adminDonasi" className="text-gray-600">
                      Admin Donasi
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="adminEvent"
                      checked={selectedFilters.adminEvent}
                      onChange={() => handleFilterChange("adminEvent")}
                      className="mr-2"
                    />
                    <label htmlFor="adminEvent" className="text-gray-600">
                      Admin Event
                    </label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="adminCabang"
                      checked={selectedFilters.adminCabang}
                      onChange={() => handleFilterChange("adminCabang")}
                      className="mr-2"
                    />
                    <label htmlFor="adminCabang" className="text-gray-600">
                      Admin Cabang/Drop Point
                    </label>
                  </div>
                  <button
                    onClick={toggleFilter}
                    className="w-full bg-[#F5E6CC] text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-[#E8D7B0] transition"
                  >
                    Filter
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="p-3 font-semibold text-gray-700">Nama</th>
                  <th className="p-3 font-semibold text-gray-700">Email</th>
                  <th className="p-3 font-semibold text-gray-700">No. Telepon</th>
                  <th className="p-3 font-semibold text-gray-700">Penempatan</th>
                  <th className="p-3 font-semibold text-gray-700">Role</th>
                  <th className="p-3 font-semibold text-gray-700">Menu</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((admin, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{admin.nama}</td>
                    <td className="p-3 text-gray-600">{admin.email}</td>
                    <td className="p-3 text-gray-600">{admin.noTelepon}</td>
                    <td className="p-3 text-gray-600">{admin.penempatan}</td>
                    <td className="p-3 text-gray-600">{admin.role}</td>
                    <td className="p-3 relative">
                      <button
                        onClick={() => toggleMenu(startIndex + index)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ⋮
                      </button>
                      {menuOpen === (startIndex + index) && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => openEditModal(startIndex + index)}
                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                          >
                            Ubah Data
                          </button>
                          <button
                            onClick={() => {
                              setAdmins(admins.filter((_, i) => i !== (startIndex + index)));
                              setMenuOpen(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                          >
                            Hapus Data
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === page
                    ? "bg-[#F5E6CC] text-gray-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {isAddModalOpen ? "Tambah Administrator" : "Ubah Data"}
            </h3>
            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Contoh: Matthew Emmanuel"
                  className="border rounded-lg p-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5E6CC]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Contoh: matthew.emmanuel@email.com"
                  className="border rounded-lg p-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5E6CC]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">No. Telepon</label>
                <input
                  type="text"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleInputChange}
                  placeholder="Contoh: +6281212312312"
                  className="border rounded-lg p-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5E6CC]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Penempatan</label>
                <input
                  type="text"
                  name="penempatan"
                  value={formData.penempatan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Cabang Bekasi"
                  className="border rounded-lg p-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5E6CC]"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-600 mb-1">Role</label>
                <div
                  onClick={toggleRoleDropdown}
                  className="border rounded-lg p-2 w-full text-gray-600 flex justify-between items-center cursor-pointer"
                >
                  <span>{formData.role || "Pilih role yang sesuai"}</span>
                  <span>▼</span>
                </div>
                {isRoleDropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleRoleSelect("Admin Utama")}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Admin Utama
                    </button>
                    <button
                      onClick={() => handleRoleSelect("Admin Donasi")}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Admin Donasi
                    </button>
                    <button
                      onClick={() => handleRoleSelect("Admin Event")}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Admin Event
                    </button>
                    <button
                      onClick={() => handleRoleSelect("Admin Cabang/Drop Point")}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Admin Cabang/Drop Point
                    </button>
                    {customRoles.map((role, index) => (
                      <button
                        key={index}
                        onClick={() => handleRoleSelect(role)}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        {role}
                      </button>
                    ))}
                    <button
                      onClick={() => handleRoleSelect("Buat Role Baru")}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      Buat Role Baru
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#8B5A2B] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#7A4A24] transition"
                >
                  {isAddModalOpen ? "Tambah Administrator" : "Ubah Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Buat Role Baru</h3>
            <form onSubmit={handleCreateRoleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nama Role</label>
                <input
                  type="text"
                  name="name"
                  value={newRoleData.name}
                  onChange={handleNewRoleInputChange}
                  placeholder="Contoh: Matthew Emmanuel"
                  className="border rounded-lg p-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F5E6CC]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Pilih Akses</label>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="barangDonasi"
                    checked={newRoleData.permissions.barangDonasi}
                    onChange={handleNewRoleInputChange}
                    className="mr-2"
                  />
                  <label className="text-gray-600">Barang Donasi</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="melihatDataDonasi"
                    checked={newRoleData.permissions.melihatDataDonasi}
                    onChange={handleNewRoleInputChange}
                    className="mr-2"
                  />
                  <label className="text-gray-600">Melihat Data Donasi</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="mengaturTanggalPenjemputan"
                    checked={newRoleData.permissions.mengaturTanggalPenjemputan}
                    onChange={handleNewRoleInputChange}
                    className="mr-2"
                  />
                  <label className="text-gray-600">Mengatur Tanggal Penjemputan</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name="mengubahStatusDonasi"
                    checked={newRoleData.permissions.mengubahStatusDonasi}
                    onChange={handleNewRoleInputChange}
                    className="mr-2"
                  />
                  <label className="text-gray-600">Mengubah Status Donasi</label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="mengaturTanggalPengiriman"
                    checked={newRoleData.permissions.mengaturTanggalPengiriman}
                    onChange={handleNewRoleInputChange}
                    className="mr-2"
                  />
                  <label className="text-gray-600">Mengatur Tanggal Pengiriman</label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeCreateRoleModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#8B5A2B] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#7A4A24] transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}