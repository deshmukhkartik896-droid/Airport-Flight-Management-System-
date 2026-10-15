import { Queue } from '../queue/Queue'
import type { AirportGraph, GraphRunResult, GraphStep } from './AirportGraph'
import { reconstructPath } from './AirportGraph'

/** BFS finds a path with the fewest edges in an unweighted (or unit-weight) graph. */
export function runBfs(graph: AirportGraph, source: string, target: string): GraphRunResult {
  const steps: GraphStep[] = []
  const visitOrder: string[] = []
  const visited = new Set<string>()
  const parent = new Map<string, string | null>()
  const queue = new Queue<string>()
  let edgesExamined = 0

  if (!graph.adj.has(source)) {
    return emptyResult('BFS', 'Source airport is not in the network.')
  }

  queue.enqueue(source)
  visited.add(source)
  parent.set(source, null)
  steps.push(makeStep(source, visited, queue.toArray(), null, [], `Enqueue source ${source}`))

  while (!queue.isEmpty()) {
    const u = queue.dequeue()!
    visitOrder.push(u)
    steps.push(makeStep(u, visited, queue.toArray(), null, [], `Dequeue and visit ${u}`))
    for (const nb of graph.neighbors(u)) {
      edgesExamined++
      steps.push(
        makeStep(u, visited, queue.toArray(), { from: u, to: nb.to }, [], `Examine edge ${u} → ${nb.to}`),
      )
      if (!visited.has(nb.to)) {
        visited.add(nb.to)
        parent.set(nb.to, u)
        queue.enqueue(nb.to)
        steps.push(makeStep(u, visited, queue.toArray(), { from: u, to: nb.to }, [], `Enqueue ${nb.to}`))
      }
    }
  }

  const path = reconstructPath(parent, source, target)
  const reachable = path.length > 0 && path[0] === source
  if (reachable) {
    steps.push(makeStep(target, visited, [], null, path, `Path found: ${path.join(' → ')}`))
  } else {
    steps.push(
      makeStep(null, visited, [], null, [], `${target} is not reachable from ${source} (disconnected component).`),
    )
  }

  return {
    steps,
    visitOrder,
    path: reachable ? path : [],
    reachable,
    verticesVisited: visitOrder.length,
    edgesExamined,
    totalDistance: null,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    explanation:
      'BFS explores layer by layer using a FIFO queue. The first time the destination is reached, the path has the fewest hops. BFS does not minimise weighted distance.',
  }
}

function makeStep(
  current: string | null,
  visited: Set<string>,
  frontier: string[],
  examinedEdge: { from: string; to: string } | null,
  path: string[],
  log: string,
): GraphStep {
  return {
    current,
    visited: [...visited],
    frontier: [...frontier],
    examinedEdge,
    path,
    log,
  }
}

function emptyResult(name: string, message: string): GraphRunResult {
  return {
    steps: [
      {
        current: null,
        visited: [],
        frontier: [],
        examinedEdge: null,
        path: [],
        log: `[${name}] ${message}`,
      },
    ],
    visitOrder: [],
    path: [],
    reachable: false,
    verticesVisited: 0,
    edgesExamined: 0,
    totalDistance: null,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    explanation: message,
  }
}

export { emptyResult }
