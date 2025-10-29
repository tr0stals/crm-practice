import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { onMounted, reactive, ref } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";

export function useAddArrivalInvoices(
  sectionName: string,
  onSuccess: () => void
) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const orgTypeKeys = ["supplierId", "factoryId"];

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    const organizations = await getDataAsync({ endpoint: "organizations/get" });

    tableColumns.value = Object.keys(data);

    for (const [key, value] of Object.entries(data)) {
      if (value.options && !orgTypeKeys.includes(key)) {
        selectOptions[key] = value.options;
      } else if (orgTypeKeys.includes(key)) {
        const targetOrganizations = organizations.data?.filter((org) => {
          return value.options.map((opt) => opt.label === org.shortName);
        });
        console.debug(targetOrganizations);

        selectOptions[key] = targetOrganizations.filter((org) => {
          console.debug(org.organizationTypes?.title === fieldDictionary[key]);
          return org.organizationTypes?.title === fieldDictionary[key];
        });
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    const { scanPhoto, ...defaultData } = formData;

    await createEntityAsync(sectionName, {
      scanPhoto: scanPhoto,
      ...defaultData,
    });

    onSuccess();
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
