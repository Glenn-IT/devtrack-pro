import api from "./axiosConfig";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const getMe = () => api.get("/auth/me");
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });
