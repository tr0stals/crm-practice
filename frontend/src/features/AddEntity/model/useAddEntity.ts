import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddEntity(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    const { quantity, ...defaultData } = data;
    console.debug(quantity, data);

    tableColumns.value = Object.keys(defaultData);

    for (const [key, value] of Object.entries(defaultData)) {
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    if (!formData.parentId) {
      formData.parentId = 0;
    }

    const res = await createEntityAsync(sectionName, formData);
    console.debug(res);
    onSuccess();
    return res.data;
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
