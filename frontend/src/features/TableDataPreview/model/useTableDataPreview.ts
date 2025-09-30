import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { computed } from "vue";

export function useTableDataPreview() {
  const navigationStore = useNavigationStore();

  const data = computed(() => {
    navigationStore.selectedRow = null;
    const activeRow = navigationStore.activeRow;
    if (!activeRow) return [];

    const result = [];
    const { children, ...targetData } = activeRow;

    result.push(targetData);
    if (children && children.length > 0) {
      result.push(...children);
    }

    return result;
  });

  const handleClick = (item: any) => {
    navigationStore.currentSection = item.name;
  };

  return {
    data,
    handleClick,
  };
}
