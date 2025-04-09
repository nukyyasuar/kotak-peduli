'use client';

import Head from "next/head";
import { FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import NavbarAfterLoginAdmin from "../NavbarAfterLoginAdmin/page";
import Footer from "../footer/page";
import { useState } from "react";

export default function Home() {
  // Sample data for the table
  const [dropPoints, setDropPoints] = useState([
    {
      nama: "Tempat Penampung A",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Cabang",
    },
    {
      nama: "Tempat Penampung B",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Cabang",
    },
    {
      nama: "Tempat Penampung C",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Cabang",
    },
    {
      nama: "Drop Point A",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Drop Point B",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Drop Point C",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Tempat Penampung D",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Tempat Penampung E",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Drop Point D",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Drop Point E",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Tempat Penampung F",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
    {
      nama: "Tempat Penampung G",
      alamat: "Jl. Lorem ipsum dolor sit amet, consectetur...",
      telepon: "+6281212312312",
      tipe: "Drop Point",
    },
  ]);

  // State to manage which dropdown is open (using the index of the row)
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // State to manage the modal visibility and the data being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // State to manage the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Maksimal 10 data per halaman

  // State for search
  const [searchTerm, setSearchTerm] = useState("");

  // State for filters
  const [filterCabang, setFilterCabang] = useState(false); // Default: Cabang tidak dipilih
  const [filterDropPoint, setFilterDropPoint] = useState(false); // Default: Drop Point tidak dipilih
  const [isTypeFilterActive, setIsTypeFilterActive] = useState(false); // Default: filter tipe tidak aktif

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat pencarian berubah
  };

  // Handle filter changes
  const handleFilterCabangChange = (e) => {
    setFilterCabang(e.target.checked);
    if (e.target.checked || filterDropPoint) {
      setIsTypeFilterActive(true); // Aktifkan filter tipe jika ada checkbox yang dipilih
    } else {
      setIsTypeFilterActive(false); // Nonaktifkan filter tipe jika tidak ada checkbox yang dipilih
    }
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  const handleFilterDropPointChange = (e) => {
    setFilterDropPoint(e.target.checked);
    if (e.target.checked || filterCabang) {
      setIsTypeFilterActive(true); // Aktifkan filter tipe jika ada checkbox yang dipilih
    } else {
      setIsTypeFilterActive(false); // Nonaktifkan filter tipe jika tidak ada checkbox yang dipilih
    }
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  // Filter data berdasarkan kata kunci pencarian dan tipe (jika filter tipe aktif)
  const filteredData = dropPoints.filter((point) => {
    const matchesSearch = point.nama.toLowerCase().includes(searchTerm.toLowerCase());
    if (!isTypeFilterActive) {
      return matchesSearch; // Tampilkan semua data jika filter tipe tidak aktif
    }
    const matchesType =
      (filterCabang && point.tipe === "Cabang") ||
      (filterDropPoint && point.tipe === "Drop Point");
    return matchesSearch && matchesType;
  });

  // Hitung total halaman berdasarkan data yang sudah difilter
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Ambil data untuk halaman saat ini dari data yang sudah difilter
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Function to toggle the dropdown for a specific row
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  // Function to open the modal for adding new data
  const openAddModal = () => {
    setIsAdding(true);
    setEditData({ nama: "", alamat: "", telepon: "", tipe: "" });
    setIsModalOpen(true);
  };

  // Function to open the modal with the selected row's data for editing
  const openEditModal = (index) => {
    setIsAdding(false);
    setEditData({ ...dropPoints[index], index });
    setIsModalOpen(true);
    setOpenDropdownIndex(null);
  };

  // Function to open the delete confirmation modal
  const openDeleteModal = (index) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
    setOpenDropdownIndex(null);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission (for both adding and editing)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdding) {
      const newDropPoint = {
        nama: editData.nama,
        alamat: editData.alamat,
        telepon: editData.telepon,
        tipe: editData.tipe,
      };
      setDropPoints([...dropPoints, newDropPoint]);
    } else {
      const updatedDropPoints = [...dropPoints];
      updatedDropPoints[editData.index] = {
        nama: editData.nama,
        alamat: editData.alamat,
        telepon: editData.telepon,
        tipe: editData.tipe,
      };
      setDropPoints(updatedDropPoints);
    }
    setIsModalOpen(false);
    setEditData(null);
    setIsAdding(false);
  };

  // Function to handle deletion
  const handleDelete = () => {
    const updatedDropPoints = dropPoints.filter((_, i) => i !== deleteIndex);
    setDropPoints(updatedDropPoints);
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);

    // Hitung ulang total halaman berdasarkan data yang sudah difilter
    const filteredAfterDelete = updatedDropPoints.filter((point) => {
      const matchesSearch = point.nama.toLowerCase().includes(searchTerm.toLowerCase());
      if (!isTypeFilterActive) {
        return matchesSearch;
      }
      const matchesType =
        (filterCabang && point.tipe === "Cabang") ||
        (filterDropPoint && point.tipe === "Drop Point");
      return matchesSearch && matchesType;
    });
    const newTotalPages = Math.ceil(filteredAfterDelete.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  };

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
    setOpenDropdownIndex(null);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setOpenDropdownIndex(null);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setOpenDropdownIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4e9] font-sans">
      <Head>
        <title>Drop Point - Kotak Peduli</title>
        <meta name="description" content="Drop Point page for Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <NavbarAfterLoginAdmin />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg min-w-[1024px]">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          CABANG & DROP POINT
        </h1>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berdasarkan nama"
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterCabang}
                onChange={handleFilterCabangChange}
                className="form-checkbox h-5 w-5 text-[#4a3e2a]"
              />
              <span className="text-gray-600">Cabang</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterDropPoint}
                onChange={handleFilterDropPointChange}
                className="form-checkbox h-5 w-5 text-[#4a3e2a]"
              />
              <span className="text-gray-600">Drop Point</span>
            </label>
            <button
              onClick={openAddModal}
              className="bg-[#4a3e2a] text-white rounded-lg py-2 px-4 hover:bg-[#3a2e1a]"
            >
              TAMBAH POS
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">
                  Nama
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">
                  Alamat
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">
                  No. Telepon
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">
                  Tipe
                </th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">
                  Menu
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((point, index) => (
                <tr key={index} className="border-t border-gray-200 relative">
                  <td className="py-3 px-4 text-gray-800">{point.nama}</td>
                  <td className="py-3 px-4 text-gray-600">{point.alamat}</td>
                  <td className="py-3 px-4 text-gray-800">{point.telepon}</td>
                  <td className="py-3 px-4 text-gray-800">{point.tipe}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {/* Dropdown Menu */}
                    {openDropdownIndex === index && (
                      <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <ul className="py-1">
                          <li>
                            <button
                              onClick={() => openEditModal(startIndex + index)}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Ubah Data
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => openDeleteModal(startIndex + index)}
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Hapus Data
                            </button>
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
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`border border-gray-300 rounded-lg py-2 px-4 text-gray-600 hover:bg-gray-100 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {"< Previous"}
          </button>

          {/* Tombol nomor halaman */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`border border-gray-300 rounded-lg py-2 px-4 ${
                currentPage === page
                  ? "bg-[#4a3e2a] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`border border-gray-300 rounded-lg py-2 px-4 text-gray-600 hover:bg-gray-100 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {"Next >"}
          </button>
        </div>
      </main>

      {/* Modal for Adding/Editing Data */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">{isAdding ? "TAMBAH POS" : "UBAH DATA"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={editData?.nama || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Contoh: Tempat Penampung B"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Alamat Lengkap</label>
                <textarea
                  name="alamat"
                  value={editData?.alamat || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Contoh: Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">No. Telepon</label>
                <input
                  type="text"
                  name="telepon"
                  value={editData?.telepon || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Contoh: +6281212312312"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tipe</label>
                <select
                  name="tipe"
                  value={editData?.tipe || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="" disabled>
                    Pilih tipe tempat yang sesuai
                  </option>
                  <option value="Cabang">Cabang</option>
                  <option value="Drop Point">Drop Point</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-gray-300 rounded-lg py-2 px-4 text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#4a3e2a] text-white rounded-lg py-2 px-4 hover:bg-[#3a2e1a]"
                >
                  {isAdding ? "Tambah Pos" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Hapus Cabang</h2>
            <p className="text-gray-700 mb-2">
              Apakah Anda yakin ingin menghapus data ini? Data yang telah dihapus
              tidak dapat dikembalikan lagi.
            </p>
            <p className="text-gray-700 mb-4 font-semibold">menghapusnya?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleDelete()}
                className="bg-[#4a3e2a] text-white rounded-lg py-2 px-4 hover:bg-[#3a2e1a]"
              >
                Konfirmasi
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="border border-gray-300 rounded-lg py-2 px-4 text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}