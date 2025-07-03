<template>
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
      <template v-if="slotProps.node.isUser">
        <div class="user-card-wrap">
          <div class="user-card">
            <div class="user-username">{{ slotProps.node.userName }}</div>
            <div class="user-row">
              <span>ФИО:</span> {{ slotProps.node.fio }}
            </div>
            <div class="user-row">
              <span>Email:</span> {{ slotProps.node.email }}
            </div>
            <div class="user-row">
              <span>Телефон:</span> {{ slotProps.node.phone }}
            </div>
            <div class="user-row">
              <span>Комментарий:</span> {{ slotProps.node.comment }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <span class="tree-label">{{ slotProps.node.label }}</span>
      </template>
    </template>
  </Tree>
</template>

<script setup>
import { ref, computed, onMounted, shallowRef } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import "../style.scss";

const treeData = ref([]);
const search = ref("");
const selectedKey = ref(null);
const importInput = ref(null);

onMounted(async () => {
  await fetchUsers();
});

async function fetchUsers() {
  const { data } = await getDataAsync({ endpoint: "/user/get" });
  // Фильтруем только администраторов, если есть поле role (добавь фильтр, если появится)
  treeData.value = groupUsers(data);
}

function groupUsers(users) {
  // Просто список пользователей, без вложенности
  return [
    {
      label: "Все пользователи",
      key: "all-users",
      children: users.map((user) => ({
        label: user.userName,
        isUser: true,
        userName: user.userName,
        fio: user.peoples
          ? `${user.peoples.lastName || ""} ${user.peoples.firstName || ""} ${
              user.peoples.middleName || ""
            }`.trim()
          : "",
        email: user.peoples?.email,
        phone: user.peoples?.phone,
        comment: user.peoples?.comment,
        key: "user-" + user.id,
        id: user.id,
        raw: user,
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
          node.userName?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.fio?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.email?.toLowerCase().includes(search.value.toLowerCase()) ||
          node.phone?.toLowerCase().includes(search.value.toLowerCase())
        )
          return node;
        return null;
      })
      .filter(Boolean);
  return filter(treeData.value);
});

function getSelectedUser() {
  if (!selectedKey.value) return null;
  const key = Object.keys(selectedKey.value)[0];
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isUser) return node;
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
    sectionName: "user",
    onClose: () => ModalManager.getInstance().closeModal(),
    onSuccess: () => {
      ModalManager.getInstance().closeModal();
      fetchUsers();
    },
  });
}
function handleEdit() {
  const user = getSelectedUser();
  if (!user) return alert("Выберите пользователя для редактирования");
  ModalManager.getInstance().open(EditModalWindow, {
    config: { sectionName: "user", data: user.raw },
    onApplyCallback: () => {
      ModalManager.getInstance().closeModal();
      fetchUsers();
    },
  });
}
function handleDelete() {
  const user = getSelectedUser();
  if (!user) return alert("Выберите пользователя для удаления");
  if (!confirm("Точно удалить пользователя?")) return;
  deleteDataAsync(user.id, "user").then(fetchUsers);
}
function handleRefresh() {
  fetchUsers();
}
function exportExcel() {
  const flat = getFlatUsers();
  if (!flat.length) return alert("Нет данных для экспорта.");
  const ws = XLSX.utils.json_to_sheet(flat);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, "users.xlsx");
}
function getFlatUsers() {
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.isUser) {
        flat.push({
          Логин: node.userName,
          ФИО: node.fio,
          Email: node.email,
          Телефон: node.phone,
          Комментарий: node.comment,
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
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const imported = XLSX.utils.sheet_to_json(sheet);
    // Импорт по userName или email, реализуй свою логику сравнения и обновления
    // ...
    alert("Импорт пользователей реализуй по аналогии с сотрудниками");
    fetchUsers();
  };
  reader.readAsArrayBuffer(file);
}
</script>
