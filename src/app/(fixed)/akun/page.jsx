"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

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
import profileSchema from "src/components/schema/profileSchema";

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
  const [errorPhoneNumberModal, setErrorPhoneNumberModal] = useState(null);
  const [errorOtp, setErrorOtp] = useState(null);
  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] = useState(false);

  const editPhoneNumberModalRef = useRef();
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoadingSendOtp, setIsLoadingSendOtp] = useState(false);
  const [isLoadingVerifyOtp, setIsLoadingVerifyOtp] = useState(false);
  const [isLoadingSentVerifEmail, setIsLoadingSentVerifEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
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

  const onSubmit = async (data) => {
    if (!isEditPhoneNumber) {
      const payload = buildUpdatedPayload(data, dataProfile);

      try {
        setIsLoadingUpdateProfile(true);

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

        fetchProfile();
      } catch (error) {
        toast.error(
          "Terjadi kesalahan saat memperbarui profil. Silakan coba lagi."
        );
      } finally {
        setIsLoadingUpdateProfile(false);
      }
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setIsLoadingSentVerifEmail(true);

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
    } finally {
      setIsLoadingSentVerifEmail(false);
    }
  };

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

  useEffect(() => {
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
    setErrorPhoneNumberModal(null);

    try {
      setIsLoadingSendOtp(true);

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
    setIsLoadingVerifyOtp(true);

    try {
      const user = await verifyPhoneCode(confirmationResult, otpCode);

      if (!user) {
        throw new Error("Gagal memverifikasi nomor telepon");
      }

      const idToken = await user.getIdToken();

      try {
        await updateProfile({
          phoneNumber: "+62" + watch("nomorTelepon"),
        });
      } catch (error) {
        setValue("nomorTelepon", dataProfile.phoneNumber.slice(3));

        if (error.message === "Unique constraint failed") {
          setIsOtpSent(false);
          throw new Error("Nomor telepon sudah terdaftar");
        } else {
          throw new Error("Gagal memperbarui nomor telepon");
        }
      }

      try {
        await verifyOtp(idToken);
      } catch (error) {
        throw new Error(error.message || "Gagal memverifikasi nomor telepon");
      }

      toast.success("Nomor telepon berhasil diverifikasi dan diperbarui");

      setIsEditPhoneNumber(false);
      setIsOtpSent(false);
      setConfirmationResult(null);
      setErrorOtp(null);
      setErrorPhoneNumberModal(null);
      fetchProfile();
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
      setIsLoadingVerifyOtp(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  return isLoadingProfileData ? (
    <div className="flex items-center justify-center h-50 sm:h-90">
      <ClipLoader
        color="#F5A623"
        loading={isLoadingProfileData}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    <div className="px-8 lg:px-0">
      <div className="mb-6 text-[#543A14]">
        <h2 className="text-xl font-bold">Profil</h2>
        <p className="text-base">Sesuaikan informasi data diri Anda</p>
      </div>

      {/* Main Section */}
      <fieldset
        disabled={
          isLoadingSendOtp ||
          isLoadingSentVerifEmail ||
          isLoadingUpdateProfile ||
          isLoadingVerifyOtp
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row-reverse gap-8"
        >
          {/* Gambar Profil */}
          <div className="flex flex-col items-center">
            <div className="w-52 aspect-square bg-gray-100 rounded-full mb-3 flex items-center justify-center relative group">
              {dataProfile?.avatar?.file &&
              (!isAvatarEdit || (isAvatarEdit && !watch("foto"))) ? (
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
            {errors?.foto?.message && (
              <p className="text-[#E52020] text-sm max-w-3xs text-center">
                {errors?.foto?.message}
              </p>
            )}
            <div className="text-sm text-black text-center">
              <p>*Ukuran maksimal 1MB</p>
              <p>*Format .jpg atau .png</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6 w-full">
            <div className="space-y-3 text-black">
              <div className="flex gap-3">
                <FormInput
                  label="Nama Depan"
                  inputType="text"
                  placeholder="Contoh: Matthew"
                  register={register("namaDepan")}
                  inputStyles={`w-full bg-white`}
                  className="w-full"
                  required
                  errors={errors?.namaDepan?.message}
                />
                <FormInput
                  label="Nama Belakang"
                  inputType="text"
                  placeholder="Contoh: Emmanuel"
                  register={register("namaBelakang")}
                  inputStyles={`w-full bg-white`}
                  className="w-full"
                  required
                  errors={errors?.namaBelakang?.message}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-0">
                <FormInput
                  label="Nomor Telepon (Whatsapp)"
                  inputType="text"
                  placeholder="Contoh: 81212312312"
                  value={dataProfile?.phoneNumber?.slice(3) || ""}
                  inputStyles={`w-full border-none`}
                  disabled
                  className="w-full"
                  required
                  errors={errors?.nomorTelepon?.message}
                />
                <ButtonCustom
                  variant="orange"
                  type="button"
                  label={`Ubah Nomor Telepon`}
                  className="ml-3 text-nowrap h-12 w-full sm:w-auto"
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
                              dataProfile.phoneNumber.slice(3) || ""
                            );
                            setIsLoadingSendOtp(false);
                            setIsLoadingVerifyOtp(false);
                          }}
                        />
                      </button>

                      <h3 className="text-xl font-bold">Ubah Nomor Telepon</h3>

                      <div className="space-y-1">
                        <div className="flex items-end">
                          <FormInput
                            label="Nomor Telepon (Whatsapp)"
                            inputType="text"
                            placeholder="Contoh: 81212312312"
                            register={register("nomorTelepon")}
                            inputStyles={`w-full`}
                            className="w-full"
                            required
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
                        {errorPhoneNumberModal && (
                          <p className="text-[#E52020] text-sm max-w-3xs">
                            {errorPhoneNumberModal}
                          </p>
                        )}
                      </div>

                      <div id="recaptcha-container" className="hidden" />

                      {isOtpSent && (
                        <div className="pt-5 border-t space-y-3">
                          <h3 className="text-lg font-bold">Verifikasi OTP</h3>
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
                                      handleOtpChange(e.target, index, e)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, index)}
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
              <div className="space-y-1">
                <div className="flex gap-3 items-end relative">
                  <FormInput
                    label="Email"
                    inputType="text"
                    type="email"
                    placeholder="Contoh: user@example.com"
                    register={register("email")}
                    inputStyles={`w-full bg-white relative`}
                    className="w-full"
                    required
                  />
                  {dataProfile?.emailVerifiedAt && !isEdit ? (
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
                      disabled={
                        isEdit ||
                        isLoadingSentVerifEmail ||
                        dataProfile?.emailVerifiedAt
                      }
                    />
                  )}
                </div>
                {errors?.email?.message && (
                  <p className="text-[#E52020] text-sm">
                    {errors?.email?.message}
                  </p>
                )}

                {isEmailVerifModalOpen && (
                  <div className="bg-black/40 w-screen h-screen fixed z-20 inset-0 flex items-center justify-center">
                    <div
                      ref={verifEmailModalRef}
                      className="bg-white rounded-lg p-8 space-y-6 text-black"
                    >
                      <h1 className="font-bold text-xl">Verfikasi Email</h1>
                      <div className="flex gap-1">
                        <span>Link verifikasi akan dikirim ke email Anda:</span>
                        <span className="font-bold">{watch("email")}</span>
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
                                Link verifikasi telah dikirim ke email anda.
                                Silakan periksa dan lakukan verifikasi dengan
                                mengklik link tersebut.
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
              <div>
                <FormInput
                  label="Alamat Lengkap"
                  inputType="textArea"
                  placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
                  value={watch("alamat.summary") || ""}
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="flex-1"
                  inputStyles={`w-full bg-white`}
                />
                {/* Modal Alamat Lengkap */}
                <AddressModal
                  isOpen={isModalOpen}
                  watch={watch}
                  dataProfile={dataProfile}
                  handleClose={() => setIsModalOpen(false)}
                  setValue={setValue}
                />
              </div>
            </div>
            {((isEdit && !isEditPhoneNumber) ||
              (isAvatarEdit && watch("foto"))) && (
              <div className="flex gap-3">
                <ButtonCustom
                  type={"submit"}
                  variant={"brown"}
                  label={
                    isLoadingUpdateProfile ? (
                      <ClipLoader
                        color="white"
                        loading={isLoadingUpdateProfile}
                        size={24}
                      />
                    ) : (
                      "Simpan Perubahan"
                    )
                  }
                  className="w-full"
                  disabled={isLoadingUpdateProfile}
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
        </form>
      </fieldset>
    </div>
  );
}
