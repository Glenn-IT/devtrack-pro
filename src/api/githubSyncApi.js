import axiosInstance from "./axiosConfig";

export const syncFromGitHub = (projectId) =>
  axiosInstance.get(`/projects/${projectId}/sync-github`);
