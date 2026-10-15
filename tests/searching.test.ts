import { describe, expect, it } from 'vitest'
import { binarySearch, binarySearchStrings, isNonDecreasing } from '../src/dsa/searching/binarySearch'
import { linearSearch } from '../src/dsa/searching/linearSearch'

describe('Searching Algorithms', () => {
  describe('Linear Search', () => {
    it('finds element at correct index and tracks comparisons', () => {
      const items = ['NAG', 'BOM', 'DEL', 'HYD', 'BLR']
      const res = linearSearch(items, 'DEL')
      expect(res.found).toBe(true)
      expect(res.index).toBe(2)
      expect(res.comparisons).toBe(3)
    })

    it('handles not found element across full scan', () => {
      const items = [10, 20, 30]
      const res = linearSearch(items, 99)
      expect(res.found).toBe(false)
      expect(res.index).toBe(-1)
      expect(res.comparisons).toBe(3)
    })

    it('handles empty input cleanly', () => {
      const res = linearSearch([], 'any')
      expect(res.found).toBe(false)
      expect(res.index).toBe(-1)
      expect(res.comparisons).toBe(0)
    })

    it('returns first occurrence on duplicates', () => {
      const res = linearSearch([5, 8, 8, 8, 9], 8)
      expect(res.found).toBe(true)
      expect(res.index).toBe(1)
      expect(res.comparisons).toBe(2)
    })
  })

  describe('Binary Search', () => {
    it('verifies non-decreasing sorted property', () => {
      expect(isNonDecreasing([1, 2, 2, 4, 9])).toBe(true)
      expect(isNonDecreasing([1, 5, 3])).toBe(false)
      expect(isNonDecreasing([])).toBe(true)
      expect(isNonDecreasing([42])).toBe(true)
    })

    it('finds element in sorted numbers using O(log n) comparisons', () => {
      const sorted = [10, 20, 30, 40, 50, 60, 70]
      const res = binarySearch(sorted, 50)
      expect(res.found).toBe(true)
      expect(res.index).toBe(4)
      expect(res.comparisons).toBeGreaterThan(0)
      expect(res.comparisons).toBeLessThanOrEqual(2 * Math.ceil(Math.log2(sorted.length + 1)) + 2)
    })

    it('finds boundary elements (first and last)', () => {
      const sorted = [5, 12, 19, 27, 34]
      const first = binarySearch(sorted, 5)
      expect(first.found).toBe(true)
      expect(first.index).toBe(0)

      const last = binarySearch(sorted, 34)
      expect(last.found).toBe(true)
      expect(last.index).toBe(4)
    })

    it('handles missing keys above, below, and between elements', () => {
      const sorted = [10, 20, 30]
      expect(binarySearch(sorted, 5).found).toBe(false)
      expect(binarySearch(sorted, 15).found).toBe(false)
      expect(binarySearch(sorted, 35).found).toBe(false)
    })

    it('handles empty input without errors', () => {
      const res = binarySearch([], 100)
      expect(res.found).toBe(false)
      expect(res.index).toBe(-1)
      expect(res.comparisons).toBe(0)
    })

    it('searches sorted strings correctly', () => {
      const flightNumbers = ['DS 208', 'DS 441', 'IP 118', 'MW 902', 'SF 210']
      const res = binarySearchStrings(flightNumbers, 'IP 118')
      expect(res.found).toBe(true)
      expect(res.index).toBe(2)

      const missing = binarySearchStrings(flightNumbers, 'ZZ 999')
      expect(missing.found).toBe(false)
      expect(missing.index).toBe(-1)
    })
  })
})
