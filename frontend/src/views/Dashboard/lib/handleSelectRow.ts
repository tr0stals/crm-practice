import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

export function handleSelectRow(item: any) {
  const navigationStore = useNavigationStore();

  navigationStore.setSelectedRow(item);
}
