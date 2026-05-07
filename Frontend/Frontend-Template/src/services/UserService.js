import API from "../api/axios";

/**
 * UserService — authentication API calls.
 *
 * The backend returns a raw JWT string from POST /login.
 * Token persistence is handled by the caller (LoginPage) via saveAuthData()
 * so there is a single place that writes to localStorage.
 */

/**
 * Register a new user.
 * @param {{ firstName, lastName, email, password }} userData
 */
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/register", userData);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Registration failed. Please try again.";
  }
};

/**
 * Login and return the raw JWT string.
 * Does NOT write to localStorage — caller is responsible for that.
 * @param {{ email, password }} credentials
 * @returns {Promise<string>} JWT token
 */
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);
    return res.data; // raw JWT string
  } catch (error) {
    throw error.response?.data || "Login failed. Please check your credentials.";
  }
};
