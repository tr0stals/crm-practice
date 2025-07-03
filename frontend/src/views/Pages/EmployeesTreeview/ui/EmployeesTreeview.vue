<template>
  <Tree
    :value="treeData"
    selectionMode="single"
    class="treeview"
    v-model:selectionKeys="selectedKey"
    :pt="{
      root: { class: 'treeview__root' },
      nodeContent: { class: 'treeview__data' },
      node: ({ context }) => ({
        class: context.selected ? 'treeview__data__selected' : '',
        style: { marginLeft: `${(context.node.level || 0) * 1}rem` },
      }),
    }"
    :pt-options="{ mergeProps: true }"
  >
    <template #default="slotProps">
      <template v-if="slotProps.node.isComponent">
        <div class="temp" @click="props.handleSelectCallback(slotProps.node)">
          <div class="comp-cell">{{ slotProps.node.label }}</div>
        </div>
      </template>
      <template class="treeview__data" v-else>
        <div
          class="treeview__data__label"
          @click="props.handleSelectCallback(slotProps.node)"
        >
          <span>{{ slotProps.node.label }}</span>
        </div>
      </template>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import "../style.scss";

const treeData = ref([]);
const search = ref("");
const selectedKey = ref(null);
const selectedEmployee = shallowRef(null);
const importInput = ref(null);
const organizations = ref([]);
const departments = ref([]);

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
}>();

onMounted(async () => {
  await fetchAll();
});

async function fetchAll() {
  const [emps, orgs, depts] = await Promise.all([
    getDataAsync({ endpoint: "/employees/get" }),
    getDataAsync({ endpoint: "/organizations/get" }),
    getDataAsync({ endpoint: "/departments/get" }),
  ]);
  organizations.value = orgs.data;
  departments.value = depts.data;
  treeData.value = groupEmployees(emps.data, orgs.data, depts.data);
}

function groupEmployees(employees, allOrganizations, allDepartments) {
  const tree = [];

  function createEmployeeNode(emp, level) {
    return {
      label: `${emp.peoples?.lastName || ""} ${emp.peoples?.firstName || ""} ${
        emp.peoples?.middleName || ""
      }`.trim(),
      isEmployee: true,
      profession: emp.profession?.title,
      comment: emp.peoples?.comment,
      phone: emp.peoples?.phone,
      email: emp.peoples?.email,
      birthDate: emp.birthDate,
      key: "emp-" + emp.id,
      id: emp.id,
      raw: emp,
      icon: "pi pi-user",
      level,
    };
  }

  function createDepartmentNode(dept, employees, level) {
    return {
      label: dept.title || "Без отдела",
      key: `dept-${dept.id || "none"}`,
      children: employees.map((emp) => createEmployeeNode(emp, level + 1)),
      isDepartment: true,
      icon: "pi pi-folder",
      level,
    };
  }

  function createOrganizationNode(org, level) {
    const orgNode = {
      label: org.fullName || "Без организации",
      key: `org-${org.id || "none"}`,
      children: [],
      id: org.id,
      isOrganization: true,
      selectable: false,
      icon: "pi pi-folder",
      level,
    };

    const orgDepartments = allDepartments.filter(
      (dept) => !dept.organizationId || dept.organizationId === org.id
    );

    if (orgDepartments.length) {
      orgDepartments.forEach((dept) => {
        const deptEmployees = employees.filter(
          (emp) =>
            Array.isArray(emp.employeeDepartments) &&
            emp.employeeDepartments.some((ed) => ed.departments?.id === dept.id)
        );
        if (deptEmployees.length > 0) {
          const deptNode = createDepartmentNode(dept, deptEmployees, level + 1);
          orgNode.children.push(deptNode);
        }
      });
    }

    // Сотрудники без отдела в этой организации
    const noDeptEmployees = employees.filter(
      (emp) =>
        (!emp.employeeDepartments || !emp.employeeDepartments.length) &&
        emp.organization?.id === org.id
    );
    if (noDeptEmployees.length > 0) {
      const noDeptNode = createDepartmentNode(
        { id: null, title: "Без отдела" },
        noDeptEmployees,
        level + 1
      );
      orgNode.children.push(noDeptNode);
    }

    return orgNode;
  }

  // Все организации
  allOrganizations.forEach((org) => {
    const orgNode = createOrganizationNode(org, 0);
    if (orgNode.children.length) {
      tree.push(orgNode);
    }
  });

  // Сотрудники без организации
  const noOrgEmployees = employees.filter((emp) => !emp.organization);
  if (noOrgEmployees.length > 0) {
    const noOrgNode = {
      label: "Без организации",
      key: "org-none",
      children: [
        createDepartmentNode(
          { id: null, title: "Без отдела" },
          noOrgEmployees,
          1
        ),
      ],
      isOrganization: true,
      selectable: false,
      icon: "pi pi-folder",
      level: 0,
    };
    tree.push(noOrgNode);
  }

  return tree;
}

const filteredTreeData = computed(() => {
  if (!search.value) return treeData.value;
  const filter = (nodes) =>
    nodes
      .map((node) => {
        if (node.children) {
          const children = filter(node.children);
          if (children.length) return { ...node, children };
        }
        if (
          node.label?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.profession?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.phone?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.email?.toLowerCase().includes(search.value.toLowerCase())
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedEmployee() {
  // selectedKey — объект с ключами выбранных узлов
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isEmployee) return node;
      if (node.children) {
        const res = find(node.children);
        if (res) return res;
      }
    }
    return null;
  }
  found = find(treeData.value);
  return found;
}

function getFlatEmployees() {
  // Собираем всех сотрудников в плоский массив для экспорта
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isEmployee) {
        flat.push({
          ФИО: node.label,
          "Дата рождения": node.birthDate,
          Должность: node.profession,
          Телефон: node.phone,
          Email: node.email,
          Комментарий: node.comment,
        });
      }
      if (node.children) walk(node.children);
    }
  }
  walk(treeData.value);
  return flat;
}

function triggerImport() {
  importInput.value && importInput.value.click();
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelRows = XLSX.utils.sheet_to_json(sheet);
    // Преобразуем Excel в [{email, ...}]
    const excelEmployees = excelRows
      .map((row) => ({
        email: row.Email || row.email,
        lastName: row["Фамилия"] || row["ФИО"]?.split(" ")[0] || "",
        firstName: row["Имя"] || row["ФИО"]?.split(" ")[1] || "",
        middleName: row["Отчество"] || row["ФИО"]?.split(" ")[2] || "",
        birthDate: row["Дата рождения"] || "",
        profession: row["Должность"] || "",
        phone: row["Телефон"] || "",
        comment: row["Комментарий"] || "",
      }))
      .filter((e) => e.email);
    // Получаем сотрудников из CRM
    const { data: crmEmployees } = await getDataAsync({
      endpoint: "/employees/get",
    });
    const crmMap = new Map(crmEmployees.map((e) => [e.peoples?.email, e]));
    const excelMap = new Map(excelEmployees.map((e) => [e.email, e]));
    let added = 0,
      updated = 0,
      deleted = 0;
    // Добавить новых
    for (const [email, excelEmp] of excelMap) {
      if (!crmMap.has(email)) {
        await addEmployeeFromExcel(excelEmp);
        added++;
      }
    }
    // Обновить существующих
    for (const [email, excelEmp] of excelMap) {
      if (crmMap.has(email)) {
        await updateEmployeeFromExcel(crmMap.get(email), excelEmp);
        updated++;
      }
    }
    // Удалить отсутствующих в Excel
    for (const [email, crmEmp] of crmMap) {
      if (!excelMap.has(email)) {
        await deleteDataAsync(crmEmp.id, "employees");
        deleted++;
      }
    }
    alert(
      `Импорт завершён. Добавлено: ${added}, обновлено: ${updated}, удалено: ${deleted}`
    );
    fetchAll();
    e.target.value = ""; // сброс input
  };
  reader.readAsArrayBuffer(file);
}

async function addEmployeeFromExcel(emp) {
  // Преобразуй под твой API, если нужно
  await fetch("/api/employees/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      peoples: {
        lastName: emp.lastName,
        firstName: emp.firstName,
        middleName: emp.middleName,
        phone: emp.phone,
        email: emp.email,
        comment: emp.comment,
      },
      birthDate: emp.birthDate,
      professionTitle: emp.profession,
    }),
  });
}

async function updateEmployeeFromExcel(crmEmp, excelEmp) {
  // Преобразуй под твой API, если нужно
  await fetch(`/api/employees/update/${crmEmp.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      peoples: {
        lastName: excelEmp.lastName,
        firstName: excelEmp.firstName,
        middleName: excelEmp.middleName,
        phone: excelEmp.phone,
        email: excelEmp.email,
        comment: excelEmp.comment,
      },
      birthDate: excelEmp.birthDate,
      professionTitle: excelEmp.profession,
    }),
  });
}
</script>
