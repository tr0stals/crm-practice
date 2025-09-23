import { getDataAsync } from "@/shared/api/getDataAsync";
import { onMounted, reactive, ref } from "vue";
import type { FieldMeta } from "../types/FieldMeta";
import { useToast } from "vue-toastification";
import { createEntityAsync } from "../api/createEntityAsync";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";

export function useAddShipments(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({
    shipments: {},
    stands: {},
  });
  const formFields = ref<FieldMeta[]>([]);
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const toast = useToast();

  const loadOrganizations = async (org: any) => {
    try {
      return await getDataAsync({ endpoint: `organizations/get/${org.id}` });
    } catch (e) {
      throw new Error(e);
    }
  };

  const fetchColumnsAndRelations = async () => {
    // сначала тянем основную таблицу Employees
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data);

    for (const [key, value] of Object.entries(data)) {
      if (
        key === "clientId" ||
        key === "transporterId" ||
        key === "factoryId" ||
        key === "supplierId"
      ) {
        const targetOptions = await Promise.all(
          value.options.map(async (opt: any) => {
            const response = await loadOrganizations(opt);
            return response.data;
          })
        );
        value.options = targetOptions.filter(
          (opt: any) => opt.organizationTypes?.title === fieldDictionary[key]
        );
      } else {
        selectOptions[key] = value.options;
      }

      formFields.value.push({
        name: key,
        type: value.options ? "select" : "input",
        options: value.options ?? [],
        section: sectionName,
      });
      console.debug(formFields.value);
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
