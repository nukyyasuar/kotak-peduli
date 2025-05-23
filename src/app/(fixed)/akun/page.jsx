"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ClipLoader } from "react-spinners";

import { FormInput } from "src/components/formInput";
import AddressModal from "src/components/addressModal";
import { ButtonCustom } from "src/components/button";
import handleOutsideModal from "src/components/handleOutsideModal";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  verifyOtp,
} from "src/services/api/profile";
import { verifyEmail } from "src/services/api/verifyEmail";

import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from "src/services/auth/auth";
import { toast } from "react-toastify";

export default function Akun() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAvatarEdit, setIsAvatarEdit] = useState(false);
  const [isEditPhoneNumber, setIsEditPhoneNumber] = useState(false);
  const fileInputRef = useRef();
  const verifEmailModalRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEmailVerifModalOpen, setIsEmailVerifModalOpen] = useState(false);
  const [isEmailVerifSent, setIsEmailVerifSent] = useState(false);
  const [dataProfile, setDataProfile] = useState({});
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(true);

  const editPhoneNumberModalRef = useRef();
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [isLoadingVerifyOtp, setIsLoadingVerifyOtp] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      namaDepan: "",
      namaBelakang: "",
      nomorTelepon: "",
      email: "",
      alamat: {},
      foto: "",
    },
  });
  const watchedValues = watch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("foto", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const buildUpdatedPayload = (data, original) => {
    const normalize = (value) => (value ?? "").toString().trim();

    const updated = {};

    if (data.namaDepan !== original.firstName) {
      updated.firstName = data.namaDepan;
    }
    if (data.namaBelakang !== original.lastName) {
      updated.lastName = data.namaBelakang;
    }
    if ("+62" + data.nomorTelepon !== original.phoneNumber) {
      updated.phoneNumber = "+62" + data.nomorTelepon;
    }
    if (data.email !== original.email) {
      updated.email = data.email;
    }

    const address = {};
    if (normalize(data.alamat?.jalan) !== normalize(original.address?.detail)) {
      address.detail = data.alamat.jalan;
    }
    if (
      normalize(data.alamat?.patokan) !== normalize(original.address?.reference)
    ) {
      address.reference = data.alamat.patokan;
    }
    if (
      normalize(data.alamat?.latitude) !== normalize(original.address?.latitude)
    ) {
      address.latitude = data.alamat.latitude;
    }
    if (
      normalize(data.alamat?.longitude) !==
      normalize(original.address?.longitude)
    ) {
      address.longitude = data.alamat.longitude;
    }

    if (Object.keys(address).length > 0) {
      updated.address = address;
    }

    return updated;
  };

  handleOutsideModal({
    ref: verifEmailModalRef,
    isOpen: isEmailVerifModalOpen,
    onClose: () => setIsEmailVerifModalOpen(false),
  });

  handleOutsideModal({
    ref: editPhoneNumberModalRef,
    isOpen: isEditPhoneNumber,
    onClose: () => setIsEditPhoneNumber(false),
  });

  const onSubmit = async (data) => {
    if (!isEditPhoneNumber) {
      const payload = buildUpdatedPayload(data, dataProfile);

      try {
        if (Object.keys(payload).length > 0) {
          await updateProfile(payload);
          toast.success("Profil berhasil diperbarui");
        }

        if (data.foto && data.foto instanceof File) {
          const formData = new FormData();
          formData.append("file", data.foto);

          try {
            await updateAvatar(formData);
            toast.success("Foto profil berhasil diperbarui");
          } catch (error) {
            toast.error("Gagal memperbarui foto profil");
          }
        }

        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        toast.error(
          "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi."
        );
      }
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail();
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
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingProfileData(true);
      try {
        const data = await getProfile();
        setDataProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoadingProfileData(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (dataProfile) {
      const reference = dataProfile?.address?.reference;
      const detail = dataProfile?.address?.detail;

      const formattedAddress =
        reference && detail ? `(${reference}) ${detail}` : detail || "";

      const formattedPhoneNumber = dataProfile?.phoneNumber?.startsWith("+62")
        ? dataProfile?.phoneNumber.slice(3)
        : dataProfile?.phoneNumber;

      reset({
        namaDepan: dataProfile.firstName || "",
        namaBelakang: dataProfile.lastName || "",
        nomorTelepon: formattedPhoneNumber || "",
        email: dataProfile.email || "",
        alamat: {
          summary: formattedAddress || "",
          jalan: dataProfile?.address?.detail || "",
          patokan: dataProfile?.address?.reference || "",
          latitude: dataProfile?.address?.latitude || "",
          longitude: dataProfile?.address?.longitude || "",
        },
      });
    }
  }, [dataProfile, reset]);

  useEffect(() => {
    const changes = buildUpdatedPayload(watchedValues, dataProfile);
    setIsEdit(Object.keys(changes).length > 0);
  }, [watchedValues, dataProfile]);

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

        try {
          await updateProfile({
            phoneNumber: "+62" + watch("nomorTelepon"),
          });
          try {
            await verifyOtp(idToken);
            toast.success("Nomor telepon berhasil diverifikasi dan diperbarui");
          } catch (error) {
            toast.error(error.message || "Gagal memverifikasi nomor telepon");
          }
        } catch (error) {
          console.error("Error updating phone number:", error.message);
          if (error.message === "Unique constraint failed") {
            toast.error("Nomor telepon sudah terdaftar");
          } else {
            toast.error("Gagal memperbarui nomor telepon");
          }
          setValue("nomorTelepon", dataProfile.phoneNumber.slice(3));
        }
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
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  };

  return isLoadingProfileData ? (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader
        color="#F5A623"
        loading={isLoadingProfileData}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    <div>
      <div className="mb-6 text-[#543A14]">
        <h2 className="text-xl font-bold">Profil</h2>
        <p className="text-base">Sesuaikan informasi data diri Anda</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-between gap-8"
      >
        <div className="space-y-6 w-full">
          <div className="space-y-3 text-black">
            <div className="flex gap-3">
              <FormInput
                label="Nama Depan"
                inputType="text"
                placeholder="Contoh: Matthew"
                register={register("namaDepan")}
                inputStyles={`w-full bg-white`}
              />
              <FormInput
                label="Nama Belakang"
                inputType="text"
                placeholder="Contoh: Emmanuel"
                register={register("namaBelakang")}
                inputStyles={`w-full bg-white`}
              />
            </div>
            <div className="flex items-end">
              <FormInput
                label="Nomor Telepon (Whatsapp)"
                inputType="text"
                placeholder="Contoh: 81212312312"
                value={dataProfile?.phoneNumber?.slice(3) || ""}
                inputStyles={`w-full border-none`}
                disabled
              />
              <ButtonCustom
                variant="orange"
                type="button"
                label={`Ubah Nomor Telepon`}
                className="ml-3 text-nowrap h-12"
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
                      {dataProfile?.phoneNumber !==
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
            <div className="flex gap-3 items-end relative">
              <FormInput
                label="Email"
                inputType="text"
                type="email"
                placeholder="Contoh: user@example.com"
                register={register("email")}
                inputStyles={`w-full bg-white relative`}
              />
              {dataProfile?.emailVerifiedAt ? (
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
              {isEmailVerifModalOpen && (
                <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
                  <div
                    ref={verifEmailModalRef}
                    className="bg-white rounded-lg p-8 space-y-6 text-black"
                  >
                    <h1 className="font-bold text-xl">Verfikasi Email</h1>
                    {isEmailVerifSent ? (
                      <div className="flex flex-col items-center gap-3">
                        <Icon
                          icon="icon-park-solid:check-one"
                          width={120}
                          height={120}
                          color="#1F7D53"
                        />
                        <div className="w-md">
                          <p className="text-center">
                            Email Anda berhasil diverifikasi. Notifikasi terkait
                            status barang donasi dan jadwal
                            pengiriman/penjemputan akan dikirimkan ke email
                            Anda.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1">
                          <span>
                            Kami telah mengirimkan tautan verifikasi ke email
                            Anda, berikut:
                          </span>
                          <span className="font-bold">{watch("email")}</span>
                        </div>
                        {/* <ButtonCustom
                    type="button"
                    label="Kirim Ulang Tautan Verifikasi (00:00)"
                    variant="brown"
                    className="w-full"
                    onClick={() => {
                      setIsEmailVerifSent(true);
                    }}
                  /> */}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <FormInput
              label="Alamat Lengkap"
              inputType="textArea"
              placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
              value={watch("alamat.summary") || ""}
              // register={register("alamat")}
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="flex-1"
              inputStyles={`w-full bg-white`}
            />
            {/* Modal Alamat Lengkap */}
            <AddressModal
              isOpen={isModalOpen}
              dataProfile={dataProfile}
              handleClose={() => setIsModalOpen(false)}
              setValue={setValue}
            />
          </div>
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
                  const reference = dataProfile?.address?.reference;
                  const detail = dataProfile?.address?.detail;
                  const formattedAddress =
                    reference && detail
                      ? `(${reference}) ${detail}`
                      : detail || "";

                  reset({
                    namaDepan: dataProfile.firstName || "",
                    namaBelakang: dataProfile.lastName || "",
                    nomorTelepon: dataProfile.phoneNumber.slice(3) || "",
                    email: dataProfile.email || "",
                    alamat: {
                      summary: formattedAddress || "",
                      jalan: dataProfile?.address?.detail || "",
                      patokan: dataProfile?.address?.reference || "",
                      latitude: dataProfile?.address?.latitude || "",
                      longitude: dataProfile?.address?.longitude || "",
                    },
                  });
                  setIsEdit(false);
                  setIsAvatarEdit(false);
                }}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Gambar Profil */}
        <div className="flex flex-col items-center">
          <div className="w-52 aspect-square bg-gray-100 rounded-full mb-3 flex items-center justify-center relative group">
            {dataProfile?.avatar?.file && !isAvatarEdit ? (
              <Image
                src={dataProfile?.avatar?.file?.path}
                alt="profile"
                className="rounded-full object-cover aspect-square"
                fill="true"
              />
            ) : previewUrl ? (
              <Image
                src={previewUrl}
                alt="profile"
                className="rounded-full object-cover"
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
          <div className="text-sm text-black text-center">
            <p>*Ukuran maksimal 5MB</p>
            <p>*Format .jpg atau .png</p>
          </div>
        </div>
      </form>
    </div>
  );
}
