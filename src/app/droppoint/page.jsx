"use client";

import Head from "next/head";
import { Icon } from "@iconify/react";
import NavbarAfterLogin from "../../components/navbarAfterLogin";
import Footer from "../footer/page";
import { useState, useEffect } from "react";

export default function Home() {
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

  const [isCabang, setIsCabang] = useState(false);
  const [isDropPoint, setIsDropPoint] = useState(false);

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

  const filteredDropPoints = dropPoints.filter((point) => {
    let matchesType = false;
    if (!isCabang && !isDropPoint) matchesType = true;
    else if (isCabang && isDropPoint) matchesType = true;
    else if (isCabang) matchesType = point.tipe === "Cabang";
    else if (isDropPoint) matchesType = point.tipe === "Drop Point";

    const matchesSearch = searchQuery
      ? point.nama.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesType && matchesSearch;
  });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      console.log("Filtered Drop Points:", filteredDropPoints);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, isCabang, isDropPoint, dropPoints]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDropPoints = filteredDropPoints.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredDropPoints.length / itemsPerPage);

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

  const Spinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4A2C2A] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5E9D4] font-sans">
      <Head>
        <title>Drop Point - Kotak Peduli</title>
        <meta name="description" content="Drop Point page for Kotak Peduli" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <div className="sticky top-0 z-50">
        <NavbarAfterLogin />
      </div>
  
      <main className="flex-grow px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A] uppercase">
          Cabang & Drop Point
        </h1>
  
        <div className="flex justify-between items-center mb-6 text-[#C2C2C2]">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search courses"
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
            <label className="flex items-center space-x-2 cursor-pointer accent-[#543A14]">
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
            <label className="flex items-center space-x-2 cursor-pointer accent-[#543A14]">
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
              className="px-4 py-1.5 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] shadow-sm uppercase"
            >
              Tambah Pos
            </button>
          </div>
        </div>
  
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    placeholder="Contoh: Jl. Lorem ipsum..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
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
  
        <div className="bg-white rounded-lg shadow-md">
          {isLoading ? (
            <Spinner />
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white text-[#4A2C2A] font-semibold uppercase">
                  <th className="p-3 w-1/5">Nama</th>
                  <th className="p-3 w-2/5">Alamat</th>
                  <th className="p-3 w-1/5">No. Telepon</th>
                  <th className="p-3 w-1/5">Tipe</th>
                  <th className="p-3 w-1/12">Menu</th>
                </tr>
              </thead>
              <tbody>
                {currentDropPoints.length > 0 ? (
                  currentDropPoints.map((point, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-3 text-black">{point.nama}</td>
                      <td className="p-3 text-black">{point.alamat}</td>
                      <td className="p-3 text-black">{point.telepon}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            point.tipe === "Cabang"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {point.tipe}
                        </span>
                      </td>
                      <td className="p-3 relative">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="text-[#4A2C2A] hover:text-[#8B5A2B]"
                          aria-label="Menu"
                        >
                          <Icon
                            icon="mdi:dots-vertical"
                            className="w-5 h-5"
                          />
                        </button>
                        {openDropdownIndex === index && (
                          <div className="absolute right-4 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
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
                  ))
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
  )
}