"use client";

import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "src/services/auth/firebaseConfig";
import { createRequestOptions, handleApiResponse } from "../helpers";

const loginWithEmail = async (email, password) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/login`,
      createRequestOptions("POST", { email, password })
    );
    const result = await handleApiResponse(response);

    const accessToken = result.data?.tokens?.accessToken;
    const refreshToken = result.data?.tokens?.refreshToken;
    if (!accessToken || !refreshToken) {
      throw new Error("Access token not found in response");
    }

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    return result.data?.user || result.data || result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginWithGoogle = async () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/oauth/callback&response_type=code&scope=profile%20email`;
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=722120791860-0i84tn29ghq06ohs257re8i4kc9l1vr2.apps.googleusercontent.com&redirect_uri=http://127.0.0.1:3000/login&response_type=code&scope=profile%20email&prompt=select_account`;

  try {
    const code = new URLSearchParams(window.location.search).get("code");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/google`,
      createRequestOptions("GET", { code })
    );
    const result = await handleApiResponse(response);

    // googleProvider.setCustomParameters({
    //   prompt: "select_account",
    // });
    // const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { loginWithEmail, loginWithGoogle };
