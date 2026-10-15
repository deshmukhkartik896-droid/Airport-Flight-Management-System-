export class BPlusNode {
  keys: number[] = []
  children: BPlusNode[] = []
  isLeaf: boolean
  next: BPlusNode | null = null
  constructor(isLeaf: boolean) {
    this.isLeaf = isLeaf
  }
}

/**
 * Educational B+ Tree (minimum degree t).
 * All keys live in leaves. Internal nodes are routing indexes only.
 * Leaves are linked for sequential / range scans.
 */
export class BPlusTree {
  root: BPlusNode
  readonly t: number
  splits: string[] = []

  constructor(t = 2) {
    this.t = t
    this.root = new BPlusNode(true)
  }

  search(key: number): boolean {
    let node = this.root
    while (!node.isLeaf) {
      let i = 0
      while (i < node.keys.length && key >= node.keys[i]) i++
      node = node.children[i]
    }
    return node.keys.includes(key)
  }

  rangeSearch(from: number, to: number): number[] {
    let node: BPlusNode | null = this.root
    while (node && !node.isLeaf) {
      let i = 0
      while (i < node.keys.length && from >= node.keys[i]) i++
      node = node.children[i]
    }
    const out: number[] = []
    while (node) {
      for (const k of node.keys) {
        if (k >= from && k <= to) out.push(k)
        if (k > to) return out
      }
      node = node.next
    }
    return out
  }

  leafChain(): number[] {
    let node: BPlusNode | null = this.root
    while (node && !node.isLeaf) node = node.children[0]
    const out: number[] = []
    while (node) {
      out.push(...node.keys)
      node = node.next
    }
    return out
  }

  insert(key: number): void {
    const r = this.root
    if (r.keys.length === 2 * this.t - 1) {
      const s = new BPlusNode(false)
      s.children.push(r)
      this.root = s
      this.splitChild(s, 0)
    }
    this.insertNonFull(this.root, key)
  }

  private insertNonFull(node: BPlusNode, key: number): void {
    if (node.isLeaf) {
      let i = 0
      while (i < node.keys.length && node.keys[i] < key) i++
      if (node.keys[i] === key) return
      node.keys.splice(i, 0, key)
      return
    }
    let i = 0
    while (i < node.keys.length && key >= node.keys[i]) i++
    if (node.children[i].keys.length === 2 * this.t - 1) {
      this.splitChild(node, i)
      if (key >= node.keys[i]) i++
    }
    this.insertNonFull(node.children[i], key)
  }

  private splitChild(parent: BPlusNode, index: number): void {
    const t = this.t
    const y = parent.children[index]
    const z = new BPlusNode(y.isLeaf)
    if (y.isLeaf) {
      z.keys = y.keys.splice(t)
      z.next = y.next
      y.next = z
      parent.keys.splice(index, 0, z.keys[0])
      parent.children.splice(index + 1, 0, z)
      this.splits.push(`Leaf split; copy-up key ${z.keys[0]}`)
    } else {
      const mid = y.keys[t - 1]
      z.keys = y.keys.splice(t)
      y.keys.pop()
      z.children = y.children.splice(t)
      parent.keys.splice(index, 0, mid)
      parent.children.splice(index + 1, 0, z)
      this.splits.push(`Internal split; push-up key ${mid}`)
    }
  }

  validate(): boolean {
    const leaves = this.leafChain()
    for (let i = 1; i < leaves.length; i++) {
      if (leaves[i] < leaves[i - 1]) return false
    }
    return this.validateNode(this.root, true)
  }

  private validateNode(node: BPlusNode, isRoot: boolean): boolean {
    const maxKeys = 2 * this.t - 1
    if (node.keys.length > maxKeys) return false
    if (!isRoot && node.keys.length < this.t - 1) return false
    if (node.isLeaf) return node.children.length === 0
    if (node.children.length !== node.keys.length + 1) return false
    return node.children.every((c) => this.validateNode(c, false))
  }
}
