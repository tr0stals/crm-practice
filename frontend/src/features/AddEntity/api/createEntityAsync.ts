import { api } from "@/shared/api/axiosInstance";

export const createEntityAsync = async (endpoint: string, data: any) => {
  if (endpoint === "user") return await api.post(`${endpoint}/register`, data);
  return await api.post(`${endpoint}/create`, data);
};
