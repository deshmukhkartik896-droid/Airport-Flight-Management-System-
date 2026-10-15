export interface SortStep {
  array: number[]
  highlight: number[]
  message: string
}

export interface SortResult {
  original: number[]
  sorted: number[]
  comparisons: number
  writes: number
  steps: SortStep[]
  best: string
  average: string
  worst: string
}

function snapshot(arr: number[], highlight: number[], message: string): SortStep {
  return { array: [...arr], highlight, message }
}

export function bubbleSort(input: number[]): SortResult {
  const a = [...input]
  const steps: SortStep[] = [snapshot(a, [], 'Start bubble sort')]
  let comparisons = 0
  let writes = 0
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++
      steps.push(snapshot(a, [j, j + 1], `Compare indices ${j} and ${j + 1}`))
      if (a[j] > a[j + 1]) {
        const tmp = a[j]
        a[j] = a[j + 1]
        a[j + 1] = tmp
        writes += 2
        swapped = true
        steps.push(snapshot(a, [j, j + 1], `Swap ${a[j + 1]} and ${a[j]}`))
      }
    }
    if (!swapped) break
  }
  steps.push(snapshot(a, [], 'Bubble sort complete'))
  return {
    original: [...input],
    sorted: a,
    comparisons,
    writes,
    steps,
    best: 'O(n) with swap flag',
    average: 'O(n²)',
    worst: 'O(n²)',
  }
}

export function selectionSort(input: number[]): SortResult {
  const a = [...input]
  const steps: SortStep[] = [snapshot(a, [], 'Start selection sort')]
  let comparisons = 0
  let writes = 0
  for (let i = 0; i < a.length; i++) {
    let min = i
    for (let j = i + 1; j < a.length; j++) {
      comparisons++
      if (a[j] < a[min]) min = j
    }
    steps.push(snapshot(a, [i, min], `Select minimum ${a[min]} for index ${i}`))
    if (min !== i) {
      const tmp = a[i]
      a[i] = a[min]
      a[min] = tmp
      writes += 2
      steps.push(snapshot(a, [i, min], 'Swap into place'))
    }
  }
  steps.push(snapshot(a, [], 'Selection sort complete'))
  return {
    original: [...input],
    sorted: a,
    comparisons,
    writes,
    steps,
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  }
}

export function insertionSort(input: number[]): SortResult {
  const a = [...input]
  const steps: SortStep[] = [snapshot(a, [], 'Start insertion sort')]
  let comparisons = 0
  let writes = 0
  for (let i = 1; i < a.length; i++) {
    const key = a[i]
    let j = i - 1
    while (j >= 0) {
      comparisons++
      if (a[j] <= key) break
      a[j + 1] = a[j]
      writes++
      j--
    }
    a[j + 1] = key
    writes++
    steps.push(snapshot(a, [j + 1], `Insert ${key} at index ${j + 1}`))
  }
  steps.push(snapshot(a, [], 'Insertion sort complete'))
  return {
    original: [...input],
    sorted: a,
    comparisons,
    writes,
    steps,
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  }
}

export function mergeSort(input: number[]): SortResult {
  const a = [...input]
  const steps: SortStep[] = [snapshot(a, [], 'Start merge sort')]
  let comparisons = 0
  let writes = 0

  function merge(left: number, mid: number, right: number): void {
    const n1 = mid - left + 1
    const n2 = right - mid
    const L = a.slice(left, mid + 1)
    const R = a.slice(mid + 1, right + 1)
    let i = 0
    let j = 0
    let k = left
    while (i < n1 && j < n2) {
      comparisons++
      if (L[i] <= R[j]) {
        a[k] = L[i]
        i++
      } else {
        a[k] = R[j]
        j++
      }
      writes++
      k++
    }
    while (i < n1) {
      a[k++] = L[i++]
      writes++
    }
    while (j < n2) {
      a[k++] = R[j++]
      writes++
    }
    steps.push(snapshot(a, range(left, right), `Merged [${left}, ${right}]`))
  }

  function sort(left: number, right: number): void {
    if (left >= right) return
    const mid = Math.floor((left + right) / 2)
    sort(left, mid)
    sort(mid + 1, right)
    merge(left, mid, right)
  }

  if (a.length > 0) sort(0, a.length - 1)
  steps.push(snapshot(a, [], 'Merge sort complete'))
  return {
    original: [...input],
    sorted: a,
    comparisons,
    writes,
    steps,
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  }
}

export function quickSort(input: number[]): SortResult {
  const a = [...input]
  const steps: SortStep[] = [snapshot(a, [], 'Start quick sort (last element as pivot)')]
  let comparisons = 0
  let writes = 0

  function partition(lo: number, hi: number): number {
    const pivot = a[hi]
    let i = lo
    for (let j = lo; j < hi; j++) {
      comparisons++
      if (a[j] <= pivot) {
        const tmp = a[i]
        a[i] = a[j]
        a[j] = tmp
        writes += 2
        i++
      }
    }
    const tmp = a[i]
    a[i] = a[hi]
    a[hi] = tmp
    writes += 2
    steps.push(snapshot(a, [i, hi], `Pivot ${pivot} placed at index ${i}`))
    return i
  }

  function sort(lo: number, hi: number): void {
    if (lo >= hi) return
    const p = partition(lo, hi)
    sort(lo, p - 1)
    sort(p + 1, hi)
  }

  if (a.length > 0) sort(0, a.length - 1)
  steps.push(snapshot(a, [], 'Quick sort complete'))
  return {
    original: [...input],
    sorted: a,
    comparisons,
    writes,
    steps,
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²) on already-sorted input with this pivot rule',
  }
}

function range(left: number, right: number): number[] {
  const out: number[] = []
  for (let i = left; i <= right; i++) out.push(i)
  return out
}
