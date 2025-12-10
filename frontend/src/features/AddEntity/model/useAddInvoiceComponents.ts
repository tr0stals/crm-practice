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
export function useAddInvoiceComponents(
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

    const { arrivalInvoiceId, ...defaultData } = data;

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

  const findInvoiceComponents = async (invoiceId: number) => {
    const result = await getDataAsync({
      endpoint: `invoices_components/byInvoice/get/${invoiceId}`,
    });

    return result.data;
  };

  const submit = async () => {
    const invoiceId = navigationStore.selectedRow?.data?.id;

    const invoiceComponents = await findInvoiceComponents(
      invoiceId ? invoiceId : formData.arrivalInvoiceId
    );

    // Найдём существующий компонент (если есть)
    const existingComponent = invoiceComponents.find(
      (item: any) => item.components?.id === formData.componentId
    );

    if (existingComponent) {
      existingComponent.componentCount += Number(formData.componentCount);
      await updateAsync("invoices_components", existingComponent);
    } else {
      await createEntityAsync(sectionName, {
        arrivalInvoiceId: invoiceId,
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
