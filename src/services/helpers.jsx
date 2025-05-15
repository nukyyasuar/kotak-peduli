import { toast } from "react-toastify";

const createRequestOptions = (method, body) => {
  const isFormData = body instanceof FormData;

  return {
    method,
    headers: isFormData
      ? { "ngrok-skip-browser-warning": "69420" }
      : {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
    body: isFormData ? body : JSON.stringify(body),
    redirect: "follow",
    credentials: "include",
  };
};

const handleApiResponse = async (response) => {
  const result = await response.json();

  if (!response.ok) {
    const rawMessage =
      result?.meta?.message || result?.message || "Request failed";
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : rawMessage;

    const error = new Error(message);
    error.status = response.status;
    error.response = result;
    throw error;
  }

  return result;
};

const fetchWithAuth = async (url, options) => {
  const accessToken = localStorage.getItem("authToken");
  const withAuthOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let response = await fetch(url, withAuthOptions);

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) throw new Error("Refresh token tidak ditemukan");

    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );
    const refreshData = await refreshRes.json();
    if (refreshRes.status !== 201) {
      toast.error("Refresh token tidak valid. Silahkan login kembali");
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return;
    }

    if (!refreshRes.ok) {
      const err = await refreshRes.text();
      console.error("Refresh error:", err);
    }

    const newToken = refreshData?.data?.accessToken;
    if (!newToken) throw new Error("Gagal memperbarui token");

    localStorage.setItem("authToken", newToken);

    const retryOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    };
    response = await fetch(url, retryOptions);
  }

  return response;
};

export {
  createRequestOptions,
  handleApiResponse,
  fetchWithAuth,
  axiosInstance,
};
