"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { FormInput } from "src/components/formInput";
import { useForm } from "react-hook-form";
import { ButtonCustom } from "src/components/button";
import AddressModal from "src/components/addressModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDonationType, setIsAddDonationType] = useState(false);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      namaLengkap: "",
      nomorTelepon: "",
      alamat: "",
      tempatPenampung: "",
      cabang: "",
      tipePengiriman: "",
      jalan: "",
      patokan: "",
      barangDonasi: [],
    },
  });

  const dummyOptions = [
    { value: "opsi_satu", label: "Opsi 1" },
    { value: "opsi_dua", label: "Opsi 2" },
    { value: "opsi_tiga", label: "Opsi 3" },
  ];
  const dummyDonationTypes = [
    { value: "pakaian", label: "Pakaian" },
    { value: "mainan", label: "Mainan" },
    { value: "alat_elektronik", label: "Elektronik" },
    { value: "buku", label: "Buku" },
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
    { label: "Lainnya", value: "lainnya" },
  ];

  // Function handle ketika menambah jenis barang. Pada button 'add'
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
  // Function handle hapus form jenis barang. Pada button 'trash' di setiap form
  const handleRemoveDonationItem = (valueToRemove) => {
    const updatedItems = watch("barangDonasi").filter(
      (item) => item.value !== valueToRemove
    );
    setValue("barangDonasi", updatedItems);
  };
  // Function submit. Pada button 'kirim'
  const onSubmit = (data) => {
    console.log(data);
  };

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
            <div className="flex flex-col space-y-3 w-fit">
              <h3 className="text-xl font-bold">Informasi Donatur</h3>
              <div className="flex gap-5">
                <FormInput
                  label="Nama Lengkap"
                  inputType="text"
                  placeholder="Contoh: Matthew Emmanuel"
                  register={register("namaLengkap")}
                />
                <FormInput
                  label="Nomor Telepon (Whatsapp)"
                  inputType="text"
                  placeholder="Contoh: 81212312312"
                  register={register("nomorTelepon")}
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
            <div className="space-y-3 w-full">
              <h3 className="text-xl font-bold">Tujuan Donasi</h3>
              <FormInput
                inputType="dropdownInput"
                label="Tempat Penampung"
                name="tempatPenampung"
                control={control}
                options={dummyOptions}
                placeholder="Pilih tempat penampung tujuan donasi"
              />
              <FormInput
                inputType="dropdownInput"
                label="Cabang / Drop Point"
                name="cabang"
                control={control}
                options={dummyOptions}
                placeholder="Pilih cabang atau drop point (jika tersedia)"
              />
              <FormInput
                inputType="dropdownInput"
                label="Metode Pengiriman"
                name="tipePengiriman"
                control={control}
                options={dummyOptions}
                placeholder="Pilih cabang atau drop point (jika tersedia)"
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
                  <p className="text-base font-bold text-white bg-[#543A14] text-center px-6 py-2 w-fit rounded-b-lg">
                    {item.label}
                  </p>
                </div>
                <button
                  className="absolute top-0 right-0 px-2 bg-[#E52020] h-9 rounded-bl-lg cursor-pointer"
                  onClick={() => handleRemoveDonationItem(item.value)}
                  type="button"
                >
                  <Icon icon="mdi:trash" width={20} color="white" />
                </button>
                <div className="space-y-3">
                  {/* Tipe Barang (Elektronik) */}
                  {item.label === "Elektronik" && (
                    <FormInput
                      inputType="dropdownChecklist"
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
                        placeholder=".jpg, .png"
                        label="Foto Barang"
                        className="pointer-events-none"
                        value={watch(`barangDonasi.${index}.foto.name`)}
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
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setValue(`barangDonasi.${index}.foto`, file);
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
                      options={dummyOptions}
                      placeholder="Pilih event tujuan donasi (jika tersedia)"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Button Tambah Jenis Barang */}
            {watch("barangDonasi").length !== dummyDonationTypes.length && (
              <div className="flex gap-6 max-h-10">
                <ButtonCustom
                  variant="orange"
                  label="Tambah Jenis Barang"
                  onClick={() => setIsAddDonationType(!isAddDonationType)}
                  icon="mdi:plus"
                  className="max-w-1/4"
                  type="button"
                />
                {isAddDonationType && (
                  <div className="flex gap-3">
                    {dummyDonationTypes.map(({ value, label }) => {
                      const isDisabled = watch("barangDonasi").some(
                        (item) => item.value === value
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
          </div>

          <button
            type="submit"
            className="w-full bg-[#543A14] hover:bg-[#6B4D20] text-white h-12 rounded-lg font-bold"
          >
            Kirim
          </button>
        </form>
      </div>
    </section>
  );
}
