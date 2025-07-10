<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import { useRouter } from "vue-router";
import "../style.scss";

const props = defineProps<{
  handleSelectCallback?: (item: any) => void;
  currentSection: string;
  extraClasses?: string[];
  extraAttrs?: string[];
}>();

const treeData = ref<any[]>([]);
const selectedKey = ref(null);
const importInput = ref(null);
const router = useRouter();
const expandedKeys = ref({});

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

const getTreeviewData = (node: any, level = 0): TreeNode => {
  const treeNode: TreeNode = {
    id: node.id,
    key: `node-${node.id || Math.random().toString(36).substring(2, 9)}`,
    label: node.name || node.title,
    data: node,
    level,
  };

  if (node.children && node.children.length > 0) {
    treeNode.children = node.children.map((child: any) =>
      getTreeviewData(child, level + 1)
    );
  } else if (node.width || node.height || node.material) {
    treeNode.isProduct = true;
    treeNode.leaf = true;
  }

  return treeNode;
};

async function fetchComponents() {
  const { data } = await getDataAsync({
    endpoint: `/${props.currentSection}/get`,
  });
  // treeData.value = buildTree(data);
  const node = getTreeviewData(data);
  treeData.value = node.children || [];
}

function onNodeSelect(event: any) {
  selectedKey.value = event.key;
  const node = event;
  props.handleSelectCallback(node);
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
