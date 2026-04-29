import api from "./axiosConfig";

export const getMilestones = (project_id) =>
  api.get("/milestones", { params: { project_id } });
export const createMilestone = (data) => api.post("/milestones", data);
export const updateMilestone = (id, data) => api.put(`/milestones/${id}`, data);
export const deleteMilestone = (id) => api.delete(`/milestones/${id}`);
