import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "../types";
import {
  API_BASE_URL,
  getAccessToken,
  getErrorMessage,
  logout,
  refresh,
} from "./userService";

// Shared axios instance for every authenticated API call.
// The interceptors below replace the try/catch/retry block each request used to repeat.
export const api = axios.create({ baseURL: API_BASE_URL });

// Attach the in-memory access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Marks a request we've already retried, so a second 401 doesn't loop forever
type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

// On a 401, refresh the access token once and replay the request.
// If the refresh fails the session is over, so log out (UserLayout then redirects to /auth).
// Every other error is turned into an ApiError carrying the backend's message.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    if (error.response?.status === 401 && config && !config._retried) {
      config._retried = true;
      try {
        await refresh();
      } catch {
        await logout();
        throw new ApiError({ status: 401, message: "Your session has expired" });
      }
      return api(config); // the request interceptor adds the new token
    }

    throw new ApiError(getErrorMessage(error));
  },
);
