<template>
  <Tree
    :value="treeData"
    selectionMode="single"
    class="treeview"
    v-model:selectionKeys="selectedKey"
    v-model:expandedKeys="expandedKeys"
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
        <div @click="props.handleSelectCallback(slotProps.node)">
          <div class="comp-cell">{{ slotProps.node.label }}</div>
        </div>
      </template>
      <template class="treeview__data" v-else>
        <span
          class="treeview__data__label"
          @click="props.handleSelectCallback(slotProps.node)"
        >
          {{ slotProps.node.label }}
        </span>
      </template>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, watch } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import "../style.scss";

const treeData = ref([]);
const search = ref("");
const selectedKey = ref(null);
const selectedOrganization = shallowRef(null);
const importInput = ref(null);
const expandedKeys = ref({});

onMounted(async () => {
  await fetchOrganizations();
});

async function fetchOrganizations() {
  const { data } = await getDataAsync({ endpoint: "/organizations/get" });
  treeData.value = groupOrganizations(data);
}

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
  search?: string;
}>();

function groupOrganizations(orgs) {
  // Группируем по типу организации
  const typeMap = {};
  orgs.forEach((org, level) => {
    const typeKey = org.organizationTypes?.title || "Без типа";
    if (!typeMap[typeKey]) typeMap[typeKey] = [];
    typeMap[typeKey].push({
      label: org.fullName,
      isOrganization: true,
      type: org.organizationTypes?.title || "Без типа",
      inn: org.inn,
      kpp: org.kpp,
      orgn: org.orgn,
      orgnDate: org.orgnDate,
      lawAddress: org.lawAddress,
      factAddress: org.factAddress,
      postAddress: org.postAddress,
      phone: org.phone,
      email: org.email,
      comment: org.comment,
      rating: org.rating,
      digitalDocs: org.digitalDocs,
      key: "org-" + org.id,
      id: org.id,
      raw: org,
    });
  });
  return Object.entries(typeMap).map(([type, orgs]) => ({
    label: type,
    key: type,
    children: orgs,
  }));
}

const filteredTreeData = computed(() => {
  const searchValue = props.search ?? search.value;
  if (!searchValue) return treeData.value;
  const filter = (nodes) =>
    nodes
      .map((node) => {
        let children = [];
        if (node.children) {
          children = filter(node.children);
        }
        const isMatch =
          node.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
          node.type?.toLowerCase().includes(searchValue.toLowerCase()) ||
          node.inn?.toLowerCase().includes(searchValue.toLowerCase()) ||
          node.phone?.toLowerCase().includes(searchValue.toLowerCase()) ||
          node.email?.toLowerCase().includes(searchValue.toLowerCase());
        if (isMatch || children.length) {
          return { ...node, ...(children.length ? { children } : {}) };
        }
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedOrganization() {
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isOrganization) return node;
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

function handleAdd() {
  ModalManager.getInstance().open(AddEntity, {
    sectionName: "organizations",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchOrganizations();
    },
  });
}
function handleEdit() {
  const org = getSelectedOrganization();
  if (!org) return alert("Выберите организацию для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "organizations", data: org.raw },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchOrganizations();
    },
  });
}
function handleDelete() {
  const org = getSelectedOrganization();
  if (!org) return alert("Выберите организацию для удаления");
  if (!confirm("Точно удалить организацию?")) return;
  deleteDataAsync(org.id, "organizations").then(fetchOrganizations);
}
function handleRefresh() {
  fetchOrganizations();
}
function exportExcel() {
  const flat = getFlatOrganizations();
  if (!flat.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Organizations");
  XLSX.writeFile(wb, "organizations.xlsx");
}
function getFlatOrganizations() {
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isOrganization) {
        flat.push({
          Название: node.label,
          Тип: node.type,
          ИНН: node.inn,
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
    // Преобразуем Excel в [{inn, ...}]
    const excelOrgs = excelRows
      .map((row) => ({
        inn: row["ИНН"] || row["inn"],
        fullName: row["Название"] || row["fullName"],
        type: row["Тип"] || row["type"],
        phone: row["Телефон"] || row["phone"],
        email: row["Email"] || row["email"],
        comment: row["Комментарий"] || row["comment"],
      }))
      .filter((e) => e.inn);
    // Получаем организации из CRM
    const { data: crmOrgs } = await getDataAsync({
      endpoint: "/organizations/get",
    });
    const crmMap = new Map(crmOrgs.map((e) => [e.inn, e]));
    const excelMap = new Map(excelOrgs.map((e) => [e.inn, e]));
    let added = 0,
      updated = 0,
      deleted = 0;
    // Добавить новых
    for (const [inn, excelOrg] of excelMap) {
      if (!crmMap.has(inn)) {
        await addOrganizationFromExcel(excelOrg);
        added++;
      }
    }
    // Обновить существующих
    for (const [inn, excelOrg] of excelMap) {
      if (crmMap.has(inn)) {
        await updateOrganizationFromExcel(crmMap.get(inn), excelOrg);
        updated++;
      }
    }
    // Удалить отсутствующих в Excel
    for (const [inn, crmOrg] of crmMap) {
      if (!excelMap.has(inn)) {
        await deleteDataAsync(crmOrg.id, "organizations");
        deleted++;
      }
    }
    alert(
      `Импорт завершён. Добавлено: ${added}, обновлено: ${updated}, удалено: ${deleted}`
    );
    fetchOrganizations();
    e.target.value = ""; // сброс input
  };
  reader.readAsArrayBuffer(file);
}

async function addOrganizationFromExcel(org) {
  await fetch("/api/organizations/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: org.fullName,
      inn: org.inn,
      phone: org.phone,
      email: org.email,
      comment: org.comment,
      organizationTypeTitle: org.type,
    }),
  });
}

async function updateOrganizationFromExcel(crmOrg, excelOrg) {
  await fetch(`/api/organizations/update/${crmOrg.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: excelOrg.fullName,
      inn: excelOrg.inn,
      phone: excelOrg.phone,
      email: excelOrg.email,
      comment: excelOrg.comment,
      organizationTypeTitle: excelOrg.type,
    }),
  });
}

function getExpandedKeysForSearch(nodes) {
  const searchValue = props.search ?? search.value;
  const expanded = {};
  function walk(node, parentKeys = []) {
    let match = false;
    if (node.children) {
      for (const child of node.children) {
        if (walk(child, [...parentKeys, node.key])) match = true;
      }
    }
    if (
      node.label?.toLowerCase().includes(searchValue.toLowerCase()) ||
      node.type?.toLowerCase().includes(searchValue.toLowerCase()) ||
      node.inn?.toLowerCase().includes(searchValue.toLowerCase()) ||
      node.phone?.toLowerCase().includes(searchValue.toLowerCase()) ||
      node.email?.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      match = true;
    }
    if (match) {
      for (const k of parentKeys) expanded[k] = true;
    }
    return match;
  }
  for (const node of nodes) walk(node);
  return expanded;
}

watch(
  () => props.search ?? search.value,
  (val) => {
    if (val) {
      expandedKeys.value = getExpandedKeysForSearch(filteredTreeData.value);
    } else {
      expandedKeys.value = {};
    }
  },
  { immediate: true }
);
</script>
