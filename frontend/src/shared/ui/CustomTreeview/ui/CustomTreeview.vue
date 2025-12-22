<script setup lang="ts">
import { ref, watch, computed, type Component } from "vue";
import Tree from "primevue/tree";
import "../style.scss";
import { getTreeviewData } from "@/shared/ui/CustomTreeview/utils/getTreeviewData";
import useFetch from "@/shared/lib/useFetch";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";
import LoadingLayout from "../../LoadingLayout/ui/LoadingLayout.vue";
import { imageTables } from "../config/imageTables";
import { tablesEnum } from "@/shared/config/tablesEnum";
import { useToast } from "vue-toastification";
import { getDataAsync } from "@/shared/api/getDataAsync";
import { useMenuStore } from "@/entities/MenuEntity/model/menuStore";
import { treeviewIcons } from "../config/treeviewIcons";

const props = defineProps<{
  currentSection: string;
  searchQuery?: string;
  extraClasses?: string[];
  extraAttrs?: string[];
}>();

const emit = defineEmits<{
  (e: "node-select", item: any): void;
}>();

const treeData = ref<any[]>([]);

// --- Фильтрация дерева по поиску ---
function filterTree(nodes: any[], query: string) {
  if (!query) return nodes;

  const lower = query.toLowerCase();

  const result: any[] = [];

  for (const node of nodes) {
    const labelMatch = node.label?.toLowerCase().includes(lower);

    let childMatches: any[] = [];

    if (node.children && node.children.length > 0) {
      childMatches = filterTree(node.children, query);
    }

    // если совпало название или совпали дети — оставляем узел  
    if (labelMatch || childMatches.length > 0) {
      result.push({
        ...node,
        children: childMatches.length > 0 ? childMatches : node.children ?? []
      });
    }
  }

  return result;
}

const filteredTreeData = computed(() => {
  return filterTree(treeData.value, props.searchQuery || "");
});

watch(filteredTreeData, (newTree) => {
  if (!props.searchQuery) return;

  const expandMatches = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.children && n.children.length > 0) {
        expandedKeys.value[n.key] = true;
        expandMatches(n.children);
      }
    }
  };

  expandMatches(newTree);
});



const selectedKey = ref(null);
const expandedKeys = ref<any>({});
const navigationStore = useNavigationStore();
const isSelectOpen = ref(false);
const selectedSection = ref("");
const toast = useToast();

// Кэш изображений, чтобы не дёргать сервер по 100 раз
const imageUrlMap = ref<Record<number, string>>({});

interface TreeNode {
  id: number;
  key: string;
  label: string;
  data?: any;
  children?: TreeNode[];
  leaf?: boolean;
  isProduct?: boolean;
  level: any;
}

/**
 * Массив исключений. Есть несколько таблиц, для которых дерево запрашивается по /getTree
 * */
const treeTablesExceptions = ["employees", "stands", "pcbs"];
const menuStore = useMenuStore();

const { data, error, loading, refetch } = useFetch<TreeNode[]>(
  treeTablesExceptions.includes(props.currentSection)
    ? `${defaultEndpoint}/${props.currentSection}/getTree`
    : `${defaultEndpoint}/${props.currentSection}/tree`,
  {
    immediate: true,
    timeout: 3000,
  }
);

watch(
  () => menuStore.showDismissals,
  async (val) => {
    console.debug("!");
    if (props.currentSection === "employees") {
      console.debug("!!");
      if (val) {
        console.debug("!!!");
        data.value = await getDataAsync({
          endpoint: `${defaultEndpoint}/${props.currentSection}/treeDismissed`,
        }).then((res) => res.data);
      } else {
        refetch();
      }
    } else {
      return;
    }
  }
);

const handleShowDismissals = () => {
  showDismissals.value = !showDismissals.value;
};

const handleLoadImages = async (nodeType: string) => {
  if (imageTables.includes(props.currentSection as tablesEnum)) {
    for (const node of treeData.value) {
      console.debug(node);
      if (node.data?.nodeType && node.data?.id) {
        await fetchImageForNode(node.data.nodeType, node.data.id);
      }

      if (node.children) {
        for (const child of node.children) {
          console.debug(child);
        }
      }
    }
  }
};

watch(data, async (val) => {
  if (!val) return;

  const root = getTreeviewData(val);
  treeData.value = root.children || [];
  

  if (Array.isArray(val)) {
    treeData.value = val.map((node: any) => getTreeviewData(node));
  } else {
    const root = getTreeviewData(val);
    treeData.value = root.children || [];
  }

  // Авторазворачивание веток для определённых секций
  if (props.currentSection === "current_tasks") {
    expandedKeys.value = treeData.value.reduce((acc, node) => {
      acc[node.key] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }

  async function processNode(node: any) {
    const promises = [];

    if (
      imageTables.includes(node.data.nodeType as tablesEnum) &&
      node.data?.nodeType &&
      node.data?.id
    ) {
      promises.push(fetchImageForNode(node.data.nodeType, node.data.id));
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        promises.push(processNode(child));
      }
    }

    await Promise.all(promises);
  }

  for (const node of treeData.value) {
    await processNode(node);
  }
});

const page = ref<number>(1);
const perPage = ref<number>(10);

const paginatedTreeData = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredTreeData.value.slice(start, start + perPage.value) || [];
});

function nextPage() {
  if (page.value < Math.ceil(treeData.value.length / perPage.value)) {
    page.value++;
  }
}

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
  navigationStore.setSelectedRow(event);
  emit("node-select", event);
}

// Новый метод загрузки изображения по полиморфному эндпоинту
async function fetchImageForNode(targetType: string, targetId: number) {
  if (imageUrlMap.value[targetId]) return; // уже загружено
  if (targetType === tablesEnum.components_categories)
    targetType = tablesEnum.components;

  try {
    const res = await fetch(
      `${defaultEndpoint}/images/byTarget/${targetType}/${targetId}`
    );
    if (!res.ok) throw new Error(`Ошибка загрузки изображения: ${res.status}`);
    const data = await res.json();

    const image = Array.isArray(data) ? data[0] : data;

    if (image?.filename) {
      imageUrlMap.value[targetId] = `${defaultEndpoint.replace(
        "/api",
        ""
      )}/uploads/${image.filename}`;
    }
  } catch (err) {
    toast.error(`Ошибка получения изображения: ${err}`, { timeout: 5000 });
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  // img.style.display = "none";
}

// Разворачивание узлов
function toggleExpand(node: any) {
  const key = node.key;
  const isExpanded = expandedKeys.value[key];
  if (node.leaf) return;
  if (isExpanded) delete expandedKeys.value[key];
  else expandedKeys.value[key] = true;
}
</script>

<template>
  <LoadingLayout v-if="loading" />
  <template v-else>
    <div v-if="treeData.length === 0">
      <h1>Нет данных для отображения</h1>
    </div>

    <template v-else>
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
              {
                treeview__data__selected:
                  navigationStore.selectedRow &&
                  context.node.key === selectedKey,
              },
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
            <div class="treeview__data__label">
              <component
                v-if="treeviewIcons[slotProps.node.data.nodeType]"
                :is="treeviewIcons[slotProps.node.data.nodeType]"
                class="treeview__icon"
              />

              <span>{{ slotProps.node.label }}</span>
            </div>
          </div>
        </template>
      </Tree>
    </template>

    <div class="pagination">
        <button class="pagination__btn" @click="prevPage" :disabled="page === 1">
          ← Назад
        </button>
        <span class="pagination__text">
          Страница {{ page }} из {{ Math.ceil(treeData.length / perPage) }}
        </span>
        <button
          class="pagination__btn"
          @click="nextPage"
          :disabled="page === Math.ceil(treeData.length / perPage)"
        >
          Вперёд →
        </button>
        <div class="pagination__itemsPerPage">
          <label class="pagination__label" for="itemsPerPage">Элементов на странице:</label>
          <select
            id="itemsPerPage"
            class="pagination__select"
            v-model="perPage"
            @change="
              isSelectOpen = false;
              page = 1;
            "
          >
            <option class="pagination__option" :value="5">5</option>
            <option class="pagination__option" :value="20">20</option>
            <option class="pagination__option" :value="35">35</option>
          </select>
        </div>
      </div>
  </template>
</template>
