<template>
  <div class="tree-page">
    <h1>Компоненты</h1>
    <div class="toolbar">
      <button @click="handleAdd">+ Добавить</button>
      <button @click="handleEdit">✏️ Редактировать</button>
      <button @click="handleDelete">🗑️ Удалить</button>
      <button @click="handleRefresh">⟳ Обновить</button>
      <button @click="exportExcel">Выгрузить в Excel</button>
      <button @click="triggerImport">Импорт из Excel</button>
      <input
        ref="importInput"
        type="file"
        accept=".xlsx,.xls"
        style="display: none"
        @change="handleImportFile"
      />
      <input v-model="search" placeholder="Поиск" class="search-input" />
    </div>
    <Tree
      :value="filteredTreeData"
      selectionMode="single"
      class="custom-tree"
      v-model:selectionKeys="selectedKey"
      :pt="{
        root: { class: 'treeview__root' },
        nodeContent: { class: 'treeview__data' },
        node: ({ context }) => ({
          class: context.selected ? 'treeview__data__selected' : '',
        }),
      }"
      :pt-options="{ mergeProps: true }"
    >
      <template #default="slotProps">
        <template v-if="slotProps.node.isComponent">
          <div class="comp-card-wrap">
            <div class="comp-card">
              <div class="comp-title">{{ slotProps.node.label }}</div>
              <div class="comp-row">
                <span>Ширина:</span> {{ slotProps.node.width }}
              </div>
              <div class="comp-row">
                <span>Высота:</span> {{ slotProps.node.height }}
              </div>
              <div class="comp-row">
                <span>Толщина:</span> {{ slotProps.node.thickness }}
              </div>
              <div class="comp-row">
                <span>Вес:</span> {{ slotProps.node.weight }}
              </div>
              <div class="comp-row">
                <span>Материал:</span> {{ slotProps.node.material }}
              </div>
              <div class="comp-row">
                <span>Дата поступления:</span> {{ slotProps.node.receiptDate }}
              </div>
              <div class="comp-row">
                <span>Чертёж:</span> {{ slotProps.node.drawingReference }}
              </div>
              <div class="comp-row">
                <span>Фото:</span> {{ slotProps.node.photo }}
              </div>
              <div class="comp-row">
                <span>Размещение:</span> {{ slotProps.node.placementTitle }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <span class="tree-label">{{ slotProps.node.label }}</span>
        </template>
      </template>
    </Tree>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import { useRouter } from "vue-router";

const treeData = ref([]);
const search = ref("");
const selectedKey = ref(null);
const importInput = ref(null);
const router = useRouter();

onMounted(fetchComponents);

async function fetchComponents() {
  const { data } = await getDataAsync({ endpoint: "/components/get" });
  treeData.value = buildTree(data);
}

function buildTree(components) {
  const map = {};
  const roots = [];
  components.forEach((c) => {
    map[c.id] = {
      ...c,
      key: "comp-" + c.id,
      label: c.title,
      isComponent: true,
      placementTitle: c.placement?.title || "",
      children: [],
    };
  });
  components.forEach((c) => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
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
          node.material?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.drawingReference
            ?.toLowerCase()
            .includes(search.value.toLowerCase())
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedComponent() {
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isComponent) return node;
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
    sectionName: "components",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchComponents();
    },
  });
}
function handleEdit() {
  const comp = getSelectedComponent();
  if (!comp) return alert("Выберите компонент для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "components", data: comp },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchComponents();
    },
  });
}
function handleDelete() {
  const comp = getSelectedComponent();
  if (!comp) return alert("Выберите компонент для удаления");
  if (!confirm("Точно удалить компонент?")) return;
  deleteDataAsync(comp.id, "components").then(fetchComponents);
}
function handleRefresh() {
  fetchComponents();
}
function exportExcel() {
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isComponent) {
        flat.push({
          Название: node.label,
          Ширина: node.width,
          Высота: node.height,
          Толщина: node.thickness,
          Вес: node.weight,
          Материал: node.material,
          "Дата поступления": node.receiptDate,
          Чертёж: node.drawingReference,
          Фото: node.photo,
          Размещение: node.placementTitle,
        });
      }
      if (node.children) walk(node.children);
    }
  }
  walk(treeData.value);
  if (!flat.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Components");
  XLSX.writeFile(wb, "components.xlsx");
}
function triggerImport() {
  importInput.value && importInput.value.click();
}
async function handleImportFile(e) {
  // TODO: реализовать импорт
  alert("Импорт пока не реализован");
}
function goToComponent(id) {
  router.push(`/components/${id}`);
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.toolbar button {
  font-size: 18px;
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid #bbb;
  background: #f8f8fa;
  cursor: pointer;
  transition: background 0.2s;
  height: 44px;
  font-weight: 500;
}
.toolbar button:hover {
  background: #e6e6f0;
}
.search-input {
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 220px;
  height: 44px;
}
.tree-page {
  padding: 32px;
}
.tree-page h1 {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 18px;
}
.custom-tree .tree-label {
  font-weight: 600;
}
.comp-card-wrap {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
}
.comp-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 18px;
  margin: 0;
  width: 100%;
  box-shadow: none;
  transition: background 0.2s;
  display: block;
}
.comp-card:hover {
  background: #eef6ff;
}
.comp-title {
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 6px;
  color: #1976d2;
  word-break: break-word;
}
.comp-row {
  font-size: 15px;
  color: #333;
  margin-bottom: 2px;
  word-break: break-word;
}
.comp-row span {
  color: #888;
  min-width: 110px;
  display: inline-block;
}
</style>
