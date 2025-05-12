"use client";

import Head from "next/head";
import { Icon } from "@iconify/react";
import NavbarAfterLogin from "../../components/navbarAfterLogin";
import Footer from "../footer/page";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import collectionCenterService from "../../service/dropPointService";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Nama tempat penampung tidak boleh kosong.")
    .max(100, "Nama tempat penampung tidak boleh melebihi 100 karakter.")
    .min(10, "Nama tempat penampung harus berisi minimal 10 karakter."),
  address: Yup.string().required("Alamat tidak boleh kosong."),
  phoneNumber: Yup.string()
    .required("Nomor telepon tidak boleh kosong.")
    .matches(/^8/, "Nomor telepon harus diawali dengan angka '8'.")
    .max(15, "Nomor telepon tidak boleh lebih dari 15 digit.")
    .min(10, "Nomor telepon harus berisi minimal 10 digit."),
  type: Yup.string().required("Tipe tempat harus dipilih."),
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [centerId, setCenterId] = useState(null);
  const [filters, setFilters] = useState({
    isCabang: false,
    isDropPoint: false
  });
  const itemsPerPage = 10;

  // Initialize React Hook Form for Tambah modal
  const tambahForm = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      type: "",
    },
  });

  // Initialize React Hook Form for Ubah modal
  const ubahForm = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      type: "",
    },
  });

  const fetchDropPoints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build query parameters for server-side filtering and pagination
      let queryParams = new URLSearchParams();
      queryParams.append('page', currentPage);
      queryParams.append('limit', itemsPerPage);
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      // Handle type filtering
      if (filters.isCabang && !filters.isDropPoint) {
        queryParams.append('type', 'BRANCH');
      } else if (!filters.isCabang && filters.isDropPoint) {
        queryParams.append('type', 'DROP_POINT');
      }
      
      // Fetch drop points with filters
      const response = await collectionCenterService.getPostsWithFilters(centerId, queryParams.toString());
      
      setDropPoints(response.data);
      setTotalItems(response.meta.total);
      setTotalPages(Math.ceil(response.meta.total / itemsPerPage));
      
      if (response.data.length === 0) {
        setError("No drop points found matching your criteria.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.meta?.message?.join(", ") ||
        err.message ||
        "Gagal memuat data. Silakan coba lagi.";
      setError(errorMessage);
      console.error("Fetch Drop Points Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCollectionCenter = async () => {
      setIsLoading(true);
      try {
        // Fetch user's collection center
        const centerData = await collectionCenterService.getUserCollectionCenter();
        const fetchedCenterId = centerData.id;
        setCenterId(fetchedCenterId);
      } catch (err) {
        const errorMessage =
          err.response?.data?.meta?.message?.join(", ") ||
          err.message ||
          "Gagal memuat data pusat pengumpulan. Silakan coba lagi.";
        setError(errorMessage);
        console.error("Fetch Collection Center Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollectionCenter();
  }, []);

  // Fetch drop points whenever filters, search, or pagination changes
  useEffect(() => {
    if (centerId) {
      fetchDropPoints();
    }
  }, [centerId, currentPage, searchQuery, filters.isCabang, filters.isDropPoint]);

  const handleFilterChange = (filterType) => (value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDropPoints(); // Explicitly trigger search
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
        name: point.name,
        address: point.address.detail || "",
        phoneNumber: point.phoneNumber,
        type: point.type,
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
      const newDropPoint = {
        name: data.name,
        address: { detail: data.address },
        phoneNumber: "+62"+ data.phoneNumber,
        type: data.type,
      };
      await collectionCenterService.createPost(centerId, newDropPoint);
      toggleTambahModal();
      fetchDropPoints(); // Refresh the list after adding
    } catch (err) {
      setError(err.message || "Gagal menambahkan cabang. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleUbahSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedDropPoint = {
        name: data.name,
        address: { detail: data.address },
        phoneNumber: "+62"+ data.phoneNumber,
        type: data.type,
      };
      const postId = selectedDropPoint.id;
      console.log(updatedDropPoint)
      await collectionCenterService.updatePost(centerId, postId, updatedDropPoint);
      toggleUbahModal(null);
      fetchDropPoints(); // Refresh the list after updating
    } catch (err) {
      setError(err.message || "Gagal memperbarui cabang. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const postId = selectedDropPoint.id;
      await collectionCenterService.deletePost(centerId, postId);
      setIsDeleteModalOpen(false);
      setSelectedDropPoint(null);
      fetchDropPoints(); // Refresh the list after deleting
    } catch (err) {
      setError(err.message || "Gagal menghapus cabang. Silakan coba lagi.");
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
          <form onSubmit={handleSearch} className="relative w-64">
            <input
              type="text"
              placeholder="Cari cabang atau drop point"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pl-10 rounded-lg shadow-sm focus:outline-none bg-white text-sm text-[#131010] placeholder-[#C2C2C2] w-full"
              aria-label="Cari cabang atau drop point"
            />
            <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C2C2C2]">
              <Icon
                icon="mdi:magnify"
                className="w-5 h-5"
              />
            </button>
          </form>
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer accent-[#543A14]">
              <input
                type="checkbox"
                checked={filters.isCabang}
                onChange={(e) =>
                  handleFilterChange("isCabang")(e.target.checked)
                }
                className="h-4 w-4 text-[#4A2C2A] border-gray-300 rounded focus:ring-[#8B5A2B]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Cabang</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer accent-[#543A14]">
              <input
                type="checkbox"
                checked={filters.isDropPoint}
                onChange={(e) =>
                  handleFilterChange("isDropPoint")(e.target.checked)
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

        {/* Tambah Modal */}
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
                    {...tambahForm.register("name")}
                    placeholder="Masukkan nama tempat"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {tambahForm.formState.errors.name && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    {...tambahForm.register("address")}
                    placeholder="Contoh: Jl. Lorem ipsum..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {tambahForm.formState.errors.address && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    {...tambahForm.register("phoneNumber")}
                    placeholder="Contoh: 81212312312"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {tambahForm.formState.errors.phoneNumber && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Tipe
                  </label>
                  <select
                    {...tambahForm.register("type")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  >
                    <option value="" disabled>
                      Pilih tipe tempat
                    </option>
                    <option value="BRANCH">Cabang</option>
                    <option value="DROP_POINT">Drop Point</option>
                  </select>
                  {tambahForm.formState.errors.type && (
                    <p className="text-red-600 text-xs mt-1">
                      {tambahForm.formState.errors.type.message}
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

        {/* Ubah Modal */}
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
                    {...ubahForm.register("name")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {ubahForm.formState.errors.name && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    {...ubahForm.register("address")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {ubahForm.formState.errors.address && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    {...ubahForm.register("phoneNumber")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  />
                  {ubahForm.formState.errors.phoneNumber && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Tipe
                  </label>
                  <select
                    {...ubahForm.register("type")}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                  >
                    <option value="" disabled>
                      Pilih tipe tempat
                    </option>
                    <option value="BRANCH">Cabang</option>
                    <option value="DROP_POINT">Drop Point</option>
                  </select>
                  {ubahForm.formState.errors.type && (
                    <p className="text-red-600 text-xs mt-1">
                      {ubahForm.formState.errors.type.message}
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

        {/* Delete Modal */}
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
                {dropPoints.length > 0 ? (
                  dropPoints.map((point, index) => (
                    <tr key={point.id || index} className="border-t border-gray-200">
                      <td className="p-3 text-black">{point.name}</td>
                      <td className="p-3 text-black">{point.address?.detail || "No address available"}</td>
                      <td className="p-3 text-black">{point.phoneNumber}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            point.type === "BRANCH" || point.type === "Cabang"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {point.type === "BRANCH" ? "Cabang" : 
                           point.type === "DROP_POINT" ? "Drop Point" : point.type}
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

        {!isLoading && totalPages > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-[#4A2C2A]">
              Menampilkan {dropPoints.length} dari {totalItems} data
            </div>
            <div className="flex space-x-2">
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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}