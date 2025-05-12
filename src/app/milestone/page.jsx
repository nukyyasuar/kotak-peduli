
"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import NavbarAfterLogin from "../../components/navbarAfterLogin";
import Footer from "../footer/page";
import eventService from "../../service/eventService";
import { formatInTimeZone } from "date-fns-tz";
import { useForm } from "react-hook-form";
import * as YUP from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Yup validation schema
const validationSchema = YUP.object({
  nama: YUP.string()
    .required("Nama tempat penampung tidak boleh kosong.")
    .min(10, "Nama tempat penampung harus berisi minimal 10 karakter.")
    .max(100, "Nama tempat penampung tidak boleh melebihi 100 karakter."),
  alamat: YUP.string().required("Alamat tidak boleh kosong."),
  akhirPenerimaan: YUP.string()
    .required("Tanggal akhir penerimaan wajib diisi.")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Format tanggal harus YYYY-MM-DD (contoh: 2025-03-20)"
    )
    .test(
      "is-future-or-today",
      "Tanggal harus setelah atau sama dengan hari ini.",
      (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(value);
        return inputDate >= today && !isNaN(inputDate);
      }
    )
    .transform((value) => (value ? value : undefined)),
  barang: YUP.object({
    pakaian: YUP.boolean(),
    elektronik: YUP.boolean(),
    mainan: YUP.boolean(),
    buku: YUP.boolean(),
  }).test("at-least-one-selected", "Pilih minimal satu opsi.", (value) => {
    return value.pakaian || value.elektronik || value.mainan || value.buku;
  }),
});

export default function Home() {
  // Initialize both checkboxes as true to show all events by default
  const [isAktif, setIsAktif] = useState(false);
  const [isSelesai, setIsSelesai] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isTambahModalOpen, setIsTambahModalOpen] = useState(false);
  const [isUbahModalOpen, setIsUbahModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventToFinishId, setEventToFinishId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [collectionCenterId, setCollectionCenterId] = useState(null);

  // Initialize React Hook Form for Tambah form with Yup validation
  const tambahForm = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      akhirPenerimaan: "",
      barang: {
        pakaian: false,
        elektronik: false,
        mainan: false,
        buku: false,
      },
    },
  });

  // Initialize React Hook Form for Ubah form with Yup validation
  const ubahForm = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      akhirPenerimaan: "",
      barang: {
        pakaian: false,
        elektronik: false,
        mainan: false,
        buku: false,
      },
    },
  });

  // Prevent typing in DatePicker input
  const preventTyping = (e) => {
    e.preventDefault();
  };

  // Modified getStatusFilter to handle showing both statuses
  const getStatusFilter = () => {
    if (isAktif && !isSelesai) return "active";
    if (!isAktif && isSelesai) return "finished";
    return ""; // Both or none selected means no filter (show all)
  };

  // Fetch collection center ID once on component mount
  const fetchCollectionCenterId = async () => {
    try {
      const profileData = await eventService.getUserCollectionCenter();
      const centerId = profileData?.id;
      if (!centerId) {
        throw new Error("No collection center ID found in profile");
      }
      setCollectionCenterId(centerId);
      return centerId;
    } catch (err) {
      setError("Failed to fetch collection center information.");
      console.error("Fetch Collection Center Error:", err);
      return null;
    }
  };

  const fetchEvents = useCallback(
    async (centerId = collectionCenterId) => {
      if (!centerId) return;
  
      setIsLoading(true);
      setError(null);
  
      try {
        // Only include isActive parameter if one status is selected but not both
        let params = {
          search: searchQuery,
          page: currentPage,
          limit: 10,
          sortOrder: sortOrder,
        };
        
        // Only apply the isActive filter if either only active or only finished is selected
        if (isAktif !== isSelesai) {
          params.isActive = isAktif ? "true" : "false";
        }
  
        const { events: fetchedEvents, pagination: paginationData } =
          await eventService.getEvents(centerId, params);
  
        const typeToFrontend = {
          CLOTHES: "Pakaian",
          ELECTRONICS: "Elektronik",
          TOYS: "Mainan",
          BOOKS: "Buku",
        };
  
        const mappedEvents = fetchedEvents
          .map(({ id, name, address, endDate, types, isActive }) => {
            // Map the types to Indonesian
            const translatedTypes = Array.isArray(types)
              ? types
                  .map((type) => typeToFrontend[type.toUpperCase()] || type)
                  .filter(Boolean)
                  .join(", ")
              : "";
  
            // Format endDate safely
            let formattedEndDate = "";
            if (endDate) {
              try {
                formattedEndDate = formatInTimeZone(
                  new Date(endDate),
                  "Asia/Jakarta",
                  "dd/MM/yyyy"
                );
              } catch (err) {
                formattedEndDate = "";
              }
            }
  
            return {
              id,
              name,
              address,
              endDate: formattedEndDate,
              types: translatedTypes || "Tidak ada barang",
              status: !isActive ? "Selesai" : "Aktif",
            };
          })
          .filter((event) => event !== null);
  
        setEvents(mappedEvents);
        setPagination(paginationData);
  
        if (mappedEvents.length === 0 && currentPage === 1) {
          setError("No events found for this collection center.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.meta?.message?.join(", ") ||
          err.message ||
          "Failed to fetch events";
        setError(errorMessage);
        console.error("Fetch Events Error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, collectionCenterId, currentPage, sortOrder, isAktif, isSelesai]
  );

  // Initialize data and set up collection center ID
  useEffect(() => {
    const initData = async () => {
      const centerId = await fetchCollectionCenterId();
      if (centerId) {
        await fetchEvents(centerId);
      }
    };

    initData();
  }, []);

  // Call fetchEvents when search parameters change
  useEffect(() => {
    if (collectionCenterId) {
      setCurrentPage(1); // Reset to first page on new search
      fetchEvents();
    }
  }, [searchQuery, isAktif, isSelesai, fetchEvents]);

  // Fetch events when page or sort order changes
  useEffect(() => {
    if (collectionCenterId) {
      fetchEvents();
    }
  }, [currentPage, sortOrder, fetchEvents]);

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  const toggleUbahModal = (index) => {
    if (index !== null && events[index]) {
      const event = events[index];
      let formattedEndDate = "";
      if (event.endDate) {
        try {
          const [day, month, year] = event.endDate.split("/");
          formattedEndDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        } catch (err) {
          console.error(
            `Invalid endDate format for event ${event.id}:`,
            event.endDate,
            err
          );
          formattedEndDate = "";
        }
      }

      // Map types to form values
      const typesArray = event.types
        ? event.types.split(", ").map((t) => t.toLowerCase())
        : [];
      ubahForm.reset({
        nama: event.name,
        alamat: event.address,
        akhirPenerimaan: formattedEndDate,
        barang: {
          pakaian: typesArray.includes("pakaian"),
          elektronik: typesArray.includes("elektronik"),
          mainan: typesArray.includes("mainan"),
          buku: typesArray.includes("buku"),
        },
      });
      setSelectedEventId(event.id);
    }
    setIsUbahModalOpen(!isUbahModalOpen);
    setOpenDropdownIndex(null);
  };

  const toggleConfirmModal = (index) => {
    if (!isConfirmModalOpen && index !== null && events[index]) {
      setEventToFinishId(events[index].id);
    } else {
      setEventToFinishId(null);
    }

    setIsConfirmModalOpen(!isConfirmModalOpen);
    setOpenDropdownIndex(null);
  };

  const handleConfirmFinish = async () => {
    if (eventToFinishId !== null && collectionCenterId) {
      setIsLoading(true);
      try {
        await eventService.finishEvent(collectionCenterId, eventToFinishId);
        await fetchEvents();
        setError(null);
      } catch (err) {
        const errorMessage =
          err.response?.data?.meta?.message?.join(", ") ||
          err.message ||
          "Failed to finish event";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setEventToFinishId(null);
      }
    }
  };

  const handleTambahSubmit = async (data) => {
    if (!collectionCenterId) {
      setError("No collection center ID found");
      return;
    }

    setIsLoading(true);
    try {
      const typeMapping = {
        pakaian: "CLOTHES",
        elektronik: "ELECTRONICS",
        mainan: "TOYS",
        buku: "BOOKS",
      };

      const eventData = {
        name: data.nama,
        address: data.alamat,
        endDate: data.akhirPenerimaan,
        types: Object.keys(data.barang)
          .filter((key) => data.barang[key])
          .map((key) => typeMapping[key]),
      };

      await eventService.createEvent(collectionCenterId, eventData);
      await fetchEvents();
      toggleTambahModal();
      setError(null);
    } catch (err) {
      setError("Failed to create event. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUbahSubmit = async (data) => {
    if (!collectionCenterId || !selectedEventId) {
      setError("Missing collection center ID or event ID");
      return;
    }

    setIsLoading(true);
    try {
      const typeMapping = {
        pakaian: "CLOTHES",
        elektronik: "ELECTRONICS",
        mainan: "TOYS",
        buku: "BOOKS",
      };

      const eventData = {
        name: data.nama,
        address: data.alamat,
        endDate: data.akhirPenerimaan,
        types: Object.keys(data.barang)
          .filter((key) => data.barang[key])
          .map((key) => typeMapping[key]),
      };

      await eventService.updateEvent(collectionCenterId, selectedEventId, eventData);
      await fetchEvents();
      toggleUbahModal(null);
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.meta?.message?.join(", ") ||
        err.message ||
        "Failed to update event";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#543A14] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F5E9D4]">
      <div className="sticky top-0 z-50">
        <NavbarAfterLogin />
      </div>
      <main className="flex-grow px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#4A2C2A] uppercase">
          Event
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6 text-[#C2C2C2]">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pl-10 rounded-lg shadow-sm focus:outline-none bg-white text-sm text-[#131010]"
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
                checked={isAktif}
                onChange={(e) => handleFilterChange(setIsAktif)(e.target.checked)}
                className="h-4 w-4 accent-[#543A14]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Aktif</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelesai}
                onChange={(e) =>
                  handleFilterChange(setIsSelesai)(e.target.checked)
                }
                className="h-4 w-4 accent-[#543A14]"
              />
              <span className="text-[#4A2C2A] text-sm font-medium">Selesai</span>
            </label>
            <button
              onClick={toggleTambahModal}
              className="px-4 py-1.5 bg-[#543A14] text-white rounded-lg text-sm font-bold hover:bg-[#8B5A2B]"
            >
              Tambah Event
            </button>
          </div>
        </div>

        {isTambahModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#543A14] mb-4">
                Tambah Event
              </h2>
              <form onSubmit={tambahForm.handleSubmit(handleTambahSubmit)}>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Nama
                  </label>
                  <input
                    type="text"
                    {...tambahForm.register("nama")}
                    placeholder="Contoh: Banjir Bekasi"
                    className={`w-full p-2 border rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] ${
                      tambahForm.formState.errors.nama
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {tambahForm.formState.errors.nama && (
                    <p className="text-red-500 text-xs mt-1">
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
                    className={`w-full p-2 border rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] ${
                      tambahForm.formState.errors.alamat
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {tambahForm.formState.errors.alamat && (
                    <p className="text-red-500 text-xs mt-1">
                      {tambahForm.formState.errors.alamat.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Akhir Penerimaan
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={
                        tambahForm.getValues("akhirPenerimaan")
                          ? new Date(tambahForm.getValues("akhirPenerimaan"))
                          : null
                      }
                      onChange={(date) => {
                        const formattedDate = date
                          ? formatInTimeZone(date, "Asia/Jakarta", "yyyy-MM-dd")
                          : "";
                        tambahForm.setValue("akhirPenerimaan", formattedDate, {
                          shouldValidate: true,
                        });
                      }}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Pilih tanggal"
                      className={`w-full p-2 border rounded-lg text-sm text-[#131010] bg-gray-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] ${
                        tambahForm.formState.errors.akhirPenerimaan
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      wrapperClassName="w-full"
                      onKeyDown={preventTyping} // Prevent typing
                    />
                    <Icon
                      icon="mdi:calendar"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#C2C2C2] w-5 h-5"
                    />
                  </div>
                  {tambahForm.formState.errors.akhirPenerimaan && (
                    <p className="text-red-500 text-xs mt-1">
                      {tambahForm.formState.errors.akhirPenerimaan.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Barang yang Dibutuhkan
                  </label>
                  <div className="flex flex-row gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...tambahForm.register("barang.pakaian")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Pakaian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...tambahForm.register("barang.elektronik")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Elektronik</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...tambahForm.register("barang.mainan")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Mainan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...tambahForm.register("barang.buku")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Buku</span>
                    </label>
                  </div>
                  {tambahForm.formState.errors.barang && (
                    <p className="text-red-500 text-xs mt-1">
                      {tambahForm.formState.errors.barang.message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 py-2 bg-[#543A14] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
                  >
                    {isLoading ? "Memproses..." : "Tambah Event"}
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
          <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-[#4A2C2A] mb-4">
                Ubah Informasi Event
              </h2>
              <form onSubmit={ubahForm.handleSubmit(handleUbahSubmit)}>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Nama
                  </label>
                  <input
                    type="text"
                    {...ubahForm.register("nama")}
                    className={`w-full p-2 border rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] ${
                      ubahForm.formState.errors.nama
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {ubahForm.formState.errors.nama && (
                    <p className="text-red-500 text-xs mt-1">
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
                    className={`w-full p-2 border rounded-lg text-sm text-[#131010] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] ${
                      ubahForm.formState.errors.alamat
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {ubahForm.formState.errors.alamat && (
                    <p className="text-red-500 text-xs mt-1">
                      {ubahForm.formState.errors.alamat.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Akhir Penerimaan
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={
                        ubahForm.getValues("akhirPenerimaan")
                          ? new Date(ubahForm.getValues("akhirPenerimaan"))
                          : null
                      }
                      onChange={(date) => {
                        const formattedDate = date
                          ? formatInTimeZone(date, "Asia/Jakarta", "yyyy-MM-dd")
                          : "";
                        ubahForm.setValue("akhirPenerimaan", formattedDate, {
                          shouldValidate: true,
                        });
                      }}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      placeholderText="Pilih tanggal"
                      className={`w-full p-2 border rounded-lg text-sm text-[#131010] bg-gray-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B5A2B] ${
                        ubahForm.formState.errors.akhirPenerimaan
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      wrapperClassName="w-full"
                      onKeyDown={preventTyping} // Prevent typing
                    />
                    <Icon
                      icon="mdi:calendar"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#C2C2C2] w-5 h-5"
                    />
                  </div>
                  {ubahForm.formState.errors.akhirPenerimaan && (
                    <p className="text-red-500 text-xs mt-1">
                      {ubahForm.formState.errors.akhirPenerimaan.message}
                    </p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-[#131010] mb-1 font-bold">
                    Barang yang Dibutuhkan
                  </label>
                  <div className="flex flex-row gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...ubahForm.register("barang.pakaian")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Pakaian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...ubahForm.register("barang.elektronik")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Elektronik</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...ubahForm.register("barang.mainan")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Mainan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...ubahForm.register("barang.buku")}
                        className="h-4 w-4 accent-[#543A14]"
                      />
                      <span className="text-sm text-[#131010]">Buku</span>
                    </label>
                  </div>
                  {ubahForm.formState.errors.barang && (
                    <p className="text-red-500 text-xs mt-1">
                      {ubahForm.formState.errors.barang.message}
                    </p>
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

        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold text-red-600 mb-4">
                Status Event (SELESAI)
              </h2>
              <p className="text-sm text-[#131010] mb-6 text-[14px]">
                Status event yang telah diubah menjadi{" "}
                <span className="font-bold text-[#131010]">SELESAI</span>, akan
                dihilangkan dari halaman yang ditampilkan kepada donatur dan tidak
                dapat dipilih kembali. Pastikan event yang selesai sesuai dengan
                tanggal akhir penerimaan.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmFinish}
                  disabled={isLoading}
                  className="w-1/2 py-2 bg-[#4A2C2A] text-white rounded-lg text-sm font-medium hover:bg-[#8B5A2B] disabled:opacity-50"
                >
                  {isLoading ? "Memproses..." : "Konfirmasi"}
                </button>
                <button
                  onClick={() => toggleConfirmModal(null)}
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
                <tr className="bg-white text-[#4A2C2A] font-bold">
                  <th className="p-3 w-1/6">Nama</th>
                  <th className="p-3 w-1/4">Alamat</th>
                  <th className="p-3 w-1/6 cursor-pointer" onClick={handleSort}>
                    <div className="flex items-center">
                      Akhir Penerimaan
                      <Icon
                        icon={
                          sortOrder === "asc"
                            ? "mdi:sort-ascending"
                            : "mdi:sort-descending"
                        }
                        className="ml-2 w-4 h-4"
                      />
                    </div>
                  </th>
                  <th className="p-3 w-1/4">Jenis Barang</th>
                  <th className="p-3 w-1/6">Status</th>
                  <th className="p-3 w-1/12">Menu</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <tr key={event.id} className="border-t border-gray-200">
                      <td className="p-3 text-black">{event.name}</td>
                      <td className="p-3 text-black">{event.address}</td>
                      <td className="p-3 text-black">{event.endDate}</td>
                      <td className="p-3 text-black">{event.types}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            event.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.status}
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
                                onClick={() => toggleUbahModal(index)}
                                className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                              >
                                Ubah Data
                              </li>
                              <li
                                onClick={() => toggleConfirmModal(index)}
                                className="px-4 py-2 hover:bg-[#F5E9D4] cursor-pointer"
                              >
                                Selesai
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
                      Tidak ada event yang sesuai dengan pencarian.
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
              }`}
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-1" />
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
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
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className={`px-3 py-1 rounded-lg text-[#4A2C2A] text-sm flex items-center ${
                currentPage === pagination.totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
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