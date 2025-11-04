import { api } from "@/shared/api/axiosInstance";

export const getImagePath = async (
  currentSection: string,
  entityId: string
) => {
  const image = await api.get(`images/byTarget/${currentSection}/${entityId}`);
  return image.data;
};
