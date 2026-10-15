/**
 * Array-backed Stack. All primitive operations are O(1).
 * Used for DFS, operation-history undo, and the laboratory LIFO demo.
 */
export class Stack<T> {
  private items: T[] = []

  constructor(initial: T[] = []) {
    this.items = [...initial]
  }

  push(value: T): void {
    this.items.push(value)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  get size(): number {
    return this.items.length
  }

  toArray(): T[] {
    return [...this.items]
  }

  clear(): void {
    this.items = []
  }
}
