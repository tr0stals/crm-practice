<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, computed } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import { useRouter } from "vue-router";
import "../style.scss";
import { getTreeviewData } from "@/shared/ui/CustomTreeview/utils/getTreeviewData";
import handlePagination from "@/shared/utils/handlePagination";
import Pagination from "../../Pagination/ui/Pagination.vue";
import useFetch from "@/shared/lib/useFetch";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import LoadingLayout from "../../LoadingLayout/ui/LoadingLayout.vue";

const props = defineProps<{
  currentSection: string;
  extraClasses?: string[];
  extraAttrs?: string[];
}>();

const emit = defineEmits<{
  (e: "node-select", item: any): void;
}>();

const treeData = ref<any[]>([]);
const selectedKey = ref(null);
const expandedKeys = ref<any>({});
const navigationStore = useNavigationStore();
const isSelectOpen = ref(false);
const selectedSection = ref("");

interface TreeNode {
  id: number;
  key: string;
  label: string;
  data?: any;
  children?: TreeNode[];
  leaf?: boolean;
  isProduct?: boolean; // Флаг для товаров
  level: any;
}
console.debug(props.currentSection);

const { data, error, loading, canAbort, abort, refetch } = useFetch<TreeNode[]>(
  `${defaultEndpoint}/${props.currentSection}/tree`,
  {
    immediate: true,
    timeout: 3000,
  }
);

watch(data, (val) => {
  if (val) {
    const root = getTreeviewData(val);
    treeData.value = root.children || [];

    if (props.currentSection === "current_tasks") {
      expandedKeys.value = treeData.value.reduce((acc, node) => {
        acc[node.key] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }

    console.debug(treeData.value);
  }
});

const page = ref<number>(1);
const perPage = ref<number>(10);

const paginatedTreeData = computed(() => {
  const start = (page.value - 1) * perPage.value;

  return treeData.value.slice(start, start + perPage.value) || [];
});

function nextPage() {
  if (page.value < Math.ceil(treeData.value.length / perPage.value)) {
    page.value++;
  }
}

watch(expandedKeys, (newVal) => {
  console.debug(newVal);
});

function prevPage() {
  if (page.value > 1) {
    page.value--;
  }
}

defineExpose({
  refreshTree: refetch,
});

function onNodeSelect(event: any) {
  selectedKey.value = event.key;

  selectedSection.value = event.data.nodeType;
  navigationStore.setActiveRow(event);

  emit("node-select", event);

  console.debug(navigationStore.activeRow);
}

function getExpandedKeysForSearch(nodes: any, search: any) {
  const expanded = {};
  function walk(node: any, parentKeys = []) {
    let match = false;
    if (node.children) {
      for (const child of node.children) {
        if (walk(child, [...parentKeys, node.key])) match = true;
      }
    }
    if (
      node.label?.toLowerCase().includes(search.toLowerCase()) ||
      node.material?.toLowerCase().includes(search.toLowerCase()) ||
      node.drawingReference?.toLowerCase().includes(search.toLowerCase())
    ) {
      match = true;
    }
    if (match) {
      for (const k of parentKeys) expanded[k] = true;
    }
    return match;
  }
  for (const node of treeData.value) walk(node);
  return expanded;
}

watch(
  () => props.search,
  (val) => {
    if (val) {
      expandedKeys.value = getExpandedKeysForSearch(treeData.value, val);
    } else {
      expandedKeys.value = {};
    }
  },
  { immediate: true }
);

function toggleExpand(node: any) {
  const key = node.key;
  const isExpanded = expandedKeys.value[key];

  if (node.leaf) return; // Не раскрываем листы

  if (isExpanded) {
    delete expandedKeys.value[key];
  } else {
    expandedKeys.value[key] = true;
  }
}
</script>

<template>
  <LoadingLayout v-if="loading" />
  <template v-else-if="treeData">
    <Tree
      :value="paginatedTreeData"
      selectionMode="single"
      class="treeview"
      v-model:selectionKey="selectedKey"
      v-model:expandedKeys="expandedKeys"
      @node-select="onNodeSelect"
      :pt="{
        root: { class: 'treeview__root' },
        nodeContent: ({ context }) => ({
          class: [
            'treeview__data',
            { treeview__data__selected: context.node.key === selectedKey },
          ],
        }),
        node: ({ context }) => ({
          style: { marginLeft: `${(context.node.level || 0) * 1}rem` },
        }),
      }"
      :pt-options="{ mergeProps: true }"
    >
      <template #default="slotProps">
        <div
          class="treeview__data__wrapper"
          @click="toggleExpand(slotProps.node)"
        >
          <span class="treeview__data__label">
            {{ slotProps.node.label }}
          </span>
        </div>
      </template>
    </Tree>
    <div class="pagination">
      <button class="pagination__btn" @click="prevPage" :disabled="page === 1">
        ← Назад
      </button>
      <span class="pagination__text"
        >Страница {{ page }} из {{ Math.ceil(treeData.length / perPage) }}</span
      >
      <button
        class="pagination__btn"
        @click="nextPage"
        :disabled="page === Math.ceil(treeData.length / perPage)"
      >
        Вперёд →
      </button>
      <div class="pagination__itemsPerPage">
        <label class="pagination__itemsPerPage__label" for="itemsPerPage"
          >Элементов на странице:</label
        >
        <div
          class="pagination__itemsPerPage__selectWrapper"
          :class="{ open: isSelectOpen }"
        >
          <select
            class="pagination__itemsPerPage__selectWrapper__select"
            id="itemsPerPage"
            v-model="perPage"
            @change="
              isSelectOpen = false;
              page = 1;
            "
          >
            <option
              class="pagination__itemsPerPage__selectWrapper__select__option"
              :value="5"
            >
              5
            </option>
            <option
              class="pagination__itemsPerPage__selectWrapper__select__option"
              :value="20"
            >
              20
            </option>
            <option
              class="pagination__itemsPerPage__selectWrapper__select__option"
              :value="35"
            >
              35
            </option>
          </select>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <h1>Нет данных для отображения</h1>
  </template>
</template>
