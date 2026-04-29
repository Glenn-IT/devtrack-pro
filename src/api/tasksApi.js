import api from "./axiosConfig";

export const getTasksByProject = (project_id) =>
  api.get("/tasks", { params: { project_id } });
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
