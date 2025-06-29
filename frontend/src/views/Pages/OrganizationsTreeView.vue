<template>
  <div class="tree-page">
    <h1>Организации</h1>
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
        <template v-if="slotProps.node.isOrganization">
          <div class="org-card-wrap">
            <div class="org-card">
              <div class="org-title">{{ slotProps.node.label }}</div>
              <div class="org-row"><span>Тип:</span> {{ slotProps.node.type || '—' }}</div>
              <div class="org-row"><span>ИНН:</span> {{ slotProps.node.inn || '—' }}</div>
              <div class="org-row"><span>КПП:</span> {{ slotProps.node.kpp || '—' }}</div>
              <div class="org-row"><span>ОГРН:</span> {{ slotProps.node.orgn || '—' }}</div>
              <div class="org-row"><span>Дата ОГРН:</span> {{ slotProps.node.orgnDate || '—' }}</div>
              <div class="org-row"><span>Юр. адрес:</span> {{ slotProps.node.lawAddress || '—' }}</div>
              <div class="org-row"><span>Факт. адрес:</span> {{ slotProps.node.factAddress || '—' }}</div>
              <div class="org-row"><span>Почтовый адрес:</span> {{ slotProps.node.postAddress || '—' }}</div>
              <div class="org-row"><span>Телефон:</span> {{ slotProps.node.phone || '—' }}</div>
              <div class="org-row"><span>Email:</span> {{ slotProps.node.email || '—' }}</div>
              <div class="org-row"><span>Комментарий:</span> {{ slotProps.node.comment || '—' }}</div>
              <div class="org-row"><span>Рейтинг:</span> {{ slotProps.node.rating ?? '—' }}</div>
              <div class="org-row"><span>Электронные доки:</span> {{ slotProps.node.digitalDocs ? 'Да' : 'Нет' }}</div>
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
const selectedOrganization = shallowRef(null)
const importInput = ref(null)

onMounted(async () => {
  await fetchOrganizations()
})

async function fetchOrganizations() {
  const { data } = await getDataAsync({ endpoint: '/organizations/get' })
  treeData.value = groupOrganizations(data)
}

function groupOrganizations(orgs) {
  // Группируем по типу организации
  const typeMap = {}
  orgs.forEach(org => {
    const typeKey = org.organizationTypes?.title || 'Без типа'
    if (!typeMap[typeKey]) typeMap[typeKey] = []
    typeMap[typeKey].push({
      label: org.fullName,
      isOrganization: true,
      type: org.organizationTypes?.title || 'Без типа',
      inn: org.inn,
      kpp: org.kpp,
      orgn: org.orgn,
      orgnDate: org.orgnDate,
      lawAddress: org.lawAddress,
      factAddress: org.factAddress,
      postAddress: org.postAddress,
      phone: org.phone,
      email: org.email,
      comment: org.comment,
      rating: org.rating,
      digitalDocs: org.digitalDocs,
      key: 'org-' + org.id,
      id: org.id,
      raw: org
    })
  })
  return Object.entries(typeMap).map(([type, orgs]) => ({
    label: type,
    key: type,
    children: orgs
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
        node.type?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.inn?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.phone?.toLowerCase().includes(search.value.toLowerCase()) ||
        node.email?.toLowerCase().includes(search.value.toLowerCase())
      ) return node
      return null
    })
    .filter(Boolean)
  return filter(treeData.value)
})

function getSelectedOrganization() {
  if (!selectedKey.value) return null
  const key = Object.keys(selectedKey.value)[0]
  let found = null
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isOrganization) return node
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
    sectionName: 'organizations',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchOrganizations(); }
  })
}
function handleEdit() {
  const org = getSelectedOrganization()
  if (!org) return alert('Выберите организацию для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'organizations', data: org.raw },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchOrganizations(); }
  })
}
function handleDelete() {
  const org = getSelectedOrganization()
  if (!org) return alert('Выберите организацию для удаления')
  if (!confirm('Точно удалить организацию?')) return
  deleteDataAsync(org.id, 'organizations').then(fetchOrganizations)
}
function handleRefresh() {
  fetchOrganizations()
}
function exportExcel() {
  const flat = getFlatOrganizations()
  if (!flat.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(flat)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Organizations')
  XLSX.writeFile(wb, 'organizations.xlsx')
}
function getFlatOrganizations() {
  const flat = []
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isOrganization) {
        flat.push({
          Название: node.label,
          Тип: node.type,
          ИНН: node.inn,
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
    // Преобразуем Excel в [{inn, ...}]
    const excelOrgs = excelRows.map(row => ({
      inn: row['ИНН'] || row['inn'],
      fullName: row['Название'] || row['fullName'],
      type: row['Тип'] || row['type'],
      phone: row['Телефон'] || row['phone'],
      email: row['Email'] || row['email'],
      comment: row['Комментарий'] || row['comment'],
    })).filter(e => e.inn)
    // Получаем организации из CRM
    const { data: crmOrgs } = await getDataAsync({ endpoint: '/organizations/get' })
    const crmMap = new Map(crmOrgs.map(e => [e.inn, e]))
    const excelMap = new Map(excelOrgs.map(e => [e.inn, e]))
    let added = 0, updated = 0, deleted = 0
    // Добавить новых
    for (const [inn, excelOrg] of excelMap) {
      if (!crmMap.has(inn)) {
        await addOrganizationFromExcel(excelOrg)
        added++
      }
    }
    // Обновить существующих
    for (const [inn, excelOrg] of excelMap) {
      if (crmMap.has(inn)) {
        await updateOrganizationFromExcel(crmMap.get(inn), excelOrg)
        updated++
      }
    }
    // Удалить отсутствующих в Excel
    for (const [inn, crmOrg] of crmMap) {
      if (!excelMap.has(inn)) {
        await deleteDataAsync(crmOrg.id, 'organizations')
        deleted++
      }
    }
    alert(`Импорт завершён. Добавлено: ${added}, обновлено: ${updated}, удалено: ${deleted}`)
    fetchOrganizations()
    e.target.value = '' // сброс input
  }
  reader.readAsArrayBuffer(file)
}

async function addOrganizationFromExcel(org) {
  await fetch('/api/organizations/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: org.fullName,
      inn: org.inn,
      phone: org.phone,
      email: org.email,
      comment: org.comment,
      organizationTypeTitle: org.type,
    })
  })
}

async function updateOrganizationFromExcel(crmOrg, excelOrg) {
  await fetch(`/api/organizations/update/${crmOrg.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: excelOrg.fullName,
      inn: excelOrg.inn,
      phone: excelOrg.phone,
      email: excelOrg.email,
      comment: excelOrg.comment,
      organizationTypeTitle: excelOrg.type,
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
.org-card-wrap {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
}
.org-card {
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
.org-card:hover {
  background: #eef6ff;
}
.org-title {
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 6px;
  color: #1976d2;
  word-break: break-word;
}
.org-row {
  font-size: 15px;
  color: #333;
  margin-bottom: 2px;
  word-break: break-word;
}
.org-row span {
  color: #888;
  min-width: 110px;
  display: inline-block;
}
</style> 