import { api } from "@/shared/api/axiosInstance";

export const setCurrentTaskCompleted = async (taskId: number) => {
  try {
    const endpoint = "current_tasks/complete";

    return await api.post(`${endpoint}/${taskId}`);
  } catch (e: any) {
    throw new Error(e);
  }
};
