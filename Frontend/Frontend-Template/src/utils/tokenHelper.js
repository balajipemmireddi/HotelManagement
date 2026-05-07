const TOKEN_KEY = "token";

// save token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// get token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};