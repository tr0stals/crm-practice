<script setup lang="ts">
import Tree from "primevue/tree";
import { onMounted, ref, watch, type Ref } from "vue";
import type { TreeNode } from "primevue/treenode";
import { useGetTreeviewData } from "../model/useGetTreeviewData";
import { event } from "@primeuix/themes/aura/timeline";
import "../style.scss";

const props = defineProps<{
  onClick?: (node: TreeNode) => void;
  data: any[];
  currentSection: string;
  extraClasses?: string[];
  extraAttrs?: string[];
}>();

const treeviewData: Ref<TreeNode[]> = ref([]);
const selectedKey = ref();

watch(selectedKey, (newVal) => {
  console.debug(newVal);
});

// Следим за props и обновляем дерево асинхронно
watch(
  () => [props.data, props.currentSection],
  async ([newData, newSection]) => {
    treeviewData.value = await useGetTreeviewData(newData, newSection);
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
    @node-select="(event) => props.onClick?.(event)"
  >
    <template #default="slotProps">
      <span
        v-if="slotProps.node.key.startsWith('child')"
        :data-js-section-data="JSON.stringify(slotProps.node.data)"
      >
        {{ slotProps.node.label }}
      </span>
      <span v-else>{{ slotProps.node.label }}</span>
    </template>
  </Tree>
</template>
