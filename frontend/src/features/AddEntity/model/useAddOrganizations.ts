import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { onMounted, reactive, ref } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

export function useAddOrganizations(
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

    tableColumns.value = Object.keys(data);

    if (tableColumns.value.includes("parentId")) {
      tableColumns.value = [
        "parentId",
        ...tableColumns.value.filter((col) => col !== "parentId"),
      ];
    }

    for (const [key, value] of Object.entries(data)) {
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    console.debug(formData);
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
