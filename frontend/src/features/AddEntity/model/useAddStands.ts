import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddStands(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    const parentsStands = await getDataAsync({ endpoint: "stands/get" });

    const parentOptions =
      parentsStands &&
      parentsStands.data.map((item) => ({
        id: item.id,
        label: item.title,
      }));

    tableColumns.value = Object.keys(data);

    for (const [key, value] of Object.entries(data)) {
      console.debug(key, value);
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
