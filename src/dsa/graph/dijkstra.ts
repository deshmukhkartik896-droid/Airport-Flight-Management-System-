import { MinHeap } from '../heap/MaxHeap'
import type { AirportGraph, GraphRunResult, GraphStep } from './AirportGraph'

const INF = Number.POSITIVE_INFINITY

/**
 * Dijkstra on non-negative edge weights.
 * Distances are simulated kilometres, not operational flying distances.
 */
export function runDijkstra(graph: AirportGraph, source: string, target: string): GraphRunResult {
  const dist = new Map<string, number>()
  const parent = new Map<string, string | null>()
  const visited = new Set<string>()
  const visitOrder: string[] = []
  const steps: GraphStep[] = []
  let edgesExamined = 0

  for (const v of graph.vertices) {
    dist.set(v, INF)
    parent.set(v, null)
  }
  if (!dist.has(source)) {
    return {
      steps: [
        {
          current: null,
          visited: [],
          frontier: [],
          examinedEdge: null,
          path: [],
          log: 'Source airport is not in the network.',
        },
      ],
      visitOrder: [],
      path: [],
      reachable: false,
      verticesVisited: 0,
      edgesExamined: 0,
      totalDistance: null,
      timeComplexity: 'O((V + E) log V)',
      spaceComplexity: 'O(V)',
      explanation: 'Source airport is not in the network.',
    }
  }

  dist.set(source, 0)
  const heap = new MinHeap<string>()
  heap.insert(source, 0)
  steps.push(make(source, visited, dist, null, [], 'Initialise dist[source] = 0'))

  while (heap.size > 0) {
    const popped = heap.extractMin()!
    const u = popped.value
    if (visited.has(u)) continue
    visited.add(u)
    visitOrder.push(u)
    steps.push(make(u, visited, dist, null, [], `Settle ${u} with distance ${fmt(dist.get(u)!)}`))
    if (u === target) break
    for (const nb of graph.neighbors(u)) {
      edgesExamined++
      steps.push(
        make(u, visited, dist, { from: u, to: nb.to }, [], `Examine ${u} → ${nb.to} (sim. ${nb.weight} km)`),
      )
      if (visited.has(nb.to)) continue
      const alt = dist.get(u)! + nb.weight
      if (alt < dist.get(nb.to)!) {
        dist.set(nb.to, alt)
        parent.set(nb.to, u)
        heap.insert(nb.to, alt)
        steps.push(make(u, visited, dist, { from: u, to: nb.to }, [], `Relax ${nb.to} to ${alt} km`))
      }
    }
  }

  const path: string[] = []
  if (dist.get(target) !== INF) {
    let cur: string | null = target
    while (cur) {
      path.push(cur)
      cur = parent.get(cur) ?? null
    }
    path.reverse()
  }
  const reachable = path.length > 0 && path[0] === source
  const total = reachable ? dist.get(target)! : null
  steps.push(
    make(
      reachable ? target : null,
      visited,
      dist,
      null,
      reachable ? path : [],
      reachable
        ? `Minimum simulated distance ${source} → ${target}: ${total} km via ${path.join(' → ')}`
        : `${target} is unreachable from ${source}.`,
    ),
  )

  return {
    steps,
    visitOrder,
    path: reachable ? path : [],
    reachable,
    verticesVisited: visitOrder.length,
    edgesExamined,
    totalDistance: total,
    timeComplexity: 'O((V + E) log V) with a binary heap',
    spaceComplexity: 'O(V)',
    explanation:
      'Dijkstra greedily settles the closest unsettled vertex. BFS minimises hop count, not weighted distance, so a 3-hop route may be shorter in kilometres than a 2-hop route.',
  }
}

function fmt(n: number): string {
  return n === INF ? '∞' : String(n)
}

function make(
  current: string | null,
  visited: Set<string>,
  dist: Map<string, number>,
  examinedEdge: { from: string; to: string } | null,
  path: string[],
  log: string,
): GraphStep {
  const distances: Record<string, number> = {}
  dist.forEach((value, key) => {
    distances[key] = value
  })
  return {
    current,
    visited: [...visited],
    frontier: [],
    examinedEdge,
    path,
    log,
    distances,
  }
}
