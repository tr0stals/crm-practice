import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

export const handleResetSection = () => {
  const navigationStore = useNavigationStore();
  const menuEntity = useMenuStore();

  navigationStore.currentSection = null;
  navigationStore.activeRow = null;
  navigationStore.selectedRow = null;
  menuEntity.activeEntity = null;
};
