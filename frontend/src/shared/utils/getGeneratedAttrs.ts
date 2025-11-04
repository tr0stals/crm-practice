import type { IExtraAttr } from "../interface/IExtraAttr";

export const getGeneratedAttrs = (
  extraAttrs?: IExtraAttr[]
): Record<string, string> => {
  const res: Record<string, string> = {};
  extraAttrs?.forEach((attr) => {
    const value =
      typeof attr.value === "object"
        ? JSON.stringify(attr.value)
        : String(attr.value);
    res[attr.name] = value;
  });
  return res;
};
