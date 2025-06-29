<template>
  <div class="tree-page">
    <h1>Заявки на заказ</h1>
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
        <template v-if="slotProps.node.isOrderRequest">
          <div class="order-req-card-wrap">
            <div class="order-req-card">
              <div class="order-req-title">{{ slotProps.node.title }}</div>
              <div class="order-req-row"><span>Статус:</span> {{ slotProps.node.state }}</div>
              <div class="order-req-row"><span>Артикул:</span> {{ slotProps.node.article }}</div>
              <div class="order-req-row"><span>Кол-во:</span> {{ slotProps.node.count }}</div>
              <div class="order-req-row"><span>Цена за шт.:</span> {{ slotProps.node.priceForPcs }}</div>
              <div class="order-req-row"><span>Ссылка:</span> {{ slotProps.node.link }}</div>
              <div class="order-req-row"><span>Комментарий:</span> {{ slotProps.node.comment }}</div>
              <div class="order-req-row"><span>Стенд:</span> {{ slotProps.node.stands ? JSON.stringify(slotProps.node.stands) : '' }}</div>
              <div class="order-req-row"><span>Создатель:</span> {{ slotProps.node.employeeCreator ? JSON.stringify(slotProps.node.employeeCreator) : '' }}</div>
              <div class="order-req-row"><span>Исполнитель:</span> {{ slotProps.node.employeeExecutor ? JSON.stringify(slotProps.node.employeeExecutor) : '' }}</div>
              <div class="order-req-row"><span>Компоненты:</span> {{ slotProps.node.orderRequestComponents ? JSON.stringify(slotProps.node.orderRequestComponents) : '' }}</div>
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
  const { data } = await getDataAsync({ endpoint: '/order-requests/get' })
  treeData.value = groupOrderRequests(data)
}

function groupOrderRequests(requests) {
  return [
    {
      label: 'Все заявки',
      key: 'all-order-requests',
      children: requests.map(req => ({
        ...req,
        label: req.title,
        isOrderRequest: true,
        key: 'order-req-' + req.id,
        raw: req
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
        node.title?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.article?.toLowerCase().includes(search.value.toLowerCase())
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedOrderRequest() {
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isOrderRequest) return node
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
    sectionName: 'order_requests',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleEdit() {
  const req = getSelectedOrderRequest()
  if (!req) return alert('Выберите заявку для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'order_requests', data: req.raw },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleDelete() {
  const req = getSelectedOrderRequest()
  if (!req) return alert('Выберите заявку для удаления')
  if (!confirm('Точно удалить заявку?')) return
  deleteDataAsync(req.id, 'order_requests').then(fetchData)
}
function handleRefresh() {
  fetchData()
}
function exportExcel() {
  const flat = getFlatOrderRequests()
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'OrderRequests')
  XLSX.writeFile(wb, 'order_requests.xlsx')
}
function getFlatOrderRequests() {
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isOrderRequest) {
        flat.push({
          ID: node.id,
          Статус: node.state,
          Название: node.title,
          Артикул: node.article,
          Количество: node.count,
          'Цена за шт.': node.priceForPcs,
          Ссылка: node.link,
          Комментарий: node.comment,
          Стенд: JSON.stringify(node.stands),
          Создатель: JSON.stringify(node.employeeCreator),
          Исполнитель: JSON.stringify(node.employeeExecutor),
          Компоненты: JSON.stringify(node.orderRequestComponents)
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
    // Импорт по title или id, реализуй свою логику сравнения и обновления
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
.order-req-card-wrap { padding: 8px; }
.order-req-card { background: #f8f9fa; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px #0001; }
.order-req-title { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #1976d2; }
.order-req-row { font-size: 16px; margin-bottom: 4px; }
.order-req-row span { color: #888; min-width: 110px; display: inline-block; }
.tree-label { font-size: 18px; font-weight: 500; }
</style> 