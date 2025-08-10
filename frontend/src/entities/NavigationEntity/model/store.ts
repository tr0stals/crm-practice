import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigationStore = defineStore("navigationStore", () => {
  const selectedRow = ref<any | null>(null);
  const currentSection = ref<string | null>(null);
  const activeRow = ref<string | null>(null);

  function setSelectedRow(row: any) {
    selectedRow.value = row;
  }

  function resetData() {
    selectedRow.value = null;
  }

  function setActiveRow(section: string) {
    activeRow.value = section;
  }

  function setCurrentSection(section: string) {
    currentSection.value = section;
  }

  return {
    selectedRow,
    setSelectedRow,
    currentSection,
    setCurrentSection,
    activeRow,
    setActiveRow,
    resetData,
  };
});
