import { useState } from "react";
import { AuthContext } from "./authContext";
import {
  getUser,
  getRole,
  isAuthenticated as checkAuth,
  logout as logoutUtil,
} from "../utils/authUtil";

/**
 * AuthProvider — wraps the app and exposes auth state to all consumers.
 *
 * State is initialised from localStorage on mount so identity persists
 * across page refreshes. The token expiry check in isAuthenticated()
 * ensures an expired token never counts as a valid session.
 */
export const AuthProvider = ({ children }) => {
  const [user,            setUser]            = useState(getUser);
  const [role,            setRole]            = useState(getRole);
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);

  /**
   * Call after saveAuthData() to sync React state with localStorage.
   * Does NOT accept a token — reads from localStorage so there is a
   * single source of truth.
   */
  const login = () => {
    const userData = getUser();
    if (!userData) return;
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  /** Clear all auth state and localStorage. */
  const logout = () => {
    logoutUtil();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
