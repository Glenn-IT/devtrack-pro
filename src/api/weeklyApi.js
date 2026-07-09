import api from "./axiosConfig";

export const getWeeklyEntries = () => api.get("/weekly");
export const createWeeklyEntry = (data) => api.post("/weekly", data);
export const updateWeeklyEntry = (id, data) => api.put(`/weekly/${id}`, data);
export const deleteWeeklyEntry = (id) => api.delete(`/weekly/${id}`);
