import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { toggleRoute } from '../../app/store'
import { AirportGraph, type GraphRunResult, type GraphStep } from '../../dsa/graph/AirportGraph'
import { runBfs } from '../../dsa/graph/bfs'
import { runDfs } from '../../dsa/graph/dfs'
import { runDijkstra } from '../../dsa/graph/dijkstra'

type Algo = 'BFS' | 'DFS' | 'Dijkstra'

export function NetworkPage() {
  const { state, apply } = useApp()
  const [source, setSource] = useState('NAG')
  const [target, setTarget] = useState('MAA')
  const [algo, setAlgo] = useState<Algo>('BFS')
  const [result, setResult] = useState<GraphRunResult | null>(null)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)

  const graph = useMemo(() => new AirportGraph(state.airports, state.routes), [state.airports, state.routes])

  function run(kind: Algo) {
    setAlgo(kind)
    setPlaying(false)
    const g = new AirportGraph(state.airports, state.routes)
    const res = kind === 'BFS' ? runBfs(g, source, target) : kind === 'DFS' ? runDfs(g, source, target) : runDijkstra(g, source, target)
    setResult(res)
    setStep(0)
  }

  const current: GraphStep | undefined = result?.steps[step]
  const finalPath = result?.path ?? []

  useEffect(() => {
    if (!playing || !result) return
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= result.steps.length - 1) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, 550)
    return () => window.clearInterval(id)
  }, [playing, result])

  const nodeColor = (code: string): string => {
    if (current?.path.includes(code) || (step === (result?.steps.length ?? 1) - 1 && finalPath.includes(code))) return '#3dcc8a'
    if (current?.current === code) return '#f5b942'
    if (current?.visited.includes(code)) return '#3ec6ff'
    return '#4a5d78'
  }

  return (
    <div>
      <div className="page-header">
        <h2>Airport Network</h2>
        <p>
          Vertices are simulated airports; edges are simulated routes stored as an adjacency list. Distances are
          estimated kilometres for education only. TST is intentionally disconnected.
        </p>
      </div>
      <div className="toolbar">
        <label className="field">
          Source
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {state.airports.map((a) => (
              <option key={a.code}>{a.code}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Destination
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {state.airports.map((a) => (
              <option key={a.code}>{a.code}</option>
            ))}
          </select>
        </label>
        <button className="btn primary" type="button" onClick={() => run('BFS')}>
          Run BFS
        </button>
        <button className="btn" type="button" onClick={() => run('DFS')}>
          Run DFS
        </button>
        <button className="btn" type="button" onClick={() => run('Dijkstra')}>
          Run Dijkstra
        </button>
        <button className="btn" type="button" onClick={() => setPlaying((p) => !p)} disabled={!result}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button className="btn" type="button" disabled={!result || step <= 0} onClick={() => setStep((s) => s - 1)}>
          Previous
        </button>
        <button
          className="btn"
          type="button"
          disabled={!result || step >= (result?.steps.length ?? 1) - 1}
          onClick={() => setStep((s) => s + 1)}
        >
          Next step
        </button>
        <button className="btn" type="button" disabled={!result} onClick={() => { setStep(0); setPlaying(false); }}>
          Reset / replay
        </button>
      </div>

      <div className="legend" style={{ marginBottom: 10 }}>
        <span><i className="dot" style={{ background: '#4a5d78' }} /> Unvisited</span>
        <span><i className="dot" style={{ background: '#3ec6ff' }} /> Visited</span>
        <span><i className="dot" style={{ background: '#f5b942' }} /> Current</span>
        <span><i className="dot" style={{ background: '#3dcc8a' }} /> Final path</span>
      </div>

      <div className="svg-wrap">
        <svg viewBox="0 0 900 540" width="100%" height="520">
          {state.routes.filter((r) => r.available).map((r) => {
            const a = state.airports.find((x) => x.code === r.from)!
            const b = state.airports.find((x) => x.code === r.to)!
            const examined =
              current?.examinedEdge &&
              ((current.examinedEdge.from === r.from && current.examinedEdge.to === r.to) ||
                (current.examinedEdge.from === r.to && current.examinedEdge.to === r.from))
            const onPath =
              finalPath.length > 1 &&
              step === (result?.steps.length ?? 0) - 1 &&
              pathHasEdge(finalPath, r.from, r.to)
            return (
              <g key={r.id}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={onPath ? '#3dcc8a' : examined ? '#f5b942' : '#2d3d55'}
                  strokeWidth={onPath ? 3 : 1.5}
                />
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 8} fill="#9aa8bc" fontSize="10">
                  {r.distanceKm} km
                </text>
              </g>
            )
          })}
          {state.airports.map((a) => (
            <g key={a.code}>
              <circle cx={a.x} cy={a.y} r={16} fill={nodeColor(a.code)} stroke="#e8edf5" strokeWidth={1} />
              <text x={a.x} y={a.y + 4} textAnchor="middle" fill="#0b1220" fontSize="10" fontWeight={700}>
                {a.code}
              </text>
              <text x={a.x} y={a.y + 32} textAnchor="middle" fill="#9aa8bc" fontSize="10">
                {a.city}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card-h">
            <h3>
              Traversal log · {algo} step {result ? step + 1 : 0}/{result?.steps.length ?? 0}
            </h3>
          </div>
          <div className="card-b">
            <div className="log">{current?.log ?? 'Run BFS, DFS, or Dijkstra. Playback follows the real algorithm steps.'}</div>
            {result ? (
              <div style={{ marginTop: 10, fontSize: 13 }}>
                <p>Visit order: {result.visitOrder.join(' → ') || '—'}</p>
                <p>Vertices visited: {result.verticesVisited} · Edges examined: {result.edgesExamined}</p>
                <p>
                  Time {result.timeComplexity} · Space {result.spaceComplexity}
                </p>
                <p>{result.explanation}</p>
                {result.reachable ? (
                  <p>
                    Path: {result.path.join(' → ')}
                    {result.totalDistance !== null ? ` · simulated ${result.totalDistance} km` : ' (fewest hops / exploration path)'}
                  </p>
                ) : (
                  <p>Destination not reachable — disconnected vertex or disabled route.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Adjacency list & routes</h3>
          </div>
          <div className="card-b">
            <div className="log">
              {state.airports
                .map((a) => `${a.code}: ${graph.neighbors(a.code).map((n) => `${n.to}(${n.weight})`).join(', ') || '∅'}`)
                .join('\n')}
            </div>
            <div className="table-wrap" style={{ marginTop: 10 }}>
              <table className="data">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Sim. km</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {state.routes.map((r) => (
                    <tr key={r.id}>
                      <td>
                        {r.from}–{r.to}
                      </td>
                      <td>{r.distanceKm}</td>
                      <td>
                        <button className="btn" type="button" onClick={() => apply(toggleRoute(state, r.id))}>
                          {r.available ? 'On' : 'Off'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function pathHasEdge(path: string[], a: string, b: string): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    if ((path[i] === a && path[i + 1] === b) || (path[i] === b && path[i + 1] === a)) return true
  }
  return false
}

