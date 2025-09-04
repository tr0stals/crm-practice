import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddStandTasksComponents(
  sectionName: string,
  onSuccess: () => void
) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data).filter(
      (key) => key !== "standTaskId"
    );

    for (const [key, value] of Object.entries(data)) {
      if (key === "standTaskId") continue;
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    const standTaskId = navigationStore.selectedRow?.data?.id;
    console.debug(standTaskId);
    // если нет выбранного parentId → делаем null (или 0)
    if (!formData.parentId) {
      formData.parentId = 0; // или 0, если у тебя в БД так заведено
    }

    formData.standTaskId = standTaskId;

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
