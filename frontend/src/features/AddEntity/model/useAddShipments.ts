import { getDataAsync } from "@/shared/api/getDataAsync";
import { onMounted, reactive, ref } from "vue";
import { useToast } from "vue-toastification";
import { createEntityAsync } from "../api/createEntityAsync";
import { fieldDictionary } from "@/shared/utils/fieldDictionary";
import { api } from "@/shared/api/axiosInstance";

export function useAddShipments(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});

  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const toast = useToast();

  /**
   * Подгрузка данных организации по id
   */
  const loadOrganizations = async (org: any) => {
    try {
      return await getDataAsync({ endpoint: `organizations/get/${org.id}` });
    } catch (e: any) {
      throw new Error(e);
    }
  };

  /**
   * Получаем метаданные формы и связи (select options)
   */
  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data);

    // обрабатываем поля с опциями (селекты)
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

        // фильтруем только нужный тип организации
        selectOptions[key] = targetOptions.filter(
          (opt: any) => opt.organizationTypes?.title === fieldDictionary[key]
        );
      } else if (value.options) {
        selectOptions[key] = value.options;
      }
    }

    // Добавляем список стендов (standId)
    const standsData = await getDataAsync({
      endpoint: `stands/get`,
    }).then((res) => res.data);

    console.debug(standsData);

    selectOptions["standId"] = standsData.map((item: any) => ({
      id: item.id,
      label: item.title,
    }));

    if (!tableColumns.value.includes("standId")) {
      tableColumns.value.push("standId");
    }
  };

  onMounted(fetchColumnsAndRelations);

  /**
   * Создание поставки + загрузка файлов
   */
  const submit = async () => {
    try {
      console.debug(formData);
      const {
        standId,
        addedDate,
        arrivalDate,
        shipmentDate,
        specificationImage,
        ...defaultData
      } = formData;

      const fileNames =
        specificationImage?.map((file: File) => file.name) ?? [];

      console.debug(fileNames);

      // создаём отгрузку
      const shipmentResponse = await createEntityAsync("shipments", {
        addedDate,
        arrivalDate,
        shipmentDate,
        specificationImage: fileNames,
        standId: standId,
        ...defaultData,
      });

      const shipmentId = shipmentResponse.data?.shipments?.id;

      // загружаем изображения, если есть
      if (specificationImage?.length && shipmentId) {
        for (const file of specificationImage) {
          const data = new FormData();
          data.append("file", file);
          data.append("targetType", sectionName);
          data.append("targetId", String(shipmentId));

          await api.post("/images/upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      onSuccess();
    } catch (e: any) {
      console.error("Ошибка при создании:", e);

      if (e.response?.data) {
        const { message } = e.response.data;
        if (Array.isArray(message))
          message.forEach((m: string) => toast.error(m));
        else toast.error(message || "Произошла ошибка при создании записи");
      } else {
        toast.error("Сервер недоступен или произошла неизвестная ошибка");
      }
    }
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
