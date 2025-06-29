<template>
  <div class="tree-page">
    <h1>Компоненты склада</h1>
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
        <template v-if="slotProps.node.isComponent">
          <div class="comp-card-wrap">
            <div class="comp-card">
              <div class="comp-title">{{ slotProps.node.title }}</div>
              <div class="comp-row"><span>Кол-во:</span> {{ slotProps.node.count }}</div>
              <div class="comp-row"><span>Цена:</span> {{ slotProps.node.price }}</div>
              <div class="comp-row"><span>Размер:</span> {{ slotProps.node.size }}</div>
              <div class="comp-row"><span>Вес:</span> {{ slotProps.node.weight }}</div>
              <div class="comp-row"><span>Материал:</span> {{ slotProps.node.material }}</div>
              <div class="comp-row"><span>Мин. кол-во:</span> {{ slotProps.node.minCount }}</div>
              <div class="comp-row"><span>Дата прихода:</span> {{ slotProps.node.arrivalDate }}</div>
              <div class="comp-row"><span>Ссылка:</span> {{ slotProps.node.link }}</div>
              <div class="comp-row"><span>Фото:</span> {{ slotProps.node.photo }}</div>
              <div class="comp-row"><span>Завод:</span> {{ slotProps.node.factoryId }}</div>
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
import { getDataAsync } from '@/shared/api/getDataAsync'
import Tree from 'primevue/tree'
import AddEntity from '@/features/AddEntity/ui/AddEntityModal.vue'
import EditModalWindow from '@/features/EditModalWindow/ui/EditModalWindow.vue'
import { ModalManager } from '@/shared/plugins/modalManager'
import { deleteDataAsync } from '@/views/Dashboard/api/deleteDataAsync'
import * as XLSX from 'xlsx'

const treeData = ref([])
const search = ref('')
const selectedKey = ref(null)
const importInput = ref(null)

onMounted(fetchData)

async function fetchData() {
  const { data } = await getDataAsync({ endpoint: '/warehouse-components/get' })
  treeData.value = buildTree(data)
}

function buildTree(components) {
  const map = {}
  const roots = []
  components.forEach(c => {
    map[c.id] = {
      ...c,
      key: 'comp-' + c.id,
      label: c.title,
      isComponent: true,
      factoryId: c.organizations?.id || '',
      children: []
    }
  })
  components.forEach(c => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].children.push(map[c.id])
    } else {
      roots.push(map[c.id])
    }
  })
  return roots
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
        node.material?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.size?.toLowerCase().includes(search.value.toLowerCase())
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedComponent() {
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isComponent) return node
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
    sectionName: 'warehouse_components',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleEdit() {
  const comp = getSelectedComponent()
  if (!comp) return alert('Выберите компонент для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'warehouse_components', data: comp },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleDelete() {
  const comp = getSelectedComponent()
  if (!comp) return alert('Выберите компонент для удаления')
  if (!confirm('Точно удалить компонент?')) return
  deleteDataAsync(comp.id, 'warehouse_components').then(fetchData)
}
function handleRefresh() {
  fetchData()
}
function exportExcel() {
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isComponent) {
        flat.push({
          Название: node.title,
          Количество: node.count,
          Цена: node.price,
          Размер: node.size,
          Вес: node.weight,
          Материал: node.material,
          'Мин. кол-во': node.minCount,
          'Дата прихода': node.arrivalDate,
          Ссылка: node.link,
          Фото: node.photo,
          Завод: node.factoryId
        })
      }
      if (node.children) walk(node.children)
    }
  }
  walk(treeData.value)
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'WarehouseComponents')
  XLSX.writeFile(wb, 'warehouse_components.xlsx')
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
    // Импорт по id или title, реализуй свою логику сравнения и обновления
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
.comp-card-wrap { padding: 8px; }
.comp-card { background: #f8f9fa; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px #0001; }
.comp-title { font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #1976d2; }
.comp-row { font-size: 16px; margin-bottom: 4px; }
.comp-row span { color: #888; min-width: 110px; display: inline-block; }
.tree-label { font-size: 18px; font-weight: 500; }
</style> 