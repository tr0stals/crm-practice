import { api } from "@/shared/api/axiosInstance";

export const updateAsync = async (endpoint: string, data: any) => {
  return await api.patch(`${endpoint}/update/${data.id}`, data);
};
