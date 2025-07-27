import { ref } from "vue";
import { importDatabase } from "../api/importDatabase";

export default function useImportDatabase() {
  const selectedFile = ref<File | null>(null);
  const loading = ref(false);

  const importDb = async () => {
    if (!selectedFile.value) return;

    loading.value = true;

    try {
      await importDatabase(selectedFile.value);
    } catch (e) {
      alert("Ошибка при импорте базы");
    } finally {
      loading.value = false;
      alert(`Импорт завершён`);
    }
  };

  return {
    selectedFile,
    loading,
    importDb,
  };
}
