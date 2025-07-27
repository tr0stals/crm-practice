import { api } from "@/shared/api/axiosInstance";

export const getDataAsync = async (config: {
  endpoint: string;
  data?: any;
}) => {
  const { endpoint, data } = config;
  return await api.get(endpoint, data);
};
