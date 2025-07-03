<template>
  <table class="custom-table">
    <thead>
      <tr>
        <th>id</th>
        <th>name</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in filteredData"
        :key="item.id"
        :class="{ selected: selectedId === item.id }"
        @click="selectedId = item.id"
        :click="props.handleSelectCallback(item)"
      >
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import "../style.scss";

const data = ref([]);
const search = ref("");
const selectedId = ref(null);
const importInput = ref(null);

onMounted(fetchData);

async function fetchData() {
  const { data: arr } = await getDataAsync({ endpoint: "/license-types/get" });
  data.value = arr;
}

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
}>();

const filteredData = computed(() => {
  if (!search.value) return data.value;
  return data.value.filter(
    (item) =>
      String(item.id).includes(search.value) ||
      (item.name &&
        item.name.toLowerCase().includes(search.value.toLowerCase()))
  );
});

function getSelected() {
  return data.value.find((x) => x.id === selectedId.value);
}

function handleAdd() {
  ModalManager.getInstance().open(AddEntity, {
    sectionName: "license-types",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchData();
    },
  });
}
function handleEdit() {
  const item = getSelected();
  if (!item) return alert("Выберите тип лицензии для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "license-types", data: item },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchData();
    },
  });
}
function handleDelete() {
  const item = getSelected();
  if (!item) return alert("Выберите тип лицензии для удаления");
  if (!confirm("Точно удалить тип лицензии?")) return;
  deleteDataAsync(item.id, "license-types").then(fetchData);
}
function handleRefresh() {
  fetchData();
}
function exportExcel() {
  if (!data.value.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(data.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "LicenseTypes");
  XLSX.writeFile(wb, "license-types.xlsx");
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
    // Импорт по id или name, реализуй свою логику сравнения и обновления
    alert("Импорт реализуй по аналогии с другими страницами");
    fetchData();
  };
  reader.readAsArrayBuffer(file);
}
</script>
