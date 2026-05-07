import { getToken, removeToken } from "./tokenHelper";

const USER_KEY = "user";

// Decode JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return err;
  }
};

// Save auth data (ONLY TOKEN COMES FROM BACKEND)
export const saveAuthData = (data) => {
  const token = data.token;

  localStorage.setItem("token", token);

  const decoded = parseJwt(token);

  if (decoded) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        email: decoded.sub,     // usually email is in 'sub'
        role: decoded.role      // custom claim
      })
    );
  }
};

// Get user
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user:", error);
    return null;
  }
};

// Get role
export const getRole = () => {
  const user = getUser();
  return user?.role || null;
};

// Check login
export const isAuthenticated = () => {
  return !!getToken();
};

// Logout
export const logout = () => {
  removeToken();
  localStorage.removeItem(USER_KEY);
};