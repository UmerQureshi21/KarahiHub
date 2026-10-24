import axios from "axios";
import { ApiError } from "../types";
import type { AuthResponse, ErrorResponse } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Access token lives in memory only — not in localStorage or sessionStorage.
// XSS can't steal what's not persisted. On page refresh, we call /auth/refresh
// and the browser auto-sends the httpOnly refresh_token cookie to get a new one.
let accessToken: string | null = null;
let currentUserEmail: string | null = null;
let currentUsername: string | null = null;

export const getCurrentUserEmail = () => currentUserEmail;
export const getCurrentUsername = () => currentUsername;

// Callback that AuthContext registers so userService can push state changes
// into React. This bridges the gap between plain JS module and React state.
type AuthListener = (username: string | null, email: string | null) => void;

let authListener: AuthListener | null = null;

export const setAuthListener = (listener: AuthListener | null) => {
  authListener = listener;
};
const notifyAuthChange = () => {
  authListener?.(currentUsername, currentUserEmail);
};

// Stores the session from any auth response and tells React about it
const setSession = (data: AuthResponse) => {
  accessToken = data.accessToken;
  currentUserEmail = data.email;
  currentUsername = data.username;
  notifyAuthChange();
};

// Extracts the custom error message from an axios error response,
// or falls back to a generic message if the response shape is unexpected.
export const getErrorMessage = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError<ErrorResponse>(error) && error.response?.data?.message) {
    return error.response.data;
  }
  return { status: 500, message: "Something went wrong" };
};

// Register a new user. Backend sets refresh_token as httpOnly cookie automatically.
export const register = async (user: {
  email: string;
  username: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/register`,
      user,
      {
        withCredentials: true, // tells axios to accept and send cookies
      },
    );
    setSession(response.data);
    return response.data;
  } catch (error) {
    throw new ApiError(getErrorMessage(error));
  }
};

// Login. Backend sets refresh_token as httpOnly cookie automatically.
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials,
      {
        withCredentials: true,
      },
    );
    setSession(response.data);
    return response.data;
  } catch (error) {
    throw new ApiError(getErrorMessage(error));
  }
};

// Only one refresh request runs at a time. If several API calls hit a 401 at once
// (or StrictMode runs the startup refresh twice), they all wait on the same promise
// instead of each spending the refresh cookie.
let refreshInFlight: Promise<AuthResponse> | null = null;

// Uses the httpOnly refresh_token cookie (sent by browser automatically)
// to get a fresh access token. Call this on app startup / page refresh.
export const refresh = (): Promise<AuthResponse> => {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, null, {
        withCredentials: true,
      })
      .then((response) => {
        setSession(response.data);
        return response.data;
      })
      .catch((error) => {
        throw new ApiError(getErrorMessage(error));
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

// Tells the backend to clear the refresh_token cookie, then clears local state
export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`, null, {
      withCredentials: true,
    });
  } catch {
    // even if the backend call fails, still clear local state
  }
  accessToken = null;
  currentUserEmail = null;
  currentUsername = null;
  notifyAuthChange();
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const isAuthenticated = (): boolean => {
  return accessToken !== null;
};
