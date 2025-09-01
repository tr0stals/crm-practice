import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { onMounted, reactive, ref } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import type { FieldMeta } from "../types/FieldMeta";
import { useToast } from "vue-toastification";

export function useAddEmployees(sectionName: string, onSuccess: () => void) {
  const formData = reactive<any>({
    employees: {},
    peoples: {},
    professions: {},
  });
  const formFields = ref<FieldMeta[]>([]);
  const tableColumns = ref<string[]>([]);
  const selectOptions = reactive<Record<string, any[]>>({});
  const navigationStore = useNavigationStore();
  const toast = useToast();
  const relationTables = ["peoples", "employees_professions"];
  const relationColumns = reactive<Record<string, string[]>>({});
  const relationOptions = reactive<Record<string, any[]>>({});

  const fetchColumnsAndRelations = async () => {
    // сначала тянем основную таблицу Employees
    const data = await getDataAsync({
      endpoint: `database/getFormMetaData/${sectionName}`,
    }).then((res) => res.data);

    tableColumns.value = Object.keys(data).filter(
      (item) => item !== "peopleId"
    );

    for (const [key, value] of Object.entries(data)) {
      if (key !== "peopleId") {
        selectOptions[key] = value.options;
        formFields.value.push({
          name: key,
          type: value.options ? "select" : "input",
          options: value.options ?? [],
          section: sectionName,
        });
      }
    }

    // теперь пробегаем по relationTables
    const relDataPeoples = await getDataAsync({
      endpoint: `database/getFormMetaData/peoples`,
    }).then((res) => res.data);

    const relDataProfessions = await getDataAsync({
      endpoint: `database/getFormMetaData/employees_professions`,
    }).then((res) => res.data);

    for (const col of Object.keys(relDataPeoples)) {
      formFields.value.push({
        name: col,
        type: "input",
        section: "peoples",
      });
    }

    // Professions (селект)
    formFields.value.push({
      name: "professionId",
      type: "select",
      options: relDataProfessions.professionId?.options ?? [],
      section: "professions",
    });
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    try {
      const peopleData = {
        email: formData.peoples.email,
        firstName: formData.peoples.firstName,
        lastName: formData.peoples.lastName,
        middleName: formData.peoples.middleName,
        phone: formData.peoples.phone,
        birthDate: formData.birthDate,
      };
      const peopleResponse = await createEntityAsync("peoples", peopleData);

      console.debug(peopleResponse.data);
      const peopleId = peopleResponse.data?.id;
      console.debug(peopleId);

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
      console.debug(employeeResponse);

      const employeeId = employeeResponse.data?.id;
      const departmentId = navigationStore.selectedRow?.data?.id;

      const employeeDepartmentResponse = await createEntityAsync(
        "employee_departments",
        {
          employeeId: employeeId,
          departmentId: departmentId,
        }
      );

      const professionId = formData.professions?.professionId;

      const employeeProfessionResponse = await createEntityAsync(
        "employees_professions",
        {
          employeeId: employeeId,
          professionId: professionId,
        }
      );

      // console.debug(employeeDepartmentResponse);
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
