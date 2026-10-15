export const APP_NAME = 'AeroFlow ATOS'
export const APP_SUBTITLE = 'Airport Traffic & Operations Simulator'
export const SIMULATION_BANNER = 'SIMULATION MODE — NOT LIVE FLIGHT DATA'

export const HUB_CODE = 'NAG'

export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  Scheduled: ['Boarding', 'Delayed', 'Cancelled'],
  Boarding: ['Departed', 'Delayed', 'Cancelled'],
  Delayed: ['Boarding', 'Departed', 'Cancelled'],
  Departed: ['Arrived'],
  Arrived: [],
  Cancelled: [],
}

export const COMPLEXITY = {
  arrayTraverse: { time: 'O(n)', space: 'O(1)' },
  linearSearch: { time: 'O(n)', space: 'O(1)' },
  binarySearch: { time: 'O(log n)', space: 'O(1)' },
  stackOps: { time: 'O(1)', space: 'O(n)' },
  queueOps: { time: 'O(1) amortized', space: 'O(n)' },
  bfs: { time: 'O(V + E)', space: 'O(V)' },
  dfs: { time: 'O(V + E)', space: 'O(V)' },
  dijkstra: { time: 'O((V + E) log V) with a binary heap', space: 'O(V)' },
  bstSearch: { time: 'O(h)', space: 'O(1)' },
  avlSearch: { time: 'O(log n)', space: 'O(1)' },
  btreeSearch: { time: 'O(t log_t n)', space: 'O(1)' },
}
