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
  const [isLoadingFetchDetail, setIsLoadingFetchDetail] = useState(false);

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
  const dataSelectedPostsAddress = dataSelectedPost?.address;

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
        const result = await getCollectionCenters();

        setDataCollectionCenters(result.data);
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
        setIsLoadingFetchDetail(true);

        try {
          const data = await getOneCollectionCenter(selectedCollectionCenterId);
          setDataOneCollectionCenter(data);
        } catch (error) {
          toast.error("Gagal memuat data detail tempat penampung yang dipilih");
        } finally {
          setIsLoadingFetchDetail(false);
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
      <section className="bg-white flex justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[1200px] w-full space-y-6">
          <div className="flex justify-center">
            <h1 className="text-[#543A14] text-2xl sm:text-3xl text-center font-bold w-full sm:w-3/5">
              Tempat Penampung Yang Sudah Bekerjasama
            </h1>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="font-bold text-base text-[#543A14]">
              Jenis Barang yang Diterima:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
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
          <div className="h-[500px] overflow-y-auto scrollbar-thin pr-2">
            {isGetCollectionCentersLoading ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader
                  color="#543A14"
                  loading={isGetCollectionCentersLoading}
                  size={50}
                />
              </div>
            ) : dataCollectionCenters?.length === 0 ||
              !dataCollectionCenters ? (
              <div className="flex flex-col justify-center items-center gap-3 h-full text-center text-[#543A14]">
                <p className="font-bold text-lg sm:text-xl">
                  Tempat penampung akan segera tersedia
                </p>
                <p className="text-sm sm:text-base">
                  Nantikan kerja sama kami dengan mitra-mitra terpercaya!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {dataCollectionCenters?.map((item, index) => (
                  <div
                    key={index}
                    className="transition-transform duration-300 hover:shadow-lg hover:z-1 rounded-md p-2 cursor-pointer bg-white"
                    onClick={() => {
                      setIsDetailModal(true);
                      setSelectedCollectionCenterId(item.id);
                    }}
                  >
                    <div className="space-y-3 h-full flex flex-col justify-between">
                      <div className="flex flex-col gap-3">
                        <div className="h-[156px] bg-gray-200 relative border-2 border-amber-300 rounded-xl overflow-hidden">
                          {item?.attachment?.path && (
                            <Image
                              src={item.attachment.path}
                              alt={item.name}
                              layout="fill"
                              objectFit="cover"
                            />
                          )}
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
                            text={
                              item.posts.length > 0
                                ? `${item.posts.length} Drop Point Tersedia`
                                : `Drop Point Tidak Tersedia`
                            }
                          />
                          <EventDropPointIcon
                            icon="material-symbols:event"
                            text={
                              item.events.length > 0
                                ? `${item.events.length} Event Berlangsung`
                                : `Belum Ada Event`
                            }
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[...new Set(item.types)]?.map(
                          (type) =>
                            goodsTypeCheck[type] && (
                              <GoodsTypeBadge
                                key={type}
                                icon={goodsTypeCheck[type].src}
                              />
                            )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Detail */}
            {isDetailModal && selectedCollectionCenterId && (
              <div
                className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
              >
                <div
                  ref={detailModalRef}
                  className="bg-white rounded-lg p-6 sm:p-8 space-y-5 text-black max-w-[90vw] sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto"
                >
                  <h1 className="font-bold text-xl">Detail Tempat Penampung</h1>

                  {isLoadingFetchDetail ? (
                    <div className="flex items-center justify-center w-full h-40">
                      <ClipLoader
                        color="#543A14"
                        loading={isLoadingFetchDetail}
                        size={50}
                      />
                    </div>
                  ) : (
                    dataOneCollectionCenter && (
                      <div className="space-y-5">
                        {/* Detail */}
                        <div className="text-base border-b border-black pb-5 flex flex-col sm:flex-row gap-5">
                          <div className="rounded-lg relative min-w-[180px] h-48 bg-[#EDEDED] overflow-hidden">
                            {dataOneCollectionCenter?.attachment?.file
                              ?.path && (
                              <Image
                                src={
                                  dataOneCollectionCenter.attachment.file.path
                                }
                                alt={dataOneCollectionCenter.name}
                                fill
                                className="object-contain object-center rounded-lg"
                              />
                            )}
                          </div>
                          <div className="w-full space-y-2">
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
                                .map((item) => goodsTypeCheck[item]?.text)
                                .join(", ")}
                            />
                          </div>
                        </div>

                        {/* Events */}
                        <div className="text-base border-b border-black pb-4 space-y-2">
                          <FormInput
                            label="Event yang Sedang Berlangsung"
                            name="goods"
                            value={selectedEvent}
                            onChange={setSelectedEvent}
                            options={dataEvents?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            placeholder="Pilih event"
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
                                .map((item) => goodsTypeCheck[item]?.text)
                                .join(", ") || "-"
                            }
                          />
                        </div>

                        {/* Drop Point */}
                        <div className="text-base space-y-2">
                          <FormInput
                            label="Cabang/Drop Point yang Tersedia"
                            name="dropPoint"
                            value={selectedDropPoint}
                            onChange={setSelectedDropPoint}
                            options={dataPosts?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                            placeholder="Pilih cabang/drop point"
                            className="mb-1"
                            inputType="dropdown"
                          />
                          <p>
                            {dataSelectedPostsAddress?.detail
                              ? `${dataSelectedPostsAddress?.reference ? `(${dataSelectedPostsAddress?.reference})` : ""} ${dataSelectedPost?.address?.detail}`
                              : "-"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
