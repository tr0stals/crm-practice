import { getDataAsync } from "@/shared/api/getDataAsync";

export async function loadItems(endpoint: string) {
  const items = await getDataAsync({ endpoint: `${endpoint}/get` });

  return items;
}
