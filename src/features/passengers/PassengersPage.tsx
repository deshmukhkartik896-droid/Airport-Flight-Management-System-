import { useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { addPassenger, deletePassenger, updatePassenger } from '../../app/store'
import { ConfirmDialog, Modal } from '../../components/Modal'
import { HashTable } from '../../dsa/hashing/HashTable'
import { passengerCounts } from '../../services/selectors'
import type { Passenger } from '../../types/models'

export function PassengersPage() {
  const { state, apply } = useApp()
  const [idQ, setIdQ] = useState('')
  const [refQ, setRefQ] = useState('')
  const [flight, setFlight] = useState('')
  const [check, setCheck] = useState<'all' | 'in' | 'out'>('all')
  const [editing, setEditing] = useState<Passenger | null | 'new'>(null)
  const [del, setDel] = useState<Passenger | null>(null)
  const counts = passengerCounts(state)

  const index = useMemo(() => {
    const table = new HashTable<string, Passenger>(16)
    for (const p of state.passengers) {
      table.insert(p.bookingRef, p)
      table.insert(p.id, p)
    }
    return table
  }, [state.passengers])

  const hashHit = refQ.trim()
    ? index.search(refQ.trim().toUpperCase())
    : idQ.trim()
      ? index.search(idQ.trim())
      : null

  const rows = useMemo(() => {
    let list = state.passengers.slice()
    if (idQ.trim()) list = list.filter((p) => p.id.toLowerCase().includes(idQ.trim().toLowerCase()))
    if (refQ.trim()) list = list.filter((p) => p.bookingRef.toLowerCase().includes(refQ.trim().toLowerCase()))
    if (flight) list = list.filter((p) => p.flightNumber === flight)
    if (check === 'in') list = list.filter((p) => p.checkedIn)
    if (check === 'out') list = list.filter((p) => !p.checkedIn)
    return list
  }, [state.passengers, idQ, refQ, flight, check])

  return (
    <div>
      <div className="page-header">
        <h2>Passenger Manifest</h2>
        <p>Fictional demonstration records only. Booking references are indexed with a separate-chaining hash table.</p>
      </div>
      <div className="toolbar">
        <input placeholder="Passenger ID" value={idQ} onChange={(e) => setIdQ(e.target.value)} />
        <input placeholder="Booking reference" value={refQ} onChange={(e) => setRefQ(e.target.value)} />
        <select value={flight} onChange={(e) => setFlight(e.target.value)}>
          <option value="">All flights</option>
          {state.flights.map((f) => (
            <option key={f.id} value={f.flightNumber}>
              {f.flightNumber} ({counts[f.flightNumber] ?? 0})
            </option>
          ))}
        </select>
        <select value={check} onChange={(e) => setCheck(e.target.value as typeof check)}>
          <option value="all">All check-in</option>
          <option value="in">Checked in</option>
          <option value="out">Not checked in</option>
        </select>
        <button className="btn primary" type="button" onClick={() => setEditing('new')}>
          Add passenger
        </button>
      </div>
      {hashHit ? (
        <p className="note" style={{ marginBottom: 10 }}>
          Hash lookup bucket {hashHit.bucket} · probes {hashHit.probes} · {hashHit.found ? 'hit' : 'miss'}
        </p>
      ) : null}
      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>PNR</th>
                <th>Flight</th>
                <th>Seat</th>
                <th>Check-in</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No passengers match.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.bookingRef}</td>
                    <td>{p.flightNumber}</td>
                    <td>{p.seat}</td>
                    <td>{p.checkedIn ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="btn" type="button" onClick={() => setEditing(p)}>
                        Edit
                      </button>{' '}
                      <button className="btn danger" type="button" onClick={() => setDel(p)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing ? (
        <Modal title={editing === 'new' ? 'Add fictional passenger' : 'Edit passenger'} onClose={() => setEditing(null)}>
          <PassengerForm
            flights={state.flights.map((f) => f.flightNumber)}
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={(draft) => {
              const ok =
                'id' in draft && draft.id
                  ? apply(updatePassenger(state, draft.id, draft))
                  : apply(addPassenger(state, draft as Omit<Passenger, 'id'>))
              if (ok) setEditing(null)
            }}
          />
        </Modal>
      ) : null}
      {del ? (
        <ConfirmDialog
          title="Remove passenger"
          message={`Remove ${del.name}?`}
          onClose={() => setDel(null)}
          onConfirm={() => {
            apply(deletePassenger(state, del.id))
            setDel(null)
          }}
        />
      ) : null}
    </div>
  )
}

function PassengerForm({
  initial,
  flights,
  onSubmit,
  onCancel,
}: {
  initial?: Passenger
  flights: string[]
  onSubmit: (p: Partial<Passenger> & Omit<Passenger, 'id'> & { id?: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [bookingRef, setBookingRef] = useState(initial?.bookingRef ?? '')
  const [flightNumber, setFlightNumber] = useState(initial?.flightNumber ?? flights[0] ?? '')
  const [seat, setSeat] = useState(initial?.seat ?? '')
  const [checkedIn, setCheckedIn] = useState(initial?.checkedIn ?? false)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ id: initial?.id, name, bookingRef, flightNumber, seat, checkedIn })
      }}
    >
      <div className="form-grid">
        <label className="field">
          Name (fictional)
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          Booking reference
          <input value={bookingRef} onChange={(e) => setBookingRef(e.target.value)} />
        </label>
        <label className="field">
          Flight
          <select value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)}>
            {flights.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Seat
          <input value={seat} onChange={(e) => setSeat(e.target.value)} placeholder="12A" />
        </label>
        <label className="field">
          Checked in
          <select value={checkedIn ? '1' : '0'} onChange={(e) => setCheckedIn(e.target.value === '1')}>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </label>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" type="submit">
          Save
        </button>
        <button className="btn" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
