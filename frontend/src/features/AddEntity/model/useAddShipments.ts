import { getDataAsync } from "@/shared/api/getDataAsync";
import { onMounted, reactive, ref } from "vue";
import type { FieldMeta } from "../types/FieldMeta";
import { useToast } from "vue-toastification";
import { createEntityAsync } from "../api/createEntityAsync";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { api } from "@/shared/api/axiosInstance";

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

      if (key === "specificationImage") {
        formFields.value.push({
          name: key,
          type: "file",
          options: value.options ?? [],
          section: sectionName,
        });
      } else {
        formFields.value.push({
          name: key,
          type: value.options ? "select" : "input",
          options: value.options ?? [],
          section: sectionName,
        });
      }
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

      console.debug(formData);

      const fileNames = defaultData.specificationImage.map(
        (file: any) => file.name
      );

      const shipmentResponse = await createEntityAsync("shipments", {
        addedDate,
        arrivalDate,
        shipmentDate,
        specificationImage: fileNames,
        standId: stands.standId,
        ...defaultData.shipments,
      });

      defaultData.specificationImage.map(async (file) => {
        console.debug(shipmentResponse);
        const data = new FormData();
        data.append("file", file);
        data.append("targetType", sectionName); // "organization_types" или "components"
        data.append("targetId", String(shipmentResponse.data[0]?.id));

        return await api.post("/images/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

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
