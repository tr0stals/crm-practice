import { api } from "@/shared/api/axiosInstance";

export const startCurrentTask = async (taskId: number, employeeId?: number) => {
  try {
    const endpoint = "current_tasks/start";

    return await api.post(`${endpoint}/${taskId}`, {
      employeeId
    });
  } catch (e: any) {
    throw new Error(e);
  }
};
