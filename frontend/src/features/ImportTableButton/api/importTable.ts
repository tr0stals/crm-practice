import { api } from "@/shared/api/axiosInstance";

export const importTable = async (
  table: string,
  file: File,
  chunkSize: number = 1000
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("table", table);
  formData.append("chunkSize", chunkSize.toString());

  try {
    const response = await api.post(
      `/database_export_import/import/table?table=${table}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Ошибка при импорте:", error);
    throw error;
  }
};
