import { ref, reactive, onMounted } from "vue";
// import type { LicenseDTO } from "../types/license";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { value } from "@primeuix/themes/aura/knob";

export function useAddEntity(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const relationsMap = ref<Record<string, string>>({});

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `${sectionName.replace(/_/g, "-")}/getDataForAdditional`,
    }).then((res) => res.data);
    console.debug(Object.keys(data));

    // console.debug(data.data);

    // // const columnsRes = await getDataAsync({
    // //   endpoint: `database/${sectionName}/columns`,
    // // });
    // // console.debug(columnsRes);
    // // tableColumns.value = columnsRes.data;

    // const relationsRes = await getDataAsync({
    //   endpoint: `database/${sectionName}/relations`,
    // });

    // const relationTables = relationsRes.data.map(async (item) => {
    //   return await getDataAsync({
    //     endpoint: `database/${item.propertyName}/relations`,
    //   });
    // });

    // console.debug(data.data);
    // console.debug(relationTables);
    // for (const rel of relationsRes.data) {
    //   console.debug(rel);
    //   relationsMap.value[rel.foreignKey] = rel.referencedColumn;
    //   console.debug(relationsMap.value);
    // }

    // for (const column of tableColumns.value) {
    //   if (column !== "id") {
    //     formData[column] = "";

    //     if (column.endsWith("Id") && relationsMap.value[column]) {
    //       const relData = await getDataAsync({
    //         endpoint: `database/${relationsMap.value[column]}`,
    //       });
    //       selectOptions[column] = relData.data;
    //       console.debug(selectOptions[column]);
    //     }
    //   }
    // }
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
