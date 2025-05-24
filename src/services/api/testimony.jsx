import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

const createTestimony = async (payload) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/testimonials`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTestimonies = async () => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/testimonials`,
      createRequestOptions("GET")
    );
    const result = await handleApiResponse(response);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { createTestimony, getTestimonies };
