import { api } from "@/shared/api/axiosInstance";

export const startCurrentTask = async (taskId: number) => {
  try {
    const endpoint = "current_tasks/start";

    return await api.post(`${endpoint}/${taskId}`);
  } catch (e: any) {
    throw new Error(e);
  }
};
