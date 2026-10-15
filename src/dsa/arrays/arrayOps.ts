export interface TraverseStep<T> {
  index: number
  value: T
}

export function traverseArray<T>(items: T[]): TraverseStep<T>[] {
  const steps: TraverseStep<T>[] = []
  for (let i = 0; i < items.length; i++) {
    steps.push({ index: i, value: items[i] })
  }
  return steps
}

export interface MinMaxResult {
  min: number | null
  max: number | null
  minIndex: number
  maxIndex: number
  comparisons: number
}

/** Single-pass comparison-based min and max. Empty input yields nulls. */
export function minMax(values: number[]): MinMaxResult {
  if (values.length === 0) {
    return { min: null, max: null, minIndex: -1, maxIndex: -1, comparisons: 0 }
  }
  let min = values[0]
  let max = values[0]
  let minIndex = 0
  let maxIndex = 0
  let comparisons = 0
  for (let i = 1; i < values.length; i++) {
    comparisons++
    if (values[i] < min) {
      min = values[i]
      minIndex = i
    }
    comparisons++
    if (values[i] > max) {
      max = values[i]
      maxIndex = i
    }
  }
  return { min, max, minIndex, maxIndex, comparisons }
}

export function indexedAccess<T>(items: T[], index: number): T | undefined {
  if (index < 0 || index >= items.length) return undefined
  return items[index]
}
