<template>
  <div class="tree-page">
    <h1>Заказы печатных плат</h1>
    <div class="toolbar">
      <button @click="handleAdd">+ Добавить</button>
      <button @click="handleEdit">✏️ Редактировать</button>
      <button @click="handleDelete">🗑️ Удалить</button>
      <button @click="handleRefresh">⟳ Обновить</button>
      <button @click="exportExcel">Выгрузить в Excel</button>
      <button @click="triggerImport">Импорт из Excel</button>
      <input ref="importInput" type="file" accept=".xlsx,.xls" style="display:none" @change="handleImportFile" />
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
        <template v-if="slotProps.node.isOrder">
          <div class="pcb-card-wrap">
            <div class="pcb-card">
              <div class="pcb-title">Заказ №{{ slotProps.node.billNumber }}</div>
              <div class="pcb-row"><span>Количество:</span> {{ slotProps.node.count }}</div>
              <div class="pcb-row"><span>Размер:</span> {{ slotProps.node.size }}</div>
              <div class="pcb-row"><span>Толщина:</span> {{ slotProps.node.thickness }}</div>
              <div class="pcb-row"><span>Артикул:</span> {{ slotProps.node.article }}</div>
              <div class="pcb-row"><span>Цена:</span> {{ slotProps.node.price }}</div>
              <div class="pcb-row"><span>PCB ID:</span> {{ slotProps.node.pcbId }}</div>
              <div class="pcb-row"><span>Производитель:</span> {{ slotProps.node.pcbManufacturerId }}</div>
              <div class="pcb-row"><span>Завод:</span> {{ slotProps.node.factoryId }}</div>
              <div class="pcb-row"><span>Тип заказа:</span> {{ slotProps.node.orderTypeId }}</div>
              <div class="pcb-row"><span>Сотрудник:</span> {{ slotProps.node.employeeId }}</div>
              <div class="pcb-row"><span>Статус:</span> {{ slotProps.node.pcbOrderStatusId }}</div>
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
import { ref, computed, onMounted } from 'vue'
import Tree from 'primevue/tree'
import AddEntity from '@/features/AddEntity/ui/AddEntityModal.vue'
import EditModalWindow from '@/features/EditModalWindow/ui/EditModalWindow.vue'
import { ModalManager } from '@/shared/plugins/modalManager'
import { getDataAsync } from '@/shared/api/getDataAsync'
import { deleteDataAsync } from '@/views/Dashboard/api/deleteDataAsync'
import * as XLSX from 'xlsx'

const treeData = ref([])
const search = ref('')
const selectedKey = ref(null)
const importInput = ref(null)

onMounted(fetchData)

async function fetchData() {
  const { data } = await getDataAsync({ endpoint: '/pcb-orders/get' })
  treeData.value = groupOrders(data)
}

function groupOrders(orders) {
  return [
    {
      label: 'Все заказы',
      key: 'all-orders',
      children: orders.map(order => ({
        ...order,
        label: `Заказ №${order.billNumber}`,
        isOrder: true,
        key: 'order-' + order.id,
        raw: order
      }))
    }
  ]
}

const filteredTreeData = computed(() => {
  if (!search.value) return treeData.value
  const filter = (nodes) => nodes
    .map(node => {
      if (node.children) {
        const children = filter(node.children)
        if (children.length) return { ...node, children }
      }
      if (
        node.billNumber?.toString().includes(search.value) ||
        node.article?.toLowerCase().includes(search.value.toLowerCase())
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedOrder() {
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isOrder) return node
      if (node.children) {
        const res = find(node.children)
        if (res) return res
      }
    }
    return null
  }
  found = find(treeData.value)
  return found
}

function handleAdd() {
  ModalManager.getInstance().open(AddEntity, {
    sectionName: 'pcb_orders',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleEdit() {
  const order = getSelectedOrder()
  if (!order) return alert('Выберите заказ для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'pcb_orders', data: order.raw },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleDelete() {
  const order = getSelectedOrder()
  if (!order) return alert('Выберите заказ для удаления')
  if (!confirm('Точно удалить заказ?')) return
  deleteDataAsync(order.id, 'pcb_orders').then(fetchData)
}
function handleRefresh() {
  fetchData()
}
function exportExcel() {
  const flat = getFlatOrders()
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'PcbOrders')
  XLSX.writeFile(wb, 'pcb_orders.xlsx')
}
function getFlatOrders() {
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isOrder) {
        flat.push({
          ID: node.id,
          'Номер заказа': node.billNumber,
          Количество: node.count,
          Размер: node.size,
          Толщина: node.thickness,
          Артикул: node.article,
          Цена: node.price,
          'PCB ID': node.pcbId,
          Производитель: node.pcbManufacturerId,
          Завод: node.factoryId,
          'Тип заказа': node.orderTypeId,
          Сотрудник: node.employeeId,
          Статус: node.pcbOrderStatusId
        })
      }
      if (node.children) walk(node.children)
    }
  }
  walk(treeData.value)
  return flat
}
function triggerImport() {
  importInput.value && importInput.value.click()
}
async function handleImportFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (evt) => {
    const dataArr = new Uint8Array(evt.target.result)
    const workbook = XLSX.read(dataArr, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const imported = XLSX.utils.sheet_to_json(sheet)
    // Импорт по billNumber или id, реализуй свою логику сравнения и обновления
    alert('Импорт реализуй по аналогии с другими страницами')
    fetchData()
  }
  reader.readAsArrayBuffer(file)
}
</script>

<style scoped>
.tree-page { padding: 32px; }
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
h1 {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 18px;
}
.custom-tree { margin-top: 12px; }
.pcb-card-wrap { padding: 8px; }
.pcb-card { background: #f8f9fa; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px #0001; }
.pcb-title { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #1976d2; }
.pcb-row { font-size: 16px; margin-bottom: 4px; }
.pcb-row span { color: #888; min-width: 110px; display: inline-block; }
.tree-label { font-size: 18px; font-weight: 500; }
</style> 