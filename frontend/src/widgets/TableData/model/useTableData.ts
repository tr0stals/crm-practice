import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { computed, ref, watch, type ComputedRef } from "vue";

/**
 *  Метод считывает текущее состояние currentSection, вычисляет количество колонок для таблицы
 * @param headers - заголовки таблицы
 * @returns
 * columnCount - количество столбцов в таблице,
 * navigationStore - навигационный стор
 *
 */
export function useTableData(
  headers: ComputedRef<string[]> | string[] | undefined
) {
  const currentSection = ref("");
  const navigationStore = useNavigationStore();

  watch(
    () => currentSection,
    (val) => {
      navigationStore.currentSection = val;
    }
  );

  /**
   * Количество столбцов в таблице
   */
  const columnCount = computed(() => {
    if (!headers) return 0;
    return Array.isArray(headers) ? headers.length : headers.value.length;
  });

  return {
    currentSection,
    columnCount,
    navigationStore,
  };
}
