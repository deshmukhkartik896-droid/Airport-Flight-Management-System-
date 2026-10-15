import { describe, expect, it } from 'vitest'
import { Queue } from '../src/dsa/queue/Queue'

describe('Queue (FIFO with head pointer, no Array.shift)', () => {
  it('initialises empty or with initial elements', () => {
    const q1 = new Queue<number>()
    expect(q1.isEmpty()).toBe(true)
    expect(q1.size).toBe(0)
    expect(q1.peek()).toBeUndefined()
    expect(q1.dequeue()).toBeUndefined()

    const q2 = new Queue<string>(['A', 'B'])
    expect(q2.size).toBe(2)
    expect(q2.peek()).toBe('A')
  })

  it('enqueues and dequeues in FIFO order', () => {
    const q = new Queue<string>()
    q.enqueue('flight-1')
    q.enqueue('flight-2')
    q.enqueue('flight-3')

    expect(q.size).toBe(3)
    expect(q.peek()).toBe('flight-1')
    expect(q.dequeue()).toBe('flight-1')
    expect(q.peek()).toBe('flight-2')
    expect(q.dequeue()).toBe('flight-2')
    expect(q.dequeue()).toBe('flight-3')
    expect(q.dequeue()).toBeUndefined()
    expect(q.isEmpty()).toBe(true)
  })

  it('compacts correctly when head pointer advances significantly', () => {
    const q = new Queue<number>()
    // Enqueue 70 items
    for (let i = 0; i < 70; i++) {
      q.enqueue(i)
    }
    expect(q.size).toBe(70)

    // Dequeue 40 items — triggers internal compact when head > 32 && head * 2 >= length
    for (let i = 0; i < 40; i++) {
      expect(q.dequeue()).toBe(i)
    }
    expect(q.size).toBe(30)
    expect(q.peek()).toBe(40)
    expect(q.toArray()).toEqual(Array.from({ length: 30 }, (_, idx) => idx + 40))
  })

  it('supports contains predicate and clear', () => {
    const q = new Queue<{ id: string; prio: number }>()
    q.enqueue({ id: 'f1', prio: 1 })
    q.enqueue({ id: 'f2', prio: 3 })

    expect(q.contains((item) => item.id === 'f2')).toBe(true)
    expect(q.contains((item) => item.id === 'f99')).toBe(false)

    q.clear()
    expect(q.size).toBe(0)
    expect(q.isEmpty()).toBe(true)
    expect(q.contains((item) => item.id === 'f1')).toBe(false)
  })
})
