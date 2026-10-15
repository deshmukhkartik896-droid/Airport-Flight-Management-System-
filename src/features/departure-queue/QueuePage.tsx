import { useState } from 'react'
import { useApp } from '../../app/AppContext'
import {
  clearDepartureQueue,
  dequeueDeparture,
  enqueueDeparture,
  heapChangePriority,
  heapExtract,
  heapInsert,
} from '../../app/store'
import { Queue } from '../../dsa/queue/Queue'
import { MaxHeap } from '../../dsa/heap/MaxHeap'
import { PRIORITY_LABELS, type PriorityLevel } from '../../types/models'
import { isInactiveForQueue } from '../../services/selectors'

export function QueuePage() {
  const { state, apply } = useApp()
  const [flightId, setFlightId] = useState(state.flights[0]?.id ?? '')
  const [prio, setPrio] = useState<PriorityLevel>(3)
  const q = new Queue(state.departureQueue)
  const heap = new MaxHeap(
    state.emergencyHeap.map((e) => ({ value: e.flightId, priority: e.priority, seq: e.seq })),
    state.heapSeq,
  )

  function name(id: string) {
    return state.flights.find((f) => f.id === id)?.flightNumber ?? id
  }

  return (
    <div>
      <div className="page-header">
        <h2>Departure Queue</h2>
        <p>
          Left: FIFO queue with a head-index implementation (not Array.shift). Right: educational max-heap. Emergency
          ranking is a classroom demonstration, not a real aviation procedure.
        </p>
      </div>
      <div className="grid two">
        <div className="card">
          <div className="card-h">
            <h3>FIFO departure queue</h3>
          </div>
          <div className="card-b">
            <p>
              Length {q.size} · Peek {q.peek() ? name(q.peek()!) : 'empty'}
            </p>
            <p className="note">enqueue/dequeue/peek are O(1) amortized. FIFO: first enqueued eligible flight is processed first.</p>
            <div className="toolbar">
              <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                {state.flights.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.flightNumber} · {f.status}
                  </option>
                ))}
              </select>
              <button className="btn primary" type="button" onClick={() => apply(enqueueDeparture(state, flightId))}>
                Enqueue
              </button>
              <button className="btn" type="button" onClick={() => apply(dequeueDeparture(state))}>
                Dequeue
              </button>
              <button className="btn danger" type="button" onClick={() => apply(clearDepartureQueue(state))}>
                Clear
              </button>
            </div>
            {q.size === 0 ? (
              <div className="empty">Queue is empty.</div>
            ) : (
              <ol>
                {q.toArray().map((id, i) => {
                  const f = state.flights.find((x) => x.id === id)
                  return (
                    <li key={id}>
                      {i + 1}. {name(id)} {f ? `· ${f.status}` : ''}
                      {f && isInactiveForQueue(f) ? ' (stale — will be ignored on status sync)' : ''}
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Emergency-priority max-heap</h3>
          </div>
          <div className="card-b">
            <p className="note warn">
              Larger number = higher priority (1 routine … 4 simulated emergency). Equal priority uses earlier insert
              sequence (FIFO tie-break). Not a real emergency protocol.
            </p>
            <p>
              Size {heap.size} · Peek{' '}
              {heap.peek() ? `${name(heap.peek()!.value)} P${heap.peek()!.priority}` : 'empty'}
            </p>
            <div className="toolbar">
              <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                {state.flights.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.flightNumber} · P{f.priority}
                  </option>
                ))}
              </select>
              <button className="btn primary" type="button" onClick={() => apply(heapInsert(state, flightId))}>
                Insert
              </button>
              <button className="btn" type="button" onClick={() => apply(heapExtract(state))}>
                Extract max
              </button>
              <select value={prio} onChange={(e) => setPrio(Number(e.target.value) as PriorityLevel)}>
                {([1, 2, 3, 4] as PriorityLevel[]).map((p) => (
                  <option key={p} value={p}>
                    {p} {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
              <button className="btn" type="button" onClick={() => apply(heapChangePriority(state, flightId, prio))}>
                Change priority
              </button>
            </div>
            <p style={{ fontSize: 13 }}>Array layout (index 0 is the root). Parent i ≥ children 2i+1 and 2i+2.</p>
            <div className="log">
              {heap.toArray().map((item, i) => `${i}: ${name(item.value)} P${item.priority} seq=${item.seq}`).join('\n') ||
                'empty heap'}
            </div>
            <HeapSvg items={heap.toArray().map((item) => `${name(item.value)}\nP${item.priority}`)} />
          </div>
        </div>
      </div>
    </div>
  )
}

function HeapSvg({ items }: { items: string[] }) {
  if (items.length === 0) return null
  const w = 640
  const levels = Math.floor(Math.log2(items.length)) + 1
  const h = levels * 70 + 20
  const pos = items.map((_, i) => {
    const level = Math.floor(Math.log2(i + 1))
    const indexInLevel = i - (2 ** level - 1)
    const count = 2 ** level
    const x = ((indexInLevel + 0.5) / count) * w
    const y = 28 + level * 70
    return { x, y }
  })
  return (
    <div className="svg-wrap" style={{ marginTop: 10 }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        {items.map((_, i) => {
          if (i === 0) return null
          const p = Math.floor((i - 1) / 2)
          return (
            <line key={`e${i}`} x1={pos[p].x} y1={pos[p].y} x2={pos[i].x} y2={pos[i].y} stroke="#2d3d55" />
          )
        })}
        {items.map((label, i) => (
          <g key={i}>
            <circle cx={pos[i].x} cy={pos[i].y} r={22} fill="#172033" stroke="#3ec6ff" />
            <text x={pos[i].x} y={pos[i].y + 3} textAnchor="middle" fill="#e8edf5" fontSize="9">
              {label.split('\n')[0]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
