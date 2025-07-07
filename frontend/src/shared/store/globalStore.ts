import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const selectedRow = ref<any>();
  const currentSection = ref<string>("");
  const activeSection = ref<string>("");

  function setSelectedRow(row: any) {
    selectedRow.value = row;
  }

  function setActiveSection(section: string) {
    activeSection.value = section;
  }

  function setCurrentSection(section: string) {
    currentSection.value = section;
  }

  const user = ref<null | {
    firstName: string;
    lastName: string;
    email: string;
  }>(null);

  function setUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    user.value = userData;
  }

  function clearUser() {
    user.value = null;
  }

  return {
    selectedRow,
    setSelectedRow,
    currentSection,
    setCurrentSection,
    activeSection,
    setActiveSection,
  };
});
