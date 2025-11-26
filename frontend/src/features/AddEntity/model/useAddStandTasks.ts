import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { api } from "@/shared/api/axiosInstance";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddStandTasks(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    const parentsStands = await getDataAsync({ endpoint: "stand_tasks/get" });

    const parentOptions =
      parentsStands &&
      parentsStands.data.map((item) => ({
        id: item.id,
        label: item.title,
      }));

    tableColumns.value = Object.keys(data).filter((item) => item !== "standId");

    for (const [key, value] of Object.entries(data)) {
      console.debug(key, value);
      if (value.options) {
        selectOptions[key] = value.options;
      }

      if (key === "parentId") {
        selectOptions[key] = parentOptions;
      }
    }
  };

  async function uploadImage(file: File, relatedItemId: number) {
    const data = new FormData();
    data.append("file", file);
    data.append("targetType", sectionName); // "organization_types" или "components"
    data.append("targetId", String(relatedItemId));

    return await api.post("/images/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async function loadStandTasks() {
    const data = { ...formData };
    const { photo, ...defaultData } = data;

    const res = await createEntityAsync(sectionName, {
      photo: photo?.name,
      ...defaultData,
    });

    const createdId = res.data.id; // ID созданного типа организации

    // 2. Если есть иконка, загружаем ее и привязываем к созданной организации
    if (formData.photo instanceof File) {
      await uploadImage(formData.photo, createdId);
    }
  }

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    // если нет выбранного parentId → делаем null
    if (!formData.parentId) {
      formData.parentId = null;
    }
    const data = { ...formData };
    const { photo, ...defaultData } = data;

    const standId = navigationStore.selectedRow?.data?.id;
    formData.standId = standId;

    const standTasksResponse = await createEntityAsync(sectionName, {
      photo: photo?.name,
      standId: standId,
      ...defaultData,
    });

    /**
     * Делаем запрет на создание записи в stand_tasks_components,
     * если не указываются componentId и componentOutCount в standTasks
     */
    if (formData.componentOutCount && formData.componentId) {
      await createEntityAsync("stand_tasks_components", {
        componentCount: formData.componentOutCount,
        standTaskId: standTasksResponse.data?.id,
        componentId: formData.componentId,
      });
    }

    if (formData.photo)
      await uploadImage(formData.photo, standTasksResponse.data?.id);

    onSuccess();
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
