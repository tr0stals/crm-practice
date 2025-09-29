import { api } from "@/shared/api/axiosInstance";
import { treeviewTables } from "@/shared/config/treeviewTables";

export const deleteDataAsync = async (id: number, sectionName: string) => {
  try {
    if (treeviewTables.includes(sectionName) || sectionName === "employees")
      return await api.delete(`database/${sectionName}/${id}/cleanup`);
    else return await api.delete(`database/${sectionName}/${id}`);
  } catch (e: any) {
    console.debug(e);
    const message =
      e.response?.data?.message || // если ты отправляешь объект { message: "..." }
      e.response?.data || // если ты отправляешь просто строку
      e.message || // fallback: стандартное сообщение ошибки
      "Произошла ошибка при удалении";

    return message;
  }
};
