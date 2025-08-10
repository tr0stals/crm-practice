import { api } from "@/shared/api/axiosInstance";

export const deleteDataAsync = async (id: number, sectionName: string) => {
  try {
    console.debug("id: ", id);
    console.debug("sectionName: ", sectionName);
    return await api.delete(`/${sectionName}/delete/${id}`);
  } catch (e: any) {
    console.debug(e);
    const message =
      e.response?.data?.message || // если ты отправляешь объект { message: "..." }
      e.response?.data || // если ты отправляешь просто строку
      e.message || // fallback: стандартное сообщение ошибки
      "Произошла ошибка при удалении";

    alert(message);
  }
};
