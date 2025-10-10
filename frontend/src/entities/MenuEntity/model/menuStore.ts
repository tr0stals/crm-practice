import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menuStore", () => {
  const activeEntity = ref<any>();

  function setActiveEntity(entity: any) {
    activeEntity.value = entity;
  }

  return {
    activeEntity,
    setActiveEntity,
  };
});
