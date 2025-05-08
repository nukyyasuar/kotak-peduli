"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Footer from "../footer/page";
import NavbarAfterLoginAdmin from "../../components/navbarAfterLoginAdmin";
import { Icon } from "@iconify/react";

// Yup validation schema for admin forms
const adminValidationSchema = Yup.object().shape({
  nama: Yup.string().required("Nama tidak boleh kosong"),
  email: Yup.string()
    .required("Email tidak boleh kosong")
    .email("Format email salah. Masukkan format email yang valid (contoh: user@example.com)"),
  noTelepon: Yup.string()
    .required("Nomor telepon tidak boleh kosong")
    .matches(/^8/, "Nomor telepon harus diawali dengan angka '8'")
    .min(13, "Nomor telepon harus berisi minimal 13 digit")
    .max(15, "Nomor telepon tidak boleh lebih dari 15 digit"),
  penempatan: Yup.string().required("Penempatan tidak boleh kosong"),
  role: Yup.string().required("Role tidak boleh kosong"),
});

// Yup validation schema for create role form
const roleValidationSchema = Yup.object().shape({
  name: Yup.string().required("Nama Role tidak boleh kosong"),
  barangDonasi: Yup.boolean(),
  melihatDataDonasi: Yup.boolean(),
  mengaturTanggalPenjemputan: Yup.boolean(),
  mengubahStatusDonasi: Yup.boolean(),
  mengaturTanggalPengiriman: Yup.boolean(),
});

export default function AdminPage() {
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

  const [isAdminUtama, setIsAdminUtama] = useState(false);
  const [isAdminDonasi, setIsAdminDonasi] = useState(false);
  const [isAdminEvent, setIsAdminEvent] = useState(false);
  const [isAdminCabang, setIsAdminCabang] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);
  const [customRoles, setCustomRoles] = useState([]);

  // Initialize react-hook-form for each form with Yup resolver
  const tambahForm = useForm({
    resolver: yupResolver(adminValidationSchema),
    defaultValues: {
      nama: "",
      email: "",
      noTelepon: "",
      penempatan: "",
      role: "",
    },
  });

  const ubahForm = useForm({
    resolver: yupResolver(adminValidationSchema),
    defaultValues: {
      nama: "",
      email: "",
      noTelepon: "",
      penempatan: "",
      role: "",
    },
  });

  const createRoleForm = useForm({
    resolver: yupResolver(roleValidationSchema),
    defaultValues: {
      name: "",
      barangDonasi: false,
      melihatDataDonasi: false,
      mengaturTanggalPenjemputan: false,
      mengubahStatusDonasi: false,
      mengaturTanggalPengiriman: false,
    },
  });

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

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, isAdminUtama, isAdminDonasi, isAdminEvent, isAdminCabang, admins]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

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
      tambahForm.reset();
    }
  };

  const toggleUbahModal = (index) => {
    if (index !== null && admins[index]) {
      const admin = admins[index];
      const newNumber = admin.noTelepon
      ubahForm.reset({
        nama: admin.nama,
        email: admin.email,
        noTelepon: newNumber.slice(3),
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
      createRoleForm.reset();
    }
  };

  const handleRoleSelect = (role, form) => {
    if (role === "Buat Role Baru") {
      toggleCreateRoleModal();
    } else {
      form.setValue("role", role);
    }
  };

  const handleTambahSubmit = (data) => {
    setIsLoading(true);
    setAdmins((prev) => [...prev, data]);
    toggleTambahModal();
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleUbahSubmit = (data) => {
    setIsLoading(true);
    setAdmins((prev) => {
      const updatedAdmins = [...prev];
      updatedAdmins[selectedAdminIndex] = data;
      return updatedAdmins;
    });
    toggleUbahModal(null);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleCreateRoleSubmit = (data) => {
    setCustomRoles((prev) => [...prev, data.name]);
    tambahForm.setValue("role", data.name);
    ubahForm.setValue("role", data.name);
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
                  <label className="ownershipflex items-center space-x-2 px-4 py-2 cursor-pointer">
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
                <tr className="bg-white text-[#131010] font-semibold uppercase">
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
          <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Tambah Administrator</h2>
              <form onSubmit={tambahForm.handleSubmit(handleTambahSubmit)}>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Nama</label>
                  <input
                    id="tambah-nama"
                    type="text"
                    {...tambahForm.register("nama")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {tambahForm.formState.errors.nama && (
                    <p className="text-red-500 text-xs mt-1">{tambahForm.formState.errors.nama.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1 font-bold">Email</label>
                  <input
                    id="tambah-email"
                    type="email"
                    {...tambahForm.register("email")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {tambahForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{tambahForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">No. Telepon</label>
                  <input
                    id="tambah-noTelepon"
                    type="text"
                    {...tambahForm.register("noTelepon")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {tambahForm.formState.errors.noTelepon && (
                    <p className="text-red-500 text-xs mt-1">{tambahForm.formState.errors.noTelepon.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Penempatan</label>
                  <input
                    id="tambah-penempatan"
                    type="text"
                    {...tambahForm.register("penempatan")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {tambahForm.formState.errors.penempatan && (
                    <p className="text-red-500 text-xs mt-1">{tambahForm.formState.errors.penempatan.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Role</label>
                  <select
                    id="tambah-role"
                    {...tambahForm.register("role")}
                    onChange={(e) => handleRoleSelect(e.target.value, tambahForm)}
                    className="w-full p-2 border rounded-lg text-[#131010]"
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
                  {tambahForm.formState.errors.role && (
                    <p className="text-red-500 text-xs mt-1">{tambahForm.formState.errors.role.message}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
                  >
                    {isLoading ? "Memproses..." : "Simpan"}
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
          <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Ubah Data Administrator</h2>
              <form onSubmit={ubahForm.handleSubmit(handleUbahSubmit)}>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Nama</label>
                  <input
                    id="ubah-nama"
                    type="text"
                    {...ubahForm.register("nama")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {ubahForm.formState.errors.nama && (
                    <p className="text-red-500 text-xs mt-1">{ubahForm.formState.errors.nama.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Email</label>
                  <input
                    id="ubah-email"
                    type="email"
                    {...ubahForm.register("email")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {ubahForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{ubahForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">No. Telepon</label>
                  <input
                    id="ubah-noTelepon"
                    type="text"
                    {...ubahForm.register("noTelepon")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {ubahForm.formState.errors.noTelepon && (
                    <p className="text-red-500 text-xs mt-1">{ubahForm.formState.errors.noTelepon.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Penempatan</label>
                  <input
                    id="ubah-penempatan"
                    type="text"
                    {...ubahForm.register("penempatan")}
                    className="w-full p-2 border rounded-lg text-[#131010]"
                  />
                  {ubahForm.formState.errors.penempatan && (
                    <p className="text-red-500 text-xs mt-1">{ubahForm.formState.errors.penempatan.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#131010] text-sm mb-1 font-bold">Role</label>
                  <select
                    id="ubah-role"
                    {...ubahForm.register("role")}
                    onChange={(e) => handleRoleSelect(e.target.value, ubahForm)}
                    className="w-full p-2 border rounded-lg text-[#131010]"
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
                  {ubahForm.formState.errors.role && (
                    <p className="text-red-500 text-xs mt-1">{ubahForm.formState.errors.role.message}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
                  >
                    {isLoading ? "Memproses..." : "Simpan"}
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

        {/* Buat Role Baru Modal */}
        {isCreateRoleModalOpen && (
          <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold text-[#4A2C2A] mb-4">Buat Role Baru</h2>
              <form onSubmit={createRoleForm.handleSubmit(handleCreateRoleSubmit)}>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-1">Nama Role</label>
                  <input
                    id="role-name"
                    type="text"
                    {...createRoleForm.register("name")}
                    className="w-full p-2 border rounded-lg"
                  />
                  {createRoleForm.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">{createRoleForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#4A2C2A] text-sm mb-2">Izin Akses</label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      {...createRoleForm.register("barangDonasi")}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Barang Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      {...createRoleForm.register("melihatDataDonasi")}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Melihat Data Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      {...createRoleForm.register("mengaturTanggalPenjemputan")}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Mengatur Tanggal Penjemputan</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      {...createRoleForm.register("mengubahStatusDonasi")}
                      className="h-4 w-4 accent-[#543A14]"
                    />
                    <span className="text-[#4A2C2A] text-sm">Mengubah Status Donasi</span>
                  </label>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      {...createRoleForm.register("mengaturTanggalPengiriman")}
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