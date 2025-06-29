<template>
  <div class="tree-page">
    <h1>Текущие задачи</h1>
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
        <template v-if="slotProps.node.isTask">
          <div class="task-card-wrap">
            <div class="task-card clickable" @click="goToTask(slotProps.node.id)">
              <div class="task-title">{{ slotProps.node.label }}</div>
              <div class="task-row"><span>Дедлайн:</span> {{ slotProps.node.deadline }}</div>
              <div class="task-row"><span>Сотрудник:</span> {{ slotProps.node.employeeName }}</div>
              <div class="task-row"><span>Статус:</span> {{ slotProps.node.stateTitle }}</div>
              <div class="task-row"><span>Отгрузка-Стенд:</span> {{ slotProps.node.shipmentStandTitle }}</div>
              <div class="task-row"><span>Задача стенда:</span> {{ slotProps.node.standTaskTitle }}</div>
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
import { useRouter } from 'vue-router'
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
const router = useRouter()

onMounted(fetchTasks)

async function fetchTasks() {
  const { data } = await getDataAsync({ endpoint: '/current-tasks/get' })
  treeData.value = buildTree(data)
}

function buildTree(tasks) {
  // Группируем по статусу задачи
  const stateMap = {}
  tasks.forEach(t => {
    const state = t.currentTaskStates?.title || 'Без статуса'
    if (!stateMap[state]) stateMap[state] = []
    stateMap[state].push(t)
  })
  return Object.entries(stateMap).map(([state, tasks]) => ({
    label: state,
    key: state,
    children: tasks.map(task => ({
      label: task.title,
      isTask: true,
      deadline: task.deadline,
      employeeName: task.employees?.peoples ? `${task.employees.peoples.lastName} ${task.employees.peoples.firstName}` : '',
      stateTitle: task.currentTaskStates?.title,
      shipmentStandTitle: task.shipmentsStands?.id ? `ID ${task.shipmentsStands.id}` : '',
      standTaskTitle: task.standTasks?.title,
      key: 'task-' + task.id,
      id: task.id,
      raw: task
    }))
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
        node.employeeName?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.stateTitle?.toLowerCase().includes(search.value.toLowerCase())
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedTask() {
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isTask) return node
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
    sectionName: 'current_tasks',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchTasks(); }
  })
}
function handleEdit() {
  const task = getSelectedTask()
  if (!task) return alert('Выберите задачу для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'current_tasks', data: task.raw },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchTasks(); }
  })
}
function handleDelete() {
  const task = getSelectedTask()
  if (!task) return alert('Выберите задачу для удаления')
  if (!confirm('Точно удалить задачу?')) return
  deleteDataAsync(task.id, 'current_tasks').then(fetchTasks)
}
function handleRefresh() {
  fetchTasks()
}
function exportExcel() {
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isTask) {
        flat.push({
          Название: node.label,
          Дедлайн: node.deadline,
          Сотрудник: node.employeeName,
          Статус: node.stateTitle,
          'Отгрузка-Стенд': node.shipmentStandTitle,
          'Задача стенда': node.standTaskTitle
        })
      }
      if (node.children) walk(node.children)
    }
  }
  walk(treeData.value)
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'CurrentTasks')
  XLSX.writeFile(wb, 'current_tasks.xlsx')
}
function triggerImport() {
  importInput.value && importInput.value.click()
}
async function handleImportFile(e) {
  // TODO: реализовать импорт
  alert('Импорт пока не реализован')
}
function goToTask(id) {
  router.push(`/current_tasks/${id}`)
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
.task-card-wrap {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
}
.task-card {
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
.task-card:hover {
  background: #eef6ff;
}
.task-title {
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 6px;
  color: #1976d2;
  word-break: break-word;
}
.task-row {
  font-size: 15px;
  color: #333;
  margin-bottom: 2px;
  word-break: break-word;
}
.task-row span {
  color: #888;
  min-width: 110px;
  display: inline-block;
}
</style>
 