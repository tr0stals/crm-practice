import { api } from "@/shared/api/axiosInstance";
import type { IUserRegister } from "../interface/IUserRegister";

export const register = (user: IUserRegister) =>
  api.post("/auth/register", { ...user });
