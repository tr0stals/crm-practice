import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { updateAsync } from "@/features/EditModalWindow/api/updateAsync";

/**
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddComponentPlacements(
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

    const { placementTypeId, ...defaultData } = data;

    tableColumns.value = Object.keys(defaultData).filter(
      (key) => key !== "placementTypeId"
    );

    for (const [key, value] of Object.entries(defaultData)) {
      if (key === "placementTypeId") continue;
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const findPlacementType = async (placementTypeId: number) => {
    const result = await getDataAsync({
      endpoint: `component_placement_types/byComponentPlacementType/${placementTypeId}`,
    });

    return result.data;
  };

  const submit = async () => {
    const placementTypeId = navigationStore.selectedRow?.data?.id;

    const componentPlacementType = await findPlacementType(placementTypeId);

    if (componentPlacementType) {
      formData.placementTypeId = componentPlacementType.id;

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
