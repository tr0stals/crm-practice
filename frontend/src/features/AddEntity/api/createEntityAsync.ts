import { api } from "@/shared/api/axiosInstance";

export const createEntityAsync = async (endpoint: string, data: any) => {
  return await api.post(`${endpoint}/create`, data);
};
