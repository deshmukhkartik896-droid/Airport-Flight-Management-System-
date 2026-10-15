import { Stack } from '../stack/Stack'
import type { AirportGraph, GraphRunResult, GraphStep } from './AirportGraph'
import { reconstructPath } from './AirportGraph'

/** Iterative DFS using an explicit Stack. Explores deeply before siblings. */
export function runDfs(graph: AirportGraph, source: string, target: string): GraphRunResult {
  const steps: GraphStep[] = []
  const visitOrder: string[] = []
  const visited = new Set<string>()
  const parent = new Map<string, string | null>()
  const stack = new Stack<string>()
  let edgesExamined = 0

  if (!graph.adj.has(source)) {
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
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      explanation: 'Source airport is not in the network.',
    }
  }

  stack.push(source)
  steps.push(step(null, visited, stack.toArray(), null, `Push source ${source}`))

  while (!stack.isEmpty()) {
    const u = stack.pop()!
    if (visited.has(u)) {
      steps.push(step(u, visited, stack.toArray(), null, `${u} already visited — skip`))
      continue
    }
    visited.add(u)
    visitOrder.push(u)
    steps.push(step(u, visited, stack.toArray(), null, `Pop and visit ${u}`))
    const neighbors = graph.neighbors(u)
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const nb = neighbors[i]
      edgesExamined++
      steps.push(step(u, visited, stack.toArray(), { from: u, to: nb.to }, `Examine edge ${u} → ${nb.to}`))
      if (!visited.has(nb.to)) {
        if (!parent.has(nb.to)) parent.set(nb.to, u)
        stack.push(nb.to)
        steps.push(step(u, visited, stack.toArray(), { from: u, to: nb.to }, `Push ${nb.to}`))
      }
    }
    if (!parent.has(u)) parent.set(u, null)
  }

  const path = reconstructPath(parent, source, target)
  const reachable = path.length > 0 && path[0] === source
  steps.push(
    step(
      reachable ? target : null,
      visited,
      [],
      null,
      reachable ? `A DFS path: ${path.join(' → ')}` : `${target} is not reachable from ${source}.`,
    ),
  )

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
      'DFS uses a LIFO stack (or recursion). It is not guaranteed to find the fewest hops or the minimum weighted distance. Compared with BFS, DFS dives along one branch before exploring siblings.',
  }
}

function step(
  current: string | null,
  visited: Set<string>,
  frontier: string[],
  examinedEdge: { from: string; to: string } | null,
  log: string,
): GraphStep {
  return {
    current,
    visited: [...visited],
    frontier: [...frontier],
    examinedEdge,
    path: [],
    log,
  }
}
