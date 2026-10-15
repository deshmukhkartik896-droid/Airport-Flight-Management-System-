/**
 * FIFO Queue using a head index rather than Array.shift().
 *
 * enqueue: O(1)
 * dequeue: O(1) amortized (occasional compact is O(n) but rare)
 * peek / size: O(1)
 *
 * Array.shift() is O(n) on every removal; this implementation avoids that
 * educational anti-pattern while remaining easy to explain in a viva.
 */
export class Queue<T> {
  private items: T[] = []
  private head = 0

  constructor(initial: T[] = []) {
    this.items = [...initial]
    this.head = 0
  }

  enqueue(value: T): void {
    this.items.push(value)
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined
    const value = this.items[this.head]
    this.head += 1
    if (this.head > 32 && this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head)
      this.head = 0
    }
    return value
  }

  peek(): T | undefined {
    if (this.isEmpty()) return undefined
    return this.items[this.head]
  }

  isEmpty(): boolean {
    return this.head >= this.items.length
  }

  get size(): number {
    return this.items.length - this.head
  }

  toArray(): T[] {
    return this.items.slice(this.head)
  }

  clear(): void {
    this.items = []
    this.head = 0
  }

  contains(predicate: (value: T) => boolean): boolean {
    for (let i = this.head; i < this.items.length; i++) {
      if (predicate(this.items[i])) return true
    }
    return false
  }
}
