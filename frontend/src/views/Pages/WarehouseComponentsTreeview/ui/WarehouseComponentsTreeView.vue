<template>
  <div class="warehouse-layout">
    <div class="warehouse-left">
      <div class="treeview-container">
        <Tree
          :value="filteredTreeData"
          v-model:expandedKeys="expandedKeys"
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
                  <div class="comp-title">{{ slotProps.node.title }}</div>
                  <div class="comp-row">
                    <span>Кол-во:</span> {{ getTotalCount(slotProps.node) }}
                    <button @click.stop="() => openDetailModal(slotProps.node)" style="margin-left:8px;">👁️</button>
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
      <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
        <div class="modal-content">
          <h3>Детализация по компоненту: {{ detailComponent?.title }}</h3>
          <div class="modal-desc">Тут будет попап с инвентаризациями, приходами, расходами и переходом в накладные/расходы</div>
          <button class="modal-close" @click="showDetailModal = false">Закрыть</button>
        </div>
      </div>
    </div>
    <div class="warehouse-right">
      <transition name="slide-fade">
        <form class="warehouse-form" v-if="selectedComponent">
          <div class="form-row">
            <label>Минимальный запас</label>
            <input type="text" v-model="selectedComponent.minCount" disabled />
          </div>
          <div class="form-row">
            <label>Количество</label>
            <input type="text" v-model="selectedComponent.count" disabled />
          </div>
          <div class="form-row">
            <label>Дата последней инвентаризации</label>
            <input type="text" v-model="selectedComponent.lastInventoryDate" disabled />
          </div>
          <div class="form-row">
            <label>Размеры</label>
            <input type="text" v-model="selectedComponent.size" disabled />
          </div>
          <div class="form-row">
            <label>Масса</label>
            <input type="text" v-model="selectedComponent.weight" disabled />
          </div>
          <div class="form-row">
            <label>Материал</label>
            <input type="text" v-model="selectedComponent.material" disabled />
          </div>
          <div class="form-row">
            <label>Место хранения</label>
            <input type="text" v-model="selectedComponent.storagePlace" disabled />
          </div>
          <div class="form-row">
            <label>Внешний вид</label>
            <div class="appearance-img-wrap">
              <img v-if="selectedComponent.photo" :src="selectedComponent.photo" alt="Внешний вид" class="appearance-img" />
              <span v-else>Нет изображения</span>
            </div>
          </div>
        </form>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import "../style.scss";

const props = defineProps({
  handleSelectCallback: {
    type: Function,
    required: true,
  },
  search: {
    type: String,
    required: true,
  },
});

const treeData = ref([]);
const selectedKey = ref(null);
const importInput = ref(null);
const expandedKeys = ref({});
const showDetailModal = ref(false);
const detailComponent = ref(null);

onMounted(fetchData);

async function fetchData() {
  const { data } = await getDataAsync({
    endpoint: "/warehouse-components/get",
  });
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
      factoryId: c.organizations?.id || "",
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
  if (!props.search) return treeData.value;
  const filter = (nodes) =>
    nodes
      .map((node) => {
        if (node.children) {
          const children = filter(node.children);
          if (children.length) return { ...node, children };
        }
        if (
          node.title?.toLowerCase().includes(props.search.toLowerCase()) ||
          node.material?.toLowerCase().includes(props.search.toLowerCase()) ||
          node.size?.toLowerCase().includes(props.search.toLowerCase())
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

const selectedComponent = computed(() => {
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
});

function handleAdd() {
  ModalManager.getInstance().open(AddEntity, {
    sectionName: "warehouse_components",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchData();
    },
  });
}
function handleEdit() {
  const comp = selectedComponent.value;
  if (!comp) return alert("Выберите компонент для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "warehouse_components", data: comp },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchData();
    },
  });
}
function handleDelete() {
  const comp = selectedComponent.value;
  if (!comp) return alert("Выберите компонент для удаления");
  if (!confirm("Точно удалить компонент?")) return;
  deleteDataAsync(comp.id, "warehouse_components").then(fetchData);
}
function handleRefresh() {
  fetchData();
}
function triggerImport() {
  importInput.value && importInput.value.click();
}
async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const dataArr = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(dataArr, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const imported = XLSX.utils.sheet_to_json(sheet);
    // Импорт по id или title, реализуй свою логику сравнения и обновления
    alert("Импорт реализуй по аналогии с другими страницами");
    fetchData();
  };
  reader.readAsArrayBuffer(file);
}

function getExpandedKeysForSearch(nodes, search) {
  const expanded = {};
  function walk(node, parentKeys = []) {
    let match = false;
    if (node.children) {
      for (const child of node.children) {
        if (walk(child, [...parentKeys, node.key])) match = true;
      }
    }
    if (
      node.title?.toLowerCase().includes(search.toLowerCase()) ||
      node.material?.toLowerCase().includes(search.toLowerCase()) ||
      node.size?.toLowerCase().includes(search.toLowerCase())
    ) {
      match = true;
    }
    if (match) {
      for (const k of parentKeys) expanded[k] = true;
    }
    return match;
  }
  for (const node of treeData.value) walk(node);
  return expanded;
}

watch(
  () => props.search,
  (val) => {
    if (val) {
      expandedKeys.value = getExpandedKeysForSearch(treeData.value, val);
    } else {
      expandedKeys.value = {};
    }
  },
  { immediate: true }
);

function getTotalCount(node) {
  let sum = Number(node.count) || 0;
  if (node.children && node.children.length) {
    for (const child of node.children) {
      sum += getTotalCount(child);
    }
  }
  return sum;
}

function openDetailModal(node) {
  detailComponent.value = node;
  showDetailModal.value = true;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 32px 24px;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  position: relative;
}
.modal-close {
  margin-top: 24px;
  padding: 8px 20px;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-content h3 {
  font-size: 2.4rem;
  margin-bottom: 18px;
}
.modal-content .modal-desc {
  font-size: 1.8rem;
  margin-bottom: 18px;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.35s cubic-bezier(.4,2,.6,1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.warehouse-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: unset;
  margin-bottom: 0;
  padding-bottom: 0;
}
.warehouse-left {
  flex: 1 1 0;
  min-width: 320px;
}
.warehouse-right {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 32px;
  justify-content: flex-start;
}
.warehouse-form {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 24px 20px 12px 20px;
  margin-top: 0;
  margin-bottom: 0;
}
.appearance-img-wrap {
  width: 100%;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 8px 0 8px 8px;
}
.appearance-img {
  max-width: 180px;
  max-height: 120px;
  border-radius: 4px;
  object-fit: contain;
  background: #fff;
  border: 1px solid #eee;
}
.pagination, .filter-panel, .table-pagination, .table-filter {
  display: none !important;
}
</style>
