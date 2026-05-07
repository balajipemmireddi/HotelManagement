import { getToken, removeToken, setToken } from "./tokenHelper";

const USER_KEY = "user";

// ── JWT decode (no external library needed) ───────────
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// ── Check if a JWT token is expired ───────────────────
export const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded?.exp) return true;
  // exp is in seconds; Date.now() is in ms
  return decoded.exp * 1000 < Date.now();
};

/**
 * Save auth data after login.
 * Decodes the JWT to extract email and role, persists both
 * token and user object to localStorage.
 *
 * @param {{ token: string }} data
 */
export const saveAuthData = (data) => {
  const { token } = data;
  if (!token) return;

  setToken(token);

  const decoded = parseJwt(token);
  if (decoded) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        email: decoded.sub,   // Spring Security puts email in 'sub'
        role:  decoded.role,  // custom claim added by backend
      })
    );
  }
};

// ── Get stored user object ────────────────────────────
export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// ── Get stored role ───────────────────────────────────
export const getRole = () => getUser()?.role ?? null;

// ── Check if currently authenticated (token exists + not expired) ──
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

// ── Clear all auth data ───────────────────────────────
export const logout = () => {
  removeToken();
  localStorage.removeItem(USER_KEY);
};
