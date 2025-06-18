import { ref, reactive, onMounted } from "vue";
// import type { LicenseDTO } from "../types/license";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";

export function useAddEntity(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const relationsMap = ref<Record<string, string>>({});

  const fetchColumnsAndRelations = async () => {
    const columnsRes = await getDataAsync({
      endpoint: `database/${sectionName}/columns`,
    });
    tableColumns.value = columnsRes.data;

    const relationsRes = await getDataAsync({
      endpoint: `database/${sectionName}/relations`,
    });
    for (const rel of relationsRes.data) {
      relationsMap.value[rel.foreignKey] = rel.referencedColumn;
    }

    for (const column of tableColumns.value) {
      if (column !== "id") {
        formData[column] = "";

        if (column.endsWith("Id") && relationsMap.value[column]) {
          const relData = await getDataAsync({
            endpoint: `database/${relationsMap.value[column]}`,
          });
          selectOptions[column] = relData.data;
        }
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
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
