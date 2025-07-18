import { api } from "@/shared/api/axiosInstance";

export const exportTable = async (table: string, format: string) => {
  try {
    const endpoint = "database_export_import/export/table";
    const response = await api.get(`${endpoint}`, {
      params: { table, format },
      responseType: "blob", // 👈 Ключевой момент!
    });

    // Получение имени файла из заголовка
    const contentDisposition = response.headers["content-disposition"];
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `${table}.${format}`;

    // Создание и клик по ссылке
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (e: any) {
    console.error("Ошибка экспорта таблицы:", e);
    throw new Error(e);
  }
};
