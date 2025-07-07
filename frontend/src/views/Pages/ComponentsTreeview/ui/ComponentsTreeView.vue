<template>
  <Tree
    :value="filteredTreeData"
    v-model:expandedKeys="expandedKeys"
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
import { ref, computed, onMounted, watch } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import { useRouter } from "vue-router";
import "../style.scss";
import { isArray } from "element-plus/es/utils/types.mjs";

const treeData = ref<any[]>([]);
const selectedKey = ref(null);
const importInput = ref(null);
const router = useRouter();
const expandedKeys = ref({});

interface TreeNode {
  id: number;
  key: string;
  label: string;
  data?: any;
  children?: TreeNode[];
  leaf?: boolean;
  isProduct?: boolean; // Флаг для товаров
  level: any;
}

const getTreeviewData = (node: any, level = 0): TreeNode => {
  const treeNode: TreeNode = {
    id: node.id,
    key: `node-${node.id || Math.random().toString(36).substring(2, 9)}`,
    label: node.name || node.title,
    data: node,
    level,
  };

  if (node.children && node.children.length > 0) {
    treeNode.children = node.children.map((child: any) =>
      getTreeviewData(child, level + 1)
    );
  } else if (node.width || node.height || node.material) {
    treeNode.isProduct = true;
    treeNode.leaf = true;
  }

  return treeNode;
};

// Функция для построения всего дерева
const buildTreeview = (rootNode: any): TreeNode => {
  return getTreeviewData(rootNode);
};

onMounted(fetchComponents);

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
  search: string;
}>();

async function fetchComponents() {
  const { data } = await getDataAsync({ endpoint: "/components/tree" });
  // treeData.value = buildTree(data);
  const node = getTreeviewData(data);
  treeData.value = node.children || [];
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
  if (!props.search) return treeData.value;
  const filter = (nodes) =>
    nodes
      .map((node) => {
        if (node.children) {
          const children = filter(node.children);
          if (children.length) return { ...node, children };
        }
        if (
          node.label?.toLowerCase().includes(props.search.toLowerCase()) ||
          node.material?.toLowerCase().includes(props.search.toLowerCase()) ||
          node.drawingReference?.toLowerCase().includes(props.search.toLowerCase())
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
      node.label?.toLowerCase().includes(search.toLowerCase()) ||
      node.material?.toLowerCase().includes(search.toLowerCase()) ||
      node.drawingReference?.toLowerCase().includes(search.toLowerCase())
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
</script>
