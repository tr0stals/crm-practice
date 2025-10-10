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

    /**
     * Убрал поле тип организации из модального окна.
     * Тип организации определяется по клику на организацию
     */
    const { organizationTypeId, ...defaultData } = data;

    tableColumns.value = Object.keys(defaultData);

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
    const nodeType = navigationStore.selectedRow?.data?.nodeType;
    let orgTypeId: number | null = null;

    /**
     * Определяем тип организации
     */
    switch (nodeType) {
      case "organization_types":
        orgTypeId = navigationStore.selectedRow?.data?.id;
        console.debug(formData);

        formData.organizationTypeId = orgTypeId;

        await createEntityAsync(sectionName, formData);
        break;

      case "organizations":
        const parentOrganizationId = navigationStore.selectedRow?.data?.id;
        const parentOrganization = await getDataAsync({
          endpoint: `organizations/get/${parentOrganizationId}`,
        });

        orgTypeId = parentOrganization.data.organizationTypes?.id;

        formData.organizationTypeId = orgTypeId;

        await createEntityAsync(sectionName, formData);
        break;
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
