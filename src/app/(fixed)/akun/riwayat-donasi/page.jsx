"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import Image from "next/image";

import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import handleOutsideModal from "src/components/handleOutsideModal";
import { TextBetween, ListTextWithTitle } from "src/components/text";
import AttachmentImage from "src/components/attachmentImage";
import {
  statusList,
  donationTypes,
  shippingTypes,
} from "src/components/options";

import { getDonations, getOneDonation } from "src/services/api/donation";

export default function RiwayatDonasi() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isShippingDateModalOpen, setIsShippingDateModalOpen] = useState(false);
  const detailModalRef = useRef(null);
  const shippingDateModalRef = useRef(null);
  const [isDonorShippingDate, setIsDonorShippingDate] = useState([]);
  const [isShelterShippingDate, setIsShelterShippingDate] = useState(
    "10/11/2025 08:00 WIB"
  );
  const [imgSrc, setImgSrc] = useState("");
  const [imageSrcList, setImageSrcList] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [donations, setDonations] = useState([]);
  const [detailDonation, setDetailDonation] = useState();
  const [selectedIdDonation, setSelectedIdDonation] = useState();
  const [imageUrls, setImageUrls] = useState([]);

  const { control, setValue, watch, reset, handleSubmit, register } = useForm({
    defaultValues: {
      alasan: "",
      waktuPengiriman: [{ date: "", hour: "", minute: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "waktuPengiriman",
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));

  handleOutsideModal({
    ref: isShippingDateModalOpen ? "" : detailModalRef,
    isOpen: isShippingDateModalOpen
      ? "isShippingDateModalOpen"
      : isDetailModalOpen,
    onClose: () => {
      isShippingDateModalOpen ? "" : setIsDetailModalOpen(false);
    },
  });

  // const handleImageLoaded = (src, index) => {
  //   setImageSrcList((prev) => {
  //     const updated = [...prev];
  //     updated[index] = src;

  //     if (index === 0 && !imgSrc) {
  //       setImgSrc(src);
  //     }

  //     return updated;
  //   });
  // };

  const handleImageLoaded = (url, index) => {
    setImageUrls((prev) => ({ ...prev, [index]: url }));

    setImageSrcList((prev) => {
      const updated = [...prev];
      updated[index] = url;

      if (index === 0 && !imgSrc) {
        setImgSrc(url);
      }

      return updated;
    });
  };

  const handleCloseShippingDateModal = () => {
    if (isDonorShippingDate.length > 0) {
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
  };

  const onSubmit = (data) => {
    const waktuPengirimanFormatted = data.waktuPengiriman.map((item) => {
      const newDate = new Date(item.date);
      newDate.setHours(Number(item.hour));
      console.log("Hour:", item.hour);
      newDate.setMinutes(Number(item.minute));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate.toISOString();
    });

    console.log("Formatted:", waktuPengirimanFormatted);
    setIsDonorShippingDate(waktuPengirimanFormatted);

    setIsSubmitted(true);

    console.log("Data yang dikirim:", data);
    setIsShippingDateModalOpen(false);
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const datas = await getDonations();

        const detailedDonations = await Promise.all(
          datas.map(async (donation) => {
            try {
              const detail = await getOneDonation(donation.id);
              return detail;
            } catch (error) {
              console.error(
                "Error fetching detail for donation:",
                donation.id,
                error
              );
              return donation;
            }
          })
        );

        setDonations(detailedDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    const fetchDetailDonation = async () => {
      try {
        const detail = await getOneDonation(selectedIdDonation);
        setDetailDonation(detail);
        setImgSrc(detail.attachments[0]?.fileName);
      } catch (error) {
        console.error("Error fetching detail donation:", error);
      }
    };
    if (selectedIdDonation) {
      fetchDetailDonation();
    }
  }, [selectedIdDonation]);

  return (
    <section className="space-y-6 ">
      <div className="text-[#543A14]">
        <h2 className="text-xl font-bold">Riwayat Donasi</h2>
        <p className="text-base">
          Daftar barang donasi yang telah anda kirim sesuai dengan
          statusnya.{" "}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-y-scroll no-scrollbar">
        {statusList.map((status) => (
          <ButtonCustom
            newKey={status.value}
            type="button"
            variant={selectedStatus === status.value ? "brown" : "outlineBrown"}
            label={status.label}
            onClick={() => setSelectedStatus(status.value)}
            className="text-nowrap"
          />
        ))}
      </div>

      {/* Riwayat Donasi */}
      <div className="space-y-3">
        {donations.map((donation, index) => (
          <>
            <div
              className="rounded-lg p-3 pt-0 flex gap-8 hover:shadow-lg border"
              key={index}
              onClick={() => {
                setIsDetailModalOpen(true);
                setSelectedIdDonation(donation.id);
              }}
            >
              <div className="min-w-[180px] aspect-square bg-[#C2C2C2] rounded-b-lg relative">
                {/* <Image
                  src={imgSrc}
                  alt="Donation item image large"
                  fill
                  className="object-cover rounded-lg"
                /> */}
                <AttachmentImage
                  fileName={donation.attachments?.files?.[0].name}
                  index={index}
                  onLoad={handleImageLoaded}
                  onSelect={(url) => {
                    setImgSrc(url);
                  }}
                />
              </div>

              <div className="w-full">
                <div className="flex flex-col justify-between text-black text-sm h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1 pt-3">
                      <span className="font-bold">
                        {donation.collectionCenter.name}
                      </span>
                      <span>{donation.post}</span>
                    </div>
                    <span className="bg-[#543a14] text-white px-6 py-2 font-bold rounded-b-lg">
                      {statusList.find(
                        (status) =>
                          status.value === donation.approvals.latestStatus
                      )?.label || donation.approvals.latestStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span>Event:</span>
                        <span>{donation?.event?.name || "-"}</span>
                      </div>
                      <span>
                        {donationTypes.find(
                          (type) => type.value === donation.donationType
                        )?.label || donation.donationType}{" "}
                        ({donation.quantity}pcs, {donation.weight}kg)
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <span>Metode Pengiriman:</span>
                        <span>
                          {shippingTypes.find(
                            (type) => type.value === donation.pickupType
                          )?.label || donation.pickupType}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span>Tanggal Pengiriman:</span>
                        <span className="font-bold text-[#F0BB78]">
                          Menunggu pemeriksaan digital
                        </span>
                      </div>
                    </div>
                  </div>
                  <ButtonCustom
                    variant="outlineOrange"
                    type="button"
                    label="Hubungi Tempat Penampung"
                    className="w-fit"
                  />
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      {/* Modal Detail */}
      {isDetailModalOpen && detailDonation && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={detailModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black"
          >
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-xl">
                Detail Riwayat Barang Donasi
              </h1>
              <span className="bg-[#543a14] text-white px-6 py-2 font-bold rounded-lg">
                {statusList.find(
                  (status) =>
                    status.value === detailDonation?.approvals.latestStatus
                )?.label || detailDonation?.approvals.latestStatus}
              </span>
            </div>
            <div className="flex space-x-8">
              {/* Left Section */}
              <div className="w-80 space-y-6">
                <div className="bg-[#C2C2C2] aspect-square rounded-lg relative">
                  <Image
                    src={imgSrc}
                    alt="Donation item image large"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex gap-2 overflow-scroll no-scrollbar">
                  {detailDonation?.attachments?.files?.map((file, index) => {
                    return (
                      <div
                        key={index}
                        className="bg-[#C2C2C2] rounded-lg min-w-16 aspect-square relative"
                      >
                        <AttachmentImage
                          index={index}
                          fileName={file.name}
                          onSelect={(src) => setImgSrc(src)}
                          onLoad={handleImageLoaded}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <ButtonCustom
                    variant="outlineOrange"
                    type="button"
                    label="Hubungi Tempat Penampung"
                    className="w-full"
                  />
                  <ButtonCustom
                    variant="orange"
                    type="button"
                    label={`Atur ${isShelterShippingDate ? `Ulang` : ``} Tanggal Pengiriman`}
                    className="w-full"
                    onClick={() => setIsShippingDateModalOpen(true)}
                  />
                </div>
              </div>
              {/* Right Section */}
              <div className="space-y-4">
                <ListTextWithTitle
                  title="Tanggal Donasi:"
                  values={[detailDonation?.createdAt]}
                />
                <ListTextWithTitle
                  title="Informasi Donatur:"
                  values={[
                    `${detailDonation?.user.firstName} ${detailDonation?.user.lastName}`,
                    detailDonation?.user.phoneNumber,
                    `${detailDonation?.address.reference ? `(${detailDonation?.address.reference}) ` : ""}${detailDonation?.address.detail}`,
                  ]}
                  className="max-w-[450px]"
                />
                <ListTextWithTitle
                  title="Barang Donasi:"
                  values={[
                    `${donationTypes.find((type) => type.value === detailDonation?.donationType)?.label || detailDonation?.donationType} (${detailDonation?.quantity}pcs, ${detailDonation?.weight}kg)`,
                  ]}
                />
                <ListTextWithTitle
                  title="Detail Tempat Penampung:"
                  values={[
                    detailDonation?.collectionCenter.name,
                    detailDonation?.post,
                    `(${detailDonation?.targetAddress.reference}) ${detailDonation?.targetAddress.detail}`,
                    <TextBetween
                      label="Event"
                      value={detailDonation?.event?.name}
                    />,
                  ]}
                  className="max-w-[450px]"
                />
                <ListTextWithTitle
                  title="Informasi Pengiriman:"
                  values={[
                    shippingTypes.find(
                      (type) => type.value === detailDonation?.pickupType
                    )?.label || detailDonation?.pickupType,
                    <TextBetween
                      label="Tanggal Pengajuan"
                      value={[
                        isDonorShippingDate.length > 0 ? (
                          isDonorShippingDate.map((date, index) => (
                            <span key={index}>
                              {format(new Date(date), "dd/MM/yyyy HH:mm")} WIB
                            </span>
                          ))
                        ) : (
                          <span className="font-bold text-[#F0BB78]">
                            Menunggu opsi donatur
                          </span>
                        ),
                      ]}
                      className="border-b border-[#C2C2C2] pb-1 text-end"
                      type="list"
                    />,
                    <TextBetween
                      label={
                        <>
                          Tanggal Yang Dikonfirmasi <br /> Tempat Penampung
                        </>
                      }
                      value={[
                        isShelterShippingDate ? (
                          <span className="font-bold">
                            {isShelterShippingDate}
                          </span>
                        ) : (
                          <span className="font-bold text-[#F0BB78] text-end w-2/3">
                            Menunggu konfirmasi tempat penampung
                          </span>
                        ),
                      ]}
                    />,
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tanggal Pengiriman */}
      {isShippingDateModalOpen && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={shippingDateModalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black max-w-[640px]"
          >
            <h1 className="font-bold text-xl">
              Atur {isShelterShippingDate && "Ulang"} Tanggal Pengiriman
            </h1>
            <div className="flex flex-col pb-4 border-b">
              <span>Tempat Penampung Alam Sutera</span>
              <span>Drop Point Tangerang Kota</span>
              <TextBetween
                label="Waktu Operasional"
                value={["Senin - Jumat (08:00 - 17:00)"]}
              />
              <TextBetween
                label="Tanggal Pilihan Tempat Penampung"
                value={[
                  <span className="font-bold">{isShelterShippingDate}</span>,
                ]}
              />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {isShelterShippingDate && (
                <FormInput
                  inputType="text"
                  label="Alasan Penggantian"
                  placeholder="Contoh: Ada keperluan mendadak"
                  register={register("alasan")}
                />
              )}

              <div className="flex flex-col gap-3">
                <span className="font-bold">
                  Pilih Tanggal & Waktu (Maks. 5 Opsi)
                </span>
                <p className="text-sm">
                  Tempat penampung akan memilih salah satu yang sesuai dengan
                  jadwal mereka, lalu mengonfirmasikannya kepada Anda.
                </p>
              </div>

              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="flex justify-between">
                    <DatePicker
                      placeholderText="Pilih tanggal"
                      selected={watch(`waktuPengiriman.${index}.date`)}
                      onChange={(date) => {
                        setValue(`waktuPengiriman.${index}.date`, date);
                      }}
                      minDate={tomorrow}
                      dateFormat="EEEE, dd/MM/yyyy"
                      locale={id}
                      popperPlacement="right"
                      className="border border-[#C2C2C2] rounded-lg px-5 py-3 min-h-12 focus:outline-none focus:border-black placeholder:text-[#C2C2C2] bg-white w-44"
                    />
                    <div className="flex items-center gap-1">
                      <FormInput
                        inputType="dropdownInput"
                        options={hours}
                        control={control}
                        name={`waktuPengiriman.${index}.hour`}
                        placeholder={"17"}
                        inputStyles="w-25"
                      />
                      <span>:</span>
                      <FormInput
                        inputType="dropdownInput"
                        options={minutes}
                        control={control}
                        name={`waktuPengiriman.${index}.minute`}
                        placeholder={"00"}
                        inputStyles="w-25"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          date: "",
                          hour: "",
                          minute: "",
                        })
                      }
                      className="bg-[#F0BB78] text-white rounded-lg text-sm text-nowrap h-12 px-5"
                    >
                      + Add
                    </button>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-[#E52020] text-white rounded-lg text-sm text-nowrap h-12 px-5"
                      >
                        <Icon icon="mdi:trash" width={20} color="white" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-3 mt-4">
                <ButtonCustom
                  label="Kirim"
                  variant="brown"
                  type="submit"
                  onClick={onSubmit}
                  className="w-full"
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
          </div>
        </div>
      )}
    </section>
  );
}
