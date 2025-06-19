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
  },
  searchQuery?: string
): Promise<{ tree: TreeNode[]; expandedKeys: Record<string, boolean> }> {
  console.debug("useGetTreeviewData called with:", { data, currentSection, foreignConfig, searchQuery });

  if (!data || data.length === 0) {
    console.warn("Empty data passed to useGetTreeviewData");
    return { tree: [], expandedKeys: {} };
  }

  // --- Фильтрация дерева по поиску ---
  function filterTree(nodes: TreeNode[], query: string, expanded: Record<string, boolean>): TreeNode[] {
    const q = query.toLowerCase();
    return nodes
      .map(node => {
        let match = false;
        // Проверяем совпадение в label или data
        if (
          (node.label && String(node.label).toLowerCase().includes(q)) ||
          (node.data && String(node.data).toLowerCase().includes(q))
        ) {
          match = true;
        }
        let children: TreeNode[] = [];
        if (node.children) {
          children = filterTree(node.children, query, expanded);
          if (children.length > 0) {
            match = true;
            expanded[node.key] = true;
          }
        }
        if (match) {
          return { ...node, children };
        }
        return null;
      })
      .filter(Boolean) as TreeNode[];
  }

  // --- Сборка дерева как раньше ---
  let tree: TreeNode[];
  if (currentSection?.toLowerCase() === 'license' || currentSection?.toLowerCase() === 'organizations') {
    const allKeys = data.reduce((acc: string[], item: Record<string, any>) => {
      Object.keys(item).forEach((key: string) => {
        if (!acc.includes(key)) acc.push(key);
      });
      return acc;
    }, [] as string[]);
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
    tree = [rootNode];
  } else {
    tree = [
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

  // --- Применяем фильтр, если есть поисковый запрос ---
  let expandedKeys: Record<string, boolean> = {};
  if (searchQuery && searchQuery.trim()) {
    tree = filterTree(tree, searchQuery, expandedKeys);
  }
  return { tree, expandedKeys };
}
