<template>
  <div class="tree-page">
    <h1>Отделы</h1>
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
        <template v-if="slotProps.node.isDepartment">
          <div class="dept-card-wrap">
            <div class="dept-card">
              <div class="dept-title">{{ slotProps.node.label }}</div>
              <div class="dept-row"><span>ID:</span> {{ slotProps.node.id }}</div>
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

onMounted(fetchDepartments)

async function fetchDepartments() {
  const { data } = await getDataAsync({ endpoint: '/departments/get' })
  treeData.value = buildTree(data)
}

function buildTree(departments) {
  return departments.map(dept => ({
    label: dept.title,
    isDepartment: true,
    id: dept.id,
    key: 'dept-' + dept.id
  }))
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
        node.label?.toLowerCase().includes(search.value.toLowerCase()) ||
        String(node.id).includes(search.value)
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedDepartment() {
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isDepartment) return node
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
    sectionName: 'departments',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchDepartments(); }
  })
}
function handleEdit() {
  const dept = getSelectedDepartment()
  if (!dept) return alert('Выберите отдел для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'departments', data: dept },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchDepartments(); }
  })
}
function handleDelete() {
  const dept = getSelectedDepartment()
  if (!dept) return alert('Выберите отдел для удаления')
  if (!confirm('Точно удалить отдел?')) return
  deleteDataAsync(dept.id, 'departments').then(fetchDepartments)
}
function handleRefresh() {
  fetchDepartments()
}
function exportExcel() {
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isDepartment) {
        flat.push({
          Название: node.label,
          ID: node.id
        })
      }
      if (node.children) walk(node.children)
    }
  }
  walk(treeData.value)
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Departments')
  XLSX.writeFile(wb, 'departments.xlsx')
}
function triggerImport() {
  importInput.value && importInput.value.click()
}
async function handleImportFile(e) {
  // TODO: реализовать импорт
  alert('Импорт пока не реализован')
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
.tree-page { padding: 32px; }
.tree-page h1 {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 18px;
}
.custom-tree .tree-label { font-weight: 600; }
.dept-card-wrap {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
}
.dept-card {
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
.dept-card:hover {
  background: #eef6ff;
}
.dept-title {
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 6px;
  color: #1976d2;
  word-break: break-word;
}
.dept-row {
  font-size: 15px;
  color: #333;
  margin-bottom: 2px;
  word-break: break-word;
}
.dept-row span {
  color: #888;
  min-width: 110px;
  display: inline-block;
}
</style> 