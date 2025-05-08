"use client";

import Head from "next/head";
import { Icon } from "@iconify/react";
import NavbarAfterLogin from "../../components/navbarAfterLogin";
import Footer from "../footer/page";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import collectionCenterService from "../../service/dropPointService"; // Adjust path as needed

// Validation schema using Yup
const validationSchema = Yup.object({
  nama: Yup.string()
    .required("Nama tempat penampung tidak boleh kosong.")
    .max(100, "Nama tempat penampung tidak boleh melebihi 100 karakter.")
    .min(10, "Nama tempat penampung harus berisi minimal 10 karakter."),
  alamat: Yup.string().required("Alamat tidak boleh kosong."),
  telepon: Yup.string()
    .required("Nomor telepon tidak boleh kosong.")
    .matches(/^8/, "Nomor telepon harus diawali dengan angka ‘8’.")
    .max(15, "Nomor telepon tidak boleh lebih dari 15 digit.")
    .min(13, "Nomor telepon harus berisi minimal 13 digit."),
  tipe: Yup.string().required("Tipe tempat harus dipilih."),
});

export default function Home() {
  const [dropPoints, setDropPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDropPoint, setSelectedDropPoint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isCabang, setIsCabang] = useState(false);
  const [isDropPoint, setIsDropPoint] = useState(false);

  // Initialize React Hook Form for Tambah modal
  const tambahForm = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      telepon: "",
      tipe: "",
    },
  });

  // Initialize React Hook Form for Ubah modal
  const ubahForm = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      telepon: "",
      tipe: "",
    },
  });

  // Fetch drop points on component mount
  useEffect(() => {
    const fetchDropPoints = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming a fixed collection center ID for simplicity; adjust as needed
        const centerId = "1"; // Replace with actual center ID or retrieve dynamically
        const posts = await collectionCenterService.getPosts(centerId);
        setDropPoints(posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDropPoints();
  }, []);

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
      tambahForm.reset();
    }
  };

  const toggleUbahModal = (point) => {
    if (point) {
      ubahForm.reset({
        nama: point.nama,
        alamat: point.alamat,
        telepon: point.telepon,
        tipe: point.tipe,
      });
      setSelectedDropPoint(point);
    }
    setIsUbahModalOpen(!isUbahModalOpen);
    setOpenDropdownIndex(null);
  };

  const toggleDeleteModal = (point) => {
    setSelectedDropPoint(point);
    setIsDeleteModalOpen(!isDeleteModalOpen);
    setOpenDropdownIndex(null);
  };

  const handleTambahSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const centerId = "1"; // Replace with actual center ID
      const newDropPoint = {
        nama: data.nama,
        alamat: data.alamat,
        telepon: data.telepon,
        tipe: data.tipe,
      };
      const createdPost = await collectionCenterService.createPost(centerId, newDropPoint);
      setDropPoints((prev) => [...prev, createdPost]);
      toggleTambahModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUbahSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const centerId = "1"; // Replace with actual center ID
      const updatedDropPoint = {
        nama: data.nama,
        alamat: data.alamat,
        telepon: data.telepon,
        tipe: data.tipe,
      };
      const postId = selectedDropPoint.id; // Assuming the API returns an 'id' field
      const updatedPost = await collectionCenterService.updatePost(centerId, postId, updatedDropPoint);
      setDropPoints((prev) =>
        prev.map((point) =>
          point.id === postId ? updatedPost : point
        )
      );
      toggleUbahModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const centerId = "1"; // Replace with actual center ID
      const postId = selectedDropPoint.id; // Assuming the API returns an 'id' field
      await collectionCenterService.deletePost(centerId, postId);
      setDropPoints((prev) => prev.filter((point) => point.id !== postId));
      setIsDeleteModalOpen(false);
      setSelectedDropPoint(null);
      const newTotalPages = Math.ceil((filteredDropPoints.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6 text-[#C2C2C2]">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search courses"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pl-10 rounded-lg shadow-sm focus:outline-none bg-white text-sm text-[#131010] placeholder-[#C2C2C2]"
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
              Tambah Cabang
            </button>
          </div>
        </div>

        {isTambahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-bold text-[#131010] mb-4">
                Tambah Cabang
              </h2>
              <form onSubmit={tambahForm.handleSubmit(handleTambahSubmit)}>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Nama Tempat Penampung
                  </label>
                  <input
                    type="text"
                    {...tambahForm.register("nama")}
                    placeholder="Masukkan nama tempat"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {tambahForm.formState.errors.nama && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.nama.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    {...tambahForm.register("alamat")}
                    placeholder="Contoh: Jl. Lorem ipsum..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {tambahForm.formState.errors.alamat && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.alamat.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    {...tambahForm.register("telepon")}
                    placeholder="Contoh: +6281212312312"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {tambahForm.formState.errors.telepon && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.telepon.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Tipe
                  </label>
                  <select
                    {...tambahForm.register("tipe")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  >
                    <option value="" disabled>
                      Pilih tipe tempat
                    </option>
                    <option value="Cabang">Cabang</option>
                    <option value="Drop Point">Drop Point</option>
                  </select>
                  {tambahForm.formState.errors.tipe && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.tipe.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
                  >
                    Konfirmasi
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
                Ubah Informasi Cabang
              </h2>
              <form onSubmit={ubahForm.handleSubmit(handleUbahSubmit)}>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Nama Tempat Penampung
                  </label>
                  <input
                    type="text"
                    {...ubahForm.register("nama")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {ubahForm.formState.errors.nama && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.nama.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    {...ubahForm.register("alamat")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {ubahForm.formState.errors.alamat && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.alamat.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    {...ubahForm.register("telepon")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {ubahForm.formState.errors.telepon && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.telepon.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Tipe
                  </label>
                  <select
                    {...ubahForm.register("tipe")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  >
                    <option value="" disabled>
                      Pilih tipe tempat
                    </option>
                    <option value="Cabang">Cabang</option>
                    <option value="Drop Point">Drop Point</option>
                  </select>
                  {ubahForm.formState.errors.tipe && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.tipe.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
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
                Hapus Cabang
              </h2>
              <p className="text-sm text-[#4A2C2A] mb-6">
                Apakah Anda yakin ingin menghapus data ini? Data yang telah
                dihapus tidak dapat dikembalikan lagi.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
                >
                  Konfirmasi
                </button>
                <button
                  onClick={() => toggleDeleteModal(null)}
                  className="w-1/2 py-2 border border-gray-300 rounded-lg text-[#4A2C2A] text-sm font-medium hover:bg-[#F5E9D4]"
                  disabled={isLoading}
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
                <tr className="bg-white text-[#131010] font-semibold uppercase">
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
                    <tr key={point.id || index} className="border-t border-gray-200">
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
                          <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                        </button>
                        {openDropdownIndex === index && (
                          <div className="absolute right-4 top-8 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <ul className="text-sm text-[#4A2C2A]">
                              <li
                                onClick={() => toggleUbahModal(point)}
                                className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                              >
                                Ubah Data
                              </li>
                              <li
                                onClick={() => toggleDeleteModal(point)}
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
                      Tidak ada Cabang yang sesuai dengan pencarian.
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
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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