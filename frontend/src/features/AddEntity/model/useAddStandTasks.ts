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
export function useAddStandTasks(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    const parentsStands = await getDataAsync({ endpoint: "stand_tasks/get" });

    const parentOptions =
      parentsStands &&
      parentsStands.data.map((item) => ({
        id: item.id,
        label: item.title,
      }));

    tableColumns.value = Object.keys(data).filter((item) => item !== "standId");

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

    const standId = navigationStore.selectedRow?.data?.id;

    formData.standId = standId;

    const standTasksResponse = await createEntityAsync(sectionName, formData);
    const standTasksComponentsResponse = await createEntityAsync(
      "stand_tasks_components",
      {
        componentCount: formData.componentOutCount,
        standTaskId: standTasksResponse.data?.id,
        componentId: formData?.id,
      }
    );
    console.debug(standTasksComponentsResponse.data);
    onSuccess();
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
