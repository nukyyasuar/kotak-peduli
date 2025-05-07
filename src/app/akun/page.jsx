"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { FormInput } from "src/components/formInput";
import AddressModal from "src/components/addressModal";
import { ButtonCustom } from "src/components/button";
import Image from "next/image";
import handleOutsideModal from "src/components/handleOutsideModal";

export default function Akun() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const fileInputRef = useRef();
  const verifEmailModalRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEmailVerifModalOpen, setIsEmailVerifModalOpen] = useState(false);
  const [isEmailVerifSent, setIsEmailVerifSent] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      namaDepan: "",
      namaBelakang: "",
      nomorTelepon: "",
      email: "",
      alamat: "",
      jalan: "",
      patokan: "",
      foto: "",
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("foto", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  handleOutsideModal({
    ref: verifEmailModalRef,
    isOpen: isEmailVerifModalOpen,
    onClose: () => setIsEmailVerifModalOpen(false),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (fileInputRef.current) {
      console.log("File input telah terikat!");
    }
  }, []);

  return (
    <div>
      <div className="mb-6 text-[#543A14]">
        <h2 className="text-xl font-bold">Profil</h2>
        <p className="text-base">Sesuaikan informasi data diri Anda</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex justify-between">
        <div className="space-y-6">
          <div className="space-y-3 text-black">
            <div className="flex gap-3">
              <FormInput
                label="Nama Depan"
                inputType="text"
                placeholder="Contoh: Matthew"
                inputStyles="w-full"
                register={register("namaDepan")}
              />
              <FormInput
                label="Nama Belakang"
                inputType="text"
                placeholder="Contoh: Emmanuel"
                inputStyles="w-full"
                register={register("namaBelakang")}
              />
            </div>
            <FormInput
              label="Nomor Telepon (Whatsapp)"
              inputType="text"
              placeholder="Contoh: 81212312312"
              inputStyles="w-full"
              register={register("nomorTelepon")}
            />
            <div className="flex gap-3 items-end">
              <FormInput
                label="Email"
                inputType="text"
                type="email"
                placeholder="Contoh: user@example.com"
                inputStyles="w-full"
                register={register("email")}
              />
              <ButtonCustom
                type="button"
                variant="orange"
                label="Verifikasi Email"
                onClick={() => setIsEmailVerifModalOpen(true)}
                className="h-[51px] text-nowrap"
              />
            </div>
            <FormInput
              label="Alamat Lengkap"
              inputType="textArea"
              placeholder="Contoh: Jl. Tanah Air, Blok. A, No. 1, Alam Sutera"
              register={register("alamat")}
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="flex-1"
            />
            {/* Modal Alamat Lengkap */}
            <AddressModal
              isOpen={isModalOpen}
              handleClose={() => setIsModalOpen(false)}
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
            />
          </div>
          <div>
            <ButtonCustom
              type={isEdit ? "button" : "submit"}
              variant={isEdit ? "brown" : "orange"}
              label={isEdit ? "Simpan Perubahan" : "Ubah Informasi"}
              onClick={() => {
                // if (!isEdit) {
                setIsEdit(!isEdit);
                // }
              }}
              className="w-full"
            />
          </div>
        </div>

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
                      status barang donasi dan jadwal pengiriman/penjemputan
                      akan dikirimkan ke email Anda.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <span>
                      Kami telah mengirimkan tautan verifikasi ke email Anda,
                      berikut:
                    </span>
                    <span className="font-bold">example@gmail.com</span>
                  </div>
                  <ButtonCustom
                    type="button"
                    label="Kirim Ulang Tautan Verifikasi (00:00)"
                    variant="brown"
                    className="w-full"
                    onClick={() => {
                      setIsEmailVerifSent(true);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Gambar Profil */}
        <div className="flex flex-col items-center">
          <div className="w-56 aspect-square bg-gray-100 rounded-full mb-3 flex items-center justify-center relative group">
            {previewUrl ? (
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
