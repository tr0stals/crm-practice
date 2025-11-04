import { ref, reactive, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { useAuthorizedUserStore } from "@/entities/AuthorizedUserEntity/model/store";

/**
 * Добавление записей в сущности-таблицы (не тривью)
 * @param sectionName
 * @param onSuccess
 * @returns
 */
export function useAddOrderRequests(
  sectionName: string,
  onSuccess: () => void
) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const authorizedUser = useAuthorizedUserStore();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    console.debug(data);

    const { employeeCreatorId, ...defaultData } = data;

    tableColumns.value = Object.keys(defaultData);

    for (const [key, value] of Object.entries(defaultData)) {
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    if (!formData.parentId) {
      formData.parentId = 0;
    }

    formData.employeeCreatorId = authorizedUser.user?.employeeData?.id;

    const res = await createEntityAsync(sectionName, formData);

    onSuccess();
    return res.data;
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
