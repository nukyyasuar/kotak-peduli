"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

import ModalDetailDonation from "src/components/donationItems/ModalDetailDonation";
import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import handleOutsideModal from "src/components/handleOutsideModal";
import { TextBetween } from "src/components/text";
import AttachmentImage from "src/components/attachmentImage";
import {
  days,
  statusList,
  donationTypes,
  shippingTypes,
  tomorrow,
  nextTwoWeeks,
  hours,
  minutes,
  STATUS_GREEN,
  STATUS_RED,
} from "src/components/options";

import {
  getDonations,
  getOneDonation,
  processDonation,
  updateDonorShippingDate,
} from "src/services/api/donation";
import FormattedWIBDate from "src/components/dateFormatter";
import shippingDateSchema from "src/components/schema/shippingDateSchema";

export default function RiwayatDonasi() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isShippingDateModalOpen, setIsShippingDateModalOpen] = useState(false);
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);
  const detailModalRef = useRef(null);
  const [isDonorShippingDate, setIsDonorShippingDate] = useState([]);
  const [imgSrc, setImgSrc] = useState("");
  const [donations, setDonations] = useState([]);
  const [selectedIdDonation, setSelectedIdDonation] = useState();
  const [isCreateShippingDateLoading, setIsCreateShippingDateLoading] =
    useState(false);
  const [isFetchDonationsLoading, setIsFetchDonationsLoading] = useState(false);
  const [isFetchDetailDonationLoading, setIsFetchDetailDonationLoading] =
    useState(false);
  const [isUpdateStatusDonationLoading, setIsUpdateStatusDonationLoading] =
    useState(false);
  const [detailDonation, setDetailDonation] = useState();
  const [requiredAlasanMessage, setRequiredAlasanMessage] = useState("");

  const {
    control,
    setValue,
    watch,
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingDateSchema),
    defaultValues: {
      alasan: "",
      waktuPengiriman: [{ date: "", hour: "", minute: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "waktuPengiriman",
  });

  const shelterShippingDate = detailDonation?.pickupDate;

  handleOutsideModal({
    ref: isShippingDateModalOpen ? "" : detailModalRef,
    isOpen: isShippingDateModalOpen ? "" : isDetailModalOpen,
    onClose: () => {
      isShippingDateModalOpen ? "" : setIsDetailModalOpen(false);
    },
  });

  const handleImageLoaded = (url, index) => {
    if (index === 0 && !imgSrc) {
      setImgSrc(url);
    }
  };

  const handleCloseShippingDateModal = () => {
    if (isDonorShippingDate?.length > 0) {
      reset({
        waktuPengiriman: isDonorShippingDate.map((date) => ({
          date: new Date(date),
          hour: new Date(date).getHours().toString().padStart(2, "0"),
          minute: new Date(date).getMinutes().toString().padStart(2, "0"),
        })),
      });
    } else {
      reset();
    }
    setIsShippingDateModalOpen(false);
    setRequiredAlasanMessage("");
  };

  const onSubmit = async (data) => {
    setIsCreateShippingDateLoading(true);

    const waktuPengirimanFormatted = data?.waktuPengiriman?.map((item) => {
      const newDate = new Date(item.date);
      newDate.setHours(Number(item.hour));
      newDate.setMinutes(Number(item.minute));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate.toISOString();
    });

    const payload = {
      details: waktuPengirimanFormatted,
      ...(watch("alasan") !== "" && {
        alasan: watch("alasan"),
      }),
    };

    if (requiredAlasanMessage) {
      setIsCreateShippingDateLoading(false);
      return;
    }

    try {
      await updateDonorShippingDate(selectedIdDonation, payload);

      // Proses Update Status
      try {
        await processDonation(selectedIdDonation);
        setIsDonorShippingDate(waktuPengirimanFormatted);
        toast.success(
          "Tanggal pengiriman berhasil diatur. Tempat penampung akan mengkonfirmasi pilihan Anda."
        );
        fetchDonations();
      } catch (error) {
        console.error("Error processing donation:", error);
        toast.error("Gagal memproses donasi");
      }
    } catch (error) {
      console.error("Error updating shipping date:", error);
      toast.error("Gagal mengatur tanggal pengiriman");
    } finally {
      setIsCreateShippingDateLoading(false);
      setIsShippingDateModalOpen(false);
    }
  };

  const handleUpdateStatus = async () => {
    setIsUpdateStatusDonationLoading(true);

    try {
      await processDonation(selectedIdDonation);
      toast.success('Status donasi berhasil diproses ke "Dalam Perjalanan".');
      fetchDonations();
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("Gagal memproses status donasi");
    } finally {
      setIsUpdateStatusDonationLoading(false);
      setIsTransitModalOpen(false);
    }
  };

  const fetchDonations = async () => {
    setIsFetchDonationsLoading(true);

    try {
      const datas = await getDonations(selectedStatus);

      setDonations(datas);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Gagal memuat riwayat donasi");
    } finally {
      setIsFetchDonationsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    const fetchDetailDonation = async () => {
      setIsFetchDetailDonationLoading(true);

      try {
        const detail = await getOneDonation(selectedIdDonation);
        setDetailDonation(detail);
        setImgSrc(detail.attachments[0]?.fileName);
      } catch (error) {
        console.error("Error fetching detail donation:", error);
      } finally {
        setIsFetchDetailDonationLoading(false);
      }
    };

    if (selectedIdDonation) {
      fetchDetailDonation();
    }
  }, [selectedIdDonation]);

  return (
    <section className="space-y-6 px-4 sm:px-6 md:px-8">
      <div className="text-[#543A14]">
        <h2 className="text-xl font-bold">Riwayat Donasi</h2>
        <p className="text-base">
          Daftar barang donasi yang telah anda kirim sesuai dengan
          statusnya.{" "}
        </p>
      </div>

      {/* Status Filter Button */}
      <div className="flex gap-1 overflow-y-scroll no-scrollbar">
        {statusList.map((status) => (
          <ButtonCustom
            key={status.value}
            type="button"
            variant={selectedStatus === status.value ? "brown" : "outlineBrown"}
            label={status.label}
            onClick={() => setSelectedStatus(status.value)}
            className="text-nowrap"
          />
        ))}
      </div>

      {/* Loading Fetch Donations */}
      {isFetchDonationsLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <ClipLoader
            color="#F5A623"
            size={50}
            loading={isFetchDonationsLoading}
          />
        </div>
      ) : donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <h1 className="text-[#543A14] font-bold text-xl">
            Belum ada riwayat donasi terkait
          </h1>
        </div>
      ) : (
        <>
          {/* Riwayat Donasi */}
          <div className="space-y-3">
            {donations.map((donation, index) => {
              const latestStatus = donation?.approval?.latestStatus;
              const status = statusList.find(
                (status) => status.value === latestStatus
              )?.label;
              const statusRedDonation = STATUS_RED.includes(latestStatus);
              const statusGreenDonation = STATUS_GREEN.includes(latestStatus);
              const isHighlightedLatestStatus =
                latestStatus === "CONFIRMED" ||
                latestStatus === "PENDING" ||
                latestStatus === "CONFIRMING";

              const statusTextHighlighted = {
                DIGITAL_CHECKING: "Proses pemeriksaan digital",
                PENDING: "Donatur belum mengirim opsi",
                CONFIRMING: "Tempat penampung belum memilih",
              };

              const phoneNumber = donation.collectionCenter?.phoneNumber;

              return (
                <div key={index}>
                  <div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-4 rounded-lg border hover:shadow-lg"
                    key={index}
                    onClick={() => {
                      setIsDetailModalOpen(true);
                      setSelectedIdDonation(donation.id);
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="flex justify-center">
                      <div className="w-[120px] sm:w-[180px] aspect-square bg-[#C2C2C2] rounded-lg relative flex-shrink-0">
                        <AttachmentImage
                          fileName={donation.attachments?.files?.[0].name}
                          index={index}
                          onLoad={handleImageLoaded}
                          onSelect={(url) => {
                            setImgSrc(url);
                          }}
                        />
                      </div>
                    </div>

                    {/* Informasi Summary */}
                    <div className="w-full">
                      <div className="flex flex-col justify-between flex-1 text-sm text-black gap-3 h-full">
                        <div className="flex flex-col sm:flex-row-reverse justify-between items-start gap-3">
                          <span
                            className={`px-4 py-1 text-sm font-bold rounded-full ${
                              statusGreenDonation
                                ? "bg-[#1F7D53]"
                                : statusRedDonation
                                  ? "bg-[#E52020]"
                                  : "bg-[#543A14]"
                            } text-white`}
                          >
                            {status}
                          </span>
                          <div>
                            <p className="font-bold">
                              {donation.collectionCenter.name}
                            </p>
                            <p>{donation?.post?.name}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-bold">Event: </span>
                              {donation?.event?.name || "-"}
                            </p>
                            <p>
                              <span className="font-bold">Jenis: </span>
                              {donationTypes.find(
                                (type) => type.value === donation.donationType
                              )?.label || donation.donationType}{" "}
                              ({donation.quantity}pcs, {donation.weight}kg)
                            </p>
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-bold">Metode: </span>
                              {shippingTypes.find(
                                (type) => type.value === donation.pickupType
                              )?.label || donation.pickupType}
                            </p>
                            <p>
                              <span className="font-bold">
                                Tanggal Pengiriman:{" "}
                              </span>
                              {statusTextHighlighted[latestStatus] || (
                                <FormattedWIBDate
                                  date={donation.pickupDate}
                                  type="time"
                                />
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Button Card */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <ButtonCustom
                            variant="outlineOrange"
                            type="button"
                            label="Hubungi Tempat Penampung"
                            className="text-sm sm:text-base"
                            onClick={(e) => {
                              e.stopPropagation();
                              const urlWhatsapp = `https://wa.me/${phoneNumber}?text=Halo, saya ingin menanyakan tentang donasi saya dengan ID barang donasi: ${donation.id}.`;
                              window.open(urlWhatsapp, "_blank");
                            }}
                          />
                          {(latestStatus === "PENDING" ||
                            latestStatus === "CONFIRMED") && (
                            <ButtonCustom
                              variant="orange"
                              type="button"
                              className="text-sm sm:text-base"
                              label={
                                latestStatus === "PENDING"
                                  ? "Atur opsi tanggal"
                                  : "Atur ulang tanggal"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIdDonation(donation.id);
                                setIsShippingDateModalOpen(true);
                              }}
                            />
                          )}
                          {latestStatus === "TRANSPORTING" && (
                            <ButtonCustom
                              variant="orange"
                              type="button"
                              className="w-full sm:w-fit"
                              label="Antar Donasi Sekarang"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIdDonation(donation.id);
                                setIsTransitModalOpen(true);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal Detail Data Donasi */}
      <ModalDetailDonation
        isOpen={isDetailModalOpen}
        detailModalRef={detailModalRef}
        detailDonation={detailDonation}
        isFetchDetailDonationLoading={isFetchDetailDonationLoading}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        STATUS_GREEN={STATUS_GREEN}
        STATUS_RED={STATUS_RED}
        handleImageLoaded={handleImageLoaded}
        setIsShippingDateModalOpen={setIsShippingDateModalOpen}
        selectedIdDonation={selectedIdDonation}
      />

      {/* Modal Tanggal Pengiriman */}
      {isShippingDateModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-4 md:p-8 space-y-6 text-black w-full max-w-screen-sm max-h-[90vh] overflow-y-auto">
            <h1 className="font-bold text-xl">
              Atur {shelterShippingDate && "Ulang"} Tanggal Pengiriman
            </h1>

            {isFetchDetailDonationLoading ? (
              <div className="flex justify-center items-center h-60 w-full">
                <ClipLoader color="#543A14" size={30} />
              </div>
            ) : (
              <>
                <div className="flex flex-col pb-4 border-b space-y-1">
                  <span>{detailDonation?.collectionCenter?.name}</span>
                  {detailDonation?.post && (
                    <span>{detailDonation?.post?.name}</span>
                  )}
                  <TextBetween
                    label="Waktu Operasional"
                    value={detailDonation?.collectionCenter?.activeHours
                      ?.sort(
                        (a, b) =>
                          days.findIndex((d) => d.value === a.day) -
                          days.findIndex((d) => d.value === b.day)
                      )
                      ?.map((item) => {
                        const dayLabel =
                          days.find((d) => d.value === item.day)?.label ||
                          item.day;
                        return `${dayLabel}, ${item.openTime} - ${item.closeTime}`;
                      })}
                  />
                  {shelterShippingDate && (
                    <TextBetween
                      label="Tanggal Pilihan Tempat Penampung"
                      value={[
                        <span className="font-bold">
                          <FormattedWIBDate
                            date={shelterShippingDate}
                            type="time"
                          />
                        </span>,
                      ]}
                    />
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {shelterShippingDate && (
                    <div>
                      <FormInput
                        inputType="text"
                        label="Alasan Penggantian"
                        placeholder="Contoh: Ada keperluan mendadak"
                        register={register("alasan")}
                      />
                      {requiredAlasanMessage && (
                        <p className="text-red-600 mt-1 text-sm">
                          {requiredAlasanMessage}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="font-bold">
                      Pilih Tanggal & Waktu (Maks. 5 Opsi)
                    </span>
                    <p className="text-sm text-gray-600">
                      Tempat penampung akan memilih salah satu yang sesuai
                      dengan jadwal mereka, lalu mengonfirmasikannya kepada
                      Anda.
                    </p>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-1">
                      <div className="flex md:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
                          <DatePicker
                            placeholderText="Pilih tanggal"
                            selected={watch(`waktuPengiriman.${index}.date`)}
                            onChange={(date) => {
                              setValue(`waktuPengiriman.${index}.date`, date);
                            }}
                            minDate={tomorrow}
                            maxDate={nextTwoWeeks}
                            dateFormat="EEEE, dd/MM/yyyy"
                            locale={id}
                            popperPlacement="right"
                            className="border border-[#C2C2C2] rounded-lg px-4 py-3 min-h-12 focus:outline-none focus:border-black placeholder:text-[#C2C2C2] bg-white w-full md:w-44"
                          />

                          <div className="flex items-center justify-between gap-2">
                            <FormInput
                              inputType="dropdownInput"
                              options={hours}
                              control={control}
                              name={`waktuPengiriman.${index}.hour`}
                              placeholder="17"
                              inputStyles="w-25"
                            />
                            <span>:</span>
                            <FormInput
                              inputType="dropdownInput"
                              options={minutes}
                              control={control}
                              name={`waktuPengiriman.${index}.minute`}
                              placeholder="00"
                              inputStyles="w-25"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {fields.length < 5 && (
                            <button
                              type="button"
                              onClick={() =>
                                append({ date: "", hour: "", minute: "" })
                              }
                              className="bg-[#F0BB78] text-white rounded-lg text-sm h-12 px-4"
                            >
                              + Add
                            </button>
                          )}
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="bg-[#E52020] text-white rounded-lg text-sm h-12 px-4"
                            >
                              <Icon icon="mdi:trash" width={20} color="white" />
                            </button>
                          )}
                        </div>
                      </div>
                      {errors.waktuPengiriman?.[index] && (
                        <p className="text-red-500 text-sm">
                          {errors.waktuPengiriman[index].message}
                        </p>
                      )}
                    </div>
                  ))}

                  {errors.waktuPengiriman?.root?.message && (
                    <p className="text-red-500 text-sm">
                      {errors.waktuPengiriman.root.message}
                    </p>
                  )}

                  <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
                    <ButtonCustom
                      label={
                        isCreateShippingDateLoading ? (
                          <ClipLoader color="#fff" size={20} />
                        ) : (
                          "Kirim"
                        )
                      }
                      variant="brown"
                      type="submit"
                      className="w-full"
                      onClick={() => {
                        if (
                          watch("alasan") === "" &&
                          detailDonation?.pickupDate
                        ) {
                          setRequiredAlasanMessage(
                            "Alasan penggantian wajib diisi"
                          );
                        } else {
                          setRequiredAlasanMessage("");
                        }
                      }}
                    />
                    <ButtonCustom
                      label="Batal"
                      onClick={handleCloseShippingDateModal}
                      variant="white"
                      type="button"
                      className="w-full"
                    />
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal Dalam Perjalanan */}
      {isTransitModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px]">
            <h1 className="font-bold text-xl">
              Konfirmasi Antar Donasi Sekarang
            </h1>
            <p className="text-sm">
              Dengan menekan tombol ini, status donasi akan berubah menjadi{" "}
              <span className="font-bold">"Dalam Perjalanan"</span>. Pastikan
              Anda benar-benar sedang atau sudah ingin berangkat menuju tempat
              penampung mengantarkan barang donasi.
            </p>

            <div className="flex flex-col sm:flex-row justify-end space-x-3 mt-4 gap-3">
              <ButtonCustom
                label="Konfirmasi"
                variant="brown"
                type="button"
                className="w-full"
                onClick={() => {
                  handleUpdateStatus();
                }}
              />
              <ButtonCustom
                label="Batal"
                onClick={handleCloseShippingDateModal}
                variant="white"
                type="button"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
