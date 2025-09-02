import { getDataAsync } from "@/shared/api/getDataAsync";
import { onMounted, reactive, ref } from "vue";
import type { FieldMeta } from "../types/FieldMeta";
import { useToast } from "vue-toastification";
import { createEntityAsync } from "../api/createEntityAsync";

export function useAddShipments(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({
    shipments: {},
    stands: {},
  });
  const formFields = ref<FieldMeta[]>([]);
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const toast = useToast();

  const fetchColumnsAndRelations = async () => {
    // сначала тянем основную таблицу Employees
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data);

    for (const [key, value] of Object.entries(data)) {
      selectOptions[key] = value.options;
      formFields.value.push({
        name: key,
        type: value.options ? "select" : "input",
        options: value.options ?? [],
        section: sectionName,
      });
    }

    const standsData = await getDataAsync({
      endpoint: `stands/get`,
    }).then((res) => res.data);
    console.debug(standsData);

    // Stands (селект)
    formFields.value.push({
      name: "standId",
      type: "select",
      options: standsData.map((item: any) => ({
        id: item.id,
        label: item.title,
      })),
      section: "stands",
    });
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    try {
      const { stands, addedDate, arrivalDate, shipmentDate, ...defaultData } =
        formData;
      console.debug("shipmentData", defaultData);

      const shipmentResponse = await createEntityAsync("shipments", {
        addedDate,
        arrivalDate,
        shipmentDate,
        ...defaultData.shipments,
      });

      const shipmentStandsResponse = await createEntityAsync(
        "shipments_stands",
        {
          shipmentId: shipmentResponse.data?.id,
          standId: stands?.standId,
        }
      );

      console.debug(shipmentStandsResponse.data);

      onSuccess();
    } catch (e) {
      toast.error("Ошибка при добавлении сотрудника", { timeout: 3000 });
    }
  };

  return {
    formData,
    formFields,
    selectOptions,
    submit,
  };
}
