"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { registrationSchema } from "src/components/schema/registrationSchema";
import { FormInput } from "src/components/formInput";
import { ButtonCustom } from "src/components/button";
import { Spacer, TextWithLink } from "src/components/text";

import { registerWithEmail } from "src/services/api/register";
import { loginWithGoogle } from "src/services/api/login";

import {
  onAuthStateChange,
  sendPhoneVerificationCode,
  setupRecaptcha,
  verifyPhoneCode,
} from "../auth/auth";
import {
  setConfirmationResult,
  getConfirmationResult,
  clearConfirmationResult,
} from "../auth/authStore";

export default function Registration() {
  // Form/Registration states
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Add new state to control view
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  // OTP states
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);

  const recaptchaContainerRef = useRef(null);
  const inputRefs = useRef([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
    },
  });

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const saveRegistrationData = (data) => {
    try {
      localStorage.setItem("registrationData", JSON.stringify(data));

      return true;
    } catch (err) {
      console.error("Error saving registrationData:", err.message);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formattedPhoneNumber = "+62" + data.phoneNumber;
      const registrationData = { ...data, phoneNumber: formattedPhoneNumber };

      // Attempt to save registrationData with retry
      let attempts = 0;
      const maxAttempts = 3;
      while (attempts < maxAttempts) {
        try {
          if (saveRegistrationData(registrationData)) {
            break;
          }
        } catch (err) {
          attempts++;
          console.warn(
            `Attempt ${attempts} failed to save registrationData:`,
            err
          );
          if (attempts === maxAttempts) {
            throw new Error(
              "Gagal menyimpan data registrasi setelah beberapa percobaan."
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 100)); // Brief delay before retry
        }
      }

      // Save registrationData in state as well
      setRegistrationData(registrationData);

      // Save OTP verification state to localStorage
      localStorage.setItem("showOtpVerification", "true");

      // Show OTP verification screen first, then send code
      setShowOtpVerification(true);

      // Wait for recaptcha to initialize
      setTimeout(async () => {
        try {
          const confirmation =
            await sendPhoneVerificationCode(formattedPhoneNumber);
          toast.success(
            "Kode OTP telah dikirim ke nomor telepon Anda. Silakan periksa pesan masuk Anda."
          );
          setConfirmationResult(confirmation);
          setIsTimerRunning(true);
        } catch (err) {
          console.error("Error during OTP sending:", err);
          toast.error(err.message || "Terjadi kesalahan saat mengirim OTP");
          setShowOtpVerification(false);
          localStorage.removeItem("showOtpVerification");
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(
        err.message || "Terjadi kesalahan saat memproses pendaftaran"
      );
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // OTP handling functions
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

  const handleVerifyOtp = async () => {
    setIsLoading(true);

    const code = otp.join("");
    if (!code || code.length !== 6) {
      toast.error("Masukkan 6 digit kode OTP");
      setIsLoading(false);
      return;
    }

    if (!registrationData || Object.keys(registrationData).length === 0) {
      toast.error("Data registrasi tidak ditemukan. Silakan daftar ulang.");
      setIsLoading(false);
      setShowOtpVerification(false);
      return;
    }

    try {
      const user = await verifyPhoneCode(confirmationResult, code);
      const idToken = await user.getIdToken();

      const { email, password } = registrationData;
      if (!email || !password) {
        throw new Error(
          "Data registrasi tidak lengkap (email atau password hilang). Silakan daftar ulang."
        );
      }

      await registerWithEmail({
        email: watch("email"),
        password: watch("password"),
        firstName: watch("firstName"),
        lastName: watch("lastName"),
        phoneNumber: "+62" + watch("phoneNumber"),
        idToken,
      });

      localStorage.removeItem("registrationData");
      localStorage.removeItem("showOtpVerification");
      clearConfirmationResult();

      toast.success("Pendaftaran berhasil!");
      router.push("/login");
    } catch (err) {
      console.error("Error during OTP verification or registration:", err);
      {
        err?.code === "auth/invalid-verification-code"
          ? toast.error("Kode OTP salah. Silakan coba lagi.")
          : err?.code === "auth/session-expired"
            ? toast.error(
                "Sesi OTP telah kedaluwarsa. Silakan minta kode baru."
              )
            : err?.message?.includes("Data registrasi tidak lengkap")
              ? toast.error(err.message)
              : toast.error(
                  `Gagal memverifikasi OTP: ${err.message || "Terjadi kesalahan"}`
                );
      }

      if (
        err?.message?.includes("tidak lengkap") ||
        err?.code === "auth/invalid-phone-number"
      ) {
        setShowOtpVerification(false);
        localStorage.removeItem("showOtpVerification");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (dataToUse = null) => {
    const data = dataToUse || registrationData;
    setIsResendLoading(true);

    const phoneNumber = data?.phoneNumber;
    if (!phoneNumber) {
      setIsResendLoading(false);
      setShowOtpVerification(false);
      localStorage.removeItem("showOtpVerification");
      return;
    }

    try {
      clearConfirmationResult();
      setConfirmationResult(null);

      if (!recaptchaContainerRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!recaptchaContainerRef.current) {
          throw new Error("reCAPTCHA container tidak ditemukan.");
        }
      }

      await setupRecaptcha(recaptchaContainerRef.current.id, true);
      const confirmation = await sendPhoneVerificationCode(phoneNumber);

      setConfirmationResult(confirmation);
      setTimer(60);
      setIsTimerRunning(true);
      setOtp(["", "", "", "", "", ""]);

      if (!dataToUse) {
        toast.success("Kode OTP baru telah dikirim.");
      }
    } catch (err) {
      console.error("Error while resending OTP:", err);

      if (err.message.includes("reCAPTCHA has already been rendered")) {
        try {
          document.getElementById(recaptchaContainerRef.current.id).innerHTML =
            "";
          await setupRecaptcha(recaptchaContainerRef.current.id, true);

          const confirmation = await sendPhoneVerificationCode(phoneNumber);
          setConfirmationResult(confirmation);
          setTimer(60);
          setIsTimerRunning(true);
          return;
        } catch (innerErr) {
          console.error("Gagal recover dari reCAPTCHA error:", innerErr);
        }

        toast.error(
          "Gagal menginisialisasi reCAPTCHA. Silakan muat ulang halaman."
        );
      } else if (err.code === "auth/invalid-phone-number") {
        setShowOtpVerification(false);
        localStorage.removeItem("showOtpVerification");
      } else {
        toast.error("Gagal mengirim ulang kode OTP. Silakan coba lagi.");
      }
    } finally {
      setIsResendLoading(false);
    }
  };

  const goBackToRegistration = () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } catch (err) {
      console.warn("Failed to clear reCAPTCHA:", err);
    }

    setShowOtpVerification(false);
    localStorage.removeItem("showOtpVerification");
  };

  // Check for stored OTP state on component mount
  useEffect(() => {
    try {
      // Check if we were in OTP verification
      const storedRegistrationData = JSON.parse(
        localStorage.getItem("registrationData")
      );
      const storedVerificationState =
        localStorage.getItem("showOtpVerification") === "true";

      if (storedRegistrationData && storedVerificationState) {
        setRegistrationData(storedRegistrationData);
        setShowOtpVerification(true);

        // Retrieve confirmation result if available
        const storedConfirmation = getConfirmationResult();
        if (storedConfirmation) {
          setConfirmationResult(storedConfirmation);
        } else {
          // Set timer for 2 seconds to allow DOM to fully render before initializing reCAPTCHA
          setTimeout(() => {
            handleResendOtp(storedRegistrationData);
          }, 2000);
        }

        // Start timer if needed
        setTimer(60);
        setIsTimerRunning(true);
      }
    } catch (err) {
      console.error("Error restoring verification state:", err);
      // Reset state in case of error
      localStorage.removeItem("showOtpVerification");
      localStorage.removeItem("registrationData");
      clearConfirmationResult();
    }
  }, []);

  // Initialize recaptcha when component mounts
  useEffect(() => {
    if (!recaptchaContainerRef.current || !showOtpVerification) return;

    let isMounted = true;

    const initializeRecaptcha = async () => {
      try {
        await setupRecaptcha(recaptchaContainerRef.current.id);
      } catch (err) {
        if (isMounted) {
          console.error("reCAPTCHA initialization error:", err);
          toast.error("Gagal menginisialisasi reCAPTCHA: " + err.message);
        }
      }
    };

    initializeRecaptcha();

    return () => {
      isMounted = false;
    };
  }, [showOtpVerification]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  return (
    <div className="h-dvh bg-white flex">
      <Head>
        <title>
          {showOtpVerification
            ? "Verifikasi OTP - Beri Barang"
            : "Beri Barang - Daftar"}
        </title>
        <meta
          name="description"
          content={
            showOtpVerification
              ? "Verifikasi OTP untuk donasi selamat datang di Beri Barang"
              : "Beri Barang donation registration page"
          }
        />
      </Head>

      <div className="w-full max-w-6xl mx-auto py-12 flex flex-col md:flex-row items-center">
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

        <div className="w-full md:w-1/2 md:pl-12 text-black">
          {!showOtpVerification ? (
            /* Form Registrasi*/
            <div className="space-y-5">
              <div id="recaptcha-container" className="hidden" />

              <div className="text-center">
                <h1 className="text-[28px] font-bold ">DAFTAR</h1>
                <p>Bersama menyejahterakan masyarakat</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <FormInput
                      inputType="text"
                      name="firstName"
                      register={register("firstName")}
                      value={watch("firstName")}
                      label="Nama Depan"
                      placeholder="Contoh: Matthew"
                      inputStyles="w-full"
                      errors={errors?.firstName?.message}
                      required
                    />
                    <FormInput
                      inputType="text"
                      name="lastName"
                      register={register("lastName")}
                      value={watch("lastName")}
                      label="Nama Belakang"
                      placeholder="Contoh: Emmanuel"
                      inputStyles="w-full"
                      errors={errors?.lastName?.message}
                      required
                    />
                  </div>
                  <FormInput
                    inputType="text"
                    name="phoneNumber"
                    register={register("phoneNumber")}
                    value={watch("phoneNumber")}
                    label="Nomor Telepon (Whatsapp)"
                    placeholder="Contoh: 812468751243"
                    errors={errors?.phoneNumber?.message}
                    required
                  />
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
                  />
                </div>

                <ButtonCustom
                  type="submit"
                  variant="orange"
                  disabled={isLoading}
                  className="w-full h-12"
                  label={[
                    isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
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
                      "Buat Akun"
                    ),
                  ]}
                />

                <Spacer text="atau menggunakan" />

                <ButtonCustom
                  type="button"
                  onClick={handleGoogleLogin}
                  label="Google"
                  variant="outlineOrange"
                  icon="devicon:google"
                  className="w-full h-12 gap-2"
                />

                <TextWithLink
                  href="/login"
                  text="Sudah punya akun?"
                  label="Login"
                />
              </form>
            </div>
          ) : (
            /* Verifikasi OTP */
            <div className="p-6 flex flex-col justify-center gap-5 text-black">
              <div
                id="recaptcha-container"
                ref={recaptchaContainerRef}
                className="hidden"
              />

              <button
                onClick={goBackToRegistration}
                className="text-xs flex justify-start cursor-pointer hover:underline mb-3"
              >
                {`<`} Kembali ke formulir pendaftaran
              </button>

              <div className="text-center">
                <h2 className="text-[28px] font-bold">Verifikasi OTP</h2>
                <p>
                  Masukkan kode OTP yang telah dikirimkan ke{" "}
                  <span className="font-bold">
                    +62{watch("phoneNumber") || "nomor telepon anda"}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index, e)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
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
                disabled={isLoading}
                className="w-full h-12"
                onClick={handleVerifyOtp}
                label={[
                  isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Memverifikasi...</span>
                    </div>
                  ) : (
                    "Konfirmasi"
                  ),
                ]}
              />

              <ButtonCustom
                type="button"
                onClick={handleResendOtp}
                variant="outlineOrange"
                disabled={isTimerRunning || isResendLoading}
                className={`w-full h-12 ${
                  (isTimerRunning || isResendLoading) &&
                  "opacity-50 cursor-not-allowed"
                }`}
                label={[
                  isResendLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#F0BB78] border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Mengirim...</span>
                    </div>
                  ) : (
                    `Kirim Ulang Kode (${formatTimer(timer)})`
                  ),
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
