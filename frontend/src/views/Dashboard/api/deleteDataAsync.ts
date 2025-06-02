import { api } from "@/shared/api/axiosInstance";

export const deleteDataAsync = (id: number, sectionName: string) =>
  api.delete(`/${sectionName}/delete/${id}`);
