import { describe, expect, it } from 'vitest'
import { AIRPORTS, ROUTES } from '../src/data/airports'
import { AirportGraph } from '../src/dsa/graph/AirportGraph'
import { runBfs } from '../src/dsa/graph/bfs'
import { runDfs } from '../src/dsa/graph/dfs'
import { runDijkstra } from '../src/dsa/graph/dijkstra'

describe('Airport Graph Traversal & Shortest Path (BFS, DFS, Dijkstra)', () => {
  const graph = new AirportGraph(AIRPORTS, ROUTES)

  describe('Adjacency List Construction', () => {
    it('creates vertices for all airports and bidirectional edges', () => {
      expect(graph.vertices).toContain('NAG')
      expect(graph.vertices).toContain('BOM')
      expect(graph.vertices).toContain('TST')

      const nagNeighbors = graph.neighbors('NAG')
      expect(nagNeighbors.some((n) => n.to === 'BOM')).toBe(true)
      expect(nagNeighbors.some((n) => n.to === 'DEL')).toBe(true)

      // BOM should also have NAG as a neighbor
      const bomNeighbors = graph.neighbors('BOM')
      expect(bomNeighbors.some((n) => n.to === 'NAG')).toBe(true)

      // TST is an isolated demo airport
      expect(graph.neighbors('TST')).toEqual([])
    })
  })

  describe('Breadth-First Search (BFS)', () => {
    it('finds path with fewest hops from NAG to MAA', () => {
      const res = runBfs(graph, 'NAG', 'MAA')
      expect(res.reachable).toBe(true)
      expect(res.path[0]).toBe('NAG')
      expect(res.path[res.path.length - 1]).toBe('MAA')
      // Path via HYD: NAG -> HYD -> MAA is 2 hops
      expect(res.path).toEqual(['NAG', 'HYD', 'MAA'])
      expect(res.verticesVisited).toBeGreaterThan(0)
      expect(res.edgesExamined).toBeGreaterThan(0)
      expect(res.steps.length).toBeGreaterThan(0)
      expect(res.timeComplexity).toBe('O(V + E)')
    })

    it('reports unreachable when destination is isolated vertex TST', () => {
      const res = runBfs(graph, 'NAG', 'TST')
      expect(res.reachable).toBe(false)
      expect(res.path).toEqual([])
      expect(res.steps.some((s) => s.log.includes('not reachable'))).toBe(true)
    })

    it('handles source airport not in the network', () => {
      const res = runBfs(graph, 'UNKNOWN', 'NAG')
      expect(res.reachable).toBe(false)
      expect(res.path).toEqual([])
    })
  })

  describe('Depth-First Search (DFS)', () => {
    it('explores one branch deeply and finds a path to destination', () => {
      const res = runDfs(graph, 'NAG', 'MAA')
      expect(res.reachable).toBe(true)
      expect(res.path[0]).toBe('NAG')
      expect(res.path[res.path.length - 1]).toBe('MAA')
      expect(res.visitOrder.length).toBeGreaterThan(0)
      expect(res.timeComplexity).toBe('O(V + E)')
    })

    it('reports unreachable to isolated vertex TST', () => {
      const res = runDfs(graph, 'NAG', 'TST')
      expect(res.reachable).toBe(false)
      expect(res.path).toEqual([])
    })
  })

  describe("Dijkstra's Algorithm (Weighted routes)", () => {
    it('finds path minimizing total simulated distance from NAG to MAA', () => {
      const res = runDijkstra(graph, 'NAG', 'MAA')
      expect(res.reachable).toBe(true)
      expect(res.path[0]).toBe('NAG')
      expect(res.path[res.path.length - 1]).toBe('MAA')
      // NAG -> HYD (470) -> MAA (520) = 990 km
      expect(res.totalDistance).toBe(990)
      expect(res.path).toEqual(['NAG', 'HYD', 'MAA'])
      expect(res.timeComplexity).toContain('log V')
    })

    it('finds path from BOM to CCU', () => {
      const res = runDijkstra(graph, 'BOM', 'CCU')
      expect(res.reachable).toBe(true)
      expect(res.totalDistance).toBeGreaterThan(0)
      expect(res.path[0]).toBe('BOM')
      expect(res.path[res.path.length - 1]).toBe('CCU')
    })

    it('reports unreachable with totalDistance = null when searching to isolated vertex TST', () => {
      const res = runDijkstra(graph, 'NAG', 'TST')
      expect(res.reachable).toBe(false)
      expect(res.path).toEqual([])
      expect(res.totalDistance).toBeNull()
      expect(res.steps.some((s) => s.log.includes('unreachable'))).toBe(true)
    })
  })
})
