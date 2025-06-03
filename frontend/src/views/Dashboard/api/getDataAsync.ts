import { api } from "@/shared/api/axiosInstance";
import type { IData } from "../interface/IData";

/**
 *
 * @param config - прокидываем в конфиг данные о маршруте и сами данные
 * @returns
 */
export const getDataAsync = async (config: IData) => {
  const { endpoint, data } = config;

  return await api.get(endpoint, data);
};
