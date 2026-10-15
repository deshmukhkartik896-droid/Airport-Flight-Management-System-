import { useState } from 'react'
import { AIRLINES } from '../../data/seed'
import { AIRPORTS } from '../../data/airports'
import type { AircraftCategory, Flight, FlightStatus, PriorityLevel } from '../../types/models'

const STATUSES: FlightStatus[] = ['Scheduled', 'Boarding', 'Departed', 'Arrived', 'Delayed', 'Cancelled']
const CATS: AircraftCategory[] = ['Regional', 'Narrow', 'Wide']

export function FlightForm({
  initial,
  gates,
  runways,
  onSubmit,
  onCancel,
}: {
  initial?: Flight
  gates: { id: string }[]
  runways: { id: string }[]
  onSubmit: (draft: Omit<Flight, 'id'> | Flight) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Omit<Flight, 'id'>>({
    flightNumber: initial?.flightNumber ?? '',
    airline: initial?.airline ?? AIRLINES[0],
    origin: initial?.origin ?? 'NAG',
    destination: initial?.destination ?? 'BOM',
    aircraftType: initial?.aircraftType ?? 'A320',
    aircraftCategory: initial?.aircraftCategory ?? 'Narrow',
    scheduledDeparture: initial?.scheduledDeparture ?? '',
    estimatedDeparture: initial?.estimatedDeparture ?? '',
    scheduledArrival: initial?.scheduledArrival ?? '',
    terminal: initial?.terminal ?? 'T1',
    gateId: initial?.gateId ?? null,
    runwayId: initial?.runwayId ?? null,
    status: initial?.status ?? 'Scheduled',
    passengerCount: initial?.passengerCount ?? 120,
    delayMinutes: initial?.delayMinutes ?? 0,
    priority: initial?.priority ?? 1,
    notes: initial?.notes ?? '',
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(initial ? { ...form, id: initial.id } : form)
      }}
    >
      <div className="form-grid">
        <label className="field">
          Flight number
          <input value={form.flightNumber} onChange={(e) => set('flightNumber', e.target.value)} required />
        </label>
        <label className="field">
          Airline (simulated)
          <select value={form.airline} onChange={(e) => set('airline', e.target.value)}>
            {AIRLINES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Origin
          <select value={form.origin} onChange={(e) => set('origin', e.target.value)}>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} — {a.city}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Destination
          <select value={form.destination} onChange={(e) => set('destination', e.target.value)}>
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} — {a.city}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Aircraft type
          <input value={form.aircraftType} onChange={(e) => set('aircraftType', e.target.value)} />
        </label>
        <label className="field">
          Category
          <select value={form.aircraftCategory} onChange={(e) => set('aircraftCategory', e.target.value as AircraftCategory)}>
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Scheduled departure
          <input type="datetime-local" value={toLocal(form.scheduledDeparture)} onChange={(e) => set('scheduledDeparture', fromLocal(e.target.value))} />
        </label>
        <label className="field">
          Estimated departure
          <input type="datetime-local" value={toLocal(form.estimatedDeparture)} onChange={(e) => set('estimatedDeparture', fromLocal(e.target.value))} />
        </label>
        <label className="field">
          Scheduled arrival
          <input type="datetime-local" value={toLocal(form.scheduledArrival)} onChange={(e) => set('scheduledArrival', fromLocal(e.target.value))} />
        </label>
        <label className="field">
          Terminal
          <input value={form.terminal} onChange={(e) => set('terminal', e.target.value)} />
        </label>
        <label className="field">
          Gate
          <select value={form.gateId ?? ''} onChange={(e) => set('gateId', e.target.value || null)}>
            <option value="">None</option>
            {gates.map((g) => (
              <option key={g.id}>{g.id}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Runway
          <select value={form.runwayId ?? ''} onChange={(e) => set('runwayId', e.target.value || null)}>
            <option value="">None</option>
            {runways.map((r) => (
              <option key={r.id}>{r.id}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Status
          <select value={form.status} onChange={(e) => set('status', e.target.value as FlightStatus)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Passenger count
          <input type="number" min={0} value={form.passengerCount} onChange={(e) => set('passengerCount', Number(e.target.value))} />
        </label>
        <label className="field">
          Delay (minutes)
          <input type="number" min={0} value={form.delayMinutes} onChange={(e) => set('delayMinutes', Number(e.target.value))} />
        </label>
        <label className="field">
          Priority (1–4)
          <select value={form.priority} onChange={(e) => set('priority', Number(e.target.value) as PriorityLevel)}>
            <option value={1}>1 Routine</option>
            <option value={2}>2 Time-sensitive</option>
            <option value={3}>3 Urgent</option>
            <option value={4}>4 Simulated emergency</option>
          </select>
        </label>
      </div>
      <label className="field" style={{ marginTop: 10 }}>
        Notes
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} />
      </label>
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

function toLocal(iso: string): string {
  if (!iso) return ''
  return iso.slice(0, 16)
}
function fromLocal(value: string): string {
  if (!value) return ''
  return value.length === 16 ? `${value}:00` : value
}
