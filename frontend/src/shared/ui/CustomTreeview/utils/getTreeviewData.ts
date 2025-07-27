import type { TreeNode } from "primevue/treenode";

export const getTreeviewData = (node: any, level = 0): TreeNode => {
  console.debug("level", level);
  const treeNode: TreeNode = {
    id: node.id,
    key: `node-${Math.random().toString(36).substring(2, 9)}`,
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
