import { ref } from "vue";
import { importTable as importTableRequest } from "../api/importTable";

export default function useImportTable(globalStore: any) {
  const selectedFile = ref<File | null>(null);
  const loading = ref(false);

  const importTable = async () => {
    if (!selectedFile.value) return;

    loading.value = true;

    try {
      const result = await importTableRequest(
        globalStore.currentSection,
        selectedFile.value
      );
      console.log("Импорт завершён:", result);
      alert(
        `Импорт завершён: добавлено ${result.imported}, ошибок: ${result.failed}`
      );
    } catch (e) {
      alert("Ошибка при импорте таблицы");
    } finally {
      loading.value = false;
    }
  };

  return {
    selectedFile,
    loading,
    importTable,
  };
}
