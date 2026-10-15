export class AvlNode {
  value: number
  height: number
  left: AvlNode | null
  right: AvlNode | null
  constructor(value: number) {
    this.value = value
    this.height = 0
    this.left = null
    this.right = null
  }
}

export type RotationKind = 'LL' | 'RR' | 'LR' | 'RL'

export interface AvlInsertResult {
  rotation: RotationKind | null
  involved: number[]
  log: string
}

function height(node: AvlNode | null): number {
  return node ? node.height : -1
}

function update(node: AvlNode): void {
  const lh = height(node.left)
  const rh = height(node.right)
  node.height = 1 + (lh > rh ? lh : rh)
}

function balanceFactor(node: AvlNode): number {
  return height(node.left) - height(node.right)
}

function rotateRight(y: AvlNode): AvlNode {
  const x = y.left!
  y.left = x.right
  x.right = y
  update(y)
  update(x)
  return x
}

function rotateLeft(x: AvlNode): AvlNode {
  const y = x.right!
  x.right = y.left
  y.left = x
  update(x)
  update(y)
  return y
}

export class AVL {
  root: AvlNode | null = null
  lastInsert: AvlInsertResult = { rotation: null, involved: [], log: 'No insertion yet' }

  clear(): void {
    this.root = null
    this.lastInsert = { rotation: null, involved: [], log: 'Tree cleared' }
  }

  insert(value: number): AvlInsertResult {
    this.lastInsert = { rotation: null, involved: [], log: `Insert ${value}` }
    this.root = this.insertNode(this.root, value)
    return this.lastInsert
  }

  search(value: number): boolean {
    let cur = this.root
    while (cur) {
      if (value === cur.value) return true
      cur = value < cur.value ? cur.left : cur.right
    }
    return false
  }

  inorder(node: AvlNode | null = this.root, out: number[] = []): number[] {
    if (!node) return out
    this.inorder(node.left, out)
    out.push(node.value)
    this.inorder(node.right, out)
    return out
  }

  isBalanced(node: AvlNode | null = this.root): boolean {
    if (!node) return true
    const bf = balanceFactor(node)
    if (bf > 1 || bf < -1) return false
    return this.isBalanced(node.left) && this.isBalanced(node.right)
  }

  height(): number {
    return height(this.root)
  }

  private insertNode(node: AvlNode | null, value: number): AvlNode {
    if (!node) return new AvlNode(value)
    if (value === node.value) return node
    if (value < node.value) node.left = this.insertNode(node.left, value)
    else node.right = this.insertNode(node.right, value)
    update(node)
    const bf = balanceFactor(node)
    if (bf > 1 && value < node.left!.value) {
      this.lastInsert = { rotation: 'LL', involved: [node.value, node.left!.value], log: `LL rotation at ${node.value}` }
      return rotateRight(node)
    }
    if (bf < -1 && value > node.right!.value) {
      this.lastInsert = { rotation: 'RR', involved: [node.value, node.right!.value], log: `RR rotation at ${node.value}` }
      return rotateLeft(node)
    }
    if (bf > 1 && value > node.left!.value) {
      this.lastInsert = {
        rotation: 'LR',
        involved: [node.value, node.left!.value, node.left!.right!.value],
        log: `LR rotation at ${node.value}`,
      }
      node.left = rotateLeft(node.left!)
      return rotateRight(node)
    }
    if (bf < -1 && value < node.right!.value) {
      this.lastInsert = {
        rotation: 'RL',
        involved: [node.value, node.right!.value, node.right!.left!.value],
        log: `RL rotation at ${node.value}`,
      }
      node.right = rotateRight(node.right!)
      return rotateLeft(node)
    }
    return node
  }
}

export function layoutAvl(node: AvlNode | null, depth = 0, xRef = { n: 0 }): {
  value: number
  x: number
  y: number
  bf: number
  left: ReturnType<typeof layoutAvl>
  right: ReturnType<typeof layoutAvl>
} | null {
  if (!node) return null
  const left = layoutAvl(node.left, depth + 1, xRef)
  const x = xRef.n
  xRef.n += 1
  const right = layoutAvl(node.right, depth + 1, xRef)
  return { value: node.value, x, y: depth, bf: balanceFactor(node), left, right }
}
