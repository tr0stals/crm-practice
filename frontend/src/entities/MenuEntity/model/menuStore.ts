import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menuStore", () => {
  const activeEntity = ref<any>();
  const showDismissals = ref(false);

  function setActiveEntity(entity: any) {
    activeEntity.value = entity;
  }

  function setShowDismissals(show: boolean) {
    showDismissals.value = show;
  }

  return {
    activeEntity,
    showDismissals,
    setActiveEntity,
    setShowDismissals,
  };
});
