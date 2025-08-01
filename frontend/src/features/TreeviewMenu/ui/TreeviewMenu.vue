<script setup lang="ts">
import useFetch from "@/shared/lib/useFetch";
import "../style.scss";
import { defaultEndpoint } from "@/shared/api/axiosInstance";
import { ref, watch } from "vue";
import type { TreeNode } from "primevue/treenode";
import Tree from "primevue/tree";
import { useTreeviewMenu } from "../model/useTreeviewMenu";
import { localizatedSectionsList } from "@/shared/config/localizatedSections";
import LoadingLayout from "@/shared/ui/LoadingLayout/ui/LoadingLayout.vue";
import { useNavigationStore } from "@/entities/NavigationEntity/model/store";

const selectedKey = ref(null);
const expandedKeys = ref<any>({});
const selectedSection = ref("");
const navigationStore = useNavigationStore();

const { data, loading, refetch } = useFetch(
  `${defaultEndpoint}/database/treeTables`
);
const treeData = ref<TreeNode[]>();
const { getTreeviewData } = useTreeviewMenu();

const emit = defineEmits<{
  (e: "node-select", item: any): void;
}>();

watch(
  () => data.value,
  () => {
    console.debug(data.value);
    const tree = getTreeviewData(data.value || []);

    treeData.value = tree; // Массив узлов, без дополнительной обёртки
    console.debug(treeData.value);
  }
);

function onNodeSelect(event: any) {
  navigationStore.resetData();
  selectedKey.value = event.key;
  console.debug(event);
  selectedSection.value = event.data.nodeType;

  emit("node-select", event);
}

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
  <Tree
    v-else-if="!loading"
    :value="treeData"
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
        @click="toggleExpand(slotProps.node)"
        class="treeview__data__wrapper"
      >
        <span class="treeview__data__label">
          {{ localizatedSectionsList[slotProps.node.label!] }}
        </span>
      </div>
    </template>
  </Tree>
</template>
