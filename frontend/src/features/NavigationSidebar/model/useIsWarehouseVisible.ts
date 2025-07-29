import { computed } from "vue";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";

export const useIsWarehouseVisible = () => {
  const authorizedUserStore = useAuthorizedUserStore();

  return computed(() => {
    const profession = authorizedUserStore.user?.professionTitle;
    return profession === "Снабженец" || profession === "Test";
  });
};
