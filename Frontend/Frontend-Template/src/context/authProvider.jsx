import { useState } from "react";
import { AuthContext } from "./authContext";
import {
  getUser,
  getRole,
  isAuthenticated as checkIsAuthenticated,
  logout as clearAuthData,
} from "../utils/authUtil";

/**
 * AuthProvider
 *
 * Wraps the whole app and makes auth state available to every component
 * via AuthContext (useContext(AuthContext)).
 *
 * On first load, we read from localStorage so the user stays logged in
 * after a page refresh — no need to log in again.
 */
export const AuthProvider = ({ children }) => {

  // Read the initial values from localStorage when the component first mounts.
  // getUser() returns { email, role } or null.
  // checkIsAuthenticated() returns true only if a valid, non-expired token exists.
  const [user,            setUser]            = useState(getUser());
  const [role,            setRole]            = useState(getRole());
  const [isAuthenticated, setIsAuthenticated] = useState(checkIsAuthenticated());

  // ── login ─────────────────────────────────────────────
  // Called by LoginPage AFTER saveAuthData() has already written the token
  // and user to localStorage. This function just syncs the React state
  // so the rest of the app re-renders with the new auth info.
  function login() {
    const userData = getUser();

    // Safety check — if localStorage is empty for some reason, do nothing
    if (!userData) return;

    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  }

  // ── logout ────────────────────────────────────────────
  // Clears localStorage and resets all auth state to "logged out".
  function logout() {
    clearAuthData();      // removes token + user from localStorage
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
