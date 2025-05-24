import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

const verifyEmail = async () => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/verify-email`,
      createRequestOptions("POST")
    );
    const result = await handleApiResponse(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const confirmEmail = async (token) => {
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/confirm-email`,
      createRequestOptions("POST", token)
    );
    const result = await handleApiResponse(response);
    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { verifyEmail, confirmEmail };
