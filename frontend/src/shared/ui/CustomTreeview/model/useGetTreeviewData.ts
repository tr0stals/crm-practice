import { getDataAsync } from "@/shared/api/getDataAsync";
import type { TreeNode } from "primevue/treenode";

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
  const { foreignTableName } = foreignConfig;

  if (!data || data.length === 0) {
    console.warn("Empty data passed to useGetTreeviewData");
    return [];
  }

  // данные внешней таблицы
  const foreignTableData = (
    await Promise.all(
      data.map(async (item) => {
        const res = await getDataAsync(`database/${foreignTableName}`);
        return res.data;
      })
    )
  ).flat();

  const currentTableData = (
    await Promise.all(
      data.map(async (item) => {
        const res = await getDataAsync(`database/${currentSection}/${item.id}`);
        return res.data;
      })
    )
  ).flat();

  const grouped = new Map<number, TreeNode[]>();

  for (const item of currentTableData) {
    console.debug(item);
    const idKey = Object.keys(item).find(
      (k) =>
        k.endsWith("Id") && k.includes(String(currentSection?.slice(0, -1)))
    );
    const foreignDataId = idKey ? item[idKey] : undefined;
    console.debug(idKey);

    if (typeof foreignDataId !== "number") {
      console.warn("foreignDataId is not a number or undefined", foreignDataId);
      continue;
    }

    if (!grouped.has(foreignDataId)) {
      grouped.set(foreignDataId, []);
    }

    grouped.get(foreignDataId)!.push({
      key: `child-${item.id}`,
      label:
        item.fullName ||
        currentSection +
          " " +
          (item.licenseCode || item.name || item.label || item.id),
      data: item,
      leaf: true,
    });
  }

  const foreignDataNodes: TreeNode[] = Array.from(grouped.entries()).map(
    ([id, currentData]) => {
      console.debug(foreignTableData, id);
      return {
        key: `type-${id}`,
        label: `${
          foreignTableData.find((item) => item.id === id).title ||
          foreignTableData.find((item) => item.id === id).name
        }`,
        data: id,
        children: currentData,
      };
    }
  );

  return [
    {
      key: "root",
      label: currentSection || "Раздел",
      data: currentSection,
      children: foreignDataNodes,
    },
  ];
}
