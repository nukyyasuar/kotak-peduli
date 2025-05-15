"use client";

import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";
// const accessToken = localStorage.getItem("authToken");

const createDonation = async (payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/donation-items`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDonations = async () => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/users/profile/donations`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOneDonation = async (id) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/donation-items/${id}`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAttachment = async (fileName) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/uploads/${fileName}`,
      createRequestOptions("GET")
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Attachment fetch error:", error);
    throw error;
  }
};

export { createDonation, getDonations, getOneDonation, getAttachment };
