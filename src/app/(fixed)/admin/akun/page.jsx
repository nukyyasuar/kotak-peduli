"use client";

import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import collectionCenterRegistSchema from "src/components/schema/collectionCenterRegistSchema";
import {
  getOneCollectionCenter,
  updateCollectionCenter,
  verifyPhoneNumberCollectionCenter,
  updateAvatarCollectionCenter,
  verifyEmailCollectionCenter,
} from "src/services/api/collectionCenter";
import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from "src/services/auth/auth";
import { useAuth } from "src/services/auth/AuthContext";

import Unauthorize from "src/components/unauthorize";
import { FormInput } from "src/components/formInput";
import AddressModal from "src/components/addressModal";
import { ButtonCustom } from "src/components/button";
import OperationalModal from "src/components/operationalModal";
import { donationTypes, days } from "src/components/options";
import handleOutsideModal from "src/components/handleOutsideModal";

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
  const [isEmailVerifModalOpen, setIsEmailVerifModalOpen] = useState(false);
  const [isEmailVerifSent, setIsEmailVerifSent] = useState(false);
  const [isLoadingSentVerifEmail, setIsLoadingSentVerifEmail] = useState(false);

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
  const [errorPhoneNumberModal, setErrorPhoneNumberModal] = useState(null);
  const [errorOtp, setErrorOtp] = useState(null);

  const { hasPermission } = useAuth();
  const verifEmailModalRef = useRef();

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

  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("collectionCenterId");
    }
    return null;
  };
  const collectionCenterId = getInitialValue();

  const watchValue = watch();
  const watchPhoneNumber = watch("nomorTelepon");
  const avatarPath = dataDetailCollectionCenter?.attachment?.file?.path;

  handleOutsideModal({
    ref: verifEmailModalRef,
    isOpen: isEmailVerifModalOpen,
    onClose: () => setIsEmailVerifModalOpen(false),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("foto", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const urlToFile = async (url, filename, mimeType) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: mimeType });
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

  const buildUpdatedPayload = async (data, original) => {
    const normalize = (value) => (value ?? "").toString().trim();
    const fileUrl = original?.attachment;
    const originalFile = await urlToFile(
      fileUrl,
      fileUrl?.file.name,
      fileUrl?.file.mime
    );

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
      updated.pickupTypes = [data.penjemputan];
    }
    if (data.batasJarak !== original?.distanceLimitKm) {
      updated.distanceLimitKm = data.batasJarak;
    }
    if (
      isOperationalHoursChanged(data.waktuOperasional, original?.activeHours)
    ) {
      updated.activeHours = data.waktuOperasional.map((item) => {
        const openTime = `${item.openHour}:${item.openMinute}`;
        const closeTime = `${item.closeHour}:${item.closeMinute}`;
        return {
          day: item.day,
          openTime,
          closeTime,
        };
      });
    }
    if (data.jenisBarang?.toString() !== original?.types?.toString()) {
      updated.types = data.jenisBarang;
    }
    if (data.deskripsi !== original?.description) {
      updated.description = data.deskripsi;
    }
    if (data.foto.name !== originalFile.name) {
      updated.file = data.foto;
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
    const updated = await buildUpdatedPayload(data, dataDetailCollectionCenter);

    try {
      setIsLoadingUpdateCollectionCenter(true);

      if (Object.keys(updated).length > 0) {
        if (idTokenValue) {
          try {
            await verifyPhoneNumberCollectionCenter(collectionCenterId, {
              idToken: idTokenValue,
              phoneNumber: "+62" + watchPhoneNumber,
            });
          } catch (error) {
            console.error("Error verifying phone number:", error);
            toast.error(
              "Gagal memproses penggantian nomor telepon. Silakan coba lagi."
            );
            return;
          }
        }

        if (updated.file) {
          const formDataFile = new FormData();
          formDataFile.append("file", data.foto);

          try {
            await updateAvatarCollectionCenter(
              collectionCenterId,
              formDataFile
            );
            toast.success("Foto profil berhasil diperbarui");
          } catch (error) {
            toast.error("Gagal memperbarui foto profil");
          }

          delete updated.file;
        }

        try {
          await updateCollectionCenter(collectionCenterId, updated);
          toast.success("Profil berhasil diperbarui");
          fetchDetailCollectionCenter();
        } catch (error) {
          console.error("Error updating collection center:", error);
          toast.error("Gagal memperbarui profil. Silakan coba lagi.");
        }
      }
    } catch (error) {
      toast.error(
        "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi."
      );
    } finally {
      setIsLoadingUpdateCollectionCenter(false);
    }
  };

  const fetchDetailCollectionCenter = async () => {
    try {
      setIsLoadingCollectionCenter(true);

      const detailCollectionCenterData =
        await getOneCollectionCenter(collectionCenterId);

      setDataDetailCollectionCenter(detailCollectionCenterData);
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
    const resetAndConvert = async () => {
      if (!dataDetailCollectionCenter) return;
      const address = dataDetailCollectionCenter.address;
      const reference = address.reference;
      const detail = address.detail;
      const formattedAddress =
        reference && detail ? `(${reference}) ${detail}` : detail || "";

      let file = null;
      const fileUrl = dataDetailCollectionCenter.attachment?.file;
      if (fileUrl) {
        file = await urlToFile(fileUrl, fileUrl.name, fileUrl.mime);
      }

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
        foto: file,
      });
      setPhoneNumberHolder(
        dataDetailCollectionCenter.phoneNumber.replace("+62", "")
      );
    };

    resetAndConvert();
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
    const checkChanges = async () => {
      const changes = await buildUpdatedPayload(
        watchValue,
        dataDetailCollectionCenter
      );
      setIsEdit(Object.keys(changes).length > 0);
    };

    checkChanges();
  }, [watchValue, dataDetailCollectionCenter]);

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
    const phoneNumber = watch("nomorTelepon");

    if (!phoneNumber) {
      setErrorPhoneNumberModal("Nomor telepon wajib diisi.");
      return;
    } else if (!/^\d+$/.test(phoneNumber)) {
      setErrorPhoneNumberModal("Nomor telepon hanya boleh berisi angka.");
      return;
    } else if (phoneNumber.length < 9) {
      setErrorPhoneNumberModal("Nomor telepon minimal terdiri dari 9 digit.");
      return;
    } else if (phoneNumber.length > 15) {
      setErrorPhoneNumberModal("Nomor telepon maksimal terdiri dari 15 digit.");
      return;
    } else if (!/^8\d{8,14}$/.test(phoneNumber)) {
      setErrorPhoneNumberModal(
        "Nomor telepon harus dimulai dengan angka ‘8’ (contoh: 81231231231)"
      );
      return;
    }

    try {
      setIsLoadingSendOtp(true);
      setErrorPhoneNumberModal(null);

      const confirmation = await sendPhoneVerificationCode("+62" + phoneNumber);

      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      toast.success("OTP berhasil dikirim ke nomor Anda");
    } catch (err) {
      if (
        err.message ===
        "Gagal mengirim kode OTP: Firebase: Error (auth/invalid-app-credential)"
      ) {
        toast.error(
          "Nomor telepon terlalu sering digunakan. Silakan coba lagi nanti."
        );
      } else {
        toast.error(err.message || "Terjadi kesalahan saat mengirim OTP");
      }

      setIsOtpSent(false);
    } finally {
      setIsLoadingSendOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6 && otpCode.length > 0) {
      setErrorOtp("Kode OTP harus terdiri dari 6 digit.");
      return;
    } else if (otpCode.length === 0) {
      setErrorOtp("Kode OTP wajib diisi.");
      return;
    }
    setErrorOtp(null);

    try {
      setIsLoadingVerifyOtp(true);

      const user = await verifyPhoneCode(confirmationResult, otpCode);

      if (!user) {
        throw new Error("Gagal memverifikasi nomor telepon");
      }

      const idToken = await user.getIdToken();

      setIdTokenValue(idToken);
      setPhoneNumberHolder(watchPhoneNumber);

      try {
        await verifyPhoneNumberCollectionCenter(collectionCenterId, {
          idToken,
          phoneNumber: "+62" + watchPhoneNumber,
        });

        toast.success("Verifikasi nomor telepon berhasil");
        setIsOtpSent(false);
        setConfirmationResult(null);
        setErrorOtp(null);
        setErrorPhoneNumberModal(null);
        location.reload();
      } catch (error) {
        console.error("Error verifying phone number:", error);
        toast.error("Gagal memverifikasi nomor telepon");
      }
    } catch (error) {
      const code = error?.code;

      if (code === "auth/invalid-verification-code") {
        toast.error("Kode OTP salah. Silakan coba lagi.");
      } else if (code === "auth/session-expired") {
        toast.error("Sesi OTP telah kedaluwarsa. Silakan minta kode baru.");
      } else if (error?.message?.includes("Data registrasi tidak lengkap")) {
        toast.error(error.message);
      } else {
        toast.error(error.message || "Terjadi kesalahan saat verifikasi OTP");
      }
    } finally {
      setOtp(["", "", "", "", "", ""]);
      setIsLoadingVerifyOtp(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setIsLoadingSentVerifEmail(true);

      await verifyEmailCollectionCenter(collectionCenterId);
      toast.success(
        "Tautan verifikasi email berhasil dikirim. Silahkan periksa email Anda."
      );

      setIsEmailVerifSent(true);
    } catch (error) {
      if (error.message === "Email already verified") {
        toast.error("Email sudah terverifikasi");
      } else {
        toast.error(error.message || "Gagal mengirim tautan verifikasi email");
      }
    } finally {
      setIsLoadingSentVerifEmail(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-12">
      {!hasPermission("UPDATE_COLLECTION") ? (
        <Unauthorize />
      ) : (
        <div className="space-y-6">
          <h1 className="text-[32px] text-[#543A14] font-bold text-center">
            INFORMASI TEMPAT PENAMPUNG
          </h1>

          {isLoadingCollectionCenter ? (
            <ClipLoader
              color="white"
              size={50}
              loading={isLoadingCollectionCenter}
            />
          ) : (
            <fieldset
              className="justify-between gap-8"
              disabled={isLoadingUpdateCollectionCenter}
            >
              {/* Foto Tempat Penampung */}
              <div className="flex flex-col items-center">
                <div className="w-70 aspect-square bg-gray-100 mb-3 flex items-center justify-center relative group rounded-lg">
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
                {errors?.foto?.message && (
                  <p className="text-[#E52020] text-sm max-w-3xs text-center">
                    {errors?.foto?.message}
                  </p>
                )}
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
                    className="w-full"
                  />
                  <div className="flex flex-col gap-3 w-full">
                    <div className="min-w-xl">
                      <div className="flex gap-3 items-end relative">
                        <FormInput
                          label="Email"
                          inputType="text"
                          type="email"
                          placeholder="Contoh: user@example.com"
                          register={register("email")}
                          required
                          className="w-full"
                        />
                        {dataDetailCollectionCenter?.emailVerifiedAt ? (
                          <Icon
                            icon="icon-park-solid:check-one"
                            width={32}
                            height={32}
                            color="#1F7D53"
                            className="absolute right-2 bottom-2"
                          />
                        ) : (
                          <ButtonCustom
                            type="button"
                            variant="orange"
                            label="Verifikasi Email"
                            onClick={() => {
                              handleVerifyEmail();
                              setIsEmailVerifModalOpen(true);
                            }}
                            className="h-12 text-nowrap"
                          />
                        )}
                      </div>
                      {errors?.email?.message && (
                        <p className="text-[#E52020] text-sm mt-1">
                          {errors?.email?.message}
                        </p>
                      )}

                      {isEmailVerifModalOpen && (
                        <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
                          <div
                            ref={verifEmailModalRef}
                            className="bg-white rounded-lg p-8 space-y-6 text-black"
                          >
                            <h1 className="font-bold text-xl">
                              Verfikasi Email
                            </h1>
                            <div className="flex gap-1">
                              <span>
                                Link verifikasi akan dikirim ke email Anda:
                              </span>
                              <span className="font-bold">
                                {watch("email")}
                              </span>
                            </div>
                            {isLoadingSentVerifEmail ? (
                              <div className="flex items-center justify-center">
                                <ClipLoader
                                  color="#F5A623"
                                  loading={isLoadingSentVerifEmail}
                                  size={24}
                                />
                              </div>
                            ) : (
                              isEmailVerifSent && (
                                <div className="flex items-center gap-3">
                                  <div className="w-md">
                                    <p>
                                      Link verifikasi telah dikirim ke email
                                      anda. Silakan periksa dan lakukan
                                      verifikasi dengan mengklik link tersebut.
                                    </p>
                                  </div>
                                  <Icon
                                    icon="icon-park-solid:check-one"
                                    width={48}
                                    height={48}
                                    color="#1F7D53"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <FormInput
                        label="Nomor Telepon (Whatsapp)"
                        inputType="text"
                        placeholder="Contoh: 81212312312"
                        value={phoneNumberHolder || ""}
                        inputStyles={"border-none"}
                        required
                        disabled
                        className="w-full"
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
                              <button className="flex justify-end gap-0 -mb-6">
                                <Icon
                                  icon="mdi:close"
                                  color="black"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setErrorPhoneNumberModal(null);
                                    setIsEditPhoneNumber(false);
                                    setOtp(["", "", "", "", "", ""]);
                                    setIsOtpSent(false);
                                    setConfirmationResult(null);
                                    setValue(
                                      "nomorTelepon",
                                      dataDetailCollectionCenter.phoneNumber.slice(
                                        3
                                      ) || ""
                                    );
                                    setIsLoadingSendOtp(false);
                                    setIsLoadingVerifyOtp(false);
                                    clearErrors("nomorTelepon");
                                  }}
                                />
                              </button>

                              <h3 className="text-xl font-bold">
                                Ubah Nomor Telepon
                              </h3>

                              <div className="space-y-1">
                                <div className="flex items-end">
                                  <FormInput
                                    label="Nomor Telepon (Whatsapp)"
                                    inputType="text"
                                    placeholder="Contoh: 81212312312"
                                    register={register("nomorTelepon")}
                                    inputStyles={`w-full`}
                                    className="w-full"
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
                                {errorPhoneNumberModal && (
                                  <p className="text-[#E52020] text-sm max-w-3xs">
                                    {errorPhoneNumberModal}
                                  </p>
                                )}
                              </div>

                              <div id="recaptcha-container" />

                              {isOtpSent && (
                                <div className="pt-5 border-t space-y-3">
                                  <h3 className="text-lg font-bold">
                                    Verifikasi OTP
                                  </h3>

                                  <div className="space-y-3">
                                    <div className="flex gap-3">
                                      <div className="flex gap-3">
                                        {otp.map((data, index) => (
                                          <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) =>
                                              handleOtpChange(
                                                e.target,
                                                index,
                                                e
                                              )
                                            }
                                            onKeyDown={(e) =>
                                              handleKeyDown(e, index)
                                            }
                                            ref={(el) =>
                                              (inputRefs.current[index] = el)
                                            }
                                            className="h-12 aspect-square max-w-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
                                            style={{
                                              color: data ? "#131010" : "#000",
                                              outlineColor: data
                                                ? "#131010"
                                                : "#C2C2C2",
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
                                    {errorOtp && (
                                      <p className="text-[#E52020] text-sm">
                                        {errorOtp}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
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
                      className="flex-1 w-full"
                      required
                      errors={errors?.alamat?.message}
                    />
                    {/* Modal Alamat Lengkap */}
                    <AddressModal
                      isOpen={isModalOpen}
                      watch={watch}
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
                      className="w-full"
                    />
                    {watch("penjemputan") === "PICKED_UP" && (
                      <FormInput
                        label="Batas Jarak Penjemputan (KM)"
                        inputType="text"
                        placeholder="Contoh: 10"
                        register={register("batasJarak")}
                        className="w-full"
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
                                  days.find((d) => d.value === item.day)
                                    ?.label || item.day;
                                return `${dayLabel} ${item.openHour}:${item.openMinute} - ${item.closeHour}:${item.closeMinute}`;
                              })
                              .join(", ")
                          : ""
                      }
                      required
                      errors={errors?.waktuOperasional?.message}
                      className="w-full"
                    />
                    {/* Modal Waktu Operasional */}
                    <OperationalModal
                      isOpen={isModalOperationalOpen}
                      handleClose={() => setIsModalOperationalOpen(false)}
                      setValue={setValue}
                      defaultDataOperational={
                        dataDetailCollectionCenter?.activeHours
                      }
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
                      className="w-full"
                    />
                  </div>

                  <FormInput
                    label="Deskripsi Singkat"
                    inputType="textArea"
                    placeholder="Contoh:  Kami adalah lembaga kemanusiaan yang berfokus pada bantuan darurat untuk korban bencana alam. Donasi yang kami terima akan disalurkan langsung kepada mereka yang terdampak bencana alam."
                    register={register("deskripsi")}
                    required
                    errors={errors?.deskripsi?.message}
                    className="w-full"
                  />
                </div>

                {/* Button Submit */}
                {((isEdit && !isEditPhoneNumber) || isAvatarEdit) && (
                  <div className="flex gap-3">
                    <ButtonCustom
                      type={"submit"}
                      variant={"brown"}
                      label={
                        isLoadingUpdateCollectionCenter ? (
                          <div>
                            <ClipLoader
                              color="white"
                              loading={isLoadingUpdateCollectionCenter}
                              size={20}
                            />
                          </div>
                        ) : (
                          "Simpan Perubahan"
                        )
                      }
                      className="w-full"
                      disabled={isLoadingUpdateCollectionCenter}
                    />
                    <ButtonCustom
                      type="button"
                      variant="outlineBrown"
                      label="Batalkan Perubahan"
                      onClick={async () => {
                        const address = dataDetailCollectionCenter?.address;
                        const reference = address?.reference;
                        const detail = address?.detail;
                        const formattedAddress =
                          reference && detail
                            ? `(${reference}) ${detail}`
                            : detail || "";

                        let file = null;
                        const fileUrl =
                          dataDetailCollectionCenter.attachment?.file;
                        if (fileUrl) {
                          file = await urlToFile(
                            fileUrl,
                            fileUrl.name,
                            fileUrl.mime
                          );
                        }

                        reset({
                          namaTempatPenampung: dataDetailCollectionCenter.name,
                          email: dataDetailCollectionCenter.email,
                          nomorTelepon:
                            dataDetailCollectionCenter.phoneNumber.replace(
                              "+62",
                              ""
                            ),
                          alamat: {
                            summary: formattedAddress,
                            jalan: address.detail,
                            patokan: address.reference,
                            latitude: address.latitude,
                            longitude: address.longitude,
                          },
                          penjemputan:
                            dataDetailCollectionCenter.pickupTypes[0],
                          batasJarak:
                            dataDetailCollectionCenter.distanceLimitKm,
                          jenisBarang: dataDetailCollectionCenter.types,
                          deskripsi: dataDetailCollectionCenter.description,
                          foto: file,
                        });
                        replace(
                          dataDetailCollectionCenter.activeHours.map(
                            (item) => ({
                              day: item.day,
                              openHour: item.openTime.split(":")[0],
                              openMinute: item.openTime.split(":")[1],
                              closeHour: item.closeTime.split(":")[0],
                              closeMinute: item.closeTime.split(":")[1],
                            })
                          )
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
            </fieldset>
          )}
        </div>
      )}
    </div>
  );
}
