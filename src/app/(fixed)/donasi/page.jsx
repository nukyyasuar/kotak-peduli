"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm, useWatch } from "react-hook-form";
import { components } from "react-select";
import { Tooltip } from "react-tooltip";

import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import AddressModal from "src/components/addressModal";

import {
  getCollectionCenters,
  getOneCollectionCenter,
} from "src/services/api/collectionCenter";
import { getPosts } from "src/services/api/post";
import { getProfile } from "src/services/api/profile";
import { createDonation } from "src/services/api/donation";
import { getEvents } from "src/services/api/event";

const dummyOptions = [
  { value: "opsi_satu", label: "Opsi 1" },
  { value: "opsi_dua", label: "Opsi 2" },
  { value: "opsi_tiga", label: "Opsi 3" },
];
const electronicOptions = [
  { label: "Laptop", value: "laptop" },
  { label: "Televisi", value: "tv" },
  { label: "Kulkas", value: "kulkas" },
  { label: "Mesin Cuci", value: "mesin_cuci" },
  { label: "Microwave", value: "microwave" },
  { label: "AC", value: "ac" },
  { label: "Kipas Angin", value: "kipas_angin" },
  { label: "Setrika", value: "setrika" },
  { label: "Blender", value: "blender" },
  { label: "Rice Cooker", value: "rice_cooker" },
  { label: "Speaker", value: "speaker" },
  { label: "Printer", value: "printer" },
  { label: "Monitor", value: "monitor" },
  { label: "Proyektor", value: "proyektor" },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDonationType, setIsAddDonationType] = useState(false);
  const [addressDistance, setAddressDistance] = useState(0);
  const [collectionCenters, setCollectionCenters] = useState([]);
  const [posts, setPosts] = useState([]);
  const [dataCollectionCenter, setDataCollectionCenter] = useState({});
  const [selectedDataPost, setSelectedPostData] = useState({});
  const [dataProfile, setDataProfile] = useState({});
  const [events, setEvents] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      namaLengkap: "",
      nomorTelepon: "",
      alamat: {},
      tempatPenampung: "",
      cabang: "",
      tipePengiriman: "",
      barangDonasi: [],
    },
  });

  const selectedTempatPenampung = watch("tempatPenampung");
  const selectedCabang = watch("cabang");
  const pickupTypes =
    dataCollectionCenter.pickupTypes
      ?.filter((item) => {
        if (addressDistance <= dataCollectionCenter.distanceLimitKm) {
          return true;
        } else {
          return item === "DELIVERED";
        }
      })
      .map((item) => ({
        value: item,
        label:
          item === "DELIVERED"
            ? "Dikirim sendiri"
            : "Dijemput tempat penampung",
      })) || [];
  const namaLengkap =
    dataProfile?.firstName && dataProfile?.lastName
      ? dataProfile?.firstName + " " + dataProfile?.lastName
      : "";
  const dummyDonationTypes = dataCollectionCenter?.types?.map((item) => ({
    value: item,
    label:
      item === "CLOTHES"
        ? "Pakaian"
        : item === "TOYS"
          ? "Mainan"
          : item === "ELECTRONICS"
            ? "Elektronik"
            : item === "BOOKS"
              ? "Buku"
              : item,
  }));

  const handleAddDonationType = (value, label) => {
    setIsAddDonationType(!isAddDonationType);

    const exists = watch("barangDonasi").find((item) => item.value === value);
    if (!exists) {
      setValue("barangDonasi", [
        ...watch("barangDonasi"),
        {
          jenis: value,
          label: label,
          jumlah: "",
          berat: "",
          event: "",
          foto: "",
          tipeElektronik: [],
        },
      ]);
    }
  };

  const handleRemoveDonationItem = (valueToRemove) => {
    const updatedItems = watch("barangDonasi").filter(
      (item) => item.jenis !== valueToRemove
    );
    setValue("barangDonasi", updatedItems);
  };

  const calculateAddressDistance = async () => {
    const origin = {
      latitude: watch("alamat.latitude"),
      longitude: watch("alamat.longitude"),
    };
    const destination = {
      latitude: selectedDataPost.latitude
        ? selectedDataPost.latitude
        : dataCollectionCenter.latitude,
      longitude: selectedDataPost.longitude
        ? selectedDataPost.longitude
        : dataCollectionCenter.longitude,
    };
    console.log(selectedDataPost.latitude);
    console.log(dataCollectionCenter.longitude);

    try {
      setIsCalculating(true);
      const res = await fetch("/api/calculate-distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch distance");
      }

      const data = await res.json();
      setAddressDistance(parseFloat(data.distance));
    } catch (err) {
      console.error("Failed to calculate distance:", err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    const { alamat, barangDonasi, tempatPenampung, tipePengiriman } = data;

    formData.append("collectionCenterId", tempatPenampung);
    formData.append("address[detail]", alamat.jalan);
    if (alamat.patokan) {
      formData.append("address[reference]", alamat.patokan);
    }
    formData.append("address[latitude]", alamat.latitude);
    formData.append("address[longitude]", alamat.longitude);
    formData.append("distanceKms", parseFloat(addressDistance));
    formData.append("pickupType", tipePengiriman);
    barangDonasi.forEach((item, index) => {
      formData.append(`donations[${index}][donationType]`, item.jenis);
      formData.append(`donations[${index}][quantity]`, item.jumlah);
      formData.append(`donations[${index}][weight]`, item.berat);
      formData.append(`donations[${index}][eventId]`, item.event);
      item.foto.forEach((file) => {
        formData.append(`donations[${index}][files]`, file);
      });

      // Kalau ada tipeElektronik dan isinya array
      // item.tipeElektronik.forEach((tipe, i) => {
      //   formData.append(`donations[${index}].electornicType[${i}]`, tipe);
      // });
    });

    console.log("data mentah:", data);
    console.log("formdata:", formData);

    try {
      createDonation(formData)
        .then((res) => {
          console.log("Berhasil mengirim data:", res);
          alert("Berhasil mengirim data");
        })
        .catch((err) => {
          console.error("Gagal mengirim data:", err);
          alert("Gagal mengirim data");
        });
    } catch (error) {
      console.error("Error creating donation:", error);
      alert("Gagal mengirim data");
    }
  };

  useEffect(() => {
    const fetchCollectionCenters = async () => {
      try {
        const data = await getCollectionCenters();
        const formatted = data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setCollectionCenters(formatted);
      } catch (error) {
        console.error("Error fetching collection centers:", error);
      }
    };

    fetchCollectionCenters();
  }, []);

  useEffect(() => {
    if (!selectedTempatPenampung) return;

    const fetchData = async () => {
      try {
        const data = await getOneCollectionCenter(selectedTempatPenampung);
        setDataCollectionCenter({
          ...data,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        });

        const posts = await getPosts(selectedTempatPenampung);
        const formattedPosts = posts.map((item) => ({
          value: item.id,
          label: item.name,
          latitude: item.address.latitude,
          longitude: item.address.longitude,
        }));
        setPosts(formattedPosts);

        const events = await getEvents(selectedTempatPenampung);
        const formattedEvents = events.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching data for tempatPenampung:", error);
      }
    };

    fetchData();
  }, [selectedTempatPenampung]);

  useEffect(() => {
    if (!selectedCabang) return;

    const selectedPost = posts.find((item) => item.value === selectedCabang);
    if (selectedPost) {
      setSelectedPostData({
        latitude: selectedPost.latitude,
        longitude: selectedPost.longitude,
      });
    }
  }, [selectedCabang, posts]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setDataProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <section className="bg-white py-12 flex flex-col justify-center text-black">
      <div className="max-w-[1200px] mx-auto">
        {/* Title */}
        <div className="w-full flex justify-center mb-6">
          <div className="text-center w-1/2">
            <h1 className="text-[32px] font-bold">Yuk Donasikan Barangmu</h1>
            <p className="text-[#543A14] text-base">
              Isi form berikut untuk mendeskripsikan barang yang ingin kamu
              donasikan dan bantu kami menyalurkan barangmu kepada yang
              membutuhkan.
            </p>
          </div>
        </div>

        {/* Form General Info */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center w-[1200px] gap-5"
        >
          <div className="flex gap-5 w-full">
            <div className="flex flex-col gap-3 w-full">
              <h3 className="text-xl font-bold">Informasi Donatur</h3>
              <div className="grid grid-cols-2 gap-5">
                <FormInput
                  label="Nama Lengkap"
                  inputType="text"
                  placeholder="Contoh: Matthew Emmanuel"
                  value={namaLengkap}
                  register={register("namaLengkap")}
                  inputStyles="bg-[#D9D9D9] cursor-not-allowed"
                />
                <FormInput
                  label="Nomor Telepon (Whatsapp)"
                  inputType="text"
                  value={dataProfile?.phoneNumber?.slice(3) || ""}
                  placeholder="Contoh: 81212312312"
                  register={register("nomorTelepon")}
                  inputStyles="bg-[#D9D9D9] cursor-not-allowed"
                />
              </div>
              <FormInput
                label="Alamat Lengkap"
                inputType="textArea"
                placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
                value={watch("alamat.summary") || ""}
                register={register("alamat")}
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="flex-1"
              />

              {/* Modal Alamat Lengkap */}
              <AddressModal
                isOpen={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                setValue={setValue}
              />
            </div>
            <div className="space-y-3 w-full max-w-[590px]">
              <h3 className="text-xl font-bold">Tujuan Donasi</h3>
              <FormInput
                inputType="dropdownInput"
                label="Tempat Penampung"
                name="tempatPenampung"
                control={control}
                options={collectionCenters}
                placeholder="Pilih tempat penampung tujuan donasi"
                onChange={(selected) => {
                  setValue("tempatPenampung", selected?.value || "");
                  setValue("cabang", "");
                }}
              />
              <FormInput
                key={selectedTempatPenampung}
                inputType="dropdownInput"
                label="Cabang / Drop Point"
                name="cabang"
                control={control}
                options={posts}
                placeholder="Pilih cabang atau drop point (jika tersedia)"
              />
              <ButtonCustom
                variant="orange"
                label={`Hitung Jarak Alamat Ke ${selectedCabang ? "Cabang" : "Tempat Penampung"}`}
                type="button"
                className="w-full h-12"
                onClick={calculateAddressDistance}
              />
              <FormInput
                inputType="dropdownInput"
                label="Metode Pengiriman"
                name="tipePengiriman"
                control={control}
                options={pickupTypes}
                placeholder={`${selectedTempatPenampung ? (isCalculating ? "Sedang menghitung jarak..." : "Hitung jarak terlebih dahulu") : "Pilih tempat penampung tujuan donasi terlebih dahulu"}`}
                disabled={
                  !selectedTempatPenampung || isCalculating || !addressDistance
                }
                customMenu={(props) => (
                  <components.Menu {...props}>
                    <div className="px-3 py-2 border-b text-sm text-gray-700">
                      <div>
                        Jarak alamat anda ke{" "}
                        {selectedCabang ? "cabang" : "tempat penampung"}:{" "}
                        <span
                          className={`font-bold ${
                            addressDistance
                              ? addressDistance <=
                                dataCollectionCenter.distanceLimitKm
                                ? "text-[#1F7D53]"
                                : "text-[#E52020]"
                              : "text-[#F0BB78]"
                          }`}
                        >
                          {addressDistance
                            ? `${addressDistance} km`
                            : "Proses..."}{" "}
                          (
                          {addressDistance <=
                          dataCollectionCenter.distanceLimitKm
                            ? "Jarak masih memenuhi batas penjemputan"
                            : "Jarak melebihi batas penjemputan"}
                          )
                        </span>
                      </div>
                    </div>

                    {/* Opsi dropdown */}
                    {props.children}
                  </components.Menu>
                )}
              />
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-xl font-bold mb-3">Jenis Barang Donasi</h3>

            {/* Form Detail Barang */}
            {watch("barangDonasi").map((item, index) => (
              <div
                key={index}
                className="bg-[#FFF0DC] px-5 pb-5 rounded-lg mb-3 relative"
              >
                {/* Jenis Barang */}
                <div className="w-full flex justify-center mb-3">
                  <p className="text-base font-bold text-white bg-[#543a14] text-center px-6 py-2 w-fit rounded-b-lg">
                    {item.label}
                  </p>
                </div>
                <button
                  className="absolute top-0 right-0 px-2 bg-[#E52020] h-9 rounded-bl-lg cursor-pointer"
                  onClick={() => handleRemoveDonationItem(item.jenis)}
                  type="button"
                >
                  <Icon icon="mdi:trash" width={20} color="white" />
                </button>
                <div className="space-y-3">
                  {/* Tipe Barang (Elektronik) */}
                  {item.label === "Elektronik" && (
                    <FormInput
                      inputType="dropdownChecklistOther"
                      options={electronicOptions}
                      placeholder="Pilih tipe barang elektronik yang sesuai"
                      label="Tipe Barang"
                      name={`barangDonasi.${index}.tipeElektronik`}
                      control={control}
                    />
                  )}
                  {/* Jumlah & Berat */}
                  <div className="flex gap-5">
                    <FormInput
                      label="Jumlah Barang"
                      inputType="text"
                      placeholder="Contoh: 20"
                      register={register(`barangDonasi.${index}.jumlah`)}
                    />
                    <FormInput
                      label="Total Berat Barang (kg)"
                      inputType="text"
                      placeholder="Contoh: 10"
                      register={register(`barangDonasi.${index}.berat`)}
                    />
                  </div>
                  {/* Foto & Event */}
                  <div className="flex gap-5 items-center">
                    <div className="flex items-end gap-3 flex-1">
                      <FormInput
                        inputType="text"
                        placeholder=".jpg, .png. Bisa memilih beberapa gambar"
                        label="Foto Barang"
                        className="pointer-events-none"
                        value={
                          Array.isArray(watch(`barangDonasi.${index}.foto`))
                            ? watch(`barangDonasi.${index}.foto`)
                                .map((file) => file.name)
                                .join(", ")
                            : watch(`barangDonasi.${index}.foto`)?.name || ""
                        }
                      />
                      <div className="flex">
                        <label
                          htmlFor={`fotoBarang-${index}`}
                          className="px-4 py-3 bg-[#F0BB78] text-nowrap rounded-lg font-semibold text-white cursor-pointer"
                        >
                          Pilih File
                        </label>
                        <input
                          id={`fotoBarang-${index}`}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              setValue(`barangDonasi.${index}.foto`, files);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <FormInput
                      inputType="dropdownInput"
                      label="Event"
                      name={`barangDonasi.${index}.event`}
                      control={control}
                      options={events}
                      placeholder="Pilih event tujuan donasi (jika tersedia)"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Button Tambah Jenis Barang */}
            {watch("barangDonasi").length !== dummyDonationTypes?.length && (
              <div className="flex gap-6 max-h-10">
                <ButtonCustom
                  variant="orange"
                  label="Tambah Jenis Barang"
                  onClick={() => setIsAddDonationType(!isAddDonationType)}
                  icon="mdi:plus"
                  className="max-w-1/4 text-nowrap"
                  type="button"
                  disabled={!watch("tipePengiriman")}
                  data-tooltip-id="addDonationType-tooltip"
                  data-tooltip-content="Isi informasi donatur dan tujuan donasi secara lengkap terlebih dahulu"
                />

                {isAddDonationType && (
                  <div className="flex gap-3">
                    {dummyDonationTypes?.map(({ value, label }) => {
                      const isDisabled = watch("barangDonasi").some(
                        (item) => item.jenis === value
                      );

                      return (
                        <ButtonCustom
                          key={value}
                          variant={isDisabled ? "" : "outlineOrange"}
                          label={label}
                          onClick={() =>
                            !isDisabled && handleAddDonationType(value, label)
                          }
                          type="button"
                          className={
                            isDisabled &&
                            "bg-[#F0BB78] text-white cursor-not-allowed"
                          }
                          disabled={isDisabled}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {!watch("tipePengiriman") && (
              <Tooltip
                id="addDonationType-tooltip"
                place="bottom"
                content="Hello world! I'm a Tooltip"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#543a14] hover:bg-[#6B4D20] text-white h-12 rounded-lg font-bold"
          >
            Kirim
          </button>
        </form>
      </div>
    </section>
  );
}
