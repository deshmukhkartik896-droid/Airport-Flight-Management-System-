export class ListNode<T> {
  value: T
  next: ListNode<T> | null
  constructor(value: T, next: ListNode<T> | null = null) {
    this.value = value
    this.next = next
  }
}

export class SinglyLinkedList<T> {
  head: ListNode<T> | null = null

  insertHead(value: T): void {
    this.head = new ListNode(value, this.head)
  }

  insertTail(value: T): void {
    const node = new ListNode(value)
    if (!this.head) {
      this.head = node
      return
    }
    let cur = this.head
    while (cur.next) cur = cur.next
    cur.next = node
  }

  deleteValue(value: T): boolean {
    if (!this.head) return false
    if (this.head.value === value) {
      this.head = this.head.next
      return true
    }
    let cur = this.head
    while (cur.next) {
      if (cur.next.value === value) {
        cur.next = cur.next.next
        return true
      }
      cur = cur.next
    }
    return false
  }

  search(value: T): { found: boolean; index: number } {
    let cur = this.head
    let index = 0
    while (cur) {
      if (cur.value === value) return { found: true, index }
      cur = cur.next
      index++
    }
    return { found: false, index: -1 }
  }

  traverse(): T[] {
    const out: T[] = []
    let cur = this.head
    while (cur) {
      out.push(cur.value)
      cur = cur.next
    }
    return out
  }

  toPairs(): { value: T; next: T | null }[] {
    const out: { value: T; next: T | null }[] = []
    let cur = this.head
    while (cur) {
      out.push({ value: cur.value, next: cur.next ? cur.next.value : null })
      cur = cur.next
    }
    return out
  }
}
