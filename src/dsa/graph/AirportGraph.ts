import type { Airport, RouteEdge } from '../../types/models'

export interface WeightedNeighbor {
  to: string
  weight: number
  edgeId: string
}

export class AirportGraph {
  readonly adj: Map<string, WeightedNeighbor[]> = new Map()
  readonly vertices: string[]

  constructor(airports: Airport[], routes: RouteEdge[]) {
    this.vertices = airports.map((a) => a.code)
    for (const airport of airports) {
      this.adj.set(airport.code, [])
    }
    for (const route of routes) {
      if (!route.available) continue
      if (!this.adj.has(route.from) || !this.adj.has(route.to)) continue
      this.adj.get(route.from)!.push({
        to: route.to,
        weight: route.distanceKm,
        edgeId: route.id,
      })
      this.adj.get(route.to)!.push({
        to: route.from,
        weight: route.distanceKm,
        edgeId: route.id,
      })
    }
  }

  neighbors(code: string): WeightedNeighbor[] {
    return this.adj.get(code) ?? []
  }
}

export interface GraphStep {
  current: string | null
  visited: string[]
  frontier: string[]
  examinedEdge: { from: string; to: string } | null
  path: string[]
  log: string
  distances?: Record<string, number>
}

export interface GraphRunResult {
  steps: GraphStep[]
  visitOrder: string[]
  path: string[]
  reachable: boolean
  verticesVisited: number
  edgesExamined: number
  totalDistance: number | null
  timeComplexity: string
  spaceComplexity: string
  explanation: string
}

export function reconstructPath(parent: Map<string, string | null>, source: string, target: string): string[] {
  if (source === target) return [source]
  if (!parent.has(target)) return []
  const path: string[] = []
  let cur: string | null = target
  while (cur) {
    path.push(cur)
    if (cur === source) break
    cur = parent.get(cur) ?? null
  }
  path.reverse()
  if (path[0] !== source) return []
  return path
}
