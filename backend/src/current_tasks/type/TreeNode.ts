export type TreeNode = {
  id?: number;
  name: string;
  nodeType: string;
  currentTaskState?: string;
  children: TreeNode[];
};
