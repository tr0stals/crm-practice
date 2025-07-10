<template>
  <CustomTreeview
    :tree-data="treeData"
    :on-node-select="onNodeSelect"
    :selected-key="selectedKey"
    current-section="components"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { getDataAsync } from "@/shared/api/getDataAsync";
import Tree from "primevue/tree";
import AddEntity from "@/features/AddEntity/ui/AddEntityModal.vue";
import EditModalWindow from "@/features/EditModalWindow/ui/EditModalWindow.vue";
import { ModalManager } from "@/shared/plugins/modalManager";
import { deleteDataAsync } from "@/views/Dashboard/api/deleteDataAsync";
import * as XLSX from "xlsx";
import { useRouter } from "vue-router";
import "../style.scss";
import CustomTreeview from "@/shared/ui/CustomTreeview/ui/CustomTreeview.vue";

// Функция для построения всего дерева
const buildTreeview = (rootNode: any): TreeNode => {
  return getTreeviewData(rootNode);
};

const props = defineProps<{
  handleSelectCallback: (node: any) => void;
  search: string;
}>();

function getSelectedComponent() {
  if (!selectedKey.value) return null;
  const key = selectedKey.value;
  let found = null;
  function find(nodes) {
    for (const node of nodes) {
      if (node.key === key && node.isComponent) return node;
      if (node.children) {
        const res = find(node.children);
        if (res) return res;
      }
    }
    return null;
  }
  found = find(treeData.value);
  return found;
}
</script>
