"use client";

import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import { FormInput } from "src/components/formInput";
import AddressModal from "src/components/addressModal";
import { ButtonCustom } from "src/components/button";
import OperationalModal from "src/components/operationalModal";
import { donationTypes, days } from "src/components/options";
import handleOutsideModal from "src/components/handleOutsideModal";

import collectionCenterRegistSchema from "src/components/schema/collectionCenterRegistSchema";

import {
  createCollectionCenter,
  getOneCollectionCenter,
  updateCollectionCenter,
} from "src/services/api/collectionCenter";

import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from "src/services/auth/auth";

export default function DaftarTempatPenampung() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOperationalOpen, setIsModalOperationalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dataDetailCollectionCenter, setDataDetailCollectionCenter] =
    useState(null);
  const [isLoadingCollectionCenter, setIsLoadingCollectionCenter] =
    useState(false);
  const [isAvatarEdit, setIsAvatarEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isLoadingUpdateCollectionCenter, setIsLoadingUpdateCollectionCenter] =
    useState(false);

  const [isEditPhoneNumber, setIsEditPhoneNumber] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [isLoadingVerifyOtp, setIsLoadingVerifyOtp] = useState(false);
  const editPhoneNumberModalRef = useRef();
  const [idTokenValue, setIdTokenValue] = useState(null);
  const [phoneNumberHolder, setPhoneNumberHolder] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(collectionCenterRegistSchema),
    mode: "onBlur",
    defaultValues: {
      namaTempatPenampung: "",
      email: "",
      nomorTelepon: "",
      alamat: {},
      penjemputan: "",
      batasJarak: "",
      waktuOperasional: [],
      jenisBarang: [],
      deskripsi: "",
      foto: "",
    },
  });
  const { replace } = useFieldArray({
    control,
    name: "waktuOperasional",
  });

  const collectionCenterId = localStorage.getItem("collectionCenterId");
  const watchPhoneNumber = watch("nomorTelepon");
  const avatarPath = dataDetailCollectionCenter?.attachment?.file?.path;

  handleOutsideModal({
    ref: editPhoneNumberModalRef,
    isOpen: isEditPhoneNumber,
    onClose: () => {
      setValue(
        "nomorTelepon",
        dataDetailCollectionCenter?.phoneNumber?.slice(3)
      );
      setIsOtpSent(false);
      setIsEditPhoneNumber(false);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("foto", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const isOperationalHoursChanged = (current, original) => {
    if (current.length !== original?.length) return true;

    return current.some((item, index) => {
      const originalItem = original[index];

      const openTime = `${item.openHour}:${item.openMinute}`;
      const closeTime = `${item.closeHour}:${item.closeMinute}`;

      return (
        item.day !== originalItem.day ||
        openTime !== originalItem.openTime ||
        closeTime !== originalItem.closeTime
      );
    });
  };

  const buildUpdatedPayload = (data, original) => {
    const normalize = (value) => (value ?? "").toString().trim();
    const dataPickupTypes =
      data.penjemputan === "PICKED_UP"
        ? ["PICKED_UP", "DELIVERED"]
        : ["DELIVERED"];
    const originalPickupTypes = original?.pickupTypes;

    const updated = {};
    if (data.namaTempatPenampung !== original?.name) {
      updated.name = data.namaTempatPenampung;
    }
    if (data.email !== original?.email) {
      updated.email = data.email;
    }
    if ("+62" + data.nomorTelepon !== original?.phoneNumber) {
      updated.phoneNumber = "+62" + data.nomorTelepon;
    }
    if (dataPickupTypes.toString() !== originalPickupTypes?.toString()) {
      updated.pickupTypes = data.penjemputan;
    }
    if (data.batasJarak !== original?.distanceLimitKm) {
      updated.distanceLimitKm = data.batasJarak;
    }
    if (
      isOperationalHoursChanged(data.waktuOperasional, original?.activeHours)
    ) {
      updated.activeHours = data.waktuOperasional;
    }
    if (data.jenisBarang?.toString() !== original?.types?.toString()) {
      updated.types = data.jenisBarang;
    }
    if (data.deskripsi !== original?.description) {
      updated.description = data.deskripsi;
    }

    const address = {};
    if (
      normalize(data.alamat?.jalan) !== normalize(original?.address?.detail)
    ) {
      address.detail = data.alamat.jalan;
    }
    if (
      normalize(data.alamat?.patokan) !==
      normalize(original?.address?.reference)
    ) {
      address.reference = data.alamat.patokan;
    }
    if (
      normalize(data.alamat?.latitude) !==
      normalize(original?.address?.latitude)
    ) {
      address.latitude = data.alamat.latitude;
    }
    if (
      normalize(data.alamat?.longitude) !==
      normalize(original?.address?.longitude)
    ) {
      address.longitude = data.alamat.longitude;
    }

    if (Object.keys(address).length > 0) {
      updated.address = address;
    }

    return updated;
  };

  const onSubmitUpdate = async (data) => {
    // Validasi blocking ketika ganti nomor telepon harus dapet idToken
    const formData = new FormData();
    console.log(data);

    const updated = buildUpdatedPayload(data, dataDetailCollectionCenter);
    console.log("updated", updated);

    try {
      if (Object.keys(updated).length > 0) {
        await updateCollectionCenter(collectionCenterId, updated);
        toast.success("Profil berhasil diperbarui");
      }

      // if (data.foto && data.foto instanceof File) {
      //   const formData = new FormData();
      //   formData.append("file", data.foto);

      //   try {
      //     await updateAvatar(formData);
      //     toast.success("Foto profil berhasil diperbarui");
      //   } catch (error) {
      //     toast.error("Gagal memperbarui foto profil");
      //   }
      // }

      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      toast.error(
        "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi."
      );
    }

    // if (updated.name) formData.append("name", updated.name);
    // if (updated.phoneNumber)
    //   formData.append("phoneNumber", updated.phoneNumber);
    // if (updated.email) formData.append("email", updated.email);
    // if (updated.description)
    //   formData.append("description", updated.description);
    // if (updated.distanceLimitKm)
    //   formData.append("distanceLimitKm", updated.distanceLimitKm);
    // if (updated.pickupTypes) {
    //   updated?.pickupTypes?.forEach((item) => {
    //     formData.append("pickupTypes[]", item);
    //   });
    // }
    // if (updated.types) {
    //   updated.types.forEach((item) => {
    //     formData.append("types[]", item);
    //   });
    // }
    // if (updated.address) {
    //   const { detail, reference, latitude, longitude } = updated.address;
    //   if (detail) formData.append("address[detail]", detail);
    //   if (reference) formData.append("address[reference]", reference);
    //   if (latitude) formData.append("address[latitude]", latitude);
    //   if (longitude) formData.append("address[longitude]", longitude);
    // }
    // if (updated.activeHours) {
    //   updated.activeHours.forEach((item, index) => {
    //     formData.append(`activeHours[${index}][day]`, item.day);
    //     formData.append(
    //       `activeHours[${index}][openTime]`,
    //       `${item.openHour}:${item.openMinute}`
    //     );
    //     formData.append(
    //       `activeHours[${index}][closeTime]`,
    //       `${item.closeHour}:${item.closeMinute}`
    //     );
    //   });
    // }

    // if (updated.phoneNumber && idTokenValue) {
    //   formData.append("idToken", idTokenValue);
    // }

    // if (data.foto instanceof File) {
    //   formData.append("file", data.foto);
    // }

    // console.log("Submitted formdata:", formData);

    // if ((updated.phoneNumber && idTokenValue) || !updated.phoneNumber) {
    //   try {
    //     setIsLoadingUpdateCollectionCenter(true);
    //     createCollectionCenter(formData)
    //       .then((response) => {
    //         toast.success(
    //           "Pendaftaran berhasil. Pendaftaran akan diverifikasi terlebih dahulu oleh admin."
    //         );
    //         setIsSubmitted(true);
    //         setIsPending(true);
    //         setTimeout(() => {
    //           location.reload();
    //         }, 2000);
    //       })
    //       .catch((error) => {
    //         console.error("Error:", error);
    //         toast.error("Pendaftaran gagal");
    //         setIsSubmitted(false);
    //       });
    //   } catch (error) {
    //     console.error("Error:", error);
    //     toast.error("Pendaftaran gagal");
    //     setIsSubmitted(false);
    //   } finally {
    //     setIsLoadingCreateCollectionCenter(false);
    //   }
    // }
  };

  const fetchDetailCollectionCenter = async () => {
    setIsLoadingCollectionCenter(true);

    try {
      const detailCollectionCenterData =
        await getOneCollectionCenter(collectionCenterId);

      setDataDetailCollectionCenter(detailCollectionCenterData);
      toast.success("Data tempat penampung berhasil dimuat.");
    } catch (error) {
      console.error("Error fetching detail data collection center:", error);
      toast.error("Gagal memuat data tempat penampung.");
    } finally {
      setIsLoadingCollectionCenter(false);
    }
  };

  useEffect(() => {
    fetchDetailCollectionCenter();
  }, []);

  useEffect(() => {
    if (dataDetailCollectionCenter) {
      const address = dataDetailCollectionCenter.address;
      const reference = address.reference;
      const detail = address.detail;
      const formattedAddress =
        reference && detail ? `(${reference}) ${detail}` : detail || "";

      reset({
        namaTempatPenampung: dataDetailCollectionCenter.name,
        email: dataDetailCollectionCenter.email,
        nomorTelepon: dataDetailCollectionCenter.phoneNumber.replace("+62", ""),
        alamat: {
          summary: formattedAddress,
          jalan: address.detail,
          patokan: address.reference,
          latitude: address.latitude,
          longitude: address.longitude,
        },
        penjemputan: dataDetailCollectionCenter.pickupTypes[0],
        batasJarak: dataDetailCollectionCenter.distanceLimitKm,
        waktuOperasional: dataDetailCollectionCenter.activeHours.map(
          (item) => ({
            day: item.day,
            openHour: item.openTime.split(":")[0],
            openMinute: item.openTime.split(":")[1],
            closeHour: item.closeTime.split(":")[0],
            closeMinute: item.closeTime.split(":")[1],
          })
        ),
        jenisBarang: dataDetailCollectionCenter.types,
        deskripsi: dataDetailCollectionCenter.description,
      });
      setPhoneNumberHolder(
        dataDetailCollectionCenter.phoneNumber.replace("+62", "")
      );
    }
  }, [dataDetailCollectionCenter, reset]);

  useEffect(() => {
    if (watch("alamat.summary")) {
      clearErrors("alamat");
    }
  }, [watch("alamat.summary")]);

  useEffect(() => {
    if (watch("waktuOperasional")) {
      clearErrors("waktuOperasional");
    }
  }, [watch("waktuOperasional")]);

  useEffect(() => {
    const changes = buildUpdatedPayload(watch(), dataDetailCollectionCenter);
    setIsEdit(Object.keys(changes).length > 0);
  }, [watch(), dataDetailCollectionCenter]);

  // OTP Verification
  const handleOtpChange = (element, index, event) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (!element.value && index > 0 && event.key === "Backspace") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (event.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSendOtp = async () => {
    setIsLoadingSendOtp(true);
    const phoneNumber = watch("nomorTelepon");

    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("Masukkan nomor telepon yang valid.");
      setIsLoadingSendOtp(false);
      return;
    }

    try {
      const confirmation = await sendPhoneVerificationCode("+62" + phoneNumber);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      toast.success("OTP berhasil dikirim ke nomor Anda");
    } catch (err) {
      setIsOtpSent(false);
      console.error("Error during OTP sending:", err);
      toast.error(err.message || "Terjadi kesalahan saat mengirim OTP");
    } finally {
      setIsLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoadingVerifyOtp(true);
    try {
      const user = await verifyPhoneCode(confirmationResult, otp.join(""));
      if (user) {
        const idToken = await user.getIdToken();
        setIdTokenValue(idToken);
        setPhoneNumberHolder(watchPhoneNumber);
        toast.success("Verifikasi nomor telepon berhasil");
      } else {
        toast.error("Gagal memverifikasi nomor telepon");
      }
    } catch (error) {
      {
        error?.code === "auth/invalid-verification-code"
          ? toast.error("Kode OTP salah. Silakan coba lagi.")
          : error?.code === "auth/session-expired"
            ? toast.error(
                "Sesi OTP telah kedaluwarsa. Silakan minta kode baru."
              )
            : error?.message?.includes("Data registrasi tidak lengkap")
              ? toast.error(error.message)
              : toast.error(
                  `Gagal memverifikasi OTP: ${error.message || "Terjadi kesalahan"}`
                );
      }
    } finally {
      setIsOtpSent(false);
      setIsEditPhoneNumber(false);
      setOtp(["", "", "", "", "", ""]);
      setConfirmationResult(null);
      setIsLoadingVerifyOtp(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-12">
      <h1 className="text-[32px] font-bold text-black mb-5 text-center">
        Informasi Tempat Penampung
      </h1>

      <div className="flex justify-between gap-8">
        {/* Foto Tempat Penampung */}
        <div className="flex flex-col items-center">
          <div className="w-70 aspect-square bg-gray-100 mb-3 flex items-center justify-center relative group">
            {avatarPath && !isAvatarEdit ? (
              <Image
                src={avatarPath}
                alt="profile"
                className="rounded-lg object-cover aspect-square"
                fill="true"
              />
            ) : previewUrl ? (
              <Image
                src={previewUrl}
                alt="profile"
                className="rounded-lg object-cover"
                fill
              />
            ) : (
              <Icon icon="mdi:user" color="white" width={128} height={128} />
            )}
            <label
              htmlFor="foto"
              className="absolute flex items-center justify-center bg-[#F0BB78] text-white hover:bg-[#E09359] py-2 px-7 rounded-lg font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsAvatarEdit(true)}
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

        {/* Form Input */}
        <form
          key={formKey}
          className="space-y-6"
          onSubmit={handleSubmit(onSubmitUpdate)}
        >
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
                required
                errors={errors?.email?.message}
              />
              <FormInput
                label="Nomor Telepon (Whatsapp)"
                inputType="text"
                placeholder="Contoh: 81212312312"
                value={phoneNumberHolder || ""}
                errors={errors?.nomorTelepon?.message}
                inputStyles={"border-none"}
                required
                disabled
              />
              <div className="flex items-end">
                <ButtonCustom
                  variant="orange"
                  type="button"
                  label={`Ubah Nomor Telepon`}
                  className="text-nowrap h-12"
                  onClick={() => setIsEditPhoneNumber(true)}
                />
                {isEditPhoneNumber && (
                  <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-20">
                    <div
                      ref={editPhoneNumberModalRef}
                      className="bg-white rounded-lg flex flex-col p-8 text-black gap-6"
                    >
                      <h3 className="text-xl font-bold">Ubah Nomor Telepon</h3>

                      <div className="flex items-end">
                        <FormInput
                          label="Nomor Telepon (Whatsapp)"
                          inputType="text"
                          placeholder="Contoh: 81212312312"
                          register={register("nomorTelepon")}
                          inputStyles={`w-full`}
                        />
                        {dataDetailCollectionCenter?.phoneNumber !==
                          "+62" + watch("nomorTelepon") && (
                          <ButtonCustom
                            variant="orange"
                            type="button"
                            label={`Kirim OTP`}
                            className="h-12 ml-3 text-nowrap"
                            isLoading={isLoadingSendOtp}
                            onClick={handleSendOtp}
                          />
                        )}
                      </div>

                      <div id="recaptcha-container" />

                      {isOtpSent && (
                        <div className="pt-5 border-t space-y-3">
                          <h3 className="text-lg font-bold">Verifikasi OTP</h3>
                          <div className="flex gap-3">
                            <div className="flex gap-3">
                              {otp.map((data, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  maxLength="1"
                                  value={data}
                                  onChange={(e) =>
                                    handleOtpChange(e.target, index, e)
                                  }
                                  onKeyDown={(e) => handleKeyDown(e, index)}
                                  ref={(el) => (inputRefs.current[index] = el)}
                                  className="h-12 aspect-square text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
                                  style={{
                                    color: data ? "#131010" : "#000",
                                    outlineColor: data ? "#131010" : "#C2C2C2",
                                  }}
                                  aria-label={`OTP digit ${index + 1}`}
                                  aria-required="true"
                                  autoComplete="one-time-code"
                                />
                              ))}
                            </div>
                            <ButtonCustom
                              type="button"
                              variant="orange"
                              label="Konfirmasi"
                              onClick={handleVerifyOtp}
                              isLoading={isLoadingVerifyOtp}
                              className="min-w-[146px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <FormInput
                label="Alamat Lengkap"
                inputType="textArea"
                placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
                value={watch("alamat.summary") || ""}
                // register={register("alamat")}
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="flex-1"
                required
                errors={errors?.alamat?.message}
              />
              {/* Modal Alamat Lengkap */}
              <AddressModal
                isOpen={isModalOpen}
                dataProfile={dataDetailCollectionCenter}
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
                required
                errors={errors?.penjemputan?.message}
              />
              {watch("penjemputan") === "PICKED_UP" && (
                <FormInput
                  label="Batas Jarak Penjemputan (KM)"
                  inputType="text"
                  placeholder="Contoh: 10"
                  register={register("batasJarak")}
                />
              )}
            </div>
            <div className="flex gap-3">
              <FormInput
                label="Waktu Operasional (WIB)"
                inputType="text"
                placeholder="Pilih hari dan jam operasional yang sesuai"
                onClick={() => {
                  setIsModalOperationalOpen(!isModalOperationalOpen);
                }}
                value={
                  Array.isArray(watch("waktuOperasional")) &&
                  watch("waktuOperasional").length > 0
                    ? watch("waktuOperasional")
                        .map((item) => {
                          const dayLabel =
                            days.find((d) => d.value === item.day)?.label ||
                            item.day;
                          return `${dayLabel} ${item.openHour}:${item.openMinute} - ${item.closeHour}:${item.closeMinute}`;
                        })
                        .join(", ")
                    : ""
                }
                required
                errors={errors?.waktuOperasional?.message}
              />
              {/* Modal Waktu Operasional */}
              <OperationalModal
                isOpen={isModalOperationalOpen}
                handleClose={() => setIsModalOperationalOpen(false)}
                setValue={setValue}
                defaultDataOperational={dataDetailCollectionCenter?.activeHours}
              />

              <FormInput
                label="Jenis Barang yang Diterima"
                inputType="dropdownInput"
                options={donationTypes}
                control={control}
                name="jenisBarang"
                placeholder="Pilih jenis barang yang diterima"
                type="checkbox"
                required
                errors={errors?.jenisBarang?.message}
              />
            </div>

            <FormInput
              label="Deskripsi Singkat"
              inputType="textArea"
              placeholder="Contoh:  Kami adalah lembaga kemanusiaan yang berfokus pada bantuan darurat untuk korban bencana alam. Donasi yang kami terima akan disalurkan langsung kepada mereka yang terdampak bencana alam."
              register={register("deskripsi")}
              required
              errors={errors?.deskripsi?.message}
            />
          </div>

          {/* Button Submit */}
          {((isEdit && !isEditPhoneNumber) || isAvatarEdit) && (
            <div className="flex gap-3">
              <ButtonCustom
                type={"submit"}
                variant={"brown"}
                label={"Simpan Perubahan"}
                className="w-full"
              />
              <ButtonCustom
                type="button"
                variant="outlineBrown"
                label="Batalkan Perubahan"
                onClick={() => {
                  const address = dataDetailCollectionCenter?.address;
                  const reference = address?.reference;
                  const detail = address?.detail;
                  const formattedAddress =
                    reference && detail
                      ? `(${reference}) ${detail}`
                      : detail || "";

                  reset({
                    namaTempatPenampung: dataDetailCollectionCenter.name,
                    email: dataDetailCollectionCenter.email,
                    nomorTelepon:
                      dataDetailCollectionCenter.phoneNumber.replace("+62", ""),
                    alamat: {
                      summary: formattedAddress,
                      jalan: address.detail,
                      patokan: address.reference,
                      latitude: address.latitude,
                      longitude: address.longitude,
                    },
                    penjemputan: dataDetailCollectionCenter.pickupTypes[0],
                    batasJarak: dataDetailCollectionCenter.distanceLimitKm,
                    jenisBarang: dataDetailCollectionCenter.types,
                    deskripsi: dataDetailCollectionCenter.description,
                  });
                  replace(
                    dataDetailCollectionCenter.activeHours.map((item) => ({
                      day: item.day,
                      openHour: item.openTime.split(":")[0],
                      openMinute: item.openTime.split(":")[1],
                      closeHour: item.closeTime.split(":")[0],
                      closeMinute: item.closeTime.split(":")[1],
                    }))
                  );
                  setIsEdit(false);
                  setIsAvatarEdit(false);
                  setFormKey((prev) => prev + 1);
                }}
                className="w-full"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
