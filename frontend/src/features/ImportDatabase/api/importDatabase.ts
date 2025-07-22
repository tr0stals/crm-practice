import { api } from "@/shared/api/axiosInstance";

export const importDatabase = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/database_export_import/import/db",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
