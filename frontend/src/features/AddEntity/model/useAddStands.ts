import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import useFetch from "@/shared/lib/useFetch";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddStands(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const standTypeId = ref();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);
    console.debug("!!!");

    const { standTypeId, ...defaultData } = data;

    const parentsStands = await getDataAsync({ endpoint: "stands/get" });

    const parentOptions =
      parentsStands &&
      parentsStands.data.map((item) => ({
        id: item.id,
        label: item.title,
      }));

    tableColumns.value = Object.keys(defaultData);

    for (let [key, value] of Object.entries(defaultData)) {
      if (value.options) {
        selectOptions[key] = value.options;
      }

      if (key === "parentId") {
        selectOptions[key] = parentOptions;
      }
    }
  };

  const getStandTypeId = async () => {
    const standType = navigationStore.selectedRow?.data;
    console.debug("debug!!!", standType);
    const standTypeId = ref<number>();

    switch (standType?.nodeType) {
      case "stands_types":
        standTypeId.value = standType.id;
        break;

      case "stands":
        const stand = await getDataAsync({
          endpoint: `stands/get/${standType.id}`,
        })
          .then((res) => res.data)
          .catch((e) => console.error(e));

        if (!stand) {
          throw new Error("Ошибка при поиске стенда => getStandTypeId()");
        }

        standTypeId.value = stand.standType?.id;
        break;
    }

    return standTypeId.value;
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    // если нет выбранного parentId → делаем null
    if (!formData.parentId) {
      formData.parentId = null;
    }

    const standTypeId = await getStandTypeId();

    formData.standTypeId = standTypeId;
    console.debug(formData);

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
