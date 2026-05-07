import API from "../api/axios";

// Register user
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/register", userData);
    return res.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

// Login user (returns JWT token)
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);

    const token = res.data;

    if (token && token !== "Fail") {
      localStorage.setItem("token", token);
    }

    return token;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};
