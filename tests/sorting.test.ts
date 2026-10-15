import { describe, expect, it } from 'vitest'
import {
  bubbleSort,
  insertionSort,
  mergeSort,
  quickSort,
  selectionSort,
  type SortResult,
} from '../src/dsa/sorting/sorts'

const SORT_FUNCTIONS = [
  { name: 'Bubble Sort', fn: bubbleSort },
  { name: 'Selection Sort', fn: selectionSort },
  { name: 'Insertion Sort', fn: insertionSort },
  { name: 'Merge Sort', fn: mergeSort },
  { name: 'Quick Sort', fn: quickSort },
]

describe('Sorting Algorithms', () => {
  for (const { name, fn } of SORT_FUNCTIONS) {
    describe(name, () => {
      it('correctly sorts arbitrary unsorted numbers', () => {
        const input = [35, 0, 12, 90, 45, 10, 2]
        const result: SortResult = fn(input)
        expect(result.sorted).toEqual([0, 2, 10, 12, 35, 45, 90])
        expect(result.original).toEqual(input)
        expect(result.steps.length).toBeGreaterThan(0)
      })

      it('handles empty array', () => {
        const result = fn([])
        expect(result.sorted).toEqual([])
        expect(result.comparisons).toBe(0)
      })

      it('handles single-element array', () => {
        const result = fn([42])
        expect(result.sorted).toEqual([42])
      })

      it('handles already-sorted array', () => {
        const input = [1, 2, 3, 4, 5]
        const result = fn(input)
        expect(result.sorted).toEqual([1, 2, 3, 4, 5])
      })

      it('handles reverse-sorted array', () => {
        const input = [50, 40, 30, 20, 10]
        const result = fn(input)
        expect(result.sorted).toEqual([10, 20, 30, 40, 50])
      })

      it('handles arrays with duplicate values', () => {
        const input = [4, 2, 8, 4, 2, 8, 1]
        const result = fn(input)
        expect(result.sorted).toEqual([1, 2, 2, 4, 4, 8, 8])
      })

      it('handles negative and zero values', () => {
        const input = [0, -5, 12, -20, 7]
        const result = fn(input)
        expect(result.sorted).toEqual([-20, -5, 0, 7, 12])
      })
    })
  }
})
