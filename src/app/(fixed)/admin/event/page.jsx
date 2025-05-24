"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";

import {
  getEventsWithParams,
  createEventCollectionCenter,
  updateEventCollectionCenter,
} from "src/services/api/event";
import { useAuth } from "src/services/auth/AuthContext";

import Unauthorize from "src/components/unauthorize";
import eventSchema from "src/components/schema/eventSchema";
import { FormInput } from "src/components/formInput";
import {
  donationTypes,
  eventStatusList,
  tomorrow,
} from "src/components/options";
import handleOutsideModal from "src/components/handleOutsideModal";
import { ButtonCustom } from "src/components/button";
import FormattedWIBDate from "src/components/dateFormatter";

export default function CollectionCenterEvents() {
  const isFirstFetchEvents = useRef(true);
  const [dataEvents, setDataEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("endDate:desc");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isFinishEventModalOpen, setIsFinishEventModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const addEventModalRef = useRef(null);
  const finishEventModalRef = useRef(null);
  const { hasPermission } = useAuth();

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(eventSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      address: "",
      endDate: "",
      types: [],
      isActive: true,
      startDate: new Date(),
    },
  });

  const collectionCenterId = localStorage.getItem("collectionCenterId");

  handleOutsideModal({
    ref: finishEventModalRef,
    isOpen: isFinishEventModalOpen,
    onClose: () => {
      setIsFinishEventModalOpen(false);
      reset();
    },
  });

  const fetchEvents = async (page, search, sort, statusFilters) => {
    try {
      const result = await getEventsWithParams(
        collectionCenterId,
        page,
        search,
        sort,
        statusFilters
      );

      setDataEvents(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalData(result.meta.total);

      if (isFirstFetchEvents.current) {
        toast.success("Data events berhasil dimuat");
        isFirstFetchEvents.current = false;
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Gagal memuat data events");
    }
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const onSubmitAddEvent = async (data) => {
    const payload = {
      ...data,
      endDate: new Date(data?.endDate).toISOString(),
      isActive: isFinishEventModalOpen ? false : true,
    };

    if (isEditEventModalOpen || isFinishEventModalOpen) {
      try {
        await updateEventCollectionCenter(
          collectionCenterId,
          selectedEventId,
          payload
        );

        toast.success("Data event berhasil diubah");
        setIsEditEventModalOpen(false);
        reset();

        fetchEvents(currentPage, debouncedSearch, sort, selectedStatusFilters);
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error("Gagal mengubah data event");
      }
    } else if (isAddEventModalOpen) {
      try {
        await createEventCollectionCenter(collectionCenterId, payload);

        toast.success("Data event berhasil ditambahkan");
        setIsAddEventModalOpen(false);
        reset();

        fetchEvents(currentPage, debouncedSearch, selectedStatusFilters);
      } catch (error) {
        console.error("Error creating event:", error);
        toast.error("Gagal menambahkan data event");
      }
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchKeyword]);

  useEffect(() => {
    if ((isEditEventModalOpen || isFinishEventModalOpen) && selectedEventId) {
      dataEvents.forEach((event) => {
        if (event.id === selectedEventId) {
          setValue("name", event.name);
          setValue("address", event.address);
          setValue("endDate", new Date(event.endDate));
          setValue("types", event.types);
        }
      });
    }
  }, [isEditEventModalOpen, selectedEventId]);

  useEffect(() => {
    if (isFinishEventModalOpen) {
      clearErrors("name");
      clearErrors("address");
      clearErrors("endDate");
      clearErrors("types");
    }
  }, [isFinishEventModalOpen]);

  useEffect(() => {
    fetchEvents(currentPage, debouncedSearch, sort, selectedStatusFilters);
  }, [currentPage, debouncedSearch, sort, selectedStatusFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sort, selectedStatusFilters]);

  return (
    <div className="min-h-[92dvh] bg-[#F5E9D4] py-12">
      {!hasPermission("READ_EVENT") ? (
        <Unauthorize />
      ) : (
        <main className="max-w-[1200px] mx-auto space-y-4 text-black">
          <h1 className="text-[32px] text-[#543A14] font-bold text-center">
            EVENT
          </h1>

          {/* Fitur Tabel */}
          <div className="flex justify-between items-center mb-4">
            {/* Search */}
            <div className="relative">
              <FormInput
                inputType="text"
                placeholder="Cari nama event"
                inputStyles="bg-white w-3xs relative pl-10"
                value={searchKeyword}
                onChange={(keyword) => {
                  setSearchKeyword(keyword);
                }}
              />
              <Icon
                icon="cuida:search-outline"
                width={24}
                height={24}
                color="#C2C2C2"
                className="absolute top-1/2 -translate-y-1/2 left-2"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Filter */}
              {eventStatusList.map((item) => (
                <label key={String(item.value)}>
                  <input
                    id={`status-${item.value}`}
                    type="checkbox"
                    value={item.value}
                    checked={selectedStatusFilters.includes(item.value)}
                    onChange={() => {
                      setSelectedStatusFilters((prev) =>
                        prev.includes(item.value)
                          ? prev.filter((v) => v !== item.value)
                          : [...prev, item.value]
                      );
                    }}
                    className="peer w-4 h-4 mr-2 accent-[#543A14]"
                  />
                  {item.label}
                </label>
              ))}

              {/* Button Tambah Event */}
              <ButtonCustom
                label="Tambah Data"
                variant="brown"
                icon="material-symbols:add"
                onClick={() => {
                  setIsAddEventModalOpen(true);
                }}
              />
            </div>
          </div>

          {/* Tabel Event */}
          <div
            className={`bg-white p-6 rounded-lg ${totalData <= 0 && "text-center"}`}
          >
            {totalData <= 0 ? (
              "Data tidak ditemukan"
            ) : (
              <table className="w-full bg-white rounded-lg">
                <thead>
                  <tr className="text-left border-b border-b-[#EDEDED]">
                    <th className="pb-2">Nama</th>
                    <th className="pb-2">Alamat</th>
                    <th
                      className="pb-2 flex gap-1 items-center cursor-pointer"
                      onClick={() =>
                        setSort((prev) =>
                          prev === "endDate:desc"
                            ? "endDate:asc"
                            : "endDate:desc"
                        )
                      }
                    >
                      Akhir Penerimaan
                      <Icon
                        icon="material-symbols:sort"
                        width={20}
                        height={20}
                        color="black"
                        className={sort === "endDate:asc" ? "scale-y-[-1]" : ""}
                      />
                    </th>
                    <th className="pb-2">Jenis Barang</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Menu</th>
                  </tr>
                </thead>

                <tbody>
                  {dataEvents.map((item, index) => {
                    const eventItemType = donationTypes
                      .filter((option) => item.types.includes(option.value))
                      .map((option) => option.label)
                      .join(", ");
                    const eventStatus = eventStatusList.find((status) => {
                      return status.value === item.isActive;
                    })?.label;

                    return (
                      <tr key={index} className="border-b border-b-[#EDEDED]">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">{item.address}</td>
                        <td className="py-3">
                          <FormattedWIBDate date={item.endDate} />
                        </td>
                        <td className="py-3">{eventItemType}</td>
                        <td className="py-3">{eventStatus}</td>
                        <td className="py-3 relative text-start">
                          <button
                            onClick={() => toggleMenu(index)}
                            className="border border-[#C2C2C2] rounded-sm p-1"
                          >
                            <Icon
                              icon="iconamoon:menu-burger-vertical"
                              width={16}
                              height={16}
                              color="black"
                              className="rotate-90"
                            />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuIndex === index && (
                            <div className="w-35 absolute left-0 mt-1 bg-white border border-[#543A14] rounded-lg shadow-lg z-10">
                              <ul className="py-2">
                                <li
                                  className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                  onClick={() => {
                                    setSelectedEventId(item.id);
                                    setIsEditEventModalOpen(true);
                                    setOpenMenuIndex(null);
                                  }}
                                >
                                  Ubah Data
                                </li>
                                <li
                                  className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                  onClick={() => {
                                    setSelectedEventId(item.id);
                                    setIsFinishEventModalOpen(true);
                                    setOpenMenuIndex(null);
                                  }}
                                >
                                  Selesai Event
                                </li>
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalData > 0 && (
            <div className="flex justify-end space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-[#543A14] disabled:text-[#C2C2C2]"
              >
                {"< Previous"}
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-[#4A3F35] text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-700 hover:text-gray-900 disabled:text-gray-300"
              >
                Next {">"}
              </button>
            </div>
          )}
        </main>
      )}

      {/* Modal Tambah & Ubah Event */}
      {(isAddEventModalOpen || isEditEventModalOpen) && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={addEventModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] min-w-135 overflow-y-auto max-h-[90vh]"
          >
            <h1 className="font-bold text-xl">
              {isEditEventModalOpen ? "Ubah Data Event" : "Tambah Event"}
            </h1>

            <form onSubmit={handleSubmit(onSubmitAddEvent)}>
              <div className="space-y-3 mb-6">
                <FormInput
                  inputType="text"
                  label="Nama Event"
                  placeholder="Contoh: Banjir Bekasi"
                  register={register("name")}
                  required
                  errors={errors.name?.message}
                />
                <FormInput
                  inputType="textArea"
                  label="Lokasi Tujuan Penyaluran"
                  placeholder="Contoh: Yayasan Peduli Banjir Jakarta"
                  register={register("address")}
                  required
                  errors={errors.address?.message}
                />
                <div className="flex flex-col gap-1">
                  <label className="font-bold">
                    Tanggal Akhir Penerimaan
                    <span className="text-[#E52020]">*</span>
                  </label>
                  <DatePicker
                    placeholderText="Pilih tanggal"
                    selected={watch("endDate")}
                    onChange={(date) => {
                      setValue("endDate", date);
                    }}
                    minDate={tomorrow}
                    dateFormat="EEEE, dd/MM/yyyy"
                    locale={id}
                    popperPlacement="right"
                    className="border border-[#C2C2C2] rounded-lg px-5 py-3 min-h-12 focus:outline-none focus:border-black placeholder:text-[#C2C2C2] bg-white w-full"
                  />
                  {errors.endDate && (
                    <p className="text-[#E52020] text-sm">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
                <FormInput
                  label="Jenis Barang yang Diterima"
                  inputType="dropdownInput"
                  options={donationTypes}
                  control={control}
                  name="types"
                  placeholder="Pilih jenis barang yang diterima"
                  type="checkbox"
                  required
                  errors={errors.types?.message}
                />
              </div>

              <div className="flex gap-3">
                <ButtonCustom
                  label="Simpan"
                  variant="brown"
                  type="submit"
                  className="w-full"
                />
                <ButtonCustom
                  label="Batal"
                  variant="outlineBrown"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    isEditEventModalOpen
                      ? setIsEditEventModalOpen(false)
                      : setIsAddEventModalOpen(false);
                    reset();
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Selesai Event */}
      {isFinishEventModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={finishEventModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] min-w-135 overflow-y-auto max-h-[90vh]"
          >
            <h1 className="font-bold text-xl">
              Ubah Status Event{" "}
              <span className="text-[#E52020] font-bold">{`(SELESAI)`}</span>
            </h1>
            <p>
              Status event yang telah diubah menjadi{" "}
              <span className="font-bold">SELESAI</span>, akan{" "}
              <span className="font-bold">dihilangkan</span> dari halaman yang
              ditampilkan kepada donatur dan tidak dapat dipilih kembali.{" "}
              <span className="font-bold">
                Apakah Anda yakin ingin menyelesaikan event ini sebelum tanggal
                akhir penerimaan?
              </span>
            </p>

            <div>
              <ButtonCustom
                label="Konfirmasi"
                variant="brown"
                className="w-full"
                type="button"
                onClick={handleSubmit(onSubmitAddEvent)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
