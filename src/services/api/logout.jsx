import {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
} from "../helpers";

const logout = async () => {
  const payload = {
    refreshToken: localStorage.getItem("refreshToken"),
  };
  try {
    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/logout`,
      createRequestOptions("POST", payload)
    );
    const result = await handleApiResponse(response);

    console.log(result);
    console.log(response);

    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { logout };
