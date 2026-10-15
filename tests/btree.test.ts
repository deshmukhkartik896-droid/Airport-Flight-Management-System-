import { describe, expect, it } from 'vitest'
import { BTree } from '../src/dsa/trees/b-tree/BTree'

describe('B-Tree (Degree t = 2)', () => {
  it('creates an empty leaf root', () => {
    const bt = new BTree(2)
    expect(bt.root.leaf).toBe(true)
    expect(bt.root.keys).toEqual([])
    expect(bt.validate()).toBe(true)
  })

  it('inserts up to 2t-1 keys without splitting', () => {
    const bt = new BTree(2) // max keys per node = 2*2 - 1 = 3
    bt.insert(10)
    bt.insert(20)
    bt.insert(30)

    expect(bt.root.keys).toEqual([10, 20, 30])
    expect(bt.root.leaf).toBe(true)
    expect(bt.splits.length).toBe(0)
    expect(bt.validate()).toBe(true)
  })

  it('splits root when inserting a 4th key into full root', () => {
    const bt = new BTree(2)
    ;[10, 20, 30].forEach((k) => bt.insert(k))
    // 4th insertion causes root split
    bt.insert(40)

    expect(bt.splits.length).toBeGreaterThan(0)
    expect(bt.validate()).toBe(true)
    expect(bt.root.leaf).toBe(false)
    expect(bt.inorder()).toEqual([10, 20, 30, 40])
  })

  it('maintains B-Tree key bounds and sorted inorder across multiple insertions', () => {
    const bt = new BTree(2)
    const values = [50, 20, 70, 10, 30, 60, 80, 5, 15, 25, 35, 90]
    values.forEach((v) => bt.insert(v))

    expect(bt.validate()).toBe(true)
    expect(bt.inorder()).toEqual([...values].sort((a, b) => a - b))

    // Search tests
    for (const v of values) {
      expect(bt.search(v).found).toBe(true)
    }
    expect(bt.search(999).found).toBe(false)
    expect(bt.search(0).found).toBe(false)
  })
})
