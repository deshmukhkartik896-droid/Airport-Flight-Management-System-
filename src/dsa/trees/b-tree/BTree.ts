export class BTreeNode {
  keys: number[] = []
  children: BTreeNode[] = []
  leaf: boolean
  constructor(leaf: boolean) {
    this.leaf = leaf
  }
}

/**
 * B-Tree of minimum degree t.
 * Invariant: every node has at most 2t-1 keys; every node except root has at least t-1 keys.
 */
export class BTree {
  root: BTreeNode
  readonly t: number
  splits: string[] = []

  constructor(t = 2) {
    this.t = t
    this.root = new BTreeNode(true)
  }

  search(key: number, node: BTreeNode = this.root): { found: boolean; node: BTreeNode | null } {
    let i = 0
    while (i < node.keys.length && key > node.keys[i]) i++
    if (i < node.keys.length && node.keys[i] === key) return { found: true, node }
    if (node.leaf) return { found: false, node: null }
    return this.search(key, node.children[i])
  }

  insert(key: number): void {
    const r = this.root
    if (r.keys.length === 2 * this.t - 1) {
      const s = new BTreeNode(false)
      this.root = s
      s.children.push(r)
      this.splitChild(s, 0)
      this.insertNonFull(s, key)
    } else {
      this.insertNonFull(r, key)
    }
  }

  private insertNonFull(node: BTreeNode, key: number): void {
    let i = node.keys.length - 1
    if (node.leaf) {
      node.keys.push(0)
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i]
        i--
      }
      node.keys[i + 1] = key
      return
    }
    while (i >= 0 && key < node.keys[i]) i--
    i++
    if (node.children[i].keys.length === 2 * this.t - 1) {
      this.splitChild(node, i)
      if (key > node.keys[i]) i++
    }
    this.insertNonFull(node.children[i], key)
  }

  private splitChild(parent: BTreeNode, index: number): void {
    const t = this.t
    const y = parent.children[index]
    const z = new BTreeNode(y.leaf)
    const mid = y.keys[t - 1]
    z.keys = y.keys.splice(t)
    y.keys.pop()
    if (!y.leaf) {
      z.children = y.children.splice(t)
    }
    parent.children.splice(index + 1, 0, z)
    parent.keys.splice(index, 0, mid)
    this.splits.push(`Split node around ${mid}`)
  }

  inorder(node: BTreeNode = this.root, out: number[] = []): number[] {
    for (let i = 0; i < node.keys.length; i++) {
      if (!node.leaf) this.inorder(node.children[i], out)
      out.push(node.keys[i])
    }
    if (!node.leaf) this.inorder(node.children[node.keys.length], out)
    return out
  }

  /** Verify B-Tree key-count invariants. */
  validate(node: BTreeNode = this.root, isRoot = true): boolean {
    const maxKeys = 2 * this.t - 1
    const minKeys = isRoot ? 0 : this.t - 1
    if (node.keys.length > maxKeys) return false
    if (node.keys.length < minKeys) return false
    for (let i = 1; i < node.keys.length; i++) {
      if (node.keys[i] < node.keys[i - 1]) return false
    }
    if (node.leaf) return node.children.length === 0
    if (node.children.length !== node.keys.length + 1) return false
    return node.children.every((c) => this.validate(c, false))
  }
}
