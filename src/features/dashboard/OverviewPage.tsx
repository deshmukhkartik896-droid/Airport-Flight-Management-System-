import { useState } from 'react'
import { useApp } from '../../app/AppContext'
import { resetDemo, undoLast } from '../../app/store'
import { Modal } from '../../components/Modal'
import { StatusBadge } from '../../components/StatusBadge'
import { HUB_CODE } from '../../config/constants'
import { computeStats, queuePosition, upcomingArrivals, upcomingDepartures } from '../../services/selectors'
import type { Flight } from '../../types/models'
import { formatDateTime, formatTime } from '../../utils/time'

export function OverviewPage() {
  const { state, apply } = useApp()
  const [detail, setDetail] = useState<Flight | null>(null)
  const stats = computeStats(state)
  const deps = upcomingDepartures(state)
  const arrs = upcomingArrivals(state)
  const occupied = state.gates.filter((g) => g.assignedFlightId)
  const heapTop = [...state.emergencyHeap].sort((a, b) => b.priority - a.priority || a.seq - b.seq)[0]

  return (
    <div>
      <div className="page-header">
        <h2>Operations Overview</h2>
        <p>
          Simulated control picture for hub {HUB_CODE}. Totals are derived from current records — not hardcoded.
          All times follow the selected simulation date {state.simulationDate}.
        </p>
      </div>
      <div className="toolbar">
        <button className="btn" type="button" onClick={() => apply(resetDemo(state, state.simulationDate))}>
          Restore demonstration data
        </button>
        <button className="btn" type="button" onClick={() => apply(undoLast(state))}>
          Undo last action
        </button>
      </div>
      <div className="grid stats">
        <Stat k="Total flights" v={stats.totalFlights} />
        <Stat k="Scheduled departures" v={stats.scheduledDepartures} s={`from ${HUB_CODE}`} />
        <Stat k="Scheduled arrivals" v={stats.scheduledArrivals} s={`into ${HUB_CODE}`} />
        <Stat k="Delayed flights" v={stats.delayedFlights} />
        <Stat k="Cancelled flights" v={stats.cancelledFlights} />
        <Stat k="Available gates" v={stats.availableGates} />
        <Stat k="Occupied gates" v={stats.occupiedGates} />
        <Stat k="Simulated OTP" v={`${stats.onTimePerformance}%`} s="non-cancelled, delay = 0" />
      </div>

      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card-h">
            <h3>Upcoming departures</h3>
          </div>
          <FlightMini rows={deps} empty="No pending hub departures." mode="dep" onSelect={setDetail} />
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Arrivals overview</h3>
          </div>
          <FlightMini rows={arrs} empty="No pending hub arrivals." mode="arr" onSelect={setDetail} />
        </div>
      </div>

      <div className="grid three" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card-h">
            <h3>Gate allocation</h3>
          </div>
          <div className="card-b">
            {occupied.length === 0 ? (
              <div className="empty">No gates occupied.</div>
            ) : (
              occupied.map((g) => {
                const fl = state.flights.find((f) => f.id === g.assignedFlightId)
                return (
                  <div key={g.id} className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{g.id}</span>
                    {fl ? (
                      <button className="btn ghost" type="button" onClick={() => setDetail(fl)}>
                        {fl.flightNumber}
                      </button>
                    ) : (
                      <span>—</span>
                    )}
                    <StatusBadge status={fl?.status ?? 'Scheduled'} />
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Queue summary</h3>
          </div>
          <div className="card-b">
            <p>FIFO length: {state.departureQueue.length}</p>
            <p>Next: {flightNo(state, state.departureQueue[0])}</p>
            <p>Emergency heap size: {state.emergencyHeap.length}</p>
            <p>Heap peek: {heapTop ? `${flightNo(state, heapTop.flightId)} (P${heapTop.priority})` : 'empty'}</p>
            <p className="note warn" style={{ marginTop: 8 }}>
              Emergency ranking is an educational heap demo, not a real aviation procedure.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Airport network</h3>
          </div>
          <div className="card-b">
            <p>Vertices: {state.airports.length}</p>
            <p>Available routes: {state.routes.filter((r) => r.available).length}</p>
            <p>Isolated demo vertex: TST</p>
            <p>Distances are simulated estimates.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-h">
          <h3>Operation history (Stack)</h3>
        </div>
        <div className="card-b">
          {state.history.length === 0 ? (
            <div className="empty">No history yet.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13 }}>
              {state.history
                .slice()
                .reverse()
                .slice(0, 10)
                .map((h) => (
                  <li key={h.id}>
                    {h.description} {h.undoable ? '· undoable' : ''}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {detail ? (
        <Modal title={detail.flightNumber} onClose={() => setDetail(null)}>
          <p>
            {detail.airline} · {detail.origin} → {detail.destination} · {detail.aircraftType} ({detail.aircraftCategory})
          </p>
          <p>STD {formatDateTime(detail.scheduledDeparture)} · STA {formatDateTime(detail.scheduledArrival)}</p>
          <p>
            Gate {detail.gateId ?? '—'} · Runway {detail.runwayId ?? '—'} · Terminal {detail.terminal}
          </p>
          <p>
            Pax {detail.passengerCount} · Priority {detail.priority} · Queue {queuePosition(state, detail.id) ?? 'not queued'}
          </p>
          <p>{detail.notes || 'No notes.'}</p>
        </Modal>
      ) : null}
    </div>
  )
}

function Stat({ k, v, s }: { k: string; v: number | string; s?: string }) {
  return (
    <div className="card stat">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      {s ? <div className="s">{s}</div> : null}
    </div>
  )
}

function FlightMini({
  rows,
  empty,
  mode,
  onSelect,
}: {
  rows: ReturnType<typeof upcomingDepartures>
  empty: string
  mode: 'dep' | 'arr'
  onSelect: (f: Flight) => void
}) {
  if (rows.length === 0) return <div className="empty">{empty}</div>
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Flight</th>
            <th>Airline</th>
            <th>{mode === 'dep' ? 'Dest' : 'Origin'}</th>
            <th>Time</th>
            <th>Gate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id}>
              <td>
                <button className="btn ghost" type="button" onClick={() => onSelect(f)}>
                  {f.flightNumber}
                </button>
              </td>
              <td>{f.airline}</td>
              <td>{mode === 'dep' ? f.destination : f.origin}</td>
              <td>{formatTime(mode === 'dep' ? f.scheduledDeparture : f.scheduledArrival)}</td>
              <td>{f.gateId ?? '—'}</td>
              <td>
                <StatusBadge status={f.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function flightNo(state: ReturnType<typeof useApp>['state'], id?: string) {
  if (!id) return '—'
  return state.flights.find((f) => f.id === id)?.flightNumber ?? id
}
