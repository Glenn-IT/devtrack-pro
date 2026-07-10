import api from "./axiosConfig";

export const getActivities = () => api.get("/activities");
