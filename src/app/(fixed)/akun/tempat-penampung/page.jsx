"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormInput } from "src/components/formInput";
import AddressModal from "src/components/addressModal";
import { ButtonCustom } from "src/components/button";
import OperationalModal from "src/components/operationalModal";
import { donationTypes } from "src/components/options";
import goodsShelterRegistSchema from "src/components/schema/goodsShelterRegistSchema";

import {
  createCollectionCenter,
  getOneCollectionCenter,
} from "src/services/api/collectionCenter";
import { getProfile } from "src/services/api/profile";

export default function DaftarTempatPenampung() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOperationalOpen, setIsModalOperationalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDecline, setIsDecline] = useState(false);
  const [dataProfile, setDataProfile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      namaTempatPenampung: "",
      email: "",
      nomorTelepon: "",
      alamat: "",
      jalan: "",
      patokan: "",
      penjemputan: "",
      batasJarak: "",
      waktuOperasional: [],
      jenisBarang: [],
      deskripsi: "",
      foto: "",
    },
    resolver: yupResolver(goodsShelterRegistSchema),
  });

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("foto", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    console.log(data);

    const { alamat } = data;
    formData.append("name", data.namaTempatPenampung);
    formData.append("description", data.deskripsi);
    formData.append("file", data.foto);
    formData.append("distanceLimitKm", data.batasJarak);
    formData.append("pickupTypes[]", data.penjemputan);
    data.jenisBarang.forEach((item) => {
      formData.append("types[]", item);
    });
    formData.append("address[detail]", alamat.jalan);
    if (alamat.patokan) {
      formData.append("address[reference]", alamat.patokan);
    }
    formData.append("address[latitude]", alamat.latitude);
    formData.append("address[longitude]", alamat.longitude);
    data.waktuOperasional.forEach((item, index) => {
      formData.append(`activeHours[${index}][day]`, item.day);
      formData.append(
        `activeHours[${index}][openTime]`,
        `${item.openHour}:${item.openMinute}`
      );
      formData.append(
        `activeHours[${index}][closeTime]`,
        `${item.closeHour}:${item.closeMinute}`
      );
    });

    console.log(formData);

    try {
      createCollectionCenter(formData)
        .then((response) => {
          console.log("Response:", response);
          alert(
            "Pendaftaran berhasil. Pendaftaran akan diverifikasi terlebih dahulu oleh admin."
          );
          setIsSubmitted(true);
          setIsPending(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Pendaftaran gagal");
          setIsSubmitted(false);
        });
    } catch (error) {
      console.error("Error:", error);
      alert("Pendaftaran gagal");
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setDataProfile(data);
        if (data?.collectionCenterCollaborator?.collectionCenterId) {
          const detailCollectionCenterData = await getOneCollectionCenter(
            data.collectionCenterCollaborator.collectionCenterId
          );
          const approvalStatus =
            detailCollectionCenterData?.approvals[0].latestStatus;

          if (approvalStatus === "PENDING") {
            setIsPending(true);
          } else if (approvalStatus === "APPROVED") {
            setIsApproved(true);
          }
          if (approvalStatus === "REJECTED") {
            setIsDecline(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile();
  }, []);

  console.log(errors);

  return (
    <div className="space-y-3">
      <div className="mb-6 text-[#543A14] space-y-2">
        <h2 className="text-xl font-bold">
          Daftar Sebagai Tempat Penampung{" "}
          {isSubmitted || (isPending && "(Proses Persetujuan)")}
          {!isSubmitted && isApproved && "(Disetujui)"}
          {!isSubmitted && isDecline && "(Ditolak)"}
        </h2>
        <p className="text-base">
          {isSubmitted ||
            (isPending &&
              "Pendaftaran Anda sedang diverifikasi terlebih dahulu oleh admin platform. Setelah disetujui, Anda akan mendapatkan akses ke halaman Dashboard Tempat Penampung.")}
          {!isSubmitted &&
            isApproved &&
            "Pendaftaran Anda telah disetujui. Tekan tombol dibawah untuk mengakses halaman Dashboard Tempat Penampung."}
          {!isSubmitted && isDecline && "Alasan input dari superadmin"}
        </p>
      </div>

      {isSubmitted || isPending || isApproved || isDecline ? (
        isApproved ? (
          <ButtonCustom
            label="Dashboard Tempat Penampung"
            variant="orange"
            className="w-full"
          />
        ) : null
      ) : (
        // Form
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="space-y-3 text-black">
              <FormInput
                label="Nama Tempat Penampung"
                inputType="text"
                placeholder="Contoh: Tempat Penampung Pakaian Alam Sutera"
                register={register("namaTempatPenampung")}
                required
                errors={errors?.namaTempatPenampung?.message}
              />
              <div className="flex gap-3">
                <FormInput
                  label="Email"
                  inputType="text"
                  type="email"
                  placeholder="Contoh: user@example.com"
                  register={register("email")}
                />
                <FormInput
                  label="Nomor Telepon (Whatsapp)"
                  inputType="text"
                  placeholder="Contoh: 81212312312"
                  register={register("nomorTelepon")}
                />
              </div>
              <div>
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
              <div className="flex gap-3">
                <FormInput
                  label="Ketersediaan Penjemputan"
                  inputType="dropdownInput"
                  placeholder="Pilih apakah penjemputan tersedia atau tidak"
                  control={control}
                  name="penjemputan"
                  options={[
                    { label: "Tersedia", value: "PICKED_UP" },
                    { label: "Tidak Tersedia", value: "DELIVERED" },
                  ]}
                />
                <FormInput
                  label="Batas Jarak Penjemputan (KM)"
                  inputType="text"
                  placeholder="Contoh: 10"
                  register={register("batasJarak")}
                />
              </div>
              <div className="flex gap-3">
                <FormInput
                  label="Waktu Operasional (WIB)"
                  inputType="text"
                  placeholder="Pilih hari dan jam operasional yang sesuai"
                  register={register("waktuOperasional")}
                  onClick={() => {
                    setIsModalOperationalOpen(!isModalOperationalOpen);
                  }}
                  value={
                    Array.isArray(watch("waktuOperasional")) &&
                    watch("waktuOperasional").length > 0
                      ? watch("waktuOperasional")
                          .map(
                            (item) =>
                              `${capitalize(item.day)} ${item.openHour}:${item.openMinute} - ${item.closeHour}:${item.closeMinute}`
                          )
                          .join(", ")
                      : ""
                  }
                />
                {/* Modal Waktu Operasional */}
                <OperationalModal
                  isOpen={isModalOperationalOpen}
                  handleClose={() => setIsModalOperationalOpen(false)}
                  setValue={setValue}
                />

                <FormInput
                  label="Jenis Barang yang Diterima"
                  inputType="dropdownInput"
                  options={donationTypes}
                  control={control}
                  name="jenisBarang"
                  placeholder="Pilih jenis barang yang diterima"
                  type="checkbox"
                />
              </div>

              <FormInput
                label="Deskripsi Singkat"
                inputType="textArea"
                placeholder="Contoh:  Kami adalah lembaga kemanusiaan yang berfokus pada bantuan darurat untuk korban bencana alam. Donasi yang kami terima akan disalurkan langsung kepada mereka yang terdampak bencana alam."
                register={register("deskripsi")}
              />

              {/* Input Foto + Preview */}
              <div className="flex w-full">
                <div className="flex gap-3 w-full">
                  <div className="flex flex-col items-center">
                    <div className="w-60 h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative group">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="profile"
                          className="rounded-lg object-cover"
                          fill
                        />
                      ) : (
                        <Icon
                          icon="mdi:user"
                          color="white"
                          width={128}
                          height={128}
                        />
                      )}
                      <label
                        htmlFor="foto"
                        className="absolute flex items-center justify-center bg-[#F0BB78] text-white hover:bg-[#E09359] py-2 px-7 rounded-lg font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Ubah Gambar
                      </label>
                      <input
                        id="foto"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="w-full space-y-3">
                    <FormInput
                      inputType="text"
                      placeholder=".jpg, .png"
                      label="Foto Barang"
                      className="pointer-events-none"
                      value={watch("foto").name}
                    />
                    <div className="text-sm text-black">
                      <p>*Ukuran maksimal 5MB</p>
                      <p>*Format .jpg atau .png</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Button Submit */}
            <ButtonCustom
              type="submit"
              variant="orange"
              label="Kirim"
              className="w-full"
            />
          </div>
        </form>
      )}
    </div>
  );
}
