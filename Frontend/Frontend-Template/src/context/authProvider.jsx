import { useState } from "react";
import { AuthContext } from "./authContext";
import { getUser, getRole, logout as logoutUtil } from "../utils/authUtil";
import { getToken } from "../utils/tokenHelper.js";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(getUser());
  const [role, setRole] = useState(getRole());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  const login = () => {
    const userData = getUser();

    console.log("LOGIN USER DATA:", userData);

    if (!userData) return;

    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutUtil();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};