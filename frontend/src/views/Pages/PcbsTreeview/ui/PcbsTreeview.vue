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
        <div @click="props.handleSelectCallback(slotProps.node)">
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
import { ref, computed, onMounted } from "vue";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import "../style.scss";
import type { TreeNode } from "primevue/treenode";

const treeData = ref([]);
const search = ref("");
const selectedKey = ref(null);
const importInput = ref(null);

onMounted(fetchData);

async function fetchData() {
  const { data } = await getDataAsync({ endpoint: "/pcbs/tree" });
  const node = getTreeviewData(data);
  treeData.value = node.children || [];
}

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
}>();

const getTreeviewData = (node: any, level = 0): TreeNode => {
  console.debug(node);
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

function groupOrders(orders) {
  return [
    {
      label: "Все заказы",
      key: "all-orders",
      children: orders.map((order) => ({
        ...order,
        label: `Заказ №${order.billNumber}`,
        isOrder: true,
        key: "order-" + order.id,
        raw: order,
      })),
    },
  ];
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
          node.billNumber?.toString().includes(search.value) ||
          node.article?.toLowerCase().includes(search.value.toLowerCase())
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedOrder() {
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isOrder) return node;
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
    sectionName: "pcb_orders",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchData();
    },
  });
}
function handleEdit() {
  const order = getSelectedOrder();
  if (!order) return alert("Выберите заказ для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "pcb_orders", data: order.raw },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchData();
    },
  });
}
function handleDelete() {
  const order = getSelectedOrder();
  if (!order) return alert("Выберите заказ для удаления");
  if (!confirm("Точно удалить заказ?")) return;
  deleteDataAsync(order.id, "pcb_orders").then(fetchData);
}
function handleRefresh() {
  fetchData();
}
function exportExcel() {
  const flat = getFlatOrders();
  if (!flat.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "PcbOrders");
  XLSX.writeFile(wb, "pcb_orders.xlsx");
}
function getFlatOrders() {
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isOrder) {
        flat.push({
          ID: node.id,
          "Номер заказа": node.billNumber,
          Количество: node.count,
          Размер: node.size,
          Толщина: node.thickness,
          Артикул: node.article,
          Цена: node.price,
          "PCB ID": node.pcbId,
          Производитель: node.pcbManufacturerId,
          Завод: node.factoryId,
          "Тип заказа": node.orderTypeId,
          Сотрудник: node.employeeId,
          Статус: node.pcbOrderStatusId,
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
    const dataArr = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(dataArr, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const imported = XLSX.utils.sheet_to_json(sheet);
    // Импорт по billNumber или id, реализуй свою логику сравнения и обновления
    alert("Импорт реализуй по аналогии с другими страницами");
    fetchData();
  };
  reader.readAsArrayBuffer(file);
}
</script>
