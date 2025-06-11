import { api } from "./axiosInstance";

export const getUsers = () => api.get("/user/get");
