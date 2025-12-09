import { getDataAsync } from "@/shared/api/getDataAsync";
import { createEntityAsync } from "../api/createEntityAsync";
import { onMounted, reactive, ref, watch, type Ref } from "vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import { useToast } from "vue-toastification";

export function useAddEmployees(
  sectionName: string,
  onSuccess: () => void,
  addNewPeople: Ref<boolean>
) {
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

    const {} = data;

    tableColumns.value = Object.keys(data);

    // Добавляем опции для полей
    for (const [key, value] of Object.entries(data) as any) {
      if (value.options) {
        selectOptions[key] = value.options;
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

    // Добавляем поля из peoples
    // Если addNewPeople = true, тогда добавляем поля из Peoples
    watch(addNewPeople, async (newValue) => {
      if (newValue) {
        const relDataPeoples = await getDataAsync({
          endpoint: `database/getFormMetaData/peoples`,
        }).then((res) => res.data);

        tableColumns.value = tableColumns.value.filter(
          (item) => item !== "peopleId"
        );

        for (const col of Object.keys(relDataPeoples)) {
          if (!tableColumns.value.includes(col)) {
            tableColumns.value.push(col);
          }
        }
      } else {
        tableColumns.value = Object.keys(data);

        if (!tableColumns.value.includes("professionId")) {
          tableColumns.value.push("professionId");
        }

        // Добавляем опции для professionId
        if (relDataProfessions.professionId?.options) {
          selectOptions["professionId"] =
            relDataProfessions.professionId.options;
        }
      }
    });
  };

  onMounted(fetchColumnsAndRelations);

  const submit = async () => {
    try {
      let peopleId: number | null = null;

      if (addNewPeople.value) {
        const peopleData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          phone: formData.phone,
          birthDate: formData.birthDate,
        };
        const peopleResponse = await createEntityAsync("peoples", peopleData);

        peopleId = peopleResponse.data?.id;
      } else {
        peopleId = formData.peopleId;
      }

      /**
       * Делаем поиск Employee по peopleId.
       * Если есть - не создаем нового Employee, а используем указываем его id в employeeProfessions
       * Если нет - создаем нового Employee
       */

      const targetEmployee = await getDataAsync({
        endpoint: `employees/getByPeople/${peopleId}`,
      });

      if (!peopleId) throw new Error("Не удалось найти человека");
      const employeeData = targetEmployee.data
        ? { ...targetEmployee.data }
        : {
            hiringDate: formData.hiringDate,
            dismissalDate: formData.dismissalDate,
            peopleId: peopleId,
          };

      const employeeResponse = targetEmployee.data
        ? targetEmployee
        : await createEntityAsync("employees", employeeData);

      const employeeId = employeeResponse.data?.id;
      const departmentId = navigationStore.selectedRow?.data?.id;

      /**
       * Если в выбранном отделе уже есть такой employeeId, тогда мы не добавляем новую запись в employee_departments.
       * Если нет - тогда добавляем в employee_departments
       */

      const targetEmployeeDepartments = await getDataAsync({
        endpoint: `employee_departments/getByDepartmentId/${departmentId}`,
      });

      if (
        !targetEmployeeDepartments.data.some(
          (item: any) => item.employees?.id === employeeId
        )
      ) {
        await createEntityAsync("employee_departments", {
          employeeId: employeeId,
          departmentId: departmentId,
        });
      }

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
