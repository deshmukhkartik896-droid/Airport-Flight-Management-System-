import { describe, expect, it } from 'vitest'
import { AVL } from '../src/dsa/trees/avl/AVL'

describe('AVL Tree and Rotations', () => {
  it('performs an LL rotation (Right Rotate at unbalanced node)', () => {
    const avl = new AVL()
    // Inserting decreasing sequence: 30, 20, 10 produces left-heavy tree -> LL rotation
    avl.insert(30)
    avl.insert(20)
    const res = avl.insert(10)

    expect(res.rotation).toBe('LL')
    expect(res.involved).toContain(30)
    expect(res.involved).toContain(20)
    expect(avl.root?.value).toBe(20)
    expect(avl.root?.left?.value).toBe(10)
    expect(avl.root?.right?.value).toBe(30)
    expect(avl.isBalanced()).toBe(true)
    expect(avl.inorder()).toEqual([10, 20, 30])
  })

  it('performs an RR rotation (Left Rotate at unbalanced node)', () => {
    const avl = new AVL()
    // Inserting increasing sequence: 10, 20, 30 produces right-heavy tree -> RR rotation
    avl.insert(10)
    avl.insert(20)
    const res = avl.insert(30)

    expect(res.rotation).toBe('RR')
    expect(res.involved).toContain(10)
    expect(res.involved).toContain(20)
    expect(avl.root?.value).toBe(20)
    expect(avl.root?.left?.value).toBe(10)
    expect(avl.root?.right?.value).toBe(30)
    expect(avl.isBalanced()).toBe(true)
    expect(avl.inorder()).toEqual([10, 20, 30])
  })

  it('performs an LR rotation (Left Rotate child, then Right Rotate node)', () => {
    const avl = new AVL()
    // Sequence 30, 10, 20 produces left-right shape -> LR rotation
    avl.insert(30)
    avl.insert(10)
    const res = avl.insert(20)

    expect(res.rotation).toBe('LR')
    expect(avl.root?.value).toBe(20)
    expect(avl.root?.left?.value).toBe(10)
    expect(avl.root?.right?.value).toBe(30)
    expect(avl.isBalanced()).toBe(true)
    expect(avl.inorder()).toEqual([10, 20, 30])
  })

  it('performs an RL rotation (Right Rotate child, then Left Rotate node)', () => {
    const avl = new AVL()
    // Sequence 10, 30, 20 produces right-left shape -> RL rotation
    avl.insert(10)
    avl.insert(30)
    const res = avl.insert(20)

    expect(res.rotation).toBe('RL')
    expect(avl.root?.value).toBe(20)
    expect(avl.root?.left?.value).toBe(10)
    expect(avl.root?.right?.value).toBe(30)
    expect(avl.isBalanced()).toBe(true)
    expect(avl.inorder()).toEqual([10, 20, 30])
  })

  it('maintains balance factor invariant across multiple insertions', () => {
    const avl = new AVL()
    const numbers = [15, 20, 24, 10, 13, 7, 30, 36, 25]
    for (const n of numbers) {
      avl.insert(n)
      expect(avl.isBalanced()).toBe(true)
    }

    expect(avl.inorder()).toEqual([...numbers].sort((a, b) => a - b))
    expect(avl.search(24)).toBe(true)
    expect(avl.search(999)).toBe(false)
  })

  it('ignores duplicate key insertion', () => {
    const avl = new AVL()
    avl.insert(10)
    avl.insert(10)
    expect(avl.inorder()).toEqual([10])
  })
})
