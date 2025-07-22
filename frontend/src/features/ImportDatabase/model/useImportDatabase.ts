import { ref } from "vue";
import { importDatabase } from "../api/importDatabase";

export default function useImportDatabase() {
  const selectedFile = ref<File | null>(null);
  const loading = ref(false);

  const importDb = async () => {
    if (!selectedFile.value) return;

    loading.value = true;

    try {
      const result = await importDatabase(selectedFile.value);
      console.log("Импорт завершён:", result);
      alert(`Импорт завершён`);
    } catch (e) {
      alert("Ошибка при импорте базы");
    } finally {
      loading.value = false;
    }
  };

  return {
    selectedFile,
    loading,
    importDb,
  };
}
