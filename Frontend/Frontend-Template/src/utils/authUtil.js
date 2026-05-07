import { getToken, removeToken, setToken } from "./tokenHelper";

// The key we use to store the user object in localStorage
const USER_KEY = "user";

// ── JWT decode ────────────────────────────────────────
// A JWT is three Base64 strings joined by dots: header.payload.signature
// We only need the middle part (payload) which contains the user's data.
function parseJwt(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson   = atob(payloadBase64);   // atob decodes Base64 → string
    return JSON.parse(payloadJson);
  } catch {
    // If anything goes wrong (malformed token), return null
    return null;
  }
}

// ── Check if a token is expired ───────────────────────
// The JWT payload contains an "exp" field — a Unix timestamp (seconds).
// We compare it to the current time to decide if the token is still valid.
export function isTokenExpired(token) {
  if (!token) return true;

  const decoded = parseJwt(token);

  // If we can't decode it, treat it as expired
  if (!decoded || !decoded.exp) return true;

  // decoded.exp is in seconds, Date.now() is in milliseconds — multiply by 1000
  const isExpired = decoded.exp * 1000 < Date.now();
  return isExpired;
}

// ── Save auth data after a successful login ───────────
// The backend returns a raw JWT string. We decode it to get the user's
// email and role, then save both the token and the user object to localStorage.
export function saveAuthData(data) {
  const token = data.token;
  if (!token) return;

  // Save the raw token string
  setToken(token);

  // Decode the token to extract user info
  const decoded = parseJwt(token);

  if (decoded) {
    const user = {
      email: decoded.sub,   // Spring Security stores the email in the "sub" (subject) field
      role:  decoded.role,  // We added "role" as a custom claim in the backend
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

// ── Get the stored user object ────────────────────────
// Returns the user object (e.g. { email, role }) or null if not logged in.
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);

    // Guard against missing or corrupted data
    if (!raw || raw === "undefined") return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Get the stored role ───────────────────────────────
// Returns the role string (e.g. "ADMIN" or "USER") or null.
export function getRole() {
  const user = getUser();
  if (!user) return null;
  return user.role;
}

// ── Check if the user is currently authenticated ──────
// Returns true only if a token exists AND it has not expired.
// This prevents an old expired token from keeping the user "logged in".
export function isAuthenticated() {
  const token = getToken();

  if (!token) return false;
  if (isTokenExpired(token)) return false;

  return true;
}

// ── Log the user out ──────────────────────────────────
// Removes the token and user object from localStorage.
export function logout() {
  removeToken();
  localStorage.removeItem(USER_KEY);
}
