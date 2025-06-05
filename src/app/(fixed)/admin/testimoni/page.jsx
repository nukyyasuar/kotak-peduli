"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import { createTestimony } from "src/services/api/testimony";
import { useAuth } from "src/services/auth/AuthContext";

import Unauthorize from "src/components/unauthorize";
import { ButtonCustom } from "src/components/button";
import { FormInput } from "src/components/formInput";
import testimonySchema from "src/components/schema/testimonySchema";

export default function Testimony() {
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(testimonySchema),
    defaultValues: {
      name: "",
      title: "",
      message: "",
      file: "",
    },
  });
  const { hasPermission } = useAuth();

  const canCreateTestimony = hasPermission("CREATE_TESTIMONY");

  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("collectionCenterId");
    }
    return null;
  };
  const collectionCenterId = getInitialValue();

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("title", data.title);
    formData.append("message", data.message);
    formData.append("file", data.file);
    formData.append("collectionCenterId", collectionCenterId);

    try {
      setIsLoadingSubmit(true);

      await createTestimony(formData);
      toast.success("Ucapan terima kasih berhasil dikirim.");
      reset();
    } catch (error) {
      console.error("Error creating testimony:", error);
      toast.error("Gagal mengirim ucapan terima kasih.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-[80dvh]">
      {!canCreateTestimony ? (
        <Unauthorize />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <h1 className="text-[32px] text-[#543A14] font-bold text-center">
            UCAPAN TERIMA KASIH
          </h1>

          <fieldset disabled={isLoadingSubmit}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-xl bg-[#F5E9D4] p-6 shadow-lg rounded-lg space-y-3 text-black"
            >
              <FormInput
                inputType="text"
                label="Nama Penerima"
                placeholder="Contoh: Matthew"
                register={register("name")}
                required
                errors={errors?.name?.message}
                inputStyles="bg-white"
              />
              <FormInput
                inputType="text"
                label="Jabatan atau Peran"
                placeholder="Contoh: Ketua Yayasan"
                register={register("title")}
                required
                errors={errors?.title?.message}
                inputStyles="bg-white"
              />
              <FormInput
                inputType="textArea"
                label="Ucapan atau Pesan"
                placeholder="Contoh: Terima kasih atas bantuan yang diberikan"
                register={register("message")}
                required
                errors={errors?.message?.message}
                inputStyles="bg-white"
              />
              <div className="w-full">
                <div className="flex items-end gap-3">
                  <FormInput
                    inputType="text"
                    value={watch("file")?.name}
                    register={register("file")}
                    label="Foto"
                    inputStyles="bg-white relative min-h-[3rem] flex items-center gap-2 px-2 py-1 border rounded-lg max-w-[461px] overflow-scroll"
                    required
                    className="w-full"
                  />
                  <div className="flex">
                    <label
                      htmlFor="file"
                      className="px-4 py-3 bg-[#F0BB78] text-nowrap rounded-lg font-semibold text-white cursor-pointer"
                    >
                      Pilih File
                    </label>
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setValue("file", file);
                      }}
                    />
                  </div>
                </div>
                {errors?.file?.message && (
                  <p className="text-[#E52020] text-sm mt-1">
                    {errors?.file?.message}
                  </p>
                )}
              </div>

              <ButtonCustom
                type="submit"
                variant="brown"
                label={
                  isLoadingSubmit ? (
                    <ClipLoader
                      color="white"
                      loading={isLoadingSubmit}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Kirim Ucapan"
                  )
                }
                className="w-full h-12 mt-6"
                disabled={isLoadingSubmit}
              />
            </form>
          </fieldset>
        </div>
      )}
    </div>
  );
}
