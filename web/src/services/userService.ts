import axios from 'axios';
import type { AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api';

// Access token lives in memory only — not in localStorage or sessionStorage.
// XSS can't steal what's not persisted. On page refresh, we call /auth/refresh
// and the browser auto-sends the httpOnly refresh_token cookie to get a new one.
let accessToken: string | null = null;


export const userService = {
    // Register a new user. Backend sets refresh_token as httpOnly cookie automatically.
    async register(user: { email: string; username: string; password: string }): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, user, {
            withCredentials: true, // tells axios to accept and send cookies
        });
        accessToken = response.data.accessToken;
        return response.data;
    },

    // Login. Backend sets refresh_token as httpOnly cookie automatically.
    async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials, {
            withCredentials: true,
        });
        accessToken = response.data.accessToken;
        return response.data;
    },

    // Uses the httpOnly refresh_token cookie (sent by browser automatically)
    // to get a fresh access token. Call this on app startup / page refresh.
    async refresh(): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, null, {
            withCredentials: true,
        });
        accessToken = response.data.accessToken;
        return response.data;
    },

    // Clears the in-memory token. To fully logout, the backend should also
    // clear the refresh_token cookie (or you can expire it client-side).
    logout(): void {
        accessToken = null;
    },

    getAccessToken(): string | null {
        return accessToken;
    },

    isAuthenticated(): boolean {
        return accessToken !== null;
    },
};
