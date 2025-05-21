"use client";

import Head from "next/head";
import { FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import NavbarAfterLoginAdmin from "../NavbarAfterLoginAdmin/page";
import Footer from "../../footer/page";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  // State declarations
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

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDropPointIndex, setSelectedDropPointIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dropdownRefs = useRef([]);

  // State for filters
  const [isCabang, setIsCabang] = useState(false);
  const [isDropPoint, setIsDropPoint] = useState(false);

  // State for form data
  const [tambahFormData, setTambahFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    tipe: "",
  });

  const [ubahFormData, setUbahFormData] = useState({
    nama: "",
    alamat: "",
    telepon: "",
    tipe: "",
  });

  // Filter drop points
  const filteredDropPoints = dropPoints.filter((point) => {
    let matchesType = false;
    if (!isCabang && !isDropPoint) matchesType = true;
    else if (isCabang && isDropPoint) matchesType = true;
    else if (isCabang) matchesType = point.tipe === "Cabang";
    else if (isDropPoint) matchesType = point.tipe === "Drop Point";

    const matchesSearch = searchQuery
      ? point.nama.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesType && matchesSearch; //compressing
  });

  // Loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      console.log("Filtered Drop Points:", filteredDropPoints);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, isCabang, isDropPoint, dropPoints]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefs.current.every((ref) => ref && !ref.contains(event.target))
      ) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDropPoints = filteredDropPoints.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDropPoints.length / itemsPerPage);

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
        alamat: "",
        telepon: "",
        tipe: "",
      });
    }
  };

  const toggleUbahModal = (index) => {
    if (index !== null) {
      const point = dropPoints[index];
      setUbahFormData({
        nama: point.nama,
        alamat: point.alamat,
        telepon: point.telepon,
        tipe: point.tipe,
      });
      setSelectedDropPointIndex(index);
    }
    setIsUbahModalOpen(!isUbahModalOpen);
    setOpenDropdownIndex(null);
  };

  const toggleDeleteModal = (index) => {
    setSelectedDropPointIndex(index);
    setIsDeleteModalOpen(!isDeleteModalOpen);
    setOpenDropdownIndex(null);
  };

  const handleTambahInputChange = (e) => {
    const { name, value } = e.target;
    setTambahFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTambahSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newDropPoint = {
      nama: tambahFormData.nama || "Contoh: Tempat Penampung",
      alamat: tambahFormData.alamat || "Contoh: Jl. Lorem ipsum...",
      telepon: tambahFormData.telepon || "+6281212312312",
      tipe: tambahFormData.tipe || "Drop Point",
    };
    setDropPoints((prev) => [...prev, newDropPoint]);
    toggleTambahModal();
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleUbahInputChange = (e) => {
    const { name, value } = e.target;
    setUbahFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUbahSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const updatedDropPoint = {
      nama: ubahFormData.nama,
      alamat: ubahFormData.alamat,
      telepon: ubahFormData.telepon,
      tipe: ubahFormData.tipe,
    };
    setDropPoints((prev) => {
      const updatedDropPoints = [...prev];
      updatedDropPoints[selectedDropPointIndex] = updatedDropPoint;
      return updatedDropPoints;
    });
    toggleUbahModal(null);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleDelete = () => {
    setIsLoading(true);
    setDropPoints((prev) =>
      prev.filter((_, i) => i !== selectedDropPointIndex)
    );
    setIsDeleteModalOpen(false);
    setSelectedDropPointIndex(null);
    setTimeout(() => {
      setIsLoading(false);
      const newTotalPages = Math.ceil(filteredDropPoints.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
    }, 500);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOpenDropdownIndex(null);
  };

  // Spinner component
  const Spinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4A2C2A] border-t-transparent"></div>
    </div>
  );

  // Calculate dropdown position
  const getDropdownPosition = (index) => {
    const button = dropdownRefs.current[index];
    if (!button) return { top: "top-8", transform: "" };

    const rect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 80; // Approximate height of dropdown (adjust as needed)

    // If dropdown would extend beyond bottom of viewport, open upwards
    if (rect.bottom + dropdownHeight > viewportHeight) {
      return {
        top: "bottom-full mb-2",
        transform: "translateY(-100%)",
      };
    }
    // Otherwise, open downwards
    return {
      top: "top-8",
      transform: "",
    };
  };

  return (
    <div className="min-h-screen bg-[#F5E9D4] font-sans">
      <Head>
        <title>Drop Point - Kotak Peduli</title>
        <meta name="description" content="Drop Point page for Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <NavbarAfterLoginAdmin />

      {/* Main Content */}
      <main className="px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A]">
          CABANG & DROP POINT
        </h1>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6 text-black">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Cari berdasarkan nama"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A2C2A] w-5 h-5" />
          </div>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCabang}
                onChange={(e) =>
                  handleFilterChange(setIsCabang)(e.target.checked)
                }
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Cabang</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isDropPoint}
                onChange={(e) =>
                  handleFilterChange(setIsDropPoint)(e.target.checked)
                }
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">
                Drop Point
              </span>
            </label>
            <button
              onClick={toggleTambahModal}
              className="px-4 py-1.5 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] shadow-sm"
            >
              Tambah Pos
            </button>
          </div>
        </div>

        {/* Tambah Modal */}
        {isTambahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">
                Tambah Pos
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
                    placeholder="Contoh: Tempat Penampung"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={tambahFormData.alamat}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: Jl. Lorem ipsum..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    rows="3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="telepon"
                    value={tambahFormData.telepon}
                    onChange={handleTambahInputChange}
                    placeholder="Contoh: +6281212312312"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Tipe
                  </label>
                  <select
                    name="tipe"
                    value={tambahFormData.tipe}
                    onChange={handleTambahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  >
                    <option value="" disabled>
                      Pilih tipe tempat
                    </option>
                    <option value="Cabang">Cabang</option>
                    <option value="Drop Point">Drop Point</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                  >
                    Tambah Pos
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
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">
                Ubah Informasi Pos
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
                  <textarea
                    name="alamat"
                    value={ubahFormData.alamat}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    rows="3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="telepon"
                    value={ubahFormData.telepon}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#4A2C2A] mb-1">
                    Tipe
                  </label>
                  <select
                    name="tipe"
                    value={ubahFormData.tipe}
                    onChange={handleUbahInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  >
                    <option value="" disabled>
                      Pilih tipe tempat
                    </option>
                    <option value="Cabang">Cabang</option>
                    <option value="Drop Point">Drop Point</option>
                  </select>
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

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-red-600 mb-4">
                Hapus Pos
              </h2>
              <p className="text-sm text-[#4A2C2A] mb-6">
                Apakah Anda yakin ingin menghapus data ini? Data yang telah
                dihapus tidak dapat dikembalikan lagi.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B]"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={() => toggleDeleteModal(null)}
                  className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#F5E9D4] text-[#4A2C2A] font-semibold">
                  <th className="p-3 w-1/5">NAMA</th>
                  <th className="p-3 w-2/5">ALAMAT</th>
                  <th className="p-3 w-1/5">NO. TELEPON</th>
                  <th className="p-3 w-1/5">TIPE</th>
                  <th className="p-3 w-1/12">MENU</th>
                </tr>
              </thead>
              <tbody>
                {currentDropPoints.length > 0 ? (
                  currentDropPoints.map((point, index) => {
                    const dropdownPosition = getDropdownPosition(index);
                    return (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-3 text-black">{point.nama}</td>
                        <td className="p-3 text-black">{point.alamat}</td>
                        <td className="p-3 text-black">{point.telepon}</td>
                        <td className="p-3 text-black">{point.tipe}</td>
                        <td className="p-3 relative">
                          <button
                            ref={(el) => (dropdownRefs.current[index] = el)}
                            onClick={() => toggleDropdown(index)}
                            className="text-[#4A2C2A] hover:text-[#8B5A2B]"
                            aria-label="Menu"
                          >
                            <BsThreeDotsVertical className="w-5 h-5" />
                          </button>
                          {openDropdownIndex === index && (
                            <div
                              className={`absolute right-4 ${dropdownPosition.top} bg-white border border-gray-200 rounded-lg shadow-md z-50 min-w-[120px]`}
                              style={{ transform: dropdownPosition.transform }}
                            >
                              <ul className="text-sm text-[#4A2C2A]">
                                <li
                                  onClick={() =>
                                    toggleUbahModal(indexOfFirstItem + index)
                                  }
                                  className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                                >
                                  Ubah Data
                                </li>
                                <li
                                  onClick={() =>
                                    toggleDeleteModal(indexOfFirstItem + index)
                                  }
                                  className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                                >
                                  Hapus Data
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-3 text-center text-black">
                      Tidak ada pos yang sesuai dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && (
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
        )}
      </main>

      <Footer />
    </div>
  );
}
