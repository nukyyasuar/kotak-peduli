"use client";

import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

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

const getDonations = async (statusFilter) => {
  const params = new URLSearchParams({
    limit: "50",
  });

  if (statusFilter) {
    params.append("statusTypes", statusFilter);
  }

  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/users/profile/donations?${params.toString()}`,
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

const updateDonorShippingDate = async (id, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/donation-items/${id}/availability`,
      createRequestOptions("PATCH", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCollectionCenterShippingDate = async (id, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/donation-items/${id}/pickup`,
      createRequestOptions("PATCH", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const processDonation = async (donationId, payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/donation-items/${donationId}/process`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  createDonation,
  getDonations,
  getOneDonation,
  getAttachment,
  updateDonorShippingDate,
  createCollectionCenterShippingDate,
  processDonation,
};
