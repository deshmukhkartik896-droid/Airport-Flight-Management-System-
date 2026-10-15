import { useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { assignGate, assignRunway, releaseGate, releaseRunway } from '../../app/store'
import { StatusBadge } from '../../components/StatusBadge'
import { gateConflicts, runwayConflicts } from '../../services/conflicts'
import { formatDateTime } from '../../utils/time'

export function GatesPage() {
  const { state, apply } = useApp()
  const [filter, setFilter] = useState<'all' | 'free' | 'busy'>('all')
  const [flightId, setFlightId] = useState(state.flights[0]?.id ?? '')
  const [gateId, setGateId] = useState(state.gates[0]?.id ?? '')
  const [runwayId, setRunwayId] = useState(state.runways[0]?.id ?? '')
  const [gStart, setGStart] = useState('')
  const [gEnd, setGEnd] = useState('')
  const [rStart, setRStart] = useState('')
  const [rEnd, setREnd] = useState('')

  const gates = useMemo(() => {
    if (filter === 'free') return state.gates.filter((g) => !g.assignedFlightId)
    if (filter === 'busy') return state.gates.filter((g) => g.assignedFlightId)
    return state.gates
  }, [state.gates, filter])

  const gConflicts = gateConflicts(state.gates, state.flights)
  const rConflicts = runwayConflicts(state.runways)

  return (
    <div>
      <div className="page-header">
        <h2>Gate & Runway Control</h2>
        <p>
          Overlap checks prevent two simulated assignments from occupying the same resource at the same time. This is
          an educational interval test — it is not certified ATC separation or real-world stand planning.
        </p>
      </div>
      <div className="note" style={{ marginBottom: 12 }}>
        Conflict checking matters because a gate or runway is a shared resource: overlapping occupancy would be an
        impossible double-booking in the simulation.
      </div>
      <div className="toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">All gates</option>
          <option value="free">Available</option>
          <option value="busy">Occupied</option>
        </select>
      </div>
      <div className="grid two">
        <div className="card">
          <div className="card-h">
            <h3>Gates</h3>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Gate</th>
                  <th>Terminal</th>
                  <th>Category</th>
                  <th>Flight</th>
                  <th>Interval</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {gates.map((g) => {
                  const fl = state.flights.find((f) => f.id === g.assignedFlightId)
                  return (
                    <tr key={g.id}>
                      <td>{g.id}</td>
                      <td>{g.terminal}</td>
                      <td>{g.aircraftCategory}</td>
                      <td>{fl?.flightNumber ?? '—'}</td>
                      <td>
                        {g.occupancyStart ? `${formatDateTime(g.occupancyStart)} → ${formatDateTime(g.occupancyEnd ?? '')}` : 'free'}
                      </td>
                      <td>
                        {g.assignedFlightId ? (
                          <button className="btn" type="button" onClick={() => apply(releaseGate(state, g.id))}>
                            Release
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Runways</h3>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Runway</th>
                  <th>Status</th>
                  <th>Flight</th>
                  <th>Interval</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {state.runways.map((r) => {
                  const fl = state.flights.find((f) => f.id === r.assignedFlightId)
                  return (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td>{fl?.flightNumber ?? '—'}</td>
                      <td>
                        {r.intervalStart ? `${formatDateTime(r.intervalStart)} → ${formatDateTime(r.intervalEnd ?? '')}` : '—'}
                      </td>
                      <td>
                        {r.assignedFlightId ? (
                          <button className="btn" type="button" onClick={() => apply(releaseRunway(state, r.id))}>
                            Release
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="card-h">
            <h3>Assign / change gate</h3>
          </div>
          <div className="card-b">
            <div className="form-grid">
              <label className="field">
                Flight
                <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                  {state.flights.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.flightNumber} ({f.aircraftCategory})
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Gate
                <select value={gateId} onChange={(e) => setGateId(e.target.value)}>
                  {state.gates.map((g) => (
                    <option key={g.id}>{g.id}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Occupancy start
                <input type="datetime-local" value={gStart} onChange={(e) => setGStart(e.target.value)} />
              </label>
              <label className="field">
                Occupancy end
                <input type="datetime-local" value={gEnd} onChange={(e) => setGEnd(e.target.value)} />
              </label>
            </div>
            <button
              className="btn primary"
              type="button"
              style={{ marginTop: 10 }}
              onClick={() => apply(assignGate(state, flightId, gateId, local(gStart), local(gEnd)))}
            >
              Assign gate
            </button>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Reserve runway</h3>
          </div>
          <div className="card-b">
            <div className="form-grid">
              <label className="field">
                Flight
                <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                  {state.flights.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.flightNumber}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Runway
                <select value={runwayId} onChange={(e) => setRunwayId(e.target.value)}>
                  {state.runways.map((r) => (
                    <option key={r.id}>{r.id}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Start
                <input type="datetime-local" value={rStart} onChange={(e) => setRStart(e.target.value)} />
              </label>
              <label className="field">
                End
                <input type="datetime-local" value={rEnd} onChange={(e) => setREnd(e.target.value)} />
              </label>
            </div>
            <button
              className="btn primary"
              type="button"
              style={{ marginTop: 10 }}
              onClick={() => apply(assignRunway(state, flightId, runwayId, local(rStart), local(rEnd)))}
            >
              Reserve runway
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-h">
          <h3>Detected conflicts</h3>
        </div>
        <div className="card-b">
          {gConflicts.length + rConflicts.length === 0 ? (
            <div className="empty">No interval or category conflicts in the current assignment set.</div>
          ) : (
            <ul>
              {[...gConflicts, ...rConflicts].map((c) => (
                <li key={c.message}>{c.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function local(v: string): string {
  return v ? `${v}:00` : ''
}
