import { getDataAsync } from "@/shared/api/getDataAsync";
import type { TreeNode } from "primevue/treenode";

const getForeignKeyName = (section: string) => {
  switch (section.toLowerCase()) {
    case "organizations":
      return "organizationTypeId";
    case "license":
      return "id";
    default:
      return undefined;
  }
};

const NO_TYPE_ID = -1;
const NO_TYPE_LABEL = "Без типа";

export async function useGetTreeviewData(
  /**
   * данные текущей таблицы
   * currentTableData
   */
  data?: any[],
  currentSection?: string,
  foreignConfig?: {
    foreignTableName: string;
  }
): Promise<TreeNode[]> {
  console.debug("useGetTreeviewData called with:", { data, currentSection, foreignConfig });

  if (!data || data.length === 0) {
    console.warn("Empty data passed to useGetTreeviewData");
    return [];
  }

  // Для секций 'license' и 'organizations' строим дерево по столбцам
  if (currentSection?.toLowerCase() === 'license' || currentSection?.toLowerCase() === 'organizations') {
    // Получаем список всех уникальных ключей (столбцов), которые есть во всех объектах
    const allKeys = data.reduce((acc: string[], item: Record<string, any>) => {
      Object.keys(item).forEach((key: string) => {
        if (!acc.includes(key)) acc.push(key);
      });
      return acc;
    }, [] as string[]);

    // Оставляем только те ключи, которые есть во всех объектах
    const commonKeys = allKeys.filter((key: string) => data.every((item: Record<string, any>) => key in item));

    const rootNode: TreeNode = {
      key: "root",
      label: currentSection || "Раздел",
      data: currentSection,
      children: commonKeys.map((columnName: string) => ({
        key: `col-${columnName}`,
        label: columnName,
        data: columnName,
        children: data.map((item: Record<string, any>) => ({
          key: `col-${columnName}-val-${item.id}`,
          label: String(item[columnName]),
          data: item[columnName],
          leaf: true
        }))
      }))
    };
    return [rootNode];
  }

  // Для остальных секций оставляем прежнюю логику
  return [
    {
      key: "root",
      label: currentSection || "Раздел",
      data: currentSection,
      children: data.map(item => ({
        key: `child-${item.id}`,
        label: item.fullName || item.name || item.label || item.id,
        data: item,
        leaf: true,
      })),
    },
  ];
}
