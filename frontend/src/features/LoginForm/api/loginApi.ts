import { api } from "@/shared/api/axiosInstance";

export const loginApi = (email: string, password: string) =>
  api.post("/auth/login", { email, password });
