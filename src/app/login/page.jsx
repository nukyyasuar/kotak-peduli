"use client";

import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import { loginSchema } from "src/components/schema/registrationSchema";
import { Spacer, TextWithLink } from "src/components/text";

import { loginWithEmail, loginWithGoogle } from "src/services/api/login";

export default function Login() {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsFormLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      toast.success("Berhasil login! Anda akan diarahkan ke halaman utama.");
      router.push("/");
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
    <div className="h-dvh flex bg-white text-black">
      <Head>
        <title>Beri Barang - Login</title>
        <meta name="description" content="Login to Beri Barang" />
      </Head>

      <div className="w-full max-w-6xl mx-auto py-12 flex flex-col md:flex-row items-center">
        {/* Left Section */}
        <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="bg-[#FFF0DC] rounded-lg p-8">
            <div className="relative">
              <Image
                src="/Main Design Frame.webp"
                alt="Donation Illustration"
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-6 text-black">
          <div className="max-w-md mx-auto space-y-5">
            <div>
              <h1 className="text-4xl font-bold text-center mb-1">HALO,</h1>
              <p className="text-center">Selamat Datang Kembali</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-5">
              <div className="space-y-3">
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
                <FormInput
                  inputType="text"
                  type="password"
                  name="password"
                  register={register("password")}
                  value={watch("password")}
                  label="Password"
                  placeholder="Masukkan minimum 6 karakter"
                  errors={errors?.password?.message}
                  required
                  disabled={isFormLoading}
                />
              </div>

              <ButtonCustom
                type="submit"
                disabled={isFormLoading}
                variant="orange"
                className="h-12 w-full"
                label={[
                  isFormLoading ? (
                    <ClipLoader
                      color="white"
                      loading={isFormLoading}
                      size={5}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Masuk"
                  ),
                ]}
              />
            </form>

            <div className="space-y-5">
              <Spacer text="atau menggunakan" />

              <ButtonCustom
                type="button"
                onClick={handleGoogleLogin}
                variant="outlineOrange"
                icon="devicon:google"
                className="w-full h-12 gap-2"
                disabled={isGoogleLoading}
                label={[
                  isGoogleLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-gray-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Google"
                  ),
                ]}
              />

              <TextWithLink
                href="/daftar"
                text="Belum punya akun?"
                label="Daftar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
