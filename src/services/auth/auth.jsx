import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "src/services/auth/firebase";

// Store reCAPTCHA verifier globally
let recaptchaVerifier = null;

export const setupRecaptcha = async (containerId, forceReset = false) => {
  try {
    if (forceReset && recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (err) {
        console.error("Error clearing reCAPTCHA verifier:", err);
      }
      recaptchaVerifier = null;
    }

    if (!recaptchaVerifier) {
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error("reCAPTCHA container not found");
      }

      // Clear container and remove existing reCAPTCHA elements
      container.innerHTML = "";
      const existingScripts = document.querySelectorAll(
        'script[src*="recaptcha"]'
      );
      existingScripts.forEach((script) => script.remove());
      ("Cleared existing reCAPTCHA scripts and container content");

      // Ensure container is clean
      const newContainer = document.createElement("div");
      newContainer.id = containerId;
      container.parentNode.replaceChild(newContainer, container);

      recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          recaptchaVerifier = null;
        },
        "error-callback": (error) => {
          console.error("reCAPTCHA error:", error);
          recaptchaVerifier = null;
        },
      });

      await recaptchaVerifier.render();
    } else {
    }

    return recaptchaVerifier;
  } catch (error) {
    console.error("reCAPTCHA initialization failed:", error);
    recaptchaVerifier = null;
    throw new Error("Failed to initialize reCAPTCHA: " + error.message);
  }
};

const isValidPhoneNumber = (phone) => {
  return (
    phone && phone.startsWith("+") && phone.length >= 12 && phone.length <= 15
  );
};

export const sendPhoneVerificationCode = async (phoneNumber) => {
  try {
    const verifier = await setupRecaptcha("recaptcha-container", true);
    const formattedPhoneNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+${phoneNumber}`;

    if (!isValidPhoneNumber(formattedPhoneNumber)) {
      throw new Error(
        "Nomor telepon tidak valid. Pastikan format benar (contoh: +6281234567890)."
      );
    }

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhoneNumber,
      verifier
    );

    return confirmationResult;
  } catch (error) {
    console.error("Error sending phone verification code:", error);
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    switch (error.code) {
      case "auth/invalid-phone-number":
        throw new Error(
          "Nomor telepon tidak valid. Pastikan format benar (contoh: +6281234567890)."
        );
      case "auth/too-many-requests":
        throw new Error(
          "Nomor telepon terlalu sering digunakan. Coba lagi nanti."
        );
      case "auth/quota-exceeded":
        throw new Error("Kuota SMS terlampaui. Hubungi dukungan.");
      default:
        throw new Error("Gagal mengirim kode OTP: " + error.message);
    }
  }
};

export const verifyPhoneCode = async (confirmationResult, verificationCode) => {
  try {
    if (
      !confirmationResult ||
      typeof confirmationResult.confirm !== "function"
    ) {
      throw new Error("Invalid confirmation result. Please request a new OTP.");
    }

    const result = await confirmationResult.confirm(verificationCode);

    return result.user;
  } catch (error) {
    switch (error.code) {
      case "auth/invalid-verification-code":
        toast.error("Kode OTP salah. Silakan cek kode OTP kembali.");
        break;
      case "auth/session-expired":
        toast.error("Sesi OTP telah kedaluwarsa. Silakan minta kode baru.");
        break;
      default:
        toast.error("Gagal memverifikasi OTP. Silakan coba lagi.");
        break;
    }
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
