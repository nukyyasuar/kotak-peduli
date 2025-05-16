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

let refreshTokenPromise = null;
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
    // Jika belum ada proses refresh yang sedang berjalan
    if (!refreshTokenPromise) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) throw new Error("Refresh token tidak ditemukan");

      // Simpan promise untuk mencegah multiple refresh
      refreshTokenPromise = fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      )
        .then(async (res) => {
          const data = await res.json();

          if (res.status !== 201) {
            toast.error("Sesi Anda telah habis. Silakan login kembali.");
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            throw new Error("Refresh token gagal");
          }

          const newAccessToken = data?.data?.tokens?.accessToken;
          const newRefreshToken = data?.data?.tokens?.refreshToken;

          if (!newAccessToken) throw new Error("Gagal memperbarui token");

          localStorage.setItem("authToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          return newAccessToken;
        })
        .finally(() => {
          // Reset promise setelah selesai
          refreshTokenPromise = null;
        });
    }

    // Tunggu refresh token selesai dan dapatkan access token baru
    const newAccessToken = await refreshTokenPromise;

    const retryOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
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
