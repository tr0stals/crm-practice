import { api } from "@/shared/api/axiosInstance";
import type { IUserRegister } from "../interface/IUserRegister";

export const register = async (user: IUserRegister) => {
  await api.post("/auth/register", { ...user });
};
