import { describe, expect, it } from 'vitest'
import { indexedAccess, minMax, traverseArray } from '../src/dsa/arrays/arrayOps'

describe('Arrays and Min / Max Operations', () => {
  it('traverses array and generates indexed steps', () => {
    const list = ['A320', 'B737', 'ATR72']
    const steps = traverseArray(list)
    expect(steps).toEqual([
      { index: 0, value: 'A320' },
      { index: 1, value: 'B737' },
      { index: 2, value: 'ATR72' },
    ])
  })

  it('performs safe indexed access', () => {
    const list = [100, 200, 300]
    expect(indexedAccess(list, 0)).toBe(100)
    expect(indexedAccess(list, 2)).toBe(300)
    expect(indexedAccess(list, -1)).toBeUndefined()
    expect(indexedAccess(list, 3)).toBeUndefined()
  })

  describe('minMax', () => {
    it('finds min, max and indices on positive integers', () => {
      const delays = [15, 0, 35, 120, 45, 10]
      const res = minMax(delays)
      expect(res.min).toBe(0)
      expect(res.minIndex).toBe(1)
      expect(res.max).toBe(120)
      expect(res.maxIndex).toBe(3)
      expect(res.comparisons).toBe(2 * (delays.length - 1))
    })

    it('handles empty input gracefully', () => {
      const res = minMax([])
      expect(res.min).toBeNull()
      expect(res.max).toBeNull()
      expect(res.minIndex).toBe(-1)
      expect(res.maxIndex).toBe(-1)
      expect(res.comparisons).toBe(0)
    })

    it('handles single-element input', () => {
      const res = minMax([42])
      expect(res.min).toBe(42)
      expect(res.max).toBe(42)
      expect(res.minIndex).toBe(0)
      expect(res.maxIndex).toBe(0)
      expect(res.comparisons).toBe(0)
    })

    it('handles negative numbers and zero', () => {
      const res = minMax([-30, -5, -80, 0, -10])
      expect(res.min).toBe(-80)
      expect(res.minIndex).toBe(2)
      expect(res.max).toBe(0)
      expect(res.maxIndex).toBe(3)
    })

    it('handles all identical elements', () => {
      const res = minMax([7, 7, 7, 7])
      expect(res.min).toBe(7)
      expect(res.max).toBe(7)
      expect(res.minIndex).toBe(0)
      expect(res.maxIndex).toBe(0)
    })
  })
})
