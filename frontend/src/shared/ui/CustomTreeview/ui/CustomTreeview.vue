<script setup lang="ts">
import "../style.scss";
import Tree from "primevue/tree";
import { treeviewData as nodes } from "@/shared/config/treeviewData";
import { onMounted, ref, watch, type Ref } from "vue";
import type { TreeNode } from "primevue/treenode";
import { useGetTreeviewData } from "../model/useGetTreeviewData";
import { node } from "@primeuix/themes/aura/organizationchart";

const props = defineProps<{
  data: any[];
  currentSection: string;
  extraClasses?: string[];
  extraAttrs?: string[];
}>();

const treeviewData = ref<TreeNode[]>([]);
const selectedKey = ref();

watch(
  () => [props.data, props.currentSection],
  ([newData, newSection]) => {
    treeviewData.value = useGetTreeviewData(newData, newSection).value;
    console.debug(treeviewData.value);
  }
);

const openNodes = ref(new Set());

function toggleNode(node) {
  if (openNodes.value.has(node.key)) {
    openNodes.value.delete(node.key);
  } else {
    openNodes.value.add(node.key);
  }
}

function isNodeOpen(node) {
  return openNodes.value.has(node.key);
}
</script>

<template>
  <Tree
    class="treeview"
    :value="treeviewData"
    :pt="{
      root: { class: 'treeview__root' },

      nodeContent: { class: 'treeview__data' },
    }"
    :pt-options="{
      mergeProps: true,
    }"
  >
  </Tree>
</template>
