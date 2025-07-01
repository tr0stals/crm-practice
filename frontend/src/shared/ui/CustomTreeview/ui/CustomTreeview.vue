<script setup lang="ts">
import Tree from "primevue/tree";
import { onMounted, ref, watch, type Ref } from "vue";
import type { TreeNode } from "primevue/treenode";
import { useGetTreeviewData } from "../model/useGetTreeviewData";
import "../style.scss";

const props = defineProps<{
  onClick?: (node: TreeNode) => void;
  data: any[];
  currentSection: string;
  component?: any;
  extraClasses?: string[];
  extraAttrs?: string[];
  searchQuery?: string;
}>();

const treeviewData: Ref<TreeNode[]> = ref([]);
const expandedKeys = ref<Record<string, boolean>>({});
const selectedKey = ref();

watch(selectedKey, (newVal) => {
  console.debug(newVal);
});

// Следим за props и обновляем дерево асинхронно
watch(
  () => [props.data, props.currentSection, props.searchQuery],
  async ([newData, newSection, newSearch]) => {
    const { tree, expandedKeys: expKeys } = await useGetTreeviewData(
      newData,
      newSection,
      { foreignTableName: "organization_types" },
      newSearch
    );
    treeviewData.value = tree;
    expandedKeys.value = expKeys;
    console.debug("treeviewData:", treeviewData.value);
  },
  { immediate: true }
);
</script>

<template>
  <Tree
    class="treeview"
    :value="treeviewData"
    selectionMode="single"
    v-model:selectionKeys="selectedKey"
    :expandedKeys="expandedKeys"
    :pt="{
      root: { class: 'treeview__root' },
      nodeContent: { class: 'treeview__data' },
      node: ({ context }) => ({
        class: context.selected ? 'treeview__data__selected' : '',
      }),
    }"
    :pt-options="{
      mergeProps: true,
    }"
    @node-select="
      (event) => event.key.startsWith('child') && props.onClick?.(event)
    "
  >
    <template #default="slotProps">
      <span
        v-if="slotProps.node.key.startsWith('child')"
        :data-js-section-data="JSON.stringify(slotProps.node.data)"
      >
        {{ slotProps.node.label }}
      </span>
      <template v-else-if="component">
        <component></component>
      </template>
      <span v-else>{{ slotProps.node.label }}</span>
    </template>
  </Tree>
</template>
