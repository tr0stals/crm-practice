import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { onMounted, reactive, ref } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useToast } from "vue-toastification";

export function useAddEmployees(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({});

  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();
  const toast = useToast();

  const fetchColumnsAndRelations = async () => {
    // Получаем основную таблицу Employees
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data).filter(
      (item) => item !== "peopleId"
    );

    // Добавляем опции для полей
    for (const [key, value] of Object.entries(data)) {
      if (key !== "peopleId" && value.options) {
        selectOptions[key] = value.options;
      }
    }

    // Добавляем поля из peoples
    const relDataPeoples = await getDataAsync({
      endpoint: `database/getFormMetaData/peoples`,
    }).then((res) => res.data);

    for (const col of Object.keys(relDataPeoples)) {
      if (!tableColumns.value.includes(col)) {
        tableColumns.value.push(col);
      }
    }

    // Добавляем professionId
    const relDataProfessions = await getDataAsync({
      endpoint: `database/getFormMetaData/employees_professions`,
    }).then((res) => res.data);

    if (!tableColumns.value.includes("professionId")) {
      tableColumns.value.push("professionId");
    }

    // Добавляем опции для professionId
    if (relDataProfessions.professionId?.options) {
      selectOptions["professionId"] = relDataProfessions.professionId.options;
    }
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    try {
      const peopleData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        phone: formData.phone,
        birthDate: formData.birthDate,
      };
      const peopleResponse = await createEntityAsync("peoples", peopleData);

      const peopleId = peopleResponse.data?.id;

      if (!peopleId) throw new Error("Не удалось найти человека");
      const employeeData = {
        hiringDate: formData.hiringDate,
        dismissalDate: formData.dismissalDate,
        peopleId: peopleId,
      };

      const employeeResponse = await createEntityAsync(
        "employees",
        employeeData
      );

      const employeeId = employeeResponse.data?.id;
      const departmentId = navigationStore.selectedRow?.data?.id;

      const employeeDepartmentResponse = await createEntityAsync(
        "employee_departments",
        {
          employeeId: employeeId,
          departmentId: departmentId,
        }
      );

      const professionId = formData.professionId;

      const employeeProfessionResponse = await createEntityAsync(
        "employees_professions",
        {
          employeeId: employeeId,
          professionId: professionId,
        }
      );

      onSuccess();
    } catch (e) {
      toast.error("Ошибка при добавлении сотрудника", { timeout: 3000 });
    }
  };

  return {
    formData,
    tableColumns,
    selectOptions,
    submit,
  };
}
