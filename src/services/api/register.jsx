import { createRequestOptions, handleApiResponse } from "../helpers";

export const registerWithEmail = async ({
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  idToken,
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/register`,
      createRequestOptions("POST", {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        idToken,
      })
    );
    const result = await handleApiResponse(response);

    if (result.warning || result.accessToken) {
      localStorage.setItem("authToken", result.token || result.accessToken);
    }
    return result.user || result;
  } catch (error) {
    throw new Error(error.message);
  }
};
