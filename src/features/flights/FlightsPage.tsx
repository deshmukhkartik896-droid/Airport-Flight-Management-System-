import { useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { addFlight, deleteFlight, updateFlight } from '../../app/store'
import { AircraftPhoto } from '../../components/AircraftPhoto'
import { AirlineLogo } from '../../components/AirlineLogo'
import { ConfirmDialog, Modal } from '../../components/Modal'
import { StatusBadge } from '../../components/StatusBadge'
import { AIRPORTS } from '../../data/airports'
import { queuePosition } from '../../services/selectors'
import type { Flight, FlightStatus } from '../../types/models'
import { formatDateTime } from '../../utils/time'
import { FlightForm } from './FlightForm'

type SortKey = 'flightNumber' | 'scheduledDeparture' | 'delayMinutes'

export function FlightsPage() {
  const { state, apply } = useApp()
  const [qNum, setQNum] = useState('')
  const [qAirline, setQAirline] = useState('')
  const [status, setStatus] = useState<FlightStatus | ''>('')
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [flow, setFlow] = useState<'all' | 'dep' | 'arr'>('all')
  const [sort, setSort] = useState<SortKey>('scheduledDeparture')
  const [editing, setEditing] = useState<Flight | null | 'new'>(null)
  const [detail, setDetail] = useState<Flight | null>(null)
  const [del, setDel] = useState<Flight | null>(null)

  const rows = useMemo(() => {
    let list = state.flights.slice()
    if (qNum.trim()) list = list.filter((f) => f.flightNumber.toLowerCase().includes(qNum.trim().toLowerCase()))
    if (qAirline.trim()) list = list.filter((f) => f.airline.toLowerCase().includes(qAirline.trim().toLowerCase()))
    if (status) list = list.filter((f) => f.status === status)
    if (origin) list = list.filter((f) => f.origin === origin)
    if (dest) list = list.filter((f) => f.destination === dest)
    if (flow === 'dep') list = list.filter((f) => f.origin === 'NAG')
    if (flow === 'arr') list = list.filter((f) => f.destination === 'NAG')
    list.sort((a, b) => {
      if (sort === 'flightNumber') return a.flightNumber.localeCompare(b.flightNumber)
      if (sort === 'delayMinutes') return a.delayMinutes - b.delayMinutes
      return a.scheduledDeparture.localeCompare(b.scheduledDeparture)
    })
    return list
  }, [state.flights, qNum, qAirline, status, origin, dest, flow, sort])

  return (
    <div>
      <div className="page-header">
        <h2>Flight Operations</h2>
        <p>
          All sample schedules, routes, flight numbers, assignments, and status changes are educational demonstration
          data. They are not live airline records.
        </p>
      </div>
      <div className="toolbar">
        <input placeholder="Search flight number" value={qNum} onChange={(e) => setQNum(e.target.value)} />
        <input placeholder="Search airline" value={qAirline} onChange={(e) => setQAirline(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value as FlightStatus | '')}>
          <option value="">All statuses</option>
          {['Scheduled', 'Boarding', 'Departed', 'Arrived', 'Delayed', 'Cancelled'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
          <option value="">Origin</option>
          {AIRPORTS.map((a) => (
            <option key={a.code}>{a.code}</option>
          ))}
        </select>
        <select value={dest} onChange={(e) => setDest(e.target.value)}>
          <option value="">Destination</option>
          {AIRPORTS.map((a) => (
            <option key={a.code}>{a.code}</option>
          ))}
        </select>
        <select value={flow} onChange={(e) => setFlow(e.target.value as typeof flow)}>
          <option value="all">All flows</option>
          <option value="dep">Departures from NAG</option>
          <option value="arr">Arrivals to NAG</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="scheduledDeparture">Sort: departure</option>
          <option value="flightNumber">Sort: flight number</option>
          <option value="delayMinutes">Sort: delay</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setEditing('new')}>
          Add flight
        </button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Flight</th>
                <th>Airline</th>
                <th>Route</th>
                <th>STD</th>
                <th>Gate</th>
                <th>Status</th>
                <th>Delay</th>
                <th>Q pos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty">
                    No flights match the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <button className="btn ghost" type="button" onClick={() => setDetail(f)}>
                        {f.flightNumber}
                      </button>
                    </td>
                    <td>{f.airline}</td>
                    <td>
                      {f.origin} → {f.destination}
                    </td>
                    <td>{formatDateTime(f.scheduledDeparture)}</td>
                    <td>{f.gateId ?? '—'}</td>
                    <td>
                      <StatusBadge status={f.status} />
                    </td>
                    <td>{f.delayMinutes}m</td>
                    <td>{queuePosition(state, f.id) ?? '—'}</td>
                    <td>
                      <div className="row">
                        <button className="btn" type="button" onClick={() => setEditing(f)}>
                          Edit
                        </button>
                        <button className="btn danger" type="button" onClick={() => setDel(f)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing ? (
        <Modal title={editing === 'new' ? 'Add simulated flight' : 'Edit flight'} onClose={() => setEditing(null)}>
          <FlightForm
            initial={editing === 'new' ? undefined : editing}
            gates={state.gates}
            runways={state.runways}
            onCancel={() => setEditing(null)}
            onSubmit={(draft) => {
              const ok =
                'id' in draft
                  ? apply(updateFlight(state, draft.id, draft))
                  : apply(addFlight(state, draft))
              if (ok) setEditing(null)
            }}
          />
        </Modal>
      ) : null}

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

      {del ? (
        <ConfirmDialog
          title="Delete flight"
          message={`Remove ${del.flightNumber} and its passenger records? This cannot be undone from the history stack.`}
          onClose={() => setDel(null)}
          onConfirm={() => {
            apply(deleteFlight(state, del.id))
            setDel(null)
          }}
        />
      ) : null}
    </div>
  )
}
