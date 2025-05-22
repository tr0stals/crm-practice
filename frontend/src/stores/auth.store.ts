import { defineStore } from "pinia";
import { ref } from "vue";
import { login, register } from "@/api/auth.api";
import type { IUserRegister } from "@/interfaces/IUserRegister";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const error = ref<string | null>(null);

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (response.data.token) {
        token.value = response.data.token;
        localStorage.setItem("token", response.data.token);
        error.value = null;
      }
    } catch (err) {
      error.value = "Неверные учетные данные";
      throw err;
    }
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem("token");
  };

  const registerUser = async (user: IUserRegister) => {
    try {
      await register(user);
      error.value = null;
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value = "Ошибка регистрации";
      }
      throw err;
    }
  };

  return { token, error, loginUser, logout, registerUser };
});
