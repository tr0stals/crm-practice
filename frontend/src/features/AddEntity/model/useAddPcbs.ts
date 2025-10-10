import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import useFetch from "@/shared/lib/useFetch";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddPcbs(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    const parentsPcbs = await getDataAsync({ endpoint: "pcbs/get" });

    const parentOptions =
      parentsPcbs &&
      parentsPcbs.data.map((item) => ({
        id: item.id,
        label: item.title,
      }));

    tableColumns.value = Object.keys(data);

    for (let [key, value] of Object.entries(data)) {
      if (value.options) {
        selectOptions[key] = value.options;
      }

      if (key === "parentId") {
        selectOptions[key] = parentOptions;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    // если нет выбранного parentId → делаем null
    if (!formData.parentId) {
      formData.parentId = null;
    }

    await createEntityAsync(sectionName, formData);
    onSuccess();
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
