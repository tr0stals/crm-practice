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
          <span>{{ slotProps.node.deadline }}</span>
        </div>
      </template>
    </template>
  </Tree>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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
const importInput = ref(null);

onMounted(fetchDepartments);

async function fetchDepartments() {
  const { data } = await getDataAsync({ endpoint: "/departments/get" });
  treeData.value = buildTree(data);
}

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
}>();

function buildTree(departments) {
  return departments.map((dept) => ({
    label: dept.title,
    isDepartment: true,
    id: dept.id,
    key: "dept-" + dept.id,
  }));
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
          String(node.id).includes(search.value)
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedDepartment() {
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isDepartment) return node;
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
    sectionName: "departments",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchDepartments();
    },
  });
}
function handleEdit() {
  const dept = getSelectedDepartment();
  if (!dept) return alert("Выберите отдел для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "departments", data: dept },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchDepartments();
    },
  });
}
function handleDelete() {
  const dept = getSelectedDepartment();
  if (!dept) return alert("Выберите отдел для удаления");
  if (!confirm("Точно удалить отдел?")) return;
  deleteDataAsync(dept.id, "departments").then(fetchDepartments);
}
function handleRefresh() {
  fetchDepartments();
}
function exportExcel() {
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isDepartment) {
        flat.push({
          Название: node.label,
          ID: node.id,
        });
      }
      if (node.children) walk(node.children);
    }
  }
  walk(treeData.value);
  if (!flat.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Departments");
  XLSX.writeFile(wb, "departments.xlsx");
}
function triggerImport() {
  importInput.value && importInput.value.click();
}
async function handleImportFile(e) {
  // TODO: реализовать импорт
  alert("Импорт пока не реализован");
}
</script>
