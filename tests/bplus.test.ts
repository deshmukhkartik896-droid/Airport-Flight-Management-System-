import { describe, expect, it } from 'vitest'
import { BPlusTree } from '../src/dsa/trees/b-plus-tree/BPlusTree'

describe('B+ Tree (Degree t = 2)', () => {
  it('initialises with an empty leaf root', () => {
    const bp = new BPlusTree(2)
    expect(bp.root.isLeaf).toBe(true)
    expect(bp.leafChain()).toEqual([])
    expect(bp.validate()).toBe(true)
  })

  it('inserts keys and maintains linked leaf chain', () => {
    const bp = new BPlusTree(2)
    const values = [20, 10, 40, 30, 50, 60, 25]
    values.forEach((v) => bp.insert(v))

    expect(bp.validate()).toBe(true)
    expect(bp.leafChain()).toEqual([10, 20, 25, 30, 40, 50, 60])
  })

  it('performs point searches successfully', () => {
    const bp = new BPlusTree(2)
    ;[15, 25, 35, 45].forEach((v) => bp.insert(v))

    expect(bp.search(15)).toBe(true)
    expect(bp.search(35)).toBe(true)
    expect(bp.search(99)).toBe(false)
    expect(bp.search(0)).toBe(false)
  })

  it('performs range searches using the linked leaf nodes', () => {
    const bp = new BPlusTree(2)
    const values = [5, 15, 25, 35, 45, 55, 65, 75]
    values.forEach((v) => bp.insert(v))

    expect(bp.rangeSearch(20, 50)).toEqual([25, 35, 45])
    expect(bp.rangeSearch(5, 25)).toEqual([5, 15, 25])
    expect(bp.rangeSearch(100, 200)).toEqual([])
  })

  it('splits leaves with copy-up and internal nodes with push-up', () => {
    const bp = new BPlusTree(2)
    ;[10, 20, 30, 40, 50, 60, 70, 80].forEach((v) => bp.insert(v))

    expect(bp.splits.length).toBeGreaterThan(0)
    // Leaf split logs "Leaf split; copy-up key ..."
    expect(bp.splits.some((s) => s.includes('Leaf split'))).toBe(true)
    expect(bp.validate()).toBe(true)
  })
})
