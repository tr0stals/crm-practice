import type { TreeNode } from "primevue/treenode";

export function useTreeviewMenu() {
  const getTreeviewData = (nodes: any[], level = 0): TreeNode[] => {
    console.debug(nodes);
    return nodes.map((node) => {
      const treeNode: TreeNode = {
        id: node.id,
        key: `node-${Math.random().toString(36).substring(2, 9)}`,
        label: node.name || node.title,
        data: node,
        level,
      };

      if (node.children && node.children.length > 0) {
        treeNode.children = getTreeviewData(node.children, level + 1);
      } else if (node.width || node.height || node.material) {
        treeNode.isProduct = true;
        treeNode.leaf = true;
      }

      return treeNode;
    });
  };

  return {
    getTreeviewData,
  };
}
