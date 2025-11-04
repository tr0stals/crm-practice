import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthorizedUserStore = defineStore("authorizedUserStore", () => {
  const user = ref<null | {
    id: number;
    firstName: string;
    lastName: string;
    professionTitle: string;
    employeeData?: any;
  }>(null);

  function setUser(userData: {
    id: number;
    firstName: string;
    lastName: string;
    professionTitle: string;
  }) {
    user.value = userData;
  }

  function clearUser() {
    user.value = null;
  }

  return { user, setUser, clearUser };
});
