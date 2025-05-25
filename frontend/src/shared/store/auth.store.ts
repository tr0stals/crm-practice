import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const error = ref<string | null>(null);

  const logout = () => {
    token.value = null;
    localStorage.removeItem("token");
  };

  return { token, error, logout };
});
