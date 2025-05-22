"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { format, toZonedTime } from "date-fns-tz";

import { IconText } from "src/components/text";
import { FormInput } from "src/components/formInput";
import { TextBetween } from "src/components/text";
import handleOutsideModal from "src/components/handleOutsideModal";
import { days, goodsTypes } from "src/components/options";

import {
  getCollectionCenters,
  getOneCollectionCenter,
} from "src/services/api/collectionCenter";
import { getEvents } from "src/services/api/event";
import { getPosts } from "src/services/api/post";

const GoodsTypeBadge = ({ icon }) => {
  return (
    <div className="bg-[#543a14] h-7 aspect-square rounded-full flex items-center justify-center">
      <Icon icon={icon} width={20} height={20} color="white" />
    </div>
  );
};

const EventDropPointIcon = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-1">
      <Icon icon={icon} color="#F0BB78" />
      <p className="text-[#F0BB78] text-nowrap">{text}</p>
    </div>
  );
};

export default function TempatPenampung() {
  const detailModalRef = useRef(null);

  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedCollectionCenterId, setSelectedCollectionCenterId] =
    useState(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedDropPoint, setSelectedDropPoint] = useState("");
  const [dataCollectionCenters, setDataCollectionCenters] = useState(null);
  const [dataOneCollectionCenter, setDataOneCollectionCenter] = useState(null);
  const [dataEvents, setDataEvents] = useState(null);
  const [dataPosts, setDataPosts] = useState(null);
  const [isGetCollectionCentersLoading, setIsGetCollectionCentersLoading] =
    useState(false);

  const goodsTypeCheck = Object.fromEntries(
    goodsTypes.map((item) => [item.value, item])
  );

  const dataSelectedEvent = dataEvents
    ?.map((item) => ({
      value: item.id,
      label: item.name,
      ...item,
    }))
    .find((item) => item.value === selectedEvent);

  const dataSelectedPost = dataPosts
    ?.map((item) => ({
      value: item.id,
      label: item.name,
      ...item,
    }))
    .find((item) => item.value === selectedDropPoint);

  const formatToIndonesianDate = (isoDate) => {
    if (!isoDate) return null;

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return null;

    return date.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formattedStartDate = formatToIndonesianDate(
    dataSelectedEvent?.startDate
  );
  const formattedEndDate = formatToIndonesianDate(dataSelectedEvent?.endDate);

  handleOutsideModal({
    ref: detailModalRef,
    isOpen: isDetailModal,
    onClose: () => {
      setIsDetailModal(false);
      setSelectedCollectionCenterId(null);
      setSelectedEvent("");
      setSelectedDropPoint("");
    },
  });

  useEffect(() => {
    const fetchCollectionCenters = async () => {
      setIsGetCollectionCentersLoading(true);
      try {
        const data = await getCollectionCenters();
        const approvedData = data.filter(
          (item) => item.approval.latestStatus === "APPROVED"
        );

        setDataCollectionCenters(approvedData);
      } catch (error) {
        toast.error("Gagal memuat data tempat penampung");
      } finally {
        setIsGetCollectionCentersLoading(false);
      }
    };

    fetchCollectionCenters();
  }, []);

  useEffect(() => {
    const fetchOneCollectionCenter = async () => {
      if (selectedCollectionCenterId) {
        try {
          const data = await getOneCollectionCenter(selectedCollectionCenterId);
          setDataOneCollectionCenter(data);
        } catch (error) {
          toast.error("Gagal memuat data detail tempat penampung yang dipilih");
        }
      }
    };

    fetchOneCollectionCenter();
  }, [selectedCollectionCenterId]);

  useEffect(() => {
    const fecthEvents = async () => {
      if (selectedCollectionCenterId) {
        try {
          const data = await getEvents(selectedCollectionCenterId);
          setDataEvents(data);
        } catch (error) {
          toast.error("Gagal memuat data event");
        }
      }
    };

    fecthEvents();
  }, [selectedCollectionCenterId]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (selectedCollectionCenterId) {
        try {
          const data = await getPosts(selectedCollectionCenterId);
          setDataPosts(data);
        } catch (error) {
          toast.error("Gagal memuat data event");
        }
      }
    };

    fetchPosts();
  }, [selectedCollectionCenterId]);

  return (
    <>
      <section className="bg-white flex justify-center px-8 py-12">
        <div className="max-w-[1200px] space-y-6">
          <div className="flex justify-center">
            <h1 className="text-[#543A14] text-[32px] text-center font-bold w-3/5">
              Tempat Penampung Yang Sudah Bekerjasama
            </h1>
          </div>

          {/* Filter Section */}
          <div className="flex justify-center items-center gap-4">
            <p className="font-bold text-base text-[#543A14]">
              Jenis Barang yang Diterima:
            </p>
            <div className="flex gap-3">
              {goodsTypes.map(({ text, src, alt, iconType, variant }) => (
                <IconText
                  key={text}
                  text={text}
                  src={src}
                  alt={alt}
                  iconType={iconType}
                  variant={variant}
                />
              ))}
            </div>
          </div>

          {/* Donation Points Grid */}
          <div className="flex flex-wrap items-center justify-center h-[500px] overflow-scroll">
            {isGetCollectionCentersLoading ? (
              <ClipLoader
                color="#543A14"
                loading={isGetCollectionCentersLoading}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <div className="flex flex-wrap gap-5 items-stretch ">
                {dataCollectionCenters?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="transition-transform duration-300 hover:shadow-lg hover:z-1 rounded-md p-2 w-full max-w-[220px]"
                      onClick={() => {
                        setIsDetailModal(true);
                        setSelectedCollectionCenterId(item.id);
                      }}
                    >
                      <div className="space-y-3 h-full flex flex-col justify-between">
                        <div className="flex flex-col gap-3">
                          <div className="h-[156px] bg-gray-200 relative border-2 border-amber-300 rounded-xl overflow-hidden">
                            {item?.attachment?.path ? (
                              <Image
                                src={item?.attachment?.path}
                                alt={item.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            ) : null}
                          </div>
                          <div className="space-y-1 text-black text-sm">
                            <h3 className="font-bold text-base leading-5 mb-2">
                              {item.name}
                            </h3>
                            <p>{`${item.address.reference ? `(${item?.address?.reference})` : ""} ${item.address.detail}`}</p>
                            <p>{item.phoneNumber}</p>
                            <p>
                              {item.pickupTypes.includes("PICKED_UP")
                                ? `Penjemputan ${item.distanceLimitKm ? `(Maks. ${item.distanceLimitKm}km)` : ""}`
                                : "Penjemputan tidak tersedia"}
                            </p>
                            <EventDropPointIcon
                              icon="mdi:pin"
                              text={`${item.posts.lenght > 0 ? `${item.posts.length} Drop Point Tersedia` : `Drop Point Tidak Tersedia`}`}
                            />
                            <EventDropPointIcon
                              icon="material-symbols:event"
                              text={`${item.events.lenght > 0 ? `${item.events.length} Event Berlangsung` : `Belum Ada Event`}`}
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-3">
                          {[...new Set(item.types)]?.map((type) => {
                            return (
                              goodsTypeCheck[type] && (
                                <GoodsTypeBadge
                                  key={type}
                                  icon={goodsTypeCheck[type].src}
                                />
                              )
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal Detail */}
            {isDetailModal &&
              selectedCollectionCenterId &&
              dataOneCollectionCenter && (
                <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
                  <div
                    ref={detailModalRef}
                    className="bg-white rounded-lg p-8 space-y-5 text-black"
                  >
                    <h1 className="font-bold text-xl">
                      Detail Tempat Penampung
                    </h1>

                    {/* Detail Informasi */}
                    <div className="text-base border-b border-black pb-5 flex gap-5">
                      {/* Left Section */}
                      <div className="rounded-lg relative w-70 h-48 bg-[#EDEDED] overflow-hidden">
                        {dataOneCollectionCenter?.attachment?.file?.path ? (
                          <Image
                            src={dataOneCollectionCenter?.attachment?.file.path}
                            alt={dataOneCollectionCenter.name}
                            fill
                            className="object-contain object-center rounded-lg"
                          />
                        ) : null}
                      </div>

                      {/* Right Section */}
                      <div className="max-w-lg">
                        <h2 className="font-bold">
                          {dataOneCollectionCenter.name}
                        </h2>
                        <p>{dataOneCollectionCenter.description}</p>
                        <p>{`${dataOneCollectionCenter.address.reference ? `(${dataOneCollectionCenter?.address?.reference})` : ""} ${dataOneCollectionCenter.address.detail}`}</p>
                        <p>{dataOneCollectionCenter.phoneNumber}</p>
                        <p>
                          {dataOneCollectionCenter.pickupTypes.includes(
                            "PICKED_UP"
                          )
                            ? `Penjemputan (Maks. ${dataOneCollectionCenter.distanceLimitKm}km)`
                            : "Penjemputan tidak tersedia"}
                        </p>
                        <TextBetween
                          label="Waktu Operasional"
                          value={dataOneCollectionCenter.activeHours.map(
                            (item) => {
                              const dayLabel = days.find(
                                (day) => day.value === item.day
                              )?.label;
                              return `${dayLabel} ${item.openTime} - ${item.closeTime}`;
                            }
                          )}
                        />
                        <TextBetween
                          label="Menerima Barang"
                          value={dataOneCollectionCenter.types
                            .map((item) => {
                              return goodsTypeCheck[item]?.text;
                            })
                            .join(", ")}
                        />
                      </div>
                    </div>

                    {/* Events */}
                    <div className="text-base border-b border-black pb-4">
                      <FormInput
                        label="Pilih Event"
                        name="goods"
                        value={selectedEvent}
                        onChange={setSelectedEvent}
                        options={dataEvents?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        placeholder="Pilih event untuk melihat detail"
                        className="mb-1"
                        inputType="dropdown"
                      />
                      <TextBetween
                        label="Lokasi"
                        value={dataSelectedEvent?.address || "-"}
                      />
                      <TextBetween
                        label="Periode"
                        value={
                          formattedStartDate && formattedEndDate
                            ? `${formattedStartDate} - ${formattedEndDate}`
                            : "-"
                        }
                      />
                      <TextBetween
                        label="Barang Yang Dibutuhkan"
                        value={
                          dataSelectedEvent?.types
                            .map((item) => {
                              return goodsTypeCheck[item]?.text;
                            })
                            .join(", ") || "-"
                        }
                      />
                    </div>

                    {/* Drop Point */}
                    <div className="text-base">
                      <FormInput
                        label="Pilih Cabang/Drop Point"
                        name="dropPoint"
                        value={selectedDropPoint}
                        onChange={setSelectedDropPoint}
                        options={dataPosts?.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        placeholder="Pilih cabang/drop point untuk melihat detail"
                        className="mb-1"
                        inputType="dropdown"
                      />
                      <p className="text-end">
                        {dataSelectedPost?.address?.reference &&
                        dataSelectedPost?.address?.detail
                          ? `(${dataSelectedPost?.address?.reference}) ${dataSelectedPost?.address?.detail}`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>
    </>
  );
}
