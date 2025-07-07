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
          :data-js-data="JSON.stringify(slotProps.node.id)"
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
import { useRouter } from "vue-router";
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
const router = useRouter();

onMounted(fetchTasks);

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
}>();

async function fetchTasks() {
  const { data } = await getDataAsync({ endpoint: "/current_tasks/get" });
  treeData.value = buildTree(data);
}

function buildTree(tasks) {
  // Группируем по статусу задачи
  const stateMap = {};
  tasks.forEach((t) => {
    const state = t.currentTaskStates?.title || "Без статуса";
    if (!stateMap[state]) stateMap[state] = [];
    stateMap[state].push(t);
  });
  return Object.entries(stateMap).map(([state, tasks]) => ({
    label: state,
    key: state,
    children: tasks.map((task) => ({
      label: task.title,
      isTask: true,
      deadline: task.deadline,
      employeeName: task.employees?.peoples
        ? `${task.employees.peoples.lastName} ${task.employees.peoples.firstName}`
        : "",
      stateTitle: task.currentTaskStates?.title,
      shipmentStandTitle: task.shipmentsStands?.id
        ? `ID ${task.shipmentsStands.id}`
        : "",
      standTaskTitle: task.standTasks?.title,
      key: "task-" + task.id,
      id: task.id,
      raw: task,
    })),
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
          node.employeeName
            ?.toLowerCase()
            .includes(search.value.toLowerCase()) ||
          node.stateTitle?.toLowerCase().includes(search.value.toLowerCase())
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedTask() {
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isTask) return node;
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
    sectionName: "current_tasks",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchTasks();
    },
  });
}
function handleEdit() {
  const task = getSelectedTask();
  if (!task) return alert("Выберите задачу для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "current_tasks", data: task.raw },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchTasks();
    },
  });
}
function handleDelete() {
  const task = getSelectedTask();
  if (!task) return alert("Выберите задачу для удаления");
  if (!confirm("Точно удалить задачу?")) return;
  deleteDataAsync(task.id, "current_tasks").then(fetchTasks);
}
function handleRefresh() {
  fetchTasks();
}
function exportExcel() {
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isTask) {
        flat.push({
          Название: node.label,
          Дедлайн: node.deadline,
          Сотрудник: node.employeeName,
          Статус: node.stateTitle,
          "Отгрузка-Стенд": node.shipmentStandTitle,
          "Задача стенда": node.standTaskTitle,
        });
      }
      if (node.children) walk(node.children);
    }
  }
  walk(treeData.value);
  if (!flat.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "CurrentTasks");
  XLSX.writeFile(wb, "current_tasks.xlsx");
}
function triggerImport() {
  importInput.value && importInput.value.click();
}
async function handleImportFile(e) {
  // TODO: реализовать импорт
  alert("Импорт пока не реализован");
}
function goToTask(id) {
  router.push(`/current_tasks/${id}`);
}
</script>
