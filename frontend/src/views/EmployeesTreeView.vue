<template>
  <div class="tree-page">
    <h1>Сотрудники</h1>
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
        <template v-if="slotProps.node.isEmployee">
          <div class="emp-card-wrap">
            <div class="emp-card">
              <div class="emp-fio">{{ slotProps.node.label }}</div>
              <div class="emp-row"><span>Дата рождения:</span> {{ slotProps.node.birthDate }}</div>
              <div class="emp-row"><span>Должность:</span> {{ slotProps.node.profession }}</div>
              <div class="emp-row"><span>Телефон:</span> {{ slotProps.node.phone }}</div>
              <div class="emp-row"><span>Email:</span> {{ slotProps.node.email }}</div>
              <div class="emp-row"><span>Комментарий:</span> {{ slotProps.node.comment }}</div>
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
import { ref, computed, onMounted, shallowRef } from 'vue'
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
const selectedEmployee = shallowRef(null)
const importInput = ref(null)

onMounted(async () => {
  await fetchEmployees()
})

async function fetchEmployees() {
  const { data } = await getDataAsync({ endpoint: '/employees/get' })
  treeData.value = groupEmployees(data)
}

function groupEmployees(employees) {
  const orgMap = {}
  employees.forEach(emp => {
    const org = emp.organization?.fullName || 'Без организации'
    const dept = emp.employeeDepartments?.[0]?.departments?.title || 'Без отдела'
    if (!orgMap[org]) orgMap[org] = {}
    if (!orgMap[org][dept]) orgMap[org][dept] = []
    orgMap[org][dept].push(emp)
  })
  return Object.entries(orgMap).map(([org, depts]) => ({
    label: org,
    key: org,
    children: Object.entries(depts).map(([dept, emps]) => ({
      label: dept,
      key: org + '-' + dept,
      children: emps.map(emp => ({
        label: `${emp.peoples?.lastName || ''} ${emp.peoples?.firstName || ''} ${emp.peoples?.middleName || ''}`.trim(),
        isEmployee: true,
        birthDate: emp.birthDate,
        profession: emp.profession?.title,
        phone: emp.peoples?.phone,
        email: emp.peoples?.email,
        comment: emp.peoples?.comment,
        key: 'emp-' + emp.id,
        id: emp.id,
        raw: emp
      }))
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
        node.profession?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.phone?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.email?.toLowerCase().includes(search.value.toLowerCase())
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedEmployee() {
  // selectedKey — объект с ключами выбранных узлов
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isEmployee) return node
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
    sectionName: 'employees',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchEmployees(); }
  })
}
function handleEdit() {
  const emp = getSelectedEmployee()
  if (!emp) return alert('Выберите сотрудника для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'employees', data: emp.raw },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchEmployees(); }
  })
}
function handleDelete() {
  const emp = getSelectedEmployee()
  if (!emp) return alert('Выберите сотрудника для удаления')
  if (!confirm('Точно удалить сотрудника?')) return
  deleteDataAsync(emp.id, 'employees').then(fetchEmployees)
}
function handleRefresh() {
  fetchEmployees()
}
function exportExcel() {
  const flat = getFlatEmployees()
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Employees')
  XLSX.writeFile(wb, 'employees.xlsx')
}
function getFlatEmployees() {
  // Собираем всех сотрудников в плоский массив для экспорта
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isEmployee) {
        flat.push({
          ФИО: node.label,
          'Дата рождения': node.birthDate,
          Должность: node.profession,
          Телефон: node.phone,
          Email: node.email,
          Комментарий: node.comment
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
    const data = new Uint8Array(evt.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const excelRows = XLSX.utils.sheet_to_json(sheet)
    // Преобразуем Excel в [{email, ...}]
    const excelEmployees = excelRows.map(row => ({
      email: row.Email || row.email,
      lastName: row['Фамилия'] || row['ФИО']?.split(' ')[0] || '',
      firstName: row['Имя'] || row['ФИО']?.split(' ')[1] || '',
      middleName: row['Отчество'] || row['ФИО']?.split(' ')[2] || '',
      birthDate: row['Дата рождения'] || '',
      profession: row['Должность'] || '',
      phone: row['Телефон'] || '',
      comment: row['Комментарий'] || '',
    })).filter(e => e.email)
    // Получаем сотрудников из CRM
    const { data: crmEmployees } = await getDataAsync({ endpoint: '/employees/get' })
    const crmMap = new Map(crmEmployees.map(e => [e.peoples?.email, e]))
    const excelMap = new Map(excelEmployees.map(e => [e.email, e]))
    let added = 0, updated = 0, deleted = 0
    // Добавить новых
    for (const [email, excelEmp] of excelMap) {
      if (!crmMap.has(email)) {
        await addEmployeeFromExcel(excelEmp)
        added++
      }
    }
    // Обновить существующих
    for (const [email, excelEmp] of excelMap) {
      if (crmMap.has(email)) {
        await updateEmployeeFromExcel(crmMap.get(email), excelEmp)
        updated++
      }
    }
    // Удалить отсутствующих в Excel
    for (const [email, crmEmp] of crmMap) {
      if (!excelMap.has(email)) {
        await deleteDataAsync(crmEmp.id, 'employees')
        deleted++
      }
    }
    alert(`Импорт завершён. Добавлено: ${added}, обновлено: ${updated}, удалено: ${deleted}`)
    fetchEmployees()
    e.target.value = '' // сброс input
  }
  reader.readAsArrayBuffer(file)
}

async function addEmployeeFromExcel(emp) {
  // Преобразуй под твой API, если нужно
  await fetch('/api/employees/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      peoples: {
        lastName: emp.lastName,
        firstName: emp.firstName,
        middleName: emp.middleName,
        phone: emp.phone,
        email: emp.email,
        comment: emp.comment,
      },
      birthDate: emp.birthDate,
      professionTitle: emp.profession,
    })
  })
}

async function updateEmployeeFromExcel(crmEmp, excelEmp) {
  // Преобразуй под твой API, если нужно
  await fetch(`/api/employees/update/${crmEmp.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      peoples: {
        lastName: excelEmp.lastName,
        firstName: excelEmp.firstName,
        middleName: excelEmp.middleName,
        phone: excelEmp.phone,
        email: excelEmp.email,
        comment: excelEmp.comment,
      },
      birthDate: excelEmp.birthDate,
      professionTitle: excelEmp.profession,
    })
  })
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
.emp-card-wrap {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
}
.emp-card {
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
.emp-card:hover {
  background: #eef6ff;
}
.emp-fio {
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 6px;
  color: #1976d2;
  word-break: break-word;
}
.emp-row {
  font-size: 15px;
  color: #333;
  margin-bottom: 2px;
  word-break: break-word;
}
.emp-row span {
  color: #888;
  min-width: 110px;
  display: inline-block;
}
</style> 