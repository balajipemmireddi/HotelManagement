import API from "../api/axios";

export const testAdminAccess = async () => {
  try {
    const res = await API.get("/api/test/admin");
    return res.data;
  } catch (error) {
    throw error.response?.data || "Access Denied";
  }
};