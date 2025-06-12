import type { TreeNode } from "primevue/treenode";
import { ref, type Ref } from "vue";

export function useGetTreeviewData(
  data: any[],
  currentSection: string
): Ref<TreeNode[]> {
  const treeviewData = ref<TreeNode[]>([]);

  console.debug(data);
  if (!data) {
    throw new Error("Data is undefined");
  }

  const fieldKeys = Object.keys(data[0]); // Получаем все поля таблицы

  const children: TreeNode[] = fieldKeys.map((fieldKey, fieldIndex) => {
    const values = data.map((row, rowIndex) => ({
      key: `${fieldIndex}-${rowIndex}`,
      label: String(row[fieldKey]),
      data: row[fieldKey],
      leaf: true,
    }));

    return {
      key: `${fieldIndex + 1}`,
      label: fieldKey,
      data: fieldKey,
      children: values,
    };
  });

  treeviewData.value = [
    {
      key: "0",
      label: currentSection,
      data: currentSection,
      children,
    },
  ];

  return treeviewData;
}
