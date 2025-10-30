import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";

export function handleShowDismissals() {
  const menuStore = useMenuStore();

  menuStore.showDismissals = !menuStore.showDismissals;
}
