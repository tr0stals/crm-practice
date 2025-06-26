<template>
  <div class="tree-page">
    <h1>Типы лицензий</h1>
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
    <table class="custom-table">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredData" :key="item.id" :class="{selected: selectedId === item.id}" @click="selectedId = item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDataAsync } from '@/shared/api/getDataAsync'
import AddEntity from '@/features/AddEntity/ui/AddEntityModal.vue'
import EditModalWindow from '@/features/EditModalWindow/ui/EditModalWindow.vue'
import { ModalManager } from '@/shared/plugins/modalManager'
import { deleteDataAsync } from '@/views/Dashboard/api/deleteDataAsync'
import * as XLSX from 'xlsx'

const data = ref([])
const search = ref('')
const selectedId = ref(null)
const importInput = ref(null)

onMounted(fetchData)

async function fetchData() {
  const { data: arr } = await getDataAsync({ endpoint: '/license_types/get' })
  data.value = arr
}

const filteredData = computed(() => {
  if (!search.value) return data.value
  return data.value.filter(item =>
    String(item.id).includes(search.value) ||
    (item.name && item.name.toLowerCase().includes(search.value.toLowerCase()))
  )
})

function getSelected() {
  return data.value.find(x => x.id === selectedId.value)
}

function handleAdd() {
  ModalManager.getInstance().open(AddEntity, {
    sectionName: 'license_types',
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleEdit() {
  const item = getSelected()
  if (!item) return alert('Выберите тип лицензии для редактирования')
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: 'license_types', data: item },
    onApplyCallback: () => { ModalManager.getInstance().closeModal(); fetchData(); }
  })
}
function handleDelete() {
  const item = getSelected()
  if (!item) return alert('Выберите тип лицензии для удаления')
  if (!confirm('Точно удалить тип лицензии?')) return
  deleteDataAsync(item.id, 'license_types').then(fetchData)
}
function handleRefresh() {
  fetchData()
}
function exportExcel() {
  if (!data.value.length) return alert('Нет данных для экспорта.')
  const ws = XLSX.utils.json_to_sheet(data.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'LicenseTypes')
  XLSX.writeFile(wb, 'license_types.xlsx')
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
    // Импорт по id или name, реализуй свою логику сравнения и обновления
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
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
  font-size: 17px;
}
.custom-table th, .custom-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 14px;
  text-align: left;
}
.custom-table th {
  background: #f8f9fa;
  font-weight: 600;
  font-size: 18px;
}
.custom-table tr.selected {
  background: #e6f0ff;
}
.custom-table tr:hover {
  background: #f2f7ff;
}
</style> 