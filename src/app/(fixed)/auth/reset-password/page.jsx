"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@iconify/react";

import { createNewPassword } from "src/services/api/forgotPassword";
import resetPasswordSchema from "src/components/schema/resetPasswordSchema";

import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";

export default function ConfirmEmail() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    const token = new URLSearchParams(window.location.search).get("token");
    console.log("Submitted Data:", data);

    try {
      setIsLoading(true);

      if (!token || typeof token !== "string") return;
      const payload = {
        token: token,
        password: data.password,
      };

      await createNewPassword(payload);

      toast.success("Password berhasil diubah.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      if (error.message === "Token expired") {
        toast.error("Token sudah kadaluarsa.");
      } else {
        toast.error("Gagal mengubah password. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get(
      "token"
    );
    if (tokenFromUrl) setToken(tokenFromUrl);
    setValue("token", tokenFromUrl);
  }, []);

  return (
    <div className="flex items-center justify-center bg-white text-black min-h-[80dvh]">
      <div className="space-y-5">
        <h1 className="text-[#543A14] text-[32px] text-center font-bold">
          Ganti Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <div className="relative">
              <FormInput
                label="Password Baru"
                inputType="text"
                type={showPassword ? "text" : "password"}
                register={register("password")}
                value={watch("password")}
                placeholder="Masukkan minimum 8 karakter"
                required
                errors={errors.password?.message}
                togglePassword={togglePassword}
                showPassword={showPassword}
              />
            </div>
          </div>

          <ButtonCustom
            type="submit"
            variant="orange"
            label={
              isLoading ? (
                <ClipLoader color="white" loading={isLoading} size={20} />
              ) : (
                "Konfirmasi"
              )
            }
            className="w-full"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
