import axios from 'axios';
import type { AuthResponse, ErrorResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Access token lives in memory only — not in localStorage or sessionStorage.
// XSS can't steal what's not persisted. On page refresh, we call /auth/refresh
// and the browser auto-sends the httpOnly refresh_token cookie to get a new one.
let accessToken: string | null = null;
let currentUserEmail: string | null = null;
let currentUsername: string | null = null;

export const getCurrentUserEmail = () => currentUserEmail;
export const getCurrentUsername = () => currentUsername;

// Extracts the custom error message from an axios error response,
// or falls back to a generic message if the response shape is unexpected.
const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
        return error.response?.data?.message || 'Something went wrong';
    }
    return 'Something went wrong';
};

// Register a new user. Backend sets refresh_token as httpOnly cookie automatically.
export const register = async (user: { email: string; username: string; password: string }): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, user, {
            withCredentials: true, // tells axios to accept and send cookies
        });
        accessToken = response.data.accessToken;
        currentUserEmail = response.data.email;
        currentUsername = response.data.username;
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

// Login. Backend sets refresh_token as httpOnly cookie automatically.
export const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials, {
            withCredentials: true,
        });
        accessToken = response.data.accessToken;
        currentUserEmail = response.data.email;
        currentUsername = response.data.username;
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

// Uses the httpOnly refresh_token cookie (sent by browser automatically)
// to get a fresh access token. Call this on app startup / page refresh.
export const refresh = async (): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, null, {
            withCredentials: true,
        });
        accessToken = response.data.accessToken;
        currentUserEmail = response.data.email;
        currentUsername = response.data.username;
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

// Clears the in-memory token. To fully logout, the backend should also
// clear the refresh_token cookie (or you can expire it client-side).
export const logout = (): void => {
    accessToken = null;
    currentUserEmail = null;
    currentUsername = null;
};

export const getAccessToken = (): string | null => {
    return accessToken;
};

export const isAuthenticated = (): boolean => {
    return accessToken !== null;
};
