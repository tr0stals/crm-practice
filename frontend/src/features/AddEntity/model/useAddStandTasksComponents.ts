import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { updateAsync } from "@/features/EditModalWindow/api/updateAsync";

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

  const findStandTask = async (standTaskId: number) => {
    const standTask = await getDataAsync({
      endpoint: `stand_tasks_components/byStandTask/get/${standTaskId}`,
    });

    return standTask.data;
  };

  const submit = async () => {
    const standTaskId = navigationStore.selectedRow?.data?.id;

    const standTaskComponents = await findStandTask(standTaskId);

    formData.standTaskId = standTaskId;

    if (standTaskComponents.length > 0) {
      standTaskComponents.forEach(async (item: any) => {
        // Если в задаче стенда есть компоненты задач и новый компонент совпадает с имеющимся
        if (item.component?.id === formData.componentId) {
          item.componentCount += Number(formData.componentCount);
          await updateAsync("stand_tasks_components", item);
        }
        // Если в задаче стенда есть компоненты задач и новый компонент не совпадает с имеющимся
        else {
          await createEntityAsync(sectionName, formData);
        }
      });
    }
    // Если в задаче нет компонентов - тогда добавляем новый без суммирования
    else {
      await createEntityAsync(sectionName, formData);
    }

    onSuccess();
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
