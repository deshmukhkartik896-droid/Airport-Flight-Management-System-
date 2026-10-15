export class BinaryTreeNode {
  value: number
  left: BinaryTreeNode | null
  right: BinaryTreeNode | null
  constructor(value: number, left: BinaryTreeNode | null = null, right: BinaryTreeNode | null = null) {
    this.value = value
    this.left = left
    this.right = right
  }
}

export function demoBinaryTree(): BinaryTreeNode {
  return new BinaryTreeNode(
    40,
    new BinaryTreeNode(20, new BinaryTreeNode(10), new BinaryTreeNode(30)),
    new BinaryTreeNode(60, new BinaryTreeNode(50), new BinaryTreeNode(70)),
  )
}

export function inorder(node: BinaryTreeNode | null, out: number[] = []): number[] {
  if (!node) return out
  inorder(node.left, out)
  out.push(node.value)
  inorder(node.right, out)
  return out
}

export function preorder(node: BinaryTreeNode | null, out: number[] = []): number[] {
  if (!node) return out
  out.push(node.value)
  preorder(node.left, out)
  preorder(node.right, out)
  return out
}

export function postorder(node: BinaryTreeNode | null, out: number[] = []): number[] {
  if (!node) return out
  postorder(node.left, out)
  postorder(node.right, out)
  out.push(node.value)
  return out
}

export function levelOrder(node: BinaryTreeNode | null): number[] {
  if (!node) return []
  const q: BinaryTreeNode[] = [node]
  const out: number[] = []
  let i = 0
  while (i < q.length) {
    const cur = q[i++]
    out.push(cur.value)
    if (cur.left) q.push(cur.left)
    if (cur.right) q.push(cur.right)
  }
  return out
}

export function treeHeight(node: BinaryTreeNode | null): number {
  if (!node) return -1
  const lh = treeHeight(node.left)
  const rh = treeHeight(node.right)
  return 1 + (lh > rh ? lh : rh)
}

export function nodeCount(node: BinaryTreeNode | null): number {
  if (!node) return 0
  return 1 + nodeCount(node.left) + nodeCount(node.right)
}

export interface LaidOutNode {
  value: number
  x: number
  y: number
  left: LaidOutNode | null
  right: LaidOutNode | null
}

export function layoutBinary(node: BinaryTreeNode | null, depth = 0, xRef = { n: 0 }): LaidOutNode | null {
  if (!node) return null
  const left = layoutBinary(node.left, depth + 1, xRef)
  const x = xRef.n
  xRef.n += 1
  const right = layoutBinary(node.right, depth + 1, xRef)
  return { value: node.value, x, y: depth, left, right }
}
