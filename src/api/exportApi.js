import api from "./axiosConfig";

export const exportDatabase = () => api.get("/export", { responseType: "blob" });
