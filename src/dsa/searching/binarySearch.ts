import type { SearchResult } from './linearSearch'

/**
 * Iterative binary search. The caller MUST pass a sorted array.
 * This function does not call Array.prototype.find or includes.
 */
export function binarySearch(sorted: number[], key: number): SearchResult {
  let lo = 0
  let hi = sorted.length - 1
  let comparisons = 0
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    comparisons++
    if (sorted[mid] === key) {
      return { found: true, index: mid, comparisons }
    }
    comparisons++
    if (sorted[mid] < key) lo = mid + 1
    else hi = mid - 1
  }
  return { found: false, index: -1, comparisons }
}

export function binarySearchStrings(sorted: string[], key: string): SearchResult {
  let lo = 0
  let hi = sorted.length - 1
  let comparisons = 0
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    comparisons++
    if (sorted[mid] === key) {
      return { found: true, index: mid, comparisons }
    }
    comparisons++
    if (sorted[mid] < key) lo = mid + 1
    else hi = mid - 1
  }
  return { found: false, index: -1, comparisons }
}

export function isNonDecreasing(values: number[]): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1]) return false
  }
  return true
}
