"use client";

import { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

import collectionCenterRegistSchema from "src/components/schema/collectionCenterRegistSchema";
import {
  createCollectionCenter,
  getOneCollectionCenter,
  verifyPhoneNumberCollectionCenter,
} from "src/services/api/collectionCenter";
import { getProfile } from "src/services/api/profile";
import {
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from "src/services/auth/auth";
import { useAccess } from "src/services/auth/acl";

import { FormInput } from "src/components/formInput";
import AddressModal from "src/components/addressModal";
import { ButtonCustom } from "src/components/button";
import OperationalModal from "src/components/operationalModal";
import { donationTypes, days } from "src/components/options";
import handleOutsideModal from "src/components/handleOutsideModal";

export default function AkunTempatPenampung() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOperationalOpen, setIsModalOperationalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDecline, setIsDecline] = useState(false);
  const [dataProfile, setDataProfile] = useState(null);
  const [dataDetailCollectionCenter, setDataDetailCollectionCenter] =
    useState(null);
  const [isLoadingCreateCollectionCenter, setIsLoadingCreateCollectionCenter] =
    useState(false);
  const [isLoadingCollectionCenter, setIsLoadingCollectionCenter] =
    useState(false);
  const [isLoadingDetailCollectionCenter, setIsLoadingDetailCollectionCenter] =
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
  const router = useRouter();

  const userRole = dataProfile?.collectionCenterCollaborator?.role?.name;
  const canReadDonation = useAccess("READ_DONATION");
  const canReadEvent = useAccess("READ_EVENT");
  const canReadPost = useAccess("READ_POST");
  const canReadRole = useAccess("READ_ROLE");

  const routerByPermission = () => {
    if (canReadDonation) {
      router.push("/admin/barang-donasi");
    } else if (canReadEvent) {
      router.push("/admin/event");
    } else if (canReadPost) {
      router.push("/admin/cabang");
    } else if (canReadRole) {
      router.push("/admin/pengurus");
    } else {
      router.push("/unauthorized");
    }
  };

  const watchPhoneNumber = watch("nomorTelepon");
  const collectionCenterId =
    dataProfile?.collectionCenterCollaborator?.collectionCenterId;

  handleOutsideModal({
    ref: editPhoneNumberModalRef,
    isOpen: isEditPhoneNumber,
    onClose: () => {
      setValue("nomorTelepon", dataProfile?.phoneNumber?.slice(3));
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

  const onSubmit = async (data) => {
    const formData = new FormData();

    const { alamat } = data;
    formData.append("name", data.namaTempatPenampung);
    formData.append("phoneNumber", `+62${data.nomorTelepon}`);
    formData.append("email", data.email);
    formData.append("description", data.deskripsi);
    formData.append("file", data.foto);
    if (data.batasJarak) {
      formData.append("distanceLimitKm", data.batasJarak);
    }
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
    if (idTokenValue) {
      formData.append("idToken", idTokenValue);
    }

    try {
      setIsLoadingCreateCollectionCenter(true);
      await createCollectionCenter(formData);
      toast.success(
        "Pendaftaran berhasil. Pendaftaran akan diverifikasi terlebih dahulu oleh admin."
      );
      setIsSubmitted(true);
      setIsPending(true);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Pendaftaran gagal");
      setIsSubmitted(false);
    } finally {
      setIsLoadingCreateCollectionCenter(false);
    }
  };

  const fetchProfile = async () => {
    setIsLoadingCollectionCenter(true);

    try {
      const data = await getProfile();
      setDataProfile(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoadingCollectionCenter(false);
    }
  };

  const fetchDetailCollectionCenter = async (collectionCenterId) => {
    if (!collectionCenterId) return;
    try {
      setIsLoadingDetailCollectionCenter(true);

      const detailData = await getOneCollectionCenter(collectionCenterId);
      setDataDetailCollectionCenter(detailData);

      const approvalStatus = detailData?.approval.latestStatus;

      if (approvalStatus === "PENDING") {
        setIsPending(true);
      } else if (approvalStatus === "APPROVED") {
        setIsApproved(true);
      }
      if (approvalStatus === "REJECTED") {
        setIsDecline(true);
      }
    } catch (error) {
      console.error("Error fetching collection center details:", error);
    } finally {
      setIsLoadingDetailCollectionCenter(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (collectionCenterId) {
      fetchDetailCollectionCenter(collectionCenterId);
    }
  }, [collectionCenterId]);

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
    if (dataProfile) {
      const formattedPhoneNumber = dataProfile?.phoneNumber?.startsWith("+62")
        ? dataProfile?.phoneNumber.slice(3)
        : dataProfile?.phoneNumber;

      const reference = dataProfile?.address?.reference;
      const detail = dataProfile?.address?.detail;
      const formattedAddress =
        reference && detail ? `(${reference}) ${detail}` : detail || "";

      reset({
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
      setPhoneNumberHolder(formattedPhoneNumber);
    }
  }, [dataProfile, reset]);

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

    if (!watchPhoneNumber || watchPhoneNumber.length < 9) {
      toast.error("Masukkan nomor telepon yang valid.");
      setIsLoadingSendOtp(false);
      return;
    }

    try {
      const confirmation = await sendPhoneVerificationCode(
        "+62" + watchPhoneNumber
      );
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
        console.error("Error during phone number verification:", error);
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

  return isLoadingCollectionCenter || isLoadingDetailCollectionCenter ? (
    <div className="flex items-center justify-center h-50 sm:h-90">
      <ClipLoader
        color="#F5A623"
        loading={isLoadingCollectionCenter || isLoadingDetailCollectionCenter}
        size={50}
      />
    </div>
  ) : (
    <div className="space-y-3 px-8 lg:px-0">
      <div className="mb-6 text-[#543A14] space-y-2">
        {userRole !== "Collection Center Admin" &&
        dataDetailCollectionCenter?.approval?.latestStatus !== "PENDING" ? (
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Pengurus Tempat Penampung</h2>
            <p className="text-base">
              Anda dapat mengakses dashboard sesuai dengan peran yang telah
              diberikan kepada Anda oleh Admin Utama Tempat Penampung.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-xl font-bold">
              Daftar Sebagai Tempat Penampung{" "}
              {(isSubmitted || isPending) && "(Proses Persetujuan)"}
              {!isSubmitted && isApproved && "(Disetujui)"}
              {!isSubmitted && isDecline && "(Ditolak)"}
            </h2>
            <p className="text-base">
              {(isSubmitted || isPending) &&
                "Pendaftaran Anda sedang diverifikasi terlebih dahulu oleh admin platform. Setelah disetujui, Anda akan mendapatkan akses ke halaman Dashboard Tempat Penampung."}
              {!isSubmitted &&
                isApproved &&
                "Selamat! Pendaftaran Anda telah disetujui. Tekan tombol dibawah untuk mengakses halaman Dashboard Tempat Penampung."}
              {!isSubmitted && isDecline && (
                <>
                  Mohon maaf, pendaftaran Anda ditolak. Silakan periksa alasan
                  penolakan di bawah ini.{" "}
                  <strong>
                    Pengajuan ulang dapat dilakukan setelah 7 hari
                  </strong>
                  .
                </>
              )}
            </p>
            {isDecline && (
              <p className="text-[#E52020]">
                {
                  dataDetailCollectionCenter?.approval?.approvalDetails?.find(
                    (item) => item.status === "REJECTED"
                  )?.notes
                }
              </p>
            )}
          </div>
        )}
      </div>

      {isSubmitted || isPending || isApproved || isDecline ? (
        isApproved ||
        canReadDonation ||
        canReadEvent ||
        canReadPost ||
        canReadRole ? (
          <ButtonCustom
            label="Dashboard Tempat Penampung"
            variant="orange"
            className="w-full"
            onClick={routerByPermission}
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
              <div className="flex gap-3 items-end relative">
                <FormInput
                  label="Email"
                  inputType="text"
                  type="email"
                  placeholder="Contoh: user@example.com"
                  register={register("email")}
                  required
                  errors={errors?.email?.message}
                  className="w-full"
                  inputStyles={"w-full"}
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
                  className={"w-full"}
                />
                <div className="flex items-end">
                  <ButtonCustom
                    variant="orange"
                    type="button"
                    label={`Ubah Nomor Telepon`}
                    className="text-nowrap h-12 w-full"
                    onClick={() => setIsEditPhoneNumber(true)}
                  />
                  {isEditPhoneNumber && (
                    <div className="fixed inset-0 flex items-center justify-center backdrop-brightness-50 z-20 px-4">
                      <div
                        ref={editPhoneNumberModalRef}
                        className="bg-white rounded-lg flex flex-col p-8 text-black gap-6"
                      >
                        <h3 className="text-xl font-bold">
                          Ubah Nomor Telepon
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-end">
                          <FormInput
                            label="Nomor Telepon (Whatsapp)"
                            inputType="text"
                            placeholder="Contoh: 81212312312"
                            register={register("nomorTelepon")}
                            inputStyles={`w-full`}
                            className={"w-full"}
                          />
                          {dataProfile?.phoneNumber !==
                            "+62" + watch("nomorTelepon") && (
                            <ButtonCustom
                              variant="orange"
                              type="button"
                              label={`Kirim OTP`}
                              className="h-12 ml-3 text-nowrap w-full sm:w-auto"
                              isLoading={isLoadingSendOtp}
                              onClick={handleSendOtp}
                            />
                          )}
                        </div>

                        <div id="recaptcha-container" />

                        {isOtpSent && (
                          <div className="pt-5 border-t space-y-3">
                            <h3 className="text-lg font-bold">
                              Verifikasi OTP
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="flex gap-1 sm:gap-3">
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
                                    className="h-10 sm:h-12 aspect-square text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
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
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1"
                  required
                  errors={errors?.alamat?.message}
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
              <div className="flex flex-col sm:flex-row gap-3">
                <FormInput
                  label="Ketersediaan Penjemputan"
                  inputType="dropdownInput"
                  placeholder="Pilih ketersediaan penjemputan"
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
              <div className="flex flex-col sm:flex-row gap-3">
                <FormInput
                  label="Waktu Operasional (WIB)"
                  inputType="text"
                  placeholder="Pilih hari dan jam operasional"
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
                  className="w-full"
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
              />

              {/* Input Foto + Preview */}
              <div className="flex w-full">
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
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
                        className="absolute flex items-center justify-center bg-[#F0BB78] text-white hover:bg-[#E09359] py-2 px-7 rounded-lg font-bold gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
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
                      label="Foto Tempat Penampung"
                      className="pointer-events-none"
                      value={watch("foto")?.name}
                      register={register("foto")}
                      required
                      errors={errors?.foto?.message}
                    />
                    {errors?.foto && (
                      <p className="text-[#E52020] text-sm -mt-2">
                        {errors?.foto?.message}
                      </p>
                    )}
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
              label={
                isLoadingCreateCollectionCenter ? (
                  <ClipLoader
                    color="white"
                    size={20}
                    loading={isLoadingCreateCollectionCenter}
                  />
                ) : (
                  "Kirim"
                )
              }
              disabled={isLoadingCreateCollectionCenter}
              className="w-full h-12"
            />
          </div>
        </form>
      )}
    </div>
  );
}
