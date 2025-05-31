import { api } from "./axiosInstance";

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

export const getUsers = () => api.get('/users/get');