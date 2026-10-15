export interface HeapItem<T> {
  priority: number
  seq: number
  value: T
}

/**
 * Binary max-heap.
 * Heap property: parent.priority >= children.priority.
 * Tie-break: smaller seq (earlier insert) wins — deterministic FIFO among equals.
 */
export class MaxHeap<T> {
  private data: HeapItem<T>[] = []
  private nextSeq = 0

  constructor(items: HeapItem<T>[] = [], nextSeq = 0) {
    this.data = items.map((item) => ({ ...item }))
    this.nextSeq = nextSeq
  }

  get size(): number {
    return this.data.length
  }

  isEmpty(): boolean {
    return this.data.length === 0
  }

  peek(): HeapItem<T> | undefined {
    return this.data[0]
  }

  toArray(): HeapItem<T>[] {
    return this.data.map((item) => ({ ...item }))
  }

  insert(value: T, priority: number, seq?: number): void {
    const item: HeapItem<T> = {
      value,
      priority,
      seq: seq ?? this.nextSeq++,
    }
    if (seq !== undefined && seq >= this.nextSeq) this.nextSeq = seq + 1
    this.data.push(item)
    this.siftUp(this.data.length - 1)
  }

  extractMax(): HeapItem<T> | undefined {
    if (this.data.length === 0) return undefined
    const max = this.data[0]
    const last = this.data.pop()
    if (this.data.length > 0 && last) {
      this.data[0] = last
      this.siftDown(0)
    }
    return max
  }

  /** Change priority of the first matching value. Returns false if missing. */
  changePriority(match: (value: T) => boolean, newPriority: number): boolean {
    const index = this.data.findIndex((item) => match(item.value))
    if (index < 0) return false
    const old = this.data[index].priority
    this.data[index].priority = newPriority
    if (newPriority > old) {
      this.siftUp(index)
    } else if (newPriority < old) {
      this.siftDown(index)
    }
    return true
  }

  contains(match: (value: T) => boolean): boolean {
    return this.data.some((item) => match(item.value))
  }

  getSeqCounter(): number {
    return this.nextSeq
  }

  private parent(i: number): number {
    return Math.floor((i - 1) / 2)
  }

  private left(i: number): number {
    return 2 * i + 1
  }

  private right(i: number): number {
    return 2 * i + 2
  }

  private greater(i: number, j: number): boolean {
    if (j < 0 || j >= this.data.length) return true
    const a = this.data[i]
    const b = this.data[j]
    if (a.priority !== b.priority) return a.priority > b.priority
    return a.seq < b.seq
  }

  private siftUp(i: number): void {
    while (i > 0 && this.greater(i, this.parent(i))) {
      this.swap(i, this.parent(i))
      i = this.parent(i)
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length
    while (true) {
      let best = i
      const l = this.left(i)
      const r = this.right(i)
      if (l < n && this.greater(l, best)) best = l
      if (r < n && this.greater(r, best)) best = r
      if (best === i) break
      this.swap(i, best)
      i = best
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.data[i]
    this.data[i] = this.data[j]
    this.data[j] = tmp
  }
}

export class MinHeap<T> {
  private data: { key: number; value: T }[] = []

  get size(): number {
    return this.data.length
  }

  insert(value: T, key: number): void {
    this.data.push({ key, value })
    this.siftUp(this.data.length - 1)
  }

  extractMin(): { key: number; value: T } | undefined {
    if (this.data.length === 0) return undefined
    const min = this.data[0]
    const last = this.data.pop()
    if (this.data.length > 0 && last) {
      this.data[0] = last
      this.siftDown(0)
    }
    return min
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2)
      if (this.data[i].key >= this.data[p].key) break
      const tmp = this.data[i]
      this.data[i] = this.data[p]
      this.data[p] = tmp
      i = p
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length
    while (true) {
      let smallest = i
      const l = 2 * i + 1
      const r = 2 * i + 2
      if (l < n && this.data[l].key < this.data[smallest].key) smallest = l
      if (r < n && this.data[r].key < this.data[smallest].key) smallest = r
      if (smallest === i) break
      const tmp = this.data[i]
      this.data[i] = this.data[smallest]
      this.data[smallest] = tmp
      i = smallest
    }
  }
}
