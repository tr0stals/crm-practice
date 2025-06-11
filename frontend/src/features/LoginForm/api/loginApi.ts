import { api } from "@/shared/api/axiosInstance";

export const loginApi = (userName: string, password: string) =>
  api.post("/auth/login", { userName, password });
