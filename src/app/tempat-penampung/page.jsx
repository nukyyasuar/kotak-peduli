"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { IconText } from "src/components/text";
import { useState, useRef, useEffect } from "react";
import { FormInput } from "src/components/formInput";
import { TextBetween } from "src/components/text";

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
      <p className="text-[#F0BB78]">{text}</p>
    </div>
  );
};

const goodsTypes = [
  {
    src: "tabler:book-filled",
    alt: "Book",
    text: "Buku",
    variant: "white",
  },
  {
    src: "material-symbols:smart-toy",
    alt: "Robot toy head",
    text: "Mainan",
    variant: "white",
  },
  {
    src: "healthicons:electricity",
    alt: "Electronic part",
    text: "Alat Elektronik",
    variant: "white",
  },
  {
    src: "tabler:shirt-filled",
    alt: "T-shirt",
    text: "Pakaian",
    variant: "white",
  },
];
const data = {
  goods: ["Pakaian", "Mainan", "Alat Elektronik", "Buku"], // ini contoh aja, buat jenis barang yang diterima pake array
};
const goodsShelter = [
  {
    id: 1,
    image: "/goods-shelter.jpg",
    name: "Tempat Penampung 1",
    address: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    phone: "+6282121233212",
    distance: `Penjemputan (Maks. ${10}km)`,
    dropPoint: `${3} Drop Point Tersedia`,
    events: `${3} Event Berlangsung`,
    acceptedGoodsTypes: data.goods,
  },
  {
    id: 2,
    image: "/goods-shelter.jpg",
    name: "Tempat Penampung 2",
    address: "Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    phone: "+6282121233212",
    distance: `Penjemputan (Maks. ${10}km)`,
    dropPoint: `${3} Drop Point Tersedia`,
    events: `${3} Event Berlangsung`,
    acceptedGoodsTypes: data.goods,
  },
];
const eventsOptions = [
  { value: "event_satu", label: "Event 1" },
  { value: "event_dua", label: "Event 2" },
];
const dropPointsOptions = [
  { value: "dropPoint_satu", label: "Drop Point 1" },
  { value: "dropPoint_dua", label: "Drop Point 2" },
];

export default function Home() {
  const [isModal, setIsModal] = useState(false);
  const [goodsShelterId, setGoodsShelterId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedDropPoint, setSelectedDropPoint] = useState("");
  const modalRef = useRef(null);

  const goodsTypeCheck = Object.fromEntries(
    goodsTypes.map((item) => [item.text, item])
  );
  const selectedGoodsShelter = goodsShelter.find(
    (item) => item.id === goodsShelterId
  );
  const { name, address, phone, distance, acceptedGoodsTypes } =
    selectedGoodsShelter || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setGoodsShelterId(null);
        setSelectedEvent("");
        setSelectedDropPoint("");
        setIsModal(false);
      }
    };

    if (isModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModal]);

  return (
    <>
      {isModal === true && selectedGoodsShelter && (
        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-8 space-y-6 text-black"
          >
            <h1 className="font-bold text-xl">Detail Tempat Penampung</h1>
            {/* Goods Shelter Information */}
            <div className="text-base border-b border-black pb-4">
              <h2 className="font-bold">{name}</h2>
              <p>{address}</p>
              <p>{phone}</p>
              <p>{distance}</p>
              <TextBetween
                label="Waktu Operasional"
                value={"Senin - Jumat: 08.00 - 17.00"}
              />
              <TextBetween
                label="Menerima Barang"
                value={acceptedGoodsTypes.join(", ")}
              />
              {/* Contoh tampilan jika value tipe array */}
              {/* <TextBetween
                label="Example"
                value={["10/11/2025", "12/11/2025", "14/11/2025"]}
              /> */}
            </div>

            {/* Events */}
            <div className="text-base border-b border-black pb-4">
              <FormInput
                label="Pilih Event"
                name="goods"
                value={selectedEvent}
                onChange={setSelectedEvent}
                options={eventsOptions}
                placeholder="Pilih event untuk melihat detail"
                className="mb-1"
                inputType="dropdown"
              />
              <TextBetween label="Lokasi" value={"Tangerang Kota" || "-"} />
              <TextBetween
                label="Periode"
                value={"1 Maret 2025 - 15 Maret 2025" || "-"}
              />
              <TextBetween
                label="Barang Yang Dibutuhkan"
                value={"Pakaian, Buku" || "-"}
              />
            </div>

            {/* Drop Point */}
            <div className="text-base">
              <FormInput
                label="Pilih Cabang/Drop Point"
                name="dropPoint"
                value={selectedDropPoint}
                onChange={setSelectedDropPoint}
                options={dropPointsOptions}
                placeholder="Pilih cabang/drop point untuk melihat detail"
                className="mb-1"
                inputType="dropdown"
              />
              <p>
                {"Jl. Lorem ipsum dolor sit amet, consectetur adipiscing elit" ||
                  "-"}
              </p>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex flex-wrap justify-center">
            {goodsShelter.map(
              ({
                id,
                name,
                address,
                phone,
                distance,
                dropPoint,
                events,
                image,
                acceptedGoodsTypes,
              }) => {
                const types = acceptedGoodsTypes.map((type) => type.trim());

                return (
                  <div
                    key={id}
                    className="transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:z-10 rounded-md p-2 w-full max-w-[220px]"
                    onClick={() => {
                      setIsModal(true);
                      setGoodsShelterId(id);
                    }}
                  >
                    <div className="space-y-3">
                      <div className="h-[156px] bg-gray-200 relative border-2 border-amber-300 rounded-xl overflow-hidden">
                        <Image
                          src={image}
                          alt={name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="space-y-1 text-black text-sm">
                        <h3 className="font-bold text-base">{name}</h3>
                        <p>{address}</p>
                        <p>{phone}</p>
                        <p>{distance}</p>
                        <EventDropPointIcon icon="mdi:pin" text={dropPoint} />
                        <EventDropPointIcon
                          icon="material-symbols:event"
                          text={events}
                        />
                      </div>
                      <div className="flex space-x-2">
                        {types?.map((type) => {
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
              }
            )}
          </div>
        </div>
      </section>
    </>
  );
}
