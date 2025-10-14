import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "api/";


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleLogout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  localStorage.removeItem("roleEnum");
  window.dispatchEvent(new CustomEvent("auth-logout"));
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Extend the type to include _retry
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (!error.response) {
      if (error.config?.url?.includes("/Authentication/refresh")) {
        handleLogout();
        return Promise.reject(error);
      }
      // Handle Status

      if (originalRequest && !originalRequest._retry) {
        return handleTokenRefresh(originalRequest, error);
      }

      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      return handleTokenRefresh(originalRequest, error);
    }

    return Promise.reject(error);
  }
);

// Hàm xử lý refresh token
const handleTokenRefresh = async (
  originalRequest: any,
  error: AxiosError<unknown, any>
) => {
  if (isRefreshing) {
    return new Promise(function (resolve, reject) {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(
          err instanceof Error ? err : new Error(String(err))
        );
      });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const refreshResponse = await refreshAxios.post(
      "/Authentication/refresh",
      {},
      {
        withCredentials: true,
        timeout: 10000, //10s
      }
    );
    const { accessToken: newAccessToken } = refreshResponse.data.value ?? {};
    if (!newAccessToken) {
      throw new Error("No access token received from refresh endpoint");
    }

    localStorage.setItem("jwtToken", newAccessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

    processQueue(null, newAccessToken);

    return api(originalRequest);
  } catch (refreshError: any) {
    processQueue(refreshError, null);
    handleLogout();

    return Promise.reject(
      refreshError instanceof Error
        ? refreshError
        : new Error(String(refreshError))
    );
  } finally {
    isRefreshing = false;
  }
};

export default api;
