export interface SearchResult {
  found: boolean
  index: number
  comparisons: number
}

export function linearSearch<T>(items: T[], key: T): SearchResult {
  let comparisons = 0
  for (let i = 0; i < items.length; i++) {
    comparisons++
    if (items[i] === key) {
      return { found: true, index: i, comparisons }
    }
  }
  return { found: false, index: -1, comparisons }
}
