"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

import { FormInput } from "src/components/formInput";
import {
  donationTypes,
  statusList,
  shippingTypes,
  STATUS_GREEN,
  STATUS_RED,
} from "src/components/options";
import ModalDetailDonation from "src/components/donationItems/ModalDetailDonation";
import handleOutsideModal from "src/components/handleOutsideModal";
import { ButtonCustom } from "src/components/button";
import FormattedWIBDate from "src/components/dateFormatter";
import FilterCheckboxDonationTable from "src/components/donationItems/FilterCheckboxDonationTable";
import { TextBetween } from "src/components/text";

import { getCollectionCenterDonations } from "src/services/api/collectionCenter";
import {
  getOneDonation,
  createCollectionCenterShippingDate,
  processDonation,
} from "src/services/api/donation";

export default function CollectionCenterDonationItems() {
  // Search Filter
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchKeyword]);

  // Filter Checkbox
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSearchKeyword, setFilterSearchKeyword] = useState("");
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);
  const [selectedDonationTypesFilters, setSelectedDonationTypesFilters] =
    useState([]);
  const [tempSelectedStatusFilters, setTempSelectedStatusFilters] = useState(
    []
  );
  const [
    tempSelectedDonationTypesFilters,
    setTempSelectedDonationTypesFilters,
  ] = useState([]);
  const [selectedPickupFilters, setSelectedPickupFilters] = useState([]);
  const [tempSelectedPickupFilters, setTempSelectedPickupFilters] = useState(
    []
  );

  const collectionCenterId = localStorage.getItem("collectionCenterId");
  const selectedStatusFilterCount = selectedStatusFilters?.length;
  const selectedDonationTypesFilterCount = selectedDonationTypesFilters?.length;
  const totalSelectedFiltersCount =
    selectedStatusFilterCount + selectedDonationTypesFilterCount;

  const handleTempStatusFilterChange = (value) => {
    setTempSelectedStatusFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const handleTempDonationTypesFilterChange = (value) => {
    setTempSelectedDonationTypesFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const handleTempPickupFilterChange = (value) => {
    setTempSelectedPickupFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    setSelectedStatusFilters(tempSelectedStatusFilters);
    setSelectedDonationTypesFilters(tempSelectedDonationTypesFilters);
    setSelectedPickupFilters(tempSelectedPickupFilters);
    setCurrentPage(1);
    setFilterSearchKeyword("");
    fetchDonations(
      1,
      debouncedSearch,
      tempSelectedStatusFilters,
      tempSelectedDonationTypesFilters,
      tempSelectedPickupFilters
    );
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedStatusFilters([]);
    setSelectedDonationTypesFilters([]);
    setSelectedPickupFilters([]);
    setTempSelectedStatusFilters([]);
    setTempSelectedDonationTypesFilters([]);
    setTempSelectedPickupFilters([]);
    setFilterSearchKeyword("");
    setCurrentPage(1);
    fetchDonations(1, "", [], [], []);
  };

  // Menu Dropdown
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
    setSelectedDonationId(dataDonations[index]?.id);
  };

  // Modal Detail
  const detailModalRef = useRef(null);

  const [imgSrc, setImgSrc] = useState("");
  const [isShippingDateModalOpen, setIsShippingDateModalOpen] = useState(false);

  const handleImageLoaded = (url, index) => {
    if (index === 0 && !imgSrc) {
      setImgSrc(url);
    }
  };

  // Modal Tanggal Pengiriman
  const [isSubmitShippingDateLoading, setIsSubmitShippingDateLoading] =
    useState(false);

  const {
    watch,
    reset,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      waktuPengirimanTempatPenampung: "",
      statusPemeriksaan: "",
      note: "",
      fotoDisalurkan: "",
    },
  });

  const onSubmitCollectionCenterShippingDate = async (data) => {
    console.log("data", data);
    setIsSubmitShippingDateLoading(true);

    try {
      await createCollectionCenterShippingDate(selectedDonationId, {
        pickupDate: data.waktuPengirimanTempatPenampung,
      });

      // Proses Update Status
      try {
        await processDonation(selectedDonationId);
        toast.success("Tanggal pengiriman berhasil dikonfirmasi");
        reset();
        setIsShippingDateModalOpen(false);
        location.reload();
        // fetchDonations(
        //   currentPage,
        //   debouncedSearch,
        //   selectedStatusFilters,
        //   selectedDonationTypesFilters,
        //   selectedPickupFilters
        // );
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Gagal memproses donasi");
      }
    } catch (error) {
      console.error("Error saving shipping date:", error);
      toast.error("Gagal mengkonfirmasi tanggal pengiriman");
    } finally {
      setIsSubmitShippingDateLoading(false);
    }
  };

  const handleCancelShippingDate = () => {
    reset({ waktuPengirimanTempatPenampung: "" });
    setIsShippingDateModalOpen(false);
  };

  // Modal Ubah Status
  const updateStatusModalRef = useRef(null);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const baseClassNameInput =
    "border border-[#C2C2C2] rounded-lg px-5 py-3 min-h-12 resize-none focus:outline-none focus:border-black placeholder:text-[#C2C2C2] text-base ";

  const digitalCheckingUpdateStatus = [
    {
      label: "Pemeriksaan Digital (Disetujui)",
      name: "PENDING",
      value: true,
      color: "#1F7D53",
    },
    {
      label: "Pemeriksaan Digital (Ditolak)",
      name: "REJECTED",
      value: false,
      color: "#E52020",
    },
  ];

  const physicalCheckingUpdateStatus = [
    {
      label: "Pemeriksaan Fisik (Disetujui)",
      name: "STORED",
      value: true,
      color: "#1F7D53",
    },
    {
      label: "Pemeriksaan Fisik (Ditolak)",
      name: "REDIRECTED",
      value: false,
      color: "#E52020",
    },
  ];

  const handleCancelUpdateStatus = () => {
    reset({ statusPemeriksaan: "", note: "" });
    setIsUpdateStatusModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("fotoDisalurkan", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const onSubmitUpdateStatus = async (data) => {
    // Alur status = DIGITAL_CHECKING -> (true: PENDING, false: REJECTED) -> Donatur mengirim opsi tanggal (CONFIRMING) -> Tempat penampung milih opsi tanggal (CONFIRMED) [Balik ke CONFIRMING jika donatur atur ulang sebelum status TRANSPORTING/PICKING] -> BE otomatis hari-h tanggal pengiriman (TRANSPORTING/PICKING) -> Manual ketika otw (IN_TRANSIT) -> PHYSICAL_CHECKING -> (true: STORED, false: REDIRECTED) -> DISTRIBUTED

    const selectedStatusPemeriksaan = statusCheckingList.find(
      (item) => item.name === data.statusPemeriksaan
    );

    const payload = {
      isApproved: selectedStatusPemeriksaan?.value,
      notes: data.note || undefined,
    };
    console.log("payload", payload);

    const formData = new FormData();
    if (selectedStatusPemeriksaan?.value) {
      formData.append("isApproved", selectedStatusPemeriksaan?.value);
    }
    if (data.note) {
      formData.append("notes", data.note);
    }
    if (data.fotoDisalurkan) {
      formData.append("files", data.fotoDisalurkan);
    }
    console.log("formData", formData);

    try {
      await processDonation(selectedDonationId, formData);
      toast.success("Status barang berhasil diperbarui");
      setIsUpdateStatusModalOpen(false);
      reset();
      toggleMenu(null);
      fetchDonations(
        currentPage,
        debouncedSearch,
        selectedStatusFilters,
        selectedDonationTypesFilters,
        selectedPickupFilters
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status barang");
    }
  };

  // Modal Handling Outside
  handleOutsideModal({
    ref: isUpdateStatusModalOpen
      ? ""
      : isShippingDateModalOpen
        ? ""
        : detailModalRef,
    isOpen: isUpdateStatusModalOpen
      ? ""
      : isShippingDateModalOpen
        ? ""
        : isDetailModalOpen,
    onClose: () => {
      if (isUpdateStatusModalOpen || isShippingDateModalOpen) {
        // nothing
      } else {
        setIsDetailModalOpen(false);
      }
    },
  });

  // Fetch Data
  const isFirstFetchDonations = useRef(true);
  const [detailDonation, setDetailDonation] = useState(null);
  const [dataDonations, setDataDonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  const [isFetchDetailDonationLoading, setIsFetchDetailDonationLoading] =
    useState(false);

  const detailDonationLatestStatus = detailDonation?.approvals?.latestStatus;

  const statusCheckingList =
    detailDonationLatestStatus === "DIGITAL_CHECKING"
      ? digitalCheckingUpdateStatus
      : detailDonationLatestStatus === "PHYSICAL_CHECKING"
        ? physicalCheckingUpdateStatus
        : [];

  const fetchDonations = async (
    page,
    search,
    statusFilters,
    donationTypesFilters,
    pickupFilters
  ) => {
    try {
      const result = await getCollectionCenterDonations(
        collectionCenterId,
        page,
        search,
        statusFilters,
        donationTypesFilters,
        pickupFilters
      );
      setDataDonations(result.data);
      setTotalPages(result.meta.totalPage);
      setTotalData(result.meta.total);
      if (isFirstFetchDonations.current) {
        toast.success("Data barang donasi berhasil dimuat");
        isFirstFetchDonations.current = false;
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Gagal memuat data barang donasi");
    }
  };

  useEffect(() => {
    const fetchDetailDonation = async () => {
      setIsFetchDetailDonationLoading(true);

      try {
        const detail = await getOneDonation(selectedDonationId);
        setDetailDonation(detail);
        setImgSrc(detail.attachments[0]?.fileName);
      } catch (error) {
        console.error("Error fetching detail donation:", error);
        toast.error("Gagal memuat detail barang donasi");
      } finally {
        setIsFetchDetailDonationLoading(false);
      }
    };

    if (selectedDonationId) {
      fetchDetailDonation();
    }
  }, [selectedDonationId]);

  useEffect(() => {
    fetchDonations(
      currentPage,
      debouncedSearch,
      selectedStatusFilters,
      selectedDonationTypesFilters,
      selectedPickupFilters
    );
  }, [
    currentPage,
    debouncedSearch,
    selectedStatusFilters,
    selectedDonationTypesFilters,
    selectedPickupFilters,
  ]);
  //

  return (
    <div className="min-h-[82dvh] bg-[#F5E9D4] py-12">
      <main className="max-w-[1200px] mx-auto space-y-4 text-black">
        <h1 className="text-[32px] text-[#543A14] font-bold text-center">
          BARANG DONASI
        </h1>

        {/* Fitur Tabel */}
        <div className="flex justify-between mb-4">
          {/* Search */}
          <div className="relative">
            <FormInput
              inputType="text"
              placeholder="Cari nama donatur"
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

          {/* Filter */}
          <div className="relative">
            {/* Button Filter */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`border border-[#C2C2C2] rounded-lg px-3 h-12 flex items-center justify-between ${totalSelectedFiltersCount ? "bg-[#543A14] text-white" : "bg-white text-[#C2C2C2]"}`}
            >
              <span className="mr-1">{totalSelectedFiltersCount || null}</span>{" "}
              Filter
              <Icon
                icon="mdi:chevron-down"
                width={24}
                height={24}
                color="#C2C2C2"
              />
            </button>

            {/* Modal(Dropdown) Filter */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  {/* Input Search Filter */}
                  <div className="relative mb-3">
                    <FormInput
                      inputType="text"
                      placeholder="Cari filter"
                      inputStyles="bg-white relative pl-10"
                      value={filterSearchKeyword}
                      onChange={(keyword) => {
                        setFilterSearchKeyword(keyword);
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

                  {/* Input Checkbox Filter */}
                  <div className="mb-4 max-h-50 overflow-scroll">
                    <FilterCheckboxDonationTable
                      title="Status"
                      items={statusList}
                      selected={tempSelectedStatusFilters}
                      onChange={handleTempStatusFilterChange}
                      search={filterSearchKeyword}
                    />
                    <FilterCheckboxDonationTable
                      title="Tipe Barang"
                      items={donationTypes}
                      selected={tempSelectedDonationTypesFilters}
                      onChange={handleTempDonationTypesFilterChange}
                      search={filterSearchKeyword}
                    />
                    <FilterCheckboxDonationTable
                      title="Tipe Pengiriman"
                      items={shippingTypes}
                      selected={tempSelectedPickupFilters}
                      onChange={handleTempPickupFilterChange}
                      search={filterSearchKeyword}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={handleApplyFilters}
                      className="bg-[#4A3F35] text-white px-4 py-2 rounded-lg"
                    >
                      Filter
                    </button>
                    <button
                      onClick={() => {
                        handleResetFilters();
                        setIsFilterOpen(false);
                      }}
                      className="text-gray-700 px-4 py-2 rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabel Barang Donasi */}
        <div
          className={`bg-white p-6 rounded-lg ${totalData <= 0 && "text-center"}`}
        >
          {totalData <= 0 ? (
            "Data tidak ditemukan"
          ) : (
            <table className="w-full bg-white rounded-lg">
              <thead>
                <tr className="text-left border-b border-b-[#EDEDED]">
                  <th className="pb-2">Tanggal Donasi</th>
                  <th className="pb-2">Nama Donatur</th>
                  <th className="pb-2">Jenis Barang</th>
                  <th className="pb-2">Tipe Pengiriman</th>
                  <th className="pb-2">Tanggal Pengiriman</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Menu</th>
                </tr>
              </thead>

              <tbody>
                {dataDonations.map((item, index) => {
                  const donorFullName = `${item.user?.firstName} ${item.user?.lastName}`;
                  const donationItemType = donationTypes.find((options) => {
                    return options.value === item.donationType;
                  })?.label;
                  const donationPickupType = item.pickupType?.includes(
                    "PICKED_UP"
                  )
                    ? "Dijemput"
                    : "Dikirim Sendiri";
                  const donationShippingDate = item.pickupDate ? (
                    <FormattedWIBDate date={item.pickupDate} type="time" />
                  ) : item.userAvailability?.length > 0 ? (
                    "Tanggal belum dipilih"
                  ) : item.approval?.latestStatus !== "DIGITAL_CHECKING" ? (
                    "Belum ada opsi tanggal"
                  ) : (
                    "Proses pemeriksaan digital"
                  );
                  const donationStatus = statusList.find((status) => {
                    return status.value === item.approval?.latestStatus;
                  })?.label;
                  const donationStatusValue = statusList.find((status) => {
                    return status.value === item.approval?.latestStatus;
                  }).value;

                  return (
                    <tr key={index} className="border-b border-b-[#EDEDED]">
                      <td className="py-3">
                        <FormattedWIBDate date={item.createdAt} />
                      </td>
                      <td className="py-3 w-50">{donorFullName}</td>
                      <td className="py-3">{donationItemType}</td>
                      <td className="py-3">{donationPickupType}</td>
                      <td className="py-3">{donationShippingDate}</td>
                      <td className="py-3">{donationStatus}</td>
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
                            {/* {isFetchDetailDonationLoading ? (
                              <div className="flex justify-center">
                                <ClipLoader
                                  color="#543A14"
                                  size={5}
                                  loading={isFetchDetailDonationLoading}
                                />
                              </div>
                            ) : ( */}
                            <ul className="py-2">
                              <li
                                className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                onClick={() => {
                                  setIsDetailModalOpen(true);
                                  setSelectedDonationId(item.id);
                                }}
                              >
                                Lihat Detail
                              </li>
                              {donationStatusValue !== "PENDING" &&
                                donationStatusValue !== "CONFIRMING" &&
                                donationStatusValue !== "CONFIRMED" &&
                                donationStatusValue !== "DISTRIBUTED" &&
                                donationStatusValue !== "REJECTED" && (
                                  <li
                                    className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                    onClick={() => {
                                      setIsUpdateStatusModalOpen(true);
                                      setSelectedDonationId(item.id);
                                    }}
                                  >
                                    Ubah Status
                                  </li>
                                )}
                              {item.userAvailability?.length > 0 && (
                                <li
                                  className="text-left px-3 py-1 text-gray-700 hover:bg-[#543A14] hover:text-white cursor-pointer"
                                  onClick={() => {
                                    setSelectedDonationId(item.id);
                                    setIsShippingDateModalOpen(true);
                                  }}
                                >
                                  Pilih tanggal
                                </li>
                              )}
                            </ul>
                            {/* )} */}
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
      <ModalDetailDonation
        userRole="admin"
        isOpen={isDetailModalOpen}
        setIsUpdateStatusModalOpen={setIsUpdateStatusModalOpen}
        detailModalRef={detailModalRef}
        detailDonation={detailDonation}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        STATUS_GREEN={STATUS_GREEN}
        STATUS_RED={STATUS_RED}
        handleImageLoaded={handleImageLoaded}
        setIsShippingDateModalOpen={setIsShippingDateModalOpen}
      />

      {/* Modal Tanggal Pengiriman */}
      {isShippingDateModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px]">
            <div className="space-y-3">
              <h1 className="font-bold text-xl">Pilih Tanggal Pengiriman</h1>
              <p>
                Tempat penampung memilih salah satu opsi tanggal pengiriman dari
                donatur yang sesuai untuk menerima ataupun menjemput barang
                donasi.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmitCollectionCenterShippingDate)}>
              {detailDonation?.userAvailability?.length > 0 && (
                <div className="grid gap-3">
                  {detailDonation.userAvailability.map((item, index) => {
                    const value = item;

                    return (
                      <label
                        key={index}
                        className={`cursor-pointer rounded-lg border px-4 py-2 transition-all 
                          ${watch("waktuPengirimanTempatPenampung") === value ? "bg-[#F0BB78] text-white font-bold border-[#F0BB78]" : "border-[#C2C2C2]  hover:border-[#F0BB78]"}`}
                      >
                        <input
                          type="radio"
                          value={value}
                          {...register("waktuPengirimanTempatPenampung", {
                            required: true,
                          })}
                          className="hidden"
                        />
                        <FormattedWIBDate date={item} type="time" />
                      </label>
                    );
                  })}
                </div>
              )}
              {errors?.waktuPengirimanTempatPenampung && (
                <p className="text-red-600 mt-3 text-sm">
                  Pilih salah satu opsi tanggal pengiriman
                </p>
              )}

              <div className="flex justify-end space-x-3 mt-4">
                <ButtonCustom
                  label={
                    isSubmitShippingDateLoading ? (
                      <ClipLoader color="white" size={20} />
                    ) : (
                      "Kirim"
                    )
                  }
                  variant="brown"
                  type="submit"
                  className="w-full"
                />
                <ButtonCustom
                  label="Batal"
                  onClick={handleCancelShippingDate}
                  variant="white"
                  type="button"
                  className="w-full"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ubah Status */}
      {isUpdateStatusModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={updateStatusModalRef}
            className="bg-white rounded-lg p-8 text-black max-w-[640px]"
          >
            <form
              onSubmit={handleSubmit(onSubmitUpdateStatus)}
              className="space-y-6"
            >
              <div className="space-y-3">
                <h1 className="font-bold text-xl">Ubah Status Barang</h1>
                <p>
                  Status barang donasi akan diperbarui ke tahapan selanjutnya.
                  Pastikan perubahan status sesuai dengan kondisi aktual barang.
                </p>
              </div>
              {isFetchDetailDonationLoading ? (
                <div className="flex justify-center">
                  <ClipLoader
                    color="#543A14"
                    size={30}
                    loading={isFetchDetailDonationLoading}
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <TextBetween
                      label="Status terkini"
                      value={[
                        <span className="font-bold">
                          {
                            statusList.find(
                              (status) =>
                                status.value ===
                                detailDonation?.approvals?.latestStatus
                            )?.label
                          }
                        </span>,
                      ]}
                    />
                    {(detailDonationLatestStatus === "TRANSPORTING" ||
                      detailDonationLatestStatus === "PICKING" ||
                      detailDonationLatestStatus === "IN_TRANSIT" ||
                      detailDonationLatestStatus === "STORED") && (
                      <TextBetween
                        label="Status akan menjadi"
                        value={[
                          <span className="font-bold">
                            {detailDonationLatestStatus === "PICKING"
                              ? "Dalam Perjalanan"
                              : detailDonationLatestStatus === "TRANSPORTING" ||
                                  detailDonationLatestStatus === "IN_TRANSIT"
                                ? "Pemeriksaan Fisik"
                                : detailDonationLatestStatus === "STORED"
                                  ? "Disalurkan"
                                  : ""}
                          </span>,
                        ]}
                      />
                    )}
                    {detailDonationLatestStatus === "STORED" && (
                      <div className="space-y-3">
                        <div className={`flex flex-col gap-1 w-full`}>
                          <label className="text-base font-bold">
                            Laporan Singkat Penyaluran
                          </label>
                          <textArea
                            placeholder="Contoh: Barang donasi telah disalurkan ke pihak yang membutuhkan"
                            className={baseClassNameInput}
                            {...register("note", {
                              required:
                                "Laporan singkat distribusi wajib diisi",
                            })}
                          />
                          {errors?.note && (
                            <p className="text-red-600 text-sm">
                              {errors?.note?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="flex justify-end items-end gap-3">
                            <div className="flex flex-col gap-1 w-full">
                              <label className="text-base font-bold">
                                Foto Bukti Penyaluran
                              </label>
                              <input
                                type="text"
                                className={baseClassNameInput}
                                value={watch("fotoDisalurkan")?.name}
                                {...register("fotoDisalurkan", {
                                  required: "Foto distribusi wajib diunggah",
                                  validate: {
                                    fileType: (value) => {
                                      const file = value;
                                      return (
                                        (file &&
                                          [
                                            "image/jpeg",
                                            "image/png",
                                            "image/jpg",
                                          ].includes(file.type)) ||
                                        "Format file harus JPG atau PNG"
                                      );
                                    },
                                    fileSize: (value) => {
                                      const file = value;
                                      return (
                                        (file &&
                                          file.size <= 5 * 1024 * 1024) ||
                                        "Ukuran maksimal 5MB"
                                      );
                                    },
                                  },
                                })}
                              />
                            </div>
                            <label
                              htmlFor="fotoDisalurkan"
                              className="px-4 py-3 bg-[#F0BB78] text-nowrap rounded-lg font-semibold text-white cursor-pointer h-[51px]"
                            >
                              Pilih File
                            </label>
                            <input
                              id="fotoDisalurkan"
                              type="file"
                              accept="image/jpeg, image/png"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </div>
                          {errors.fotoDisalurkan && (
                            <p className="text-red-600 mt-1 text-sm">
                              {errors.fotoDisalurkan.message}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {(detailDonationLatestStatus === "DIGITAL_CHECKING" ||
                      detailDonationLatestStatus === "PHYSICAL_CHECKING") && (
                      <div className="grid gap-3">
                        <div className="flex flex-col gap-3">
                          {statusCheckingList.map((option) => (
                            <label
                              key={option.name}
                              className={`cursor-pointer rounded-lg border px-4 py-2 transition-all 
                              ${
                                watch("statusPemeriksaan") === option.name
                                  ? `bg-[${option.color}] text-white font-bold border-[${option.color}]`
                                  : `border-[#C2C2C2] text-[${option.color}] hover:border-black`
                              }`}
                            >
                              <input
                                type="radio"
                                value={option.name}
                                {...register("statusPemeriksaan", {
                                  required: "Pilih salah satu opsi",
                                })}
                                className="hidden"
                              />
                              {option.label}
                            </label>
                          ))}
                          {errors?.statusPemeriksaan && (
                            <p className="text-red-600 -mt-1 text-sm">
                              {errors?.statusPemeriksaan?.message}
                            </p>
                          )}
                        </div>
                        {(watch("statusPemeriksaan") === "REJECTED" ||
                          watch("statusPemeriksaan") === "REDIRECTED") && (
                          <div className={`flex flex-col gap-1 w-full`}>
                            <label className="text-base font-bold">
                              Alasan Penolakan
                            </label>
                            <input
                              type="text"
                              placeholder="Contoh: Kondisi barang tidak layak"
                              className={baseClassNameInput}
                              {...register("note", {
                                required: "Alasan penolakan wajib diisi",
                              })}
                            />
                            {errors?.note && (
                              <p className="text-red-600 text-sm">
                                {errors?.note?.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <ButtonCustom
                      label="Konfirmasi"
                      variant="brown"
                      type="submit"
                      className="w-full"
                    />
                    <ButtonCustom
                      label="Batal"
                      onClick={handleCancelUpdateStatus}
                      variant="white"
                      type="button"
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
