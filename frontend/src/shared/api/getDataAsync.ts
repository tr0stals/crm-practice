import { api } from "@/shared/api/axiosInstance";

export const getDataAsync = async (endpoint: string) => {
  return await api.get(endpoint);
};
