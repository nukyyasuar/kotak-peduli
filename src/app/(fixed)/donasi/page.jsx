"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import { components } from "react-select";
import { Tooltip } from "react-tooltip";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";

import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import AddressModal from "src/components/addressModal";
import donationSchema from "src/components/schema/donationSchema";

import {
  getCollectionCenters,
  getOneCollectionCenter,
} from "src/services/api/collectionCenter";
import { getPosts } from "src/services/api/post";
import { getProfile } from "src/services/api/profile";
import { createDonation } from "src/services/api/donation";
import { getEvents } from "src/services/api/event";

import { electronicOptions, donationTypes } from "src/components/options";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDonationType, setIsAddDonationType] = useState(false);
  const [addressDistance, setAddressDistance] = useState(0);
  const [collectionCenters, setCollectionCenters] = useState([]);
  const [posts, setPosts] = useState([]);
  const [dataCollectionCenter, setDataCollectionCenter] = useState({});
  const [selectedDataPost, setSelectedPostData] = useState({});
  const [dataProfile, setDataProfile] = useState({});
  const [dataEvents, setDataEvents] = useState({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isCreateDonationLoading, setIsCreateDonationLoading] = useState(false);
  const [isFetchPostsLoading, setIsFetchPostsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(donationSchema),
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "barangDonasi",
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
  const donationTypeOptions = dataCollectionCenter?.types?.map((item) => {
    const matchedDonationType = donationTypes.find(
      (type) => type.value === item
    );
    return {
      value: item,
      label: matchedDonationType?.label || item,
    };
  });

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  const calculatingBtnDisabled =
    isEmptyObject(watch("alamat")) || !selectedTempatPenampung || isCalculating;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // blokir submit ketika tekan Enter
    }
  };

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
          event: [],
          foto: [],
          tipeElektronik: [],
        },
      ]);
    }
  };

  const handleRemoveDonationItem = (valueToRemove) => {
    const errorPathsToClear = [];
    watch("barangDonasi").forEach((item, index) => {
      if (item.jenis === valueToRemove) {
        errorPathsToClear.push(
          `barangDonasi.${index}.jumlah`,
          `barangDonasi.${index}.berat`,
          `barangDonasi.${index}.event`,
          `barangDonasi.${index}.foto`,
          `barangDonasi.${index}.tipeElektronik`
        );
      }
    });
    if (errorPathsToClear.length > 0) {
      clearErrors(errorPathsToClear);
    }

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
    } catch (error) {
      toast.error(`Gagal menghitung jarak. Silakan coba lagi.`);
      console.error("Error calculating distance:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const onSubmit = async (data) => {
    setIsCreateDonationLoading(true);

    const hasInvalidJenis = data.barangDonasi.some((item) => {
      const selectedEvent = dataEvents?.find(
        (event) => event.value.toString() === item.event
      );

      if (!selectedEvent) return false;

      const isInvalid = !selectedEvent.types.includes(item.jenis);
      return isInvalid;
    });

    if (hasInvalidJenis) {
      toast.error(
        "Ada jenis barang donasi yang tidak sesuai dengan tipe yang diperbolehkan pada event yang dipilih."
      );
      setIsCreateDonationLoading(false);
      return;
    }

    const formData = new FormData();

    const { alamat, barangDonasi, tempatPenampung, tipePengiriman, cabang } =
      data;

    formData.append("collectionCenterId", tempatPenampung);
    formData.append("postId", cabang);

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
      if (item.event !== "") {
        formData.append(`donations[${index}][eventId]`, item.event);
      }
      item.foto.forEach((file) => {
        formData.append(`donations[${index}][files]`, file);
      });

      const electronicTypesString = item.tipeElektronik
        .map((tipe) => tipe.value)
        .join(", ")
        .toLowerCase();
      formData.append(
        `donations[${index}][electronicType]`,
        electronicTypesString
      );
    });

    console.log("formdata:", formData);

    try {
      await createDonation(formData);
      toast.success(
        "Donasi kamu berhasil dibuat. Terima kasih atas kebaikanmu! Anda akan diarahkan ke halaman riwayat donasi"
      );
      window.location.href = "/akun/riwayat-donasi";
    } catch (error) {
      toast.error(`Maaf, donasi gagal dibuat. Silakan coba lagi.`);
      console.error("Error creating donation:", error);
    } finally {
      setIsCreateDonationLoading(false);
    }
  };

  useEffect(() => {
    const fetchCollectionCenters = async () => {
      try {
        const data = await getCollectionCenters();
        const approvedData = data.filter(
          (item) => item.approval.latestStatus === "APPROVED"
        );
        const formatted = approvedData.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setCollectionCenters(formatted);
      } catch (error) {
        toast.error("Gagal memuat data tempat penampung");
        console.error("Error fetching collection centers:", error);
      }
    };

    fetchCollectionCenters();
  }, []);

  useEffect(() => {
    if (!selectedTempatPenampung) return;

    const fetchData = async () => {
      try {
        setIsFetchPostsLoading(true);

        const data = await getOneCollectionCenter(selectedTempatPenampung);
        setDataCollectionCenter({
          ...data,
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        });

        // Fetch posts sesuai tempat penampung yang dipilih
        try {
          const posts = await getPosts(selectedTempatPenampung);
          if (posts.length > 0) {
            const formattedPosts = posts.map((item) => ({
              value: item.id,
              label: item.name,
              latitude: item.address.latitude,
              longitude: item.address.longitude,
            }));
            setPosts(formattedPosts);
          }
        } catch (error) {
          console.error("Error fetching posts for collection center:", error);
          toast.error(
            "Gagal memuat data cabang atau drop point. Silakan coba lagi."
          );
        } finally {
          setIsFetchPostsLoading(false);
        }

        // Fetch events sesuai tempat penampung yang dipilih
        try {
          const events = await getEvents(selectedTempatPenampung);
          if (events?.length > 0) {
            const formattedEvents = events
              .filter((item) => item.isActive === true)
              .map((item) => ({
                value: item.id,
                label: item.name,
                ...item,
              }));
            setDataEvents(formattedEvents);
          }
        } catch (error) {
          console.error("Error fetching events for collection center:", error);
          toast.error("Gagal memuat data event. Silakan coba lagi.");
        }
      } catch (error) {
        toast.error(
          `Gagal memuat detail data tempat penampung. Silakan coba lagi.`
        );
        console.error("Error fetching collection center details:", error);
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
        reset((prevValues) => ({
          ...prevValues,
          namaLengkap: data.firstName + " " + data.lastName,
          nomorTelepon: data.phoneNumber.slice(3),
          alamat: {
            jalan: data?.address?.detail || "",
            patokan: data?.address?.reference || "",
            latitude: data?.address?.latitude || "",
            longitude: data?.address?.longitude || "",
            summary:
              `(${data?.address?.reference}) ${data?.address?.detail}` || "",
          },
        }));
      } catch (error) {
        toast.error("Gagal memuat profil. Silakan coba lagi.");
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  console.log("watch alamat:", watch("alamat"));

  useEffect(() => {
    if (watch("alamat.summary")) {
      clearErrors("alamat");
    }
  }, [watch("alamat.summary")]);

  useEffect(() => {
    const subscription = watch((values) => {
      setSelectedEventId(values.barangDonasi?.[0]?.event);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="flex flex-col items-center w-[1200px] gap-5"
        >
          {/* Form General Info */}
          <div className="flex gap-5 w-full">
            {/* Form Informasi Donatur */}
            <div className="flex flex-col gap-3 w-full">
              <h3 className="text-xl font-bold">Informasi Donatur</h3>
              <div className="grid grid-cols-2 gap-5">
                <FormInput
                  name="namaLengkap"
                  label="Nama Lengkap"
                  required
                  inputType="text"
                  placeholder="Contoh: Matthew Emmanuel"
                  value={namaLengkap}
                  register={register("namaLengkap")}
                  errors={errors?.namaLengkap?.message}
                  disabled
                />
                <FormInput
                  name="nomorTelepon"
                  label="Nomor Telepon (Whatsapp)"
                  inputType="text"
                  required
                  value={dataProfile?.phoneNumber?.slice(3) || ""}
                  placeholder="Contoh: 81212312312"
                  register={register("nomorTelepon")}
                  inputStyles="bg-[#D9D9D9] cursor-not-allowed"
                  errors={errors?.nomorTelepon?.message}
                  disabled
                />
              </div>
              <FormInput
                label="Alamat Lengkap"
                inputType="textArea"
                name="alamat"
                required
                placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
                value={watch("alamat.summary") || ""}
                register={register("alamat")}
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="flex-1"
                errors={errors?.alamat?.message}
              />

              {/* Modal Alamat Lengkap */}
              <AddressModal
                isOpen={isModalOpen}
                dataProfile={dataProfile}
                handleClose={() => setIsModalOpen(false)}
                setValue={setValue}
              />
            </div>
            <div className="space-y-3 w-full max-w-[590px]">
              {/* Form Tujuan Donasi */}
              <h3 className="text-xl font-bold">Tujuan Donasi</h3>
              <FormInput
                inputType="dropdownInput"
                label="Tempat Penampung"
                name="tempatPenampung"
                required
                control={control}
                options={collectionCenters}
                placeholder="Pilih tempat penampung tujuan donasi"
                onChange={(selected) => {
                  setValue("tempatPenampung", selected?.value || "");
                  setValue("cabang", "");
                }}
                errors={errors?.tempatPenampung?.message}
              />
              <FormInput
                key={selectedTempatPenampung}
                inputType="dropdownInput"
                label="Cabang / Drop Point (opsional)"
                name="cabang"
                control={control}
                options={posts}
                placeholder={
                  selectedTempatPenampung
                    ? isFetchPostsLoading
                      ? "Sedang mengambil data cabang..."
                      : posts
                        ? "Pilih cabang / drop point tujuan donasi"
                        : "Cabang / drop point tidak tersedia"
                    : "Pilih tempat penampung terlebih dahulu"
                }
                disabled={posts.length <= 0}
              />

              {/* Button Hitung Jarak */}
              <ButtonCustom
                variant={calculatingBtnDisabled ? "disabled" : "orange"}
                label={`Hitung Jarak Alamat Ke ${selectedCabang ? "Cabang" : "Tempat Penampung"}`}
                type="button"
                className="w-full h-12 text-[#C2C2C2]"
                onClick={calculateAddressDistance}
                disabled={calculatingBtnDisabled}
              />

              <FormInput
                inputType="dropdownInput"
                label="Metode Pengiriman"
                name="tipePengiriman"
                required
                control={control}
                options={pickupTypes}
                placeholder={`${!isEmptyObject(watch("alamat")) ? (selectedTempatPenampung ? (isCalculating ? "Sedang menghitung jarak..." : addressDistance ? "Pilih metode pengiriman yang sesuai" : "Hitung jarak terlebih dahulu") : "Pilih tempat penampung terlebih dahulu") : "Masukkan alamat lengkap terlebih dahulu"}`}
                disabled={
                  !selectedTempatPenampung || isCalculating || !addressDistance
                }
                errors={errors?.tipePengiriman?.message}
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

                    {props.children}
                  </components.Menu>
                )}
              />
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-xl font-bold mb-3">Jenis Barang Donasi</h3>

            {/* Form Detail Barang */}
            {watch("barangDonasi").map((item, index) => {
              const selectedEvent = dataEvents?.find(
                (event) => event.value === item.event
              );
              const isJenisInvalid =
                selectedEvent && !selectedEvent?.types?.includes(item.jenis);

              return (
                <>
                  {selectedEvent && isJenisInvalid && (
                    <p className="text-[#E52020] text-sm font-medium mb-2">
                      Jenis barang donasi tidak sesuai dengan tipe yang
                      diperbolehkan pada event{" "}
                      <span className="font-bold">
                        ({selectedEvent?.name || "-"})
                      </span>{" "}
                      yang dipilih, hanya menerima{" "}
                      <span className="font-bold">
                        (
                        {selectedEvent?.types
                          .map(
                            (type) =>
                              donationTypes.find(
                                (donation) => donation.value === type
                              )?.label
                          )
                          .filter(Boolean)
                          .join(", ") || "(-)"}
                        )
                      </span>{" "}
                      {}. Mohon periksa kembali jenis barang donasi Anda.
                    </p>
                  )}
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
                      {item.jenis === "ELECTRONICS" && (
                        <FormInput
                          inputType="dropdownChecklistOther"
                          options={electronicOptions}
                          placeholder="Pilih tipe barang elektronik yang sesuai"
                          label="Tipe Barang"
                          name={`barangDonasi.${index}.tipeElektronik`}
                          control={control}
                          inputStyles="bg-white"
                          errors={
                            errors?.barangDonasi?.[index]?.tipeElektronik
                              ?.message
                          }
                          required
                        />
                      )}
                      {/* Jumlah & Berat */}
                      <div className="flex gap-5">
                        <FormInput
                          label="Jumlah Barang"
                          inputType="text"
                          type="number"
                          placeholder="Contoh: 20"
                          register={register(`barangDonasi.${index}.jumlah`)}
                          inputStyles="bg-white"
                          errors={
                            errors?.barangDonasi?.[index]?.jumlah?.message
                          }
                          required
                        />
                        <FormInput
                          label="Total Berat Barang (kg)"
                          inputType="text"
                          type="number"
                          placeholder="Contoh: 10"
                          register={register(`barangDonasi.${index}.berat`)}
                          inputStyles="bg-white"
                          errors={errors?.barangDonasi?.[index]?.berat?.message}
                          required
                        />
                      </div>
                      {/* Foto & Event */}
                      <div className="flex gap-5">
                        <div className="flex-1">
                          <div className="flex w-full items-end gap-3">
                            <FormInput
                              inputType="custom"
                              label="Foto Barang"
                              className=""
                              inputStyles="bg-white relative min-h-[3rem] flex items-center gap-2 px-2 py-1 border rounded-lg max-w-[461px] overflow-scroll"
                              errors={
                                errors?.barangDonasi?.[index]?.foto?.message
                              }
                              required
                              customValueRender={() => (
                                <>
                                  {Array.isArray(
                                    watch(`barangDonasi.${index}.foto`)
                                  ) &&
                                    watch(`barangDonasi.${index}.foto`).map(
                                      (file, fileIndex) => (
                                        <div
                                          key={fileIndex}
                                          className="flex items-center bg-[#EDEDED] rounded-xs px-3 text-nowrap text-sm"
                                        >
                                          {file.name}
                                          <button
                                            type="button"
                                            className="ml-2 text-[#E52020] font-bold hover:text-red-700 cursor-pointer"
                                            onClick={() => {
                                              const updated = watch(
                                                `barangDonasi.${index}.foto`
                                              ).filter(
                                                (_, i) => i !== fileIndex
                                              );
                                              setValue(
                                                `barangDonasi.${index}.foto`,
                                                updated,
                                                { shouldValidate: true }
                                              );
                                            }}
                                          >
                                            ×
                                          </button>
                                        </div>
                                      )
                                    )}
                                </>
                              )}
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
                                  const newFiles = Array.from(e.target.files);

                                  const existingFiles =
                                    watch(`barangDonasi.${index}.foto`) || [];

                                  const mergedFiles = [
                                    ...existingFiles,
                                    ...newFiles,
                                  ].filter(
                                    (file, i, self) =>
                                      i ===
                                      self.findIndex(
                                        (f) =>
                                          f.name === file.name &&
                                          f.size === file.size
                                      )
                                  );

                                  setValue(
                                    `barangDonasi.${index}.foto`,
                                    mergedFiles,
                                    {
                                      shouldValidate: true,
                                    }
                                  );

                                  e.target.value = "";
                                }}
                              />
                            </div>
                          </div>
                          {errors?.barangDonasi?.[index]?.foto && (
                            <p className="text-[#E52020] text-sm mt-1">
                              {errors?.barangDonasi?.[index]?.foto?.message}
                            </p>
                          )}
                        </div>
                        <FormInput
                          inputType="dropdownInput"
                          label="Event (opsional)"
                          name={`barangDonasi.${index}.event`}
                          control={control}
                          options={dataEvents}
                          placeholder="Pilih event tujuan donasi (jika tersedia)"
                          className="flex-1"
                          inputStyles="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}

            {/* Button Tambah Jenis Barang */}
            {watch("barangDonasi").length !== donationTypeOptions?.length && (
              <div className="flex gap-6 max-h-10">
                <ButtonCustom
                  variant={!watch("tipePengiriman") ? "disabled" : `orange`}
                  label="Tambah Jenis Barang"
                  onClick={() => {
                    setIsAddDonationType(!isAddDonationType);
                  }}
                  icon="mdi:plus"
                  className="max-w-1/4 text-nowrap"
                  type="button"
                  disabled={!watch("tipePengiriman")}
                  data-tooltip-id="addDonationType-tooltip"
                  data-tooltip-content="Isi informasi donatur dan tujuan donasi secara lengkap terlebih dahulu"
                />

                {isAddDonationType && (
                  <div className="flex gap-3">
                    {donationTypeOptions?.map(({ value, label }) => {
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
            {isCreateDonationLoading ? (
              <PulseLoader
                color="white"
                loading={isCreateDonationLoading}
                size={8}
              />
            ) : (
              "Kirim Donasi"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
