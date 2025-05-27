"use client";

import Image from "next/image";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

import { loginWithEmail, loginWithGoogle } from "src/services/api/login";
import { loginSchema } from "src/components/schema/registrationSchema";
import forgotPassSchema from "src/components/schema/forgotPassSchema";
import { sendForgotPasswordLink } from "src/services/api/forgotPassword";

import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import { Spacer, TextWithLink } from "src/components/text";
import handleOutsideModal from "@/src/components/handleOutsideModal";

export default function Login() {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isModalOpenForgotPassword, setIsModalOpenForgotPassword] =
    useState(false);
  const [isLoadingSendForgotPassword, setIsLoadingSendForgotPassword] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const modalForgotPasswordRef = useRef(null);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    formState: { errors: errorsForgotPassword },
  } = useForm({
    resolver: yupResolver(forgotPassSchema),
    defaultValues: {
      email: "",
    },
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  handleOutsideModal({
    ref: modalForgotPasswordRef,
    isOpen: isModalOpenForgotPassword,
    onClose: () => setIsModalOpenForgotPassword(false),
  });

  const onSubmit = async (data) => {
    setIsFormLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      toast.success("Berhasil login! Anda akan diarahkan ke halaman utama.");
      window.location.href = "/";
    } catch (err) {
      if (err.message === "This resource does not exist") {
        toast.error("Email atau password salah");
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsFormLoading(false);
    }
  };

  const onSubmitForgotPassword = async (data) => {
    try {
      setIsLoadingSendForgotPassword(true);

      await sendForgotPasswordLink(data);
      toast.success(
        "Link untuk membuat ulang password telah dikirim ke email Anda."
      );
      setIsModalOpenForgotPassword(false);
    } catch (error) {
      if (error.status === 400) {
        toast.error("Email tidak ditemukan");
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoadingSendForgotPassword(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Login dengan Google berhasil!");
      router.push("/");
    } catch (err) {
      toast.error("Login Google gagal: " + err.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      const fetchGoogleLogin = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/auth/google`,
            createRequestOptions("GET", { code })
          );
          const result = await handleApiResponse(response);
          localStorage.setItem("authToken", result.data?.tokens?.accessToken);

          toast.success("Login Google berhasil!");
          router.push("/");
        } catch (error) {
          toast.error("Login Google gagal: " + error.message);
        }
      };
      fetchGoogleLogin();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Logo */}
      <div className="absolute top-5 left-5">
        <Image
          src="/logo_kotakPeduli.svg"
          alt="Kotak Peduli Logo"
          width={100}
          height={100}
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 flex flex-col md:flex-row items-center justify-center flex-1">
        {/* Left Section */}
        <div className="md:w-1/2 w-full mb-10 md:mb-0 flex justify-center px-4">
          <div className="bg-[#FFF0DC] rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
            <div className="relative aspect-square">
              <Image
                src="/Main Design Frame.webp"
                alt="Donation Illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 px-4 sm:px-6">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1">HALO,</h1>
              <p className="text-base">Selamat Datang Kembali</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                inputType="text"
                type="email"
                name="email"
                register={register("email")}
                value={watch("email")}
                label="Email"
                placeholder="Contoh: user@example.com"
                errors={errors?.email?.message}
                required
                disabled={isFormLoading}
              />
              <div className="space-y-1">
                <div className="relative">
                  <FormInput
                    inputType="text"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    register={register("password")}
                    value={watch("password")}
                    label="Password"
                    placeholder="Masukkan minimum 8 karakter"
                    errors={errors?.password?.message}
                    required
                    disabled={isFormLoading}
                    togglePassword={togglePassword}
                    showPassword={showPassword}
                  />
                </div>
                <span
                  className="text-xs cursor-pointer underline text-[#C2C2C2] hover:text-[#F0BB78] transition"
                  onClick={() => setIsModalOpenForgotPassword(true)}
                >
                  Lupa password?
                </span>
              </div>

              <ButtonCustom
                type="submit"
                disabled={isFormLoading}
                variant="orange"
                className="h-12 w-full"
                label={
                  isFormLoading ? (
                    <ClipLoader
                      color="white"
                      loading={isFormLoading}
                      size={20}
                    />
                  ) : (
                    "Masuk"
                  )
                }
              />
            </form>

            {/* Optional Google Login */}
            {/* 
            <Spacer text="atau menggunakan" />
            <ButtonCustom ... />
            */}

            <TextWithLink
              href="/daftar"
              text="Belum punya akun?"
              label="Daftar"
            />
          </div>
        </div>
      </div>

      {/* Modal Forgot Password */}
      {isModalOpenForgotPassword && (
        <div className="bg-black/40 fixed inset-0 z-20 flex items-center justify-center px-4">
          <div
            ref={modalForgotPasswordRef}
            className="bg-white rounded-lg p-6 sm:p-8 text-black w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h1 className="font-bold text-xl">Buat Ulang Password</h1>
            <p className="text-sm mb-4">
              Masukkan email Anda untuk menerima link untuk membuat ulang
              password.
            </p>
            <form
              onSubmit={handleSubmitForgotPassword(onSubmitForgotPassword)}
              className="space-y-5"
            >
              <FormInput
                inputType="text"
                label="Email"
                placeholder="Contoh: user@example.com"
                register={registerForgotPassword("email")}
                required
                errors={errorsForgotPassword?.email?.message}
              />
              <ButtonCustom
                type="submit"
                variant="orange"
                label={
                  isLoadingSendForgotPassword ? (
                    <ClipLoader
                      color="white"
                      loading={isLoadingSendForgotPassword}
                      size={20}
                    />
                  ) : (
                    "Kirim Link"
                  )
                }
                className="w-full"
                disabled={isLoadingSendForgotPassword}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
