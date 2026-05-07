import axios from "axios";
import { getToken, removeToken } from "../utils/tokenHelper";

/**
 * Axios instance pre-configured for the StayEase backend.
 *
 * Request interceptor  — attaches the JWT Bearer token to every request.
 * Response interceptor — handles 401 Unauthorized by clearing the stale
 *                        token and redirecting to /login without a full
 *                        page reload.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ──────────────────
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ─────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      removeToken();
      localStorage.removeItem("user");

      // Use window.location so the redirect works outside React Router context
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
