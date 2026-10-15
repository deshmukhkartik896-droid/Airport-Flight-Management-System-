import { describe, expect, it } from 'vitest'
import { MaxHeap, MinHeap } from '../src/dsa/heap/MaxHeap'

describe('Binary Heaps (Max-Heap & Min-Heap)', () => {
  describe('MaxHeap with sequence tie-breaking', () => {
    it('initialises empty and handles peek/extractMax on empty heap', () => {
      const heap = new MaxHeap<string>()
      expect(heap.isEmpty()).toBe(true)
      expect(heap.size).toBe(0)
      expect(heap.peek()).toBeUndefined()
      expect(heap.extractMax()).toBeUndefined()
    })

    it('extracts maximum priority items first', () => {
      const heap = new MaxHeap<string>()
      heap.insert('Routine', 1)
      heap.insert('Urgent', 3)
      heap.insert('Time-sensitive', 2)
      heap.insert('Emergency', 4)

      expect(heap.size).toBe(4)
      expect(heap.peek()?.value).toBe('Emergency')
      expect(heap.extractMax()?.value).toBe('Emergency')
      expect(heap.extractMax()?.value).toBe('Urgent')
      expect(heap.extractMax()?.value).toBe('Time-sensitive')
      expect(heap.extractMax()?.value).toBe('Routine')
      expect(heap.isEmpty()).toBe(true)
    })

    it('breaks ties deterministically using insertion sequence (FIFO among equal priorities)', () => {
      const heap = new MaxHeap<string>()
      heap.insert('First-Urgent', 3, 0)
      heap.insert('Second-Urgent', 3, 1)
      heap.insert('Third-Urgent', 3, 2)

      expect(heap.extractMax()?.value).toBe('First-Urgent')
      expect(heap.extractMax()?.value).toBe('Second-Urgent')
      expect(heap.extractMax()?.value).toBe('Third-Urgent')
    })

    it('supports dynamic changePriority (promotion and demotion)', () => {
      const heap = new MaxHeap<string>()
      heap.insert('Flight-A', 1, 0)
      heap.insert('Flight-B', 2, 1)

      // Promote Flight-A to priority 4 (simulated emergency)
      const promoted = heap.changePriority((v) => v === 'Flight-A', 4)
      expect(promoted).toBe(true)
      expect(heap.peek()?.value).toBe('Flight-A')

      // Demote Flight-A to 1
      heap.changePriority((v) => v === 'Flight-A', 1)
      expect(heap.peek()?.value).toBe('Flight-B')
    })

    it('checks contains predicate', () => {
      const heap = new MaxHeap<string>()
      heap.insert('FL100', 2)
      expect(heap.contains((v) => v === 'FL100')).toBe(true)
      expect(heap.contains((v) => v === 'FL999')).toBe(false)
    })
  })

  describe('MinHeap', () => {
    it('extracts minimum keys first', () => {
      const heap = new MinHeap<string>()
      heap.insert('Node-C', 300)
      heap.insert('Node-A', 100)
      heap.insert('Node-B', 200)

      expect(heap.size).toBe(3)
      expect(heap.extractMin()).toEqual({ key: 100, value: 'Node-A' })
      expect(heap.extractMin()).toEqual({ key: 200, value: 'Node-B' })
      expect(heap.extractMin()).toEqual({ key: 300, value: 'Node-C' })
      expect(heap.extractMin()).toBeUndefined()
    })
  })
})
