import { api } from "@/shared/api/axiosInstance";

export const exportDatabase = async () => {
  const response = await api.get("database_export_import/export/db", {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/sql" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "db_dump.sql");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
