<script setup lang="ts">
import Tree from "primevue/tree";
import { treeviewData as nodes } from "@/shared/config/treeviewData";
import { ref } from "vue";
import type { TreeNode } from "primevue/treenode";

const props = defineProps<{
  data: TreeNode;
  extraClasses?: string[];
  extraAttrs?: string[];
}>();

const expandedKeys = ref<any>({});

const expandNode = (node: any) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true;

    for (let child of node.children) {
      expandNode(child);
    }
  }
};
console.debug(nodes);
</script>

<template>
  <Tree :value="props.data" class=""></Tree>
</template>
