<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import { useRouter } from "vue-router";
import "../style.scss";
import { useGlobalStore } from "@/shared/store/globalStore";
import { getTreeviewData } from "@/shared/ui/CustomTreeview/utils/getTreeviewData";

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
const importInput = ref(null);
const router = useRouter();
const expandedKeys = ref({});
const globalStore = useGlobalStore();

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

onMounted(fetchComponents);

async function fetchComponents() {
  const response = await getDataAsync({
    endpoint: `/${props.currentSection}/tree`,
  });

  // treeData.value = buildTree(data);
  const node = getTreeviewData(response.data);
  treeData.value = node.children || [];
}

defineExpose({
  refreshTree: fetchComponents,
});

function onNodeSelect(event: any) {
  selectedKey.value = event.key;
  globalStore.setCurrentSection(event.data.nodeType);

  console.debug(globalStore.currentSection);
  emit("node-select", event);
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
</script>

<template>
  <template v-if="treeData">
    <Tree
      :value="treeData"
      selectionMode="single"
      class="treeview"
      v-model:selectionKey="selectedKey"
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
        <div class="treeview__data__wrapper">
          <span class="treeview__data__label">
            {{ slotProps.node.label }}
          </span>
        </div>
      </template>
    </Tree>
  </template>
  <template v-else>
    <h1>Нет данных для отображения</h1>
  </template>
</template>
