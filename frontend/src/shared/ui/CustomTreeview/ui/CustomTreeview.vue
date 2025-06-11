<script setup>
import Tree from "primevue/tree";
import { treeviewData as nodes } from "@/shared/config/treeviewData";
import { ref } from "vue";

const expandedKeys = ref({});

const expandAll = () => {
  for (let node of nodes.value) {
    expandNode(node);
  }

  expandedKeys.value = { ...expandedKeys.value };
};

const collapseAll = () => {
  expandedKeys.value = {};
};

const expandNode = (node) => {
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
  <div class="card">
    <Tree
      v-model:expandedKeys="expandedKeys"
      :value="nodes"
      class="w-full md:w-[30rem]"
    ></Tree>
  </div>
</template>
