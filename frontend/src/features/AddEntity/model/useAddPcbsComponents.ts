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
export function useAddPcbsComponents(
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

    const { pcbId, ...defaultData } = data;

    tableColumns.value = Object.keys(defaultData).filter(
      (key) => key !== "standTaskId"
    );

    for (const [key, value] of Object.entries(defaultData)) {
      if (key === "standTaskId") continue;
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const findPcbComponents = async (pcbsId: number) => {
    const standTask = await getDataAsync({
      endpoint: `pcbs_components/byPcbs/get/${pcbsId}`,
    });

    return standTask.data;
  };

  const submit = async () => {
    console.debug("!!!!", navigationStore.selectedRow);
    const pcbId = navigationStore.selectedRow?.data?.id;
    console.debug(pcbId);

    const pcbsComponents = await findPcbComponents(
      pcbId ? pcbId : formData.pcbId
    );

    // Найдём существующий компонент (если есть)
    const existingComponent = pcbsComponents.find(
      (item: any) => item.component?.id === formData.componentId
    );

    if (existingComponent) {
      existingComponent.componentCount += Number(formData.componentCount);
      await updateAsync("pcbs_components", existingComponent);
    } else {
      await createEntityAsync(sectionName, {
        pcbId: pcbId,
        ...formData,
      });
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
