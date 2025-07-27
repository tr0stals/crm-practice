import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigationStore = defineStore("navigationStore", () => {
  const selectedRow = ref();
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

  return {
    selectedRow,
    setSelectedRow,
    currentSection,
    setCurrentSection,
    activeSection,
    setActiveSection,
  };
});
