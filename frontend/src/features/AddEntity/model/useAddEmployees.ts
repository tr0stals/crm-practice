import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { onMounted, reactive, ref } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

export function useAddEmployees(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();

  const fetchColumnsAndRelations = async () => {
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data);

    for (const [key, value] of Object.entries(data)) {
      console.debug(value);
      if (value.options) {
        selectOptions[key] = value.options;
      }
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    const response = await createEntityAsync(sectionName, formData);

    const employeeId = response.data?.id;
    const departmentId = navigationStore.selectedRow?.data?.id;

    const employeeDepartmentResponse = await createEntityAsync(
      "employee_departments",
      {
        employeeId: employeeId,
        departmentId: departmentId,
      }
    );

    console.debug(employeeDepartmentResponse);
    onSuccess();
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
