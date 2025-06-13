import { getDataAsync } from "@/shared/api/getDataAsync";
import type { TreeNode } from "primevue/treenode";

export async function useGetTreeviewData(
  data?: any[],
  currentSection?: string
): Promise<TreeNode[]> {
  if (!data || data.length === 0) {
    console.warn("Empty data passed to useGetTreeviewData");
    return [];
  }

  const licenseTypes = (
    await Promise.all(
      data.map(async (item) => {
        const res = await getDataAsync(`database/license_types/${item.id}`);
        return res.data; // { id, name }
      })
    )
  ).flat();

  const licenses = (
    await Promise.all(
      data.map(async (item) => {
        const res = await getDataAsync(`database/license/${item.id}`);
        return res.data; // массив лицензий
      })
    )
  ).flat();

  const grouped = new Map<number, TreeNode[]>();

  for (const license of licenses) {
    const licenseTypeId = license.licenseTypeId;
    if (!grouped.has(licenseTypeId)) {
      grouped.set(licenseTypeId, []);
    }
    console.debug(licenseTypeId);

    grouped.get(licenseTypeId)!.push({
      key: `child-${license.id}`,
      label: `Лицензия №${license.licenseCode}`,
      data: license,
      leaf: true,
    });
  }

  const licenseTypeNodes: TreeNode[] = Array.from(grouped.entries()).map(
    ([licenseTypeId, licenses]) => {
      return {
        key: `type-${licenseTypeId}`,
        label: `${licenseTypes.find((item) => item.id === licenseTypeId).name}`,
        data: licenseTypeId,
        children: licenses,
      };
    }
  );

  return [
    {
      key: "root",
      label: currentSection || "Раздел",
      data: currentSection,
      children: licenseTypeNodes,
    },
  ];
}
