import {
  inorder,
  levelOrder,
  nodeCount,
  postorder,
  preorder,
  treeHeight,
  type BinaryTreeNode,
} from '../binary-tree/BinaryTree'

export class BST {
  root: BinaryTreeNode | null = null

  insert(value: number): boolean {
    if (this.root === null) {
      this.root = { value, left: null, right: null }
      return true
    }
    let cur = this.root
    while (true) {
      if (value === cur.value) return false
      if (value < cur.value) {
        if (!cur.left) {
          cur.left = { value, left: null, right: null }
          return true
        }
        cur = cur.left
      } else {
        if (!cur.right) {
          cur.right = { value, left: null, right: null }
          return true
        }
        cur = cur.right
      }
    }
  }

  search(value: number): { found: boolean; comparisons: number } {
    let cur = this.root
    let comparisons = 0
    while (cur) {
      comparisons++
      if (value === cur.value) return { found: true, comparisons }
      cur = value < cur.value ? cur.left : cur.right
    }
    return { found: false, comparisons }
  }

  delete(value: number): boolean {
    const result = deleteNode(this.root, value)
    this.root = result.node
    return result.deleted
  }

  inorder(): number[] {
    return inorder(this.root)
  }
  preorder(): number[] {
    return preorder(this.root)
  }
  postorder(): number[] {
    return postorder(this.root)
  }
  levelOrder(): number[] {
    return levelOrder(this.root)
  }
  height(): number {
    return treeHeight(this.root)
  }
  count(): number {
    return nodeCount(this.root)
  }
}

function deleteNode(
  node: BinaryTreeNode | null,
  value: number,
): { node: BinaryTreeNode | null; deleted: boolean } {
  if (!node) return { node: null, deleted: false }
  if (value < node.value) {
    const res = deleteNode(node.left, value)
    node.left = res.node
    return { node, deleted: res.deleted }
  }
  if (value > node.value) {
    const res = deleteNode(node.right, value)
    node.right = res.node
    return { node, deleted: res.deleted }
  }
  if (!node.left) return { node: node.right, deleted: true }
  if (!node.right) return { node: node.left, deleted: true }
  let succ = node.right
  while (succ.left) succ = succ.left
  node.value = succ.value
  const res = deleteNode(node.right, succ.value)
  node.right = res.node
  return { node, deleted: true }
}
