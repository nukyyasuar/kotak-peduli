"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

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
} from "../../../services/auth/auth";
import {
  getConfirmationResult,
  clearConfirmationResult,
} from "../../../services/auth/authStore";

export default function Registration() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [showOtpVerification, setShowOtpVerification] = useState(false);

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

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

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
    setIsLoadingSubmit(true);

    try {
      const formattedPhoneNumber = "+62" + data.phoneNumber;
      const registrationData = { ...data, phoneNumber: formattedPhoneNumber };

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
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setRegistrationData(registrationData);

      setShowOtpVerification(true);
      localStorage.setItem("showOtpVerification", "true");

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
      setIsLoadingSubmit(false);
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

  //   const handleVerifyOtp = async () => {
  //     setIsLoading(true);

  //     const code = otp.join("");
  //     if (!code || code.length !== 6) {
  //       toast.error("Masukkan 6 digit kode OTP");
  //       setIsLoading(false);
  //       return;
  //     }

  //     if (!registrationData || Object.keys(registrationData).length === 0) {
  //       toast.error("Data registrasi tidak ditemukan. Silakan daftar ulang.");
  //       setIsLoading(false);
  //       setShowOtpVerification(false);
  //       return;
  //     }

  //     try {
  //       const user = await verifyPhoneCode(confirmationResult, code);
  //       if (user) {
  //         const idToken = await user.getIdToken();

  //         try {
  // await registerWithEmail({
  //           email: watch("email"),
  //           password: watch("password"),
  //           firstName: watch("firstName"),
  //           lastName: watch("lastName"),
  //           phoneNumber: "+62" + watch("phoneNumber"),
  //           ...(idToken ? { idToken: idToken } : {}),
  //         });
  //         toast.success(
  //           "Pendaftaran berhasil! Anda akan diarahkan ke halaman login."
  //         );
  //         } catch (error) {

  //         }

  //         }

  //       const { email, password } = registrationData;
  //       if (!email || !password) {
  //         throw new Error(
  //           "Data registrasi tidak lengkap (email atau password hilang). Silakan daftar ulang."
  //         );
  //       }

  //       localStorage.removeItem("registrationData");
  //       localStorage.removeItem("showOtpVerification");
  //       clearConfirmationResult();

  //       toast.success(
  //         "Pendaftaran berhasil! Anda akan diarahkan ke halaman login."
  //       );
  //       router.push("/login");
  //     } catch (err) {
  //       console.error("Error during OTP verification or registration:", err);
  //       if (err?.code === "auth/invalid-verification-code") {
  //         toast.error("Kode OTP salah. Silakan coba lagi.");
  //       }
  //       if (err?.code === "auth/session-expired") {
  //         toast.error("Sesi OTP telah kedaluwarsa. Silakan minta kode baru.");
  //       }
  //       if (err?.code === "auth/too-many-requests") {
  //         toast.error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
  //       }
  //       if (
  //         err?.message ===
  //         "A user with the same email or phone number already exists"
  //       ) {
  //         toast.error(
  //           "Akun dengan nomor telepon ini sudah terdaftar. Silakan gunakan nomor lain."
  //         );
  //       }
  //       if (
  //         err?.message?.includes("tidak lengkap") ||
  //         err?.code === "auth/invalid-phone-number"
  //       ) {
  //         setShowOtpVerification(false);
  //         localStorage.removeItem("showOtpVerification");
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
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
      if (user) {
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
          ...(idToken ? { idToken } : {}),
        });

        toast.success(
          "Pendaftaran berhasil! Anda akan diarahkan ke halaman login."
        );
        localStorage.removeItem("registrationData");
        localStorage.removeItem("showOtpVerification");
        clearConfirmationResult();
        router.push("/login");
      }
    } catch (err) {
      console.error("Error during OTP verification or registration:", err);

      if (err?.code === "auth/invalid-verification-code") {
        toast.error("Kode OTP salah. Silakan coba lagi.");
      } else if (err?.code === "auth/session-expired") {
        toast.error("Sesi OTP telah kedaluwarsa. Silakan minta kode baru.");
      } else if (err?.code === "auth/too-many-requests") {
        toast.error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
      } else if (
        err?.message ===
        "A user with the same email or phone number already exists"
      ) {
        toast.error(
          "Akun dengan nomor telepon atau email ini sudah terdaftar. Silakan gunakan nomor lain."
        );
      } else if (
        err?.message?.includes("tidak lengkap") ||
        err?.code === "auth/invalid-phone-number"
      ) {
        setShowOtpVerification(false);
        localStorage.removeItem("showOtpVerification");
        toast.error("Terjadi kesalahan data. Silakan daftar ulang.");
      } else {
        toast.error("Terjadi kesalahan saat verifikasi. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (dataToUse = null) => {
    setIsResendLoading(true);

    const phoneNumber = "+62" + watch("phoneNumber");

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

      toast.success("Kode OTP baru telah dikirim.");
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

          toast.success("Kode OTP baru telah dikirim.");
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
    } catch (error) {
      console.error("Failed to clear reCAPTCHA:", error);
    }

    setOtp(["", "", "", "", "", ""]);
    setShowOtpVerification(false);
    localStorage.removeItem("showOtpVerification");
  };

  useEffect(() => {
    try {
      const storedRegistrationData = JSON.parse(
        localStorage.getItem("registrationData")
      );

      const storedVerificationState =
        localStorage.getItem("showOtpVerification") === "true";

      if (storedRegistrationData && storedVerificationState) {
        setRegistrationData(storedRegistrationData);
        setShowOtpVerification(true);

        const storedConfirmation = getConfirmationResult();
        if (storedConfirmation) {
          setConfirmationResult(storedConfirmation);
        }

        setTimer(60);
        setIsTimerRunning(true);
      }
    } catch (err) {
      console.error("Error restoring verification state:", err);
      localStorage.removeItem("showOtpVerification");
      localStorage.removeItem("registrationData");
      clearConfirmationResult();
    }
  }, []);

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

  useEffect(() => {
    if (!watch("phoneNumber")) {
      setShowOtpVerification(false);
      localStorage.removeItem("showOtpVerification");
      clearConfirmationResult();
    }
  }, [watch("phoneNumber")]);

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

        {/* Form / OTP Section */}
        <div className="w-full md:w-1/2 px-4 sm:px-6">
          {!showOtpVerification || !watch("phoneNumber") ? (
            <div className="max-w-md mx-auto space-y-6">
              <div id="recaptcha-container" className="hidden" />

              <div className="text-center">
                <h1 className="text-2xl sm:text-4xl font-bold mb-1">DAFTAR</h1>
                <p className="text-base">Bersama menyejahterakan masyarakat</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    register={register("password")}
                    value={watch("password")}
                    label="Password"
                    placeholder="Masukkan minimum 8 karakter"
                    errors={errors?.password?.message}
                    required
                    togglePassword={togglePassword}
                    showPassword={showPassword}
                    inputStyles="relative"
                  />
                </div>

                <ButtonCustom
                  type="submit"
                  variant="orange"
                  disabled={isLoading}
                  className="w-full h-12"
                  label={
                    isLoading ? (
                      <>
                        <ClipLoader color="white" size={20} className="mr-2" />
                        Memproses...
                      </>
                    ) : (
                      "Buat Akun"
                    )
                  }
                />

                <TextWithLink
                  href="/login"
                  text="Sudah punya akun?"
                  label="Login"
                />
              </form>
            </div>
          ) : (
            // OTP Verification Section
            <div className="p-6 flex flex-col justify-center gap-5 text-black max-w-md mx-auto">
              <div
                id="recaptcha-container"
                ref={recaptchaContainerRef}
                className="hidden"
              />

              <button
                onClick={goBackToRegistration}
                className="text-sm flex justify-start cursor-pointer hover:underline mb-3"
              >
                {`<`} Kembali ke formulir pendaftaran
              </button>

              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Verifikasi OTP
                </h2>
                <p className="text-sm sm:text-base">
                  Masukkan kode OTP yang telah dikirimkan ke{" "}
                  <span className="font-bold">
                    +62{watch("phoneNumber") || "nomor telepon anda"}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 justify-center flex-wrap max-w-xs mx-auto">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index, e)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-9 h-9 sm:w-10 sm:h-10 text-center text-base sm:text-lg border border-gray-300 rounded-md focus:outline-none focus:border-[#F5A623] transition-colors outline-1"
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
                label={
                  isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Memverifikasi...</span>
                    </div>
                  ) : (
                    "Konfirmasi"
                  )
                }
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
                label={
                  isResendLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#F0BB78] border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2">Mengirim...</span>
                    </div>
                  ) : (
                    `Kirim Ulang Kode (${formatTimer(timer)})`
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
