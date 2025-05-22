"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { useForm } from "react-hook-form";

import {
  collectionCenterApprovedStatusList,
  days,
  donationTypes,
  STATUS_GREEN,
  STATUS_RED,
} from "src/components/options";
import { FormInput } from "src/components/formInput";
import handleOutsideModal from "src/components/handleOutsideModal";
import { ButtonCustom } from "src/components/button";
import { ListTextWithTitle } from "src/components/text";

import {
  getCollectionCentersWithParams,
  getOneCollectionCenter,
  processCollectionCenter,
} from "src/services/api/collectionCenter";

export default function AdminConsoleDashboard() {
  const detailModalRef = useRef(null);
  const approveModalRef = useRef(null);
  const rejectModalRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const isFirstFetchCollectionCenters = useRef(true);
  const [dataCollectionCenters, setDataCollectionCenters] = useState([]);
  const [dataDetailCollectionCenter, setDataDetailCollectionCenter] = useState(
    []
  );
  const [selectedCollectionCenterId, setSelectedCollectionCenterId] =
    useState(null);
  const [
    isDetailCollectionCenterModalOpen,
    setIsDetailCollectionCenterModalOpen,
  ] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [
    isFetchDetailCollectionCenterLoading,
    setIsFetchDetailCollectionCenterLoading,
  ] = useState(false);
  const [isFetchCollectionCentersLoading, setIsFetchCollectionCentersLoading] =
    useState(false);

  const {
    setValue,
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: {
      isApproved: true,
      notes: "",
    },
  });

  const baseClassNameInput =
    "border border-[#C2C2C2] rounded-lg px-5 py-3 min-h-12 resize-none focus:outline-none focus:border-black placeholder:text-[#C2C2C2] text-base ";

  const detailLatestStatus =
    dataDetailCollectionCenter?.approval?.latestStatus || "";
  const statusApprovedGreen = detailLatestStatus === "APPROVED";
  const statusRejectedRed = detailLatestStatus === "REJECTED";
  const statusColor = statusApprovedGreen
    ? "bg-[#1F7D53]"
    : statusRejectedRed
      ? "bg-[#E52020]"
      : "bg-[#543A14]";

  const detailFilePath = dataDetailCollectionCenter?.attachment?.file?.path;
  const detailAddress = dataDetailCollectionCenter?.address;
  const detailPickupType =
    dataDetailCollectionCenter?.pickupType?.length === 2
      ? "Tersedia"
      : "Tidak Tersedia";
  const detailOperationalHours = dataDetailCollectionCenter?.activeHours?.map(
    (item) => {
      const dayLabel = days.find((day) => day.value === item.day)?.label;

      return <span>{`${dayLabel} ${item.openTime} - ${item.closeTime}`}</span>;
    }
  );
  const detailDonationTypes = dataDetailCollectionCenter?.types
    ?.map((item) => {
      const donationTypeLabel = donationTypes.find(
        (type) => type.value === item
      )?.label;

      return donationTypeLabel;
    })
    .join(", ");

  // Modal Handling Outside
  handleOutsideModal({
    ref: isApproveModalOpen
      ? approveModalRef
      : isRejectModalOpen
        ? rejectModalRef
        : detailModalRef,
    isOpen: isApproveModalOpen
      ? isApproveModalOpen
      : isRejectModalOpen
        ? isRejectModalOpen
        : isDetailCollectionCenterModalOpen,
    onClose: () => {
      isApproveModalOpen
        ? setIsApproveModalOpen(false)
        : isRejectModalOpen
          ? setIsRejectModalOpen(false)
          : setIsDetailCollectionCenterModalOpen(false);
    },
  });

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const fetchCollectionCenters = async (page, search, filter) => {
    setIsFetchCollectionCentersLoading(true);

    try {
      const result = await getCollectionCentersWithParams(page, search, filter);

      setDataCollectionCenters(result.data);
      setTotalPages(result.meta.totalPages);
      setTotalData(result.meta.total);

      if (isFirstFetchCollectionCenters.current) {
        toast.success("Data tempat penampung berhasil dimuat");
        isFirstFetchCollectionCenters.current = false;
      }
    } catch (error) {
      console.error("Error fetching collection centers:", error);
      toast.error("Gagal memuat data tempat penampung");
    } finally {
      setIsFetchCollectionCentersLoading(false);
    }
  };

  const fetchDetailCollectionCenter = async () => {
    setIsFetchDetailCollectionCenterLoading(true);

    try {
      const result = await getOneCollectionCenter(selectedCollectionCenterId);
      setDataDetailCollectionCenter(result);
      toast.success("Data detail tempat penampung berhasil dimuat");
    } catch (error) {
      console.error("Error fetching detail collection center:", error);
      toast.error("Gagal memuat data detail tempat penampung");
    } finally {
      setIsFetchDetailCollectionCenterLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const type = isApproveModalOpen ? "approve" : "reject";

    const payloadApprove = { isApproved: true };
    const payloadReject = {
      isApproved: false,
      notes: data.notes,
    };

    try {
      await processCollectionCenter(
        selectedCollectionCenterId,
        type === "approve" ? payloadApprove : payloadReject
      );

      toast.success(
        `Berhasil ${type === "approve" ? "menyetujui" : "menolak"} tempat penampung`
      );
      setIsApproveModalOpen(false);
      setIsRejectModalOpen(false);
      setIsDetailCollectionCenterModalOpen(false);
      fetchCollectionCenters(
        currentPage,
        debouncedSearch,
        selectedStatusFilters
      );
      setSelectedCollectionCenterId(null);
    } catch (error) {
      console.error("Error update status collection center:", error);
      toast.error(
        `Gagal ${type === "approve" ? "menyetujui" : "menolak"} tempat penampung`
      );
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchKeyword]);

  useEffect(() => {
    fetchCollectionCenters(currentPage, debouncedSearch, selectedStatusFilters);
  }, [currentPage, debouncedSearch, selectedStatusFilters]);

  useEffect(() => {
    if (selectedCollectionCenterId) {
      fetchDetailCollectionCenter();
    }
  }, [selectedCollectionCenterId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatusFilters]);

  return (
    <div className="min-h-[82dvh] bg-[#F5E9D4] py-12">
      <main className="max-w-[1200px] mx-auto space-y-4 text-black">
        <h1 className="text-[32px] text-[#543A14] font-bold text-center">
          TEMPAT PENAMPUNG
        </h1>

        {/* Fitur Tabel */}
        <div className="flex justify-between items-center mb-4">
          {/* Search */}
          <div className="relative">
            <FormInput
              inputType="text"
              placeholder="Cari nama tempat penampung"
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
            {collectionCenterApprovedStatusList.map((item) => (
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
          </div>
        </div>

        {/* Tabel Event */}
        <div
          className={`bg-white p-6 rounded-lg ${totalData <= 0 && "text-center"}`}
        >
          {isFetchCollectionCentersLoading ? (
            <div className="flex items-center justify-center">
              <ClipLoader
                color="#543A14"
                loading={isFetchCollectionCentersLoading}
                size={28}
              />
            </div>
          ) : totalData <= 0 ? (
            "Data tidak ditemukan"
          ) : (
            <table className="w-full bg-white rounded-lg">
              <thead>
                <tr className="text-left border-b border-b-[#EDEDED]">
                  <th className="pb-2">ID</th>
                  <th className="pb-2">Nama</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">No. Telepon</th>
                  <th className="pb-2">Penjemputan</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Menu</th>
                </tr>
              </thead>

              <tbody>
                {dataCollectionCenters.map((item, index) => {
                  const pickUpTypes =
                    item.pickupTypes?.length === 2
                      ? "Tersedia"
                      : "Tidak Tersedia";

                  const latestStatus = item.approval?.latestStatus;
                  const status =
                    latestStatus === "APPROVED"
                      ? "Disetujui"
                      : latestStatus === "REJECTED"
                        ? "Ditolak"
                        : "Pengajuan";

                  return (
                    <tr key={index} className="border-b border-b-[#EDEDED]">
                      <td className="py-3 w-10">{item.id}</td>
                      <td className="py-3">{item.name}</td>
                      <td className="py-3">{item.email}</td>
                      <td className="py-3">{item.phoneNumber}</td>
                      <td className="py-3">{pickUpTypes}</td>
                      <td className="py-3">{status}</td>
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
                                  setSelectedCollectionCenterId(item.id);
                                  setIsDetailCollectionCenterModalOpen(true);
                                  setOpenMenuIndex(null);
                                }}
                              >
                                Lihat Detail
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-700 hover:text-gray-900 disabled:text-gray-300"
            >
              Next {">"}
            </button>
          </div>
        )}
      </main>

      {/* Modal Detail */}
      {isDetailCollectionCenterModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={detailModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-h-[90vh] overflow-y-auto"
          >
            {isFetchDetailCollectionCenterLoading ? (
              <div className="flex items-center justify-center w-120 h-120">
                <ClipLoader
                  color="#543A14"
                  loading={isFetchDetailCollectionCenterLoading}
                  size={50}
                />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-xl">
                    Detail Tempat Penampung{" "}
                    <span>{`(${dataDetailCollectionCenter.id})`}</span>
                  </h1>
                  <span
                    className={`${statusColor} text-white px-6 py-2 font-bold rounded-lg`}
                  >
                    {collectionCenterApprovedStatusList.find(
                      (status) => status.value === detailLatestStatus
                    )?.label || detailLatestStatus}
                  </span>
                </div>

                <div className="flex space-x-8">
                  {/* Left Section */}
                  <div className="w-80 space-y-6">
                    {/* Large Image */}
                    <div
                      className="bg-[#C2C2C2] aspect-square rounded-lg relative"
                      onClick={() => setIsModalLargeImageOpen(true)}
                    >
                      {detailFilePath ? (
                        <Image
                          src={detailFilePath}
                          alt="Donation item image large"
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : null}
                    </div>

                    {/* Buttons */}
                    {detailLatestStatus === "PENDING" && (
                      <div className="space-y-4">
                        <ButtonCustom
                          variant="green"
                          type="button"
                          label="Setujui (Pengajuan)"
                          onClick={() => {
                            setIsApproveModalOpen(true);
                          }}
                          className="w-full"
                        />
                        <ButtonCustom
                          variant="red"
                          type="button"
                          label="Tolak (Pengajuan)"
                          onClick={() => {
                            setIsRejectModalOpen(true);
                          }}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="space-y-4 max-w-[450px]">
                    {/* {rejectedRedirectedNote && (
                      <ListTextWithTitle
                        title="Alasan Penolakan:"
                        values={[rejectedRedirectedNote]}
                        className="max-w-[450px] text-red-600"
                      />
                    )} */}
                    <ListTextWithTitle
                      title="Informasi Tempat Penampung:"
                      values={[
                        dataDetailCollectionCenter?.name,
                        dataDetailCollectionCenter?.email,
                        dataDetailCollectionCenter?.phoneNumber,
                        `(${detailAddress?.reference}) ${detailAddress?.detail}`,
                      ]}
                    />
                    <div className="flex">
                      <ListTextWithTitle
                        title="Penjemputan:"
                        values={[detailPickupType]}
                        className="w-full"
                      />
                      <ListTextWithTitle
                        title="Batas Jarak Penjemputan:"
                        values={[dataDetailCollectionCenter?.distanceLimitKm]}
                        className="w-full"
                      />
                    </div>
                    <div className="flex">
                      <ListTextWithTitle
                        title="Waktu Operasional:"
                        values={[
                          <div className="flex flex-col">
                            {detailOperationalHours}
                          </div>,
                        ]}
                        className="w-full"
                      />
                      <ListTextWithTitle
                        title="Barang yang Diterima:"
                        values={[detailDonationTypes]}
                        className="w-full"
                      />
                    </div>
                    <ListTextWithTitle
                      title="Deskripsi:"
                      values={[dataDetailCollectionCenter?.description]}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Approve & Reject */}
      {(isApproveModalOpen || isRejectModalOpen) && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={isApproveModalOpen ? approveModalRef : rejectModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px] min-w-135 overflow-y-auto max-h-[90vh]"
          >
            <h1 className="font-bold text-xl">
              Pendaftaran Tempat Penampung{" "}
              <span
                className={`font-bold ${isApproveModalOpen ? "text-[#1F7D53]" : "text-[#E52020]"}`}
              >
                {isApproveModalOpen ? "Disetujui" : "Ditolak"}
              </span>
            </h1>

            {isApproveModalOpen ? (
              <p>
                Setelah disetujui,{" "}
                <span className="font-bold">
                  tempat penampungan akan terlihat oleh donatur, sehingga dapat
                  mulai menerima donasi dan mengakses dashboard untuk
                  pengelolaan
                </span>
                . Apakah Anda yakin ingin menyetujui pendaftaran tempat
                penampungan ini?
              </p>
            ) : (
              <p>
                Tempat penampungan tidak akan dapat menerima donasi dan tidak
                terlihat oleh donatur.{" "}
                <span className="font-bold">
                  Apakah Anda yakin ingin menolak pendaftaran tempat penampungan
                  ini?{" "}
                </span>
              </p>
            )}

            {isRejectModalOpen && (
              <div className={`flex flex-col gap-1 w-full`}>
                <label className="text-base font-bold">Alasan Penolakan</label>
                <input
                  type="text"
                  placeholder="Contoh: Data tidak valid"
                  className={baseClassNameInput}
                  {...register("notes", {
                    required: "Alasan penolakan wajib diisi",
                  })}
                />
                {errors?.notes && (
                  <p className="text-red-600 text-sm">
                    {errors?.notes?.message}
                  </p>
                )}
              </div>
              // <FormInput
              //   label="Alasan Penolakan"
              //   placeholder="Contoh: Data tidak asli"
              //   inputType="text"
              //   register={register("notes")}
              // />
            )}

            <div>
              <ButtonCustom
                label="Konfirmasi"
                variant="brown"
                className="w-full"
                type="button"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
