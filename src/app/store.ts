import { createSeedState } from '../data/seed'
import { MaxHeap } from '../dsa/heap/MaxHeap'
import { Queue } from '../dsa/queue/Queue'
import { Stack } from '../dsa/stack/Stack'
import { wouldGateOverlap, wouldRunwayOverlap } from '../services/conflicts'
import { isInactiveForQueue } from '../services/selectors'
import { canTransition, validateFlight, validatePassenger } from '../services/validation'
import type {
  AppPatch,
  AppState,
  Flight,
  Gate,
  HeapEntry,
  HistoryEntry,
  Passenger,
  PriorityLevel,
  Runway,
  UndoCommand,
} from '../types/models'
import { uid } from '../utils/id'
import { addMinutes } from '../utils/time'

export interface ActionResult {
  state: AppState
  error?: string
  info?: string
}

function pushHistory(state: AppState, description: string, undoable: boolean, invert?: AppPatch): AppState {
  const entry: HistoryEntry = {
    id: uid('h'),
    timestamp: new Date().toISOString(),
    description,
    undoable,
  }
  const undoStack = [...state.undoStack]
  if (undoable && invert) {
    const cmd: UndoCommand = { id: entry.id, label: description, invert }
    undoStack.push(cmd)
  }
  return {
    ...state,
    history: [...state.history, entry].slice(-80),
    undoStack: undoStack.slice(-40),
  }
}

function stripQueues(flights: Flight[], queue: string[], heap: HeapEntry[]): { queue: string[]; heap: HeapEntry[] } {
  const byId = new Map(flights.map((f) => [f.id, f]))
  return {
    queue: queue.filter((id) => {
      const f = byId.get(id)
      return f && !isInactiveForQueue(f)
    }),
    heap: heap.filter((h) => {
      const f = byId.get(h.flightId)
      return f && !isInactiveForQueue(f)
    }),
  }
}

export function addFlight(state: AppState, draft: Omit<Flight, 'id'>): ActionResult {
  const errors = validateFlight(draft, state.flights, state.gates)
  if (errors.length) return { state, error: errors[0] }
  const flight: Flight = { ...draft, id: uid('fl'), flightNumber: draft.flightNumber.trim() }
  const next = pushHistory({ ...state, flights: [...state.flights, flight] }, `Added flight ${flight.flightNumber}`, false)
  return { state: next, info: `Flight ${flight.flightNumber} created (simulated).` }
}

export function updateFlight(state: AppState, id: string, patch: Partial<Flight>): ActionResult {
  const current = state.flights.find((f) => f.id === id)
  if (!current) return { state, error: 'Flight not found.' }
  const merged = { ...current, ...patch }
  if (patch.status && !canTransition(current.status, patch.status)) {
    return { state, error: `Cannot change status from ${current.status} to ${patch.status}.` }
  }
  const errors = validateFlight(merged, state.flights, state.gates, id)
  if (errors.length) return { state, error: errors[0] }
  if (merged.delayMinutes > 0 && merged.status === 'Scheduled') {
    merged.status = 'Delayed'
    merged.estimatedDeparture = addMinutes(merged.scheduledDeparture, merged.delayMinutes)
  }
  const flights = state.flights.map((f) => (f.id === id ? merged : f))
  const stripped = stripQueues(flights, state.departureQueue, state.emergencyHeap)
  let gates = state.gates
  let runways = state.runways
  if (merged.status === 'Cancelled' || merged.status === 'Departed' || merged.status === 'Arrived') {
    gates = gates.map((g) =>
      g.assignedFlightId === id ? { ...g, assignedFlightId: null, occupancyStart: null, occupancyEnd: null } : g,
    )
    if (merged.status === 'Cancelled' || merged.status === 'Arrived') {
      runways = runways.map((r) =>
        r.assignedFlightId === id ? { ...r, assignedFlightId: null, intervalStart: null, intervalEnd: null } : r,
      )
    }
  }
  const invert: AppPatch = { flights: state.flights, gates: state.gates, runways: state.runways, departureQueue: state.departureQueue, emergencyHeap: state.emergencyHeap }
  const next = pushHistory(
    { ...state, flights, gates, runways, departureQueue: stripped.queue, emergencyHeap: stripped.heap },
    `Updated flight ${merged.flightNumber}`,
    true,
    invert,
  )
  return { state: next, info: `Flight ${merged.flightNumber} updated.` }
}

export function deleteFlight(state: AppState, id: string): ActionResult {
  const current = state.flights.find((f) => f.id === id)
  if (!current) return { state, error: 'Flight not found.' }
  const flights = state.flights.filter((f) => f.id !== id)
  const gates = state.gates.map((g) =>
    g.assignedFlightId === id ? { ...g, assignedFlightId: null, occupancyStart: null, occupancyEnd: null } : g,
  )
  const runways = state.runways.map((r) =>
    r.assignedFlightId === id ? { ...r, assignedFlightId: null, intervalStart: null, intervalEnd: null } : r,
  )
  const passengers = state.passengers.filter((p) => p.flightNumber !== current.flightNumber)
  const stripped = stripQueues(flights, state.departureQueue, state.emergencyHeap)
  const next = pushHistory(
    { ...state, flights, gates, runways, passengers, departureQueue: stripped.queue, emergencyHeap: stripped.heap },
    `Deleted flight ${current.flightNumber}`,
    false,
  )
  return { state: next, info: `Flight ${current.flightNumber} removed.` }
}

export function assignGate(
  state: AppState,
  flightId: string,
  gateId: string,
  start: string,
  end: string,
): ActionResult {
  const flight = state.flights.find((f) => f.id === flightId)
  const gate = state.gates.find((g) => g.id === gateId)
  if (!flight || !gate) return { state, error: 'Unknown flight or gate.' }
  if (flight.status === 'Cancelled') return { state, error: 'Cannot assign a gate to a cancelled flight.' }
  if (start >= end) return { state, error: 'Occupancy interval is invalid.' }
  if (wouldGateOverlap(state.gates, gateId, start, end, flightId)) {
    return { state, error: 'That gate already has an overlapping occupancy interval.' }
  }
  if (flight.aircraftCategory !== gate.aircraftCategory) {
    return { state, error: `Gate ${gate.id} supports ${gate.aircraftCategory} aircraft, not ${flight.aircraftCategory}.` }
  }
  const gates = state.gates.map((g) => {
    if (g.assignedFlightId === flightId) {
      return { ...g, assignedFlightId: null, occupancyStart: null, occupancyEnd: null }
    }
    if (g.id === gateId) {
      return { ...g, assignedFlightId: flightId, occupancyStart: start, occupancyEnd: end }
    }
    return g
  })
  const flights = state.flights.map((f) => (f.id === flightId ? { ...f, gateId, terminal: gate.terminal } : f))
  const invert: AppPatch = { flights: state.flights, gates: state.gates }
  const next = pushHistory({ ...state, flights, gates }, `Assigned ${gateId} to ${flight.flightNumber}`, true, invert)
  return { state: next, info: `${gateId} assigned to ${flight.flightNumber} (simulated).` }
}

export function releaseGate(state: AppState, gateId: string): ActionResult {
  const gate = state.gates.find((g) => g.id === gateId)
  if (!gate) return { state, error: 'Unknown gate.' }
  const flightId = gate.assignedFlightId
  const gates = state.gates.map((g) =>
    g.id === gateId ? { ...g, assignedFlightId: null, occupancyStart: null, occupancyEnd: null } : g,
  )
  const flights = state.flights.map((f) => (f.id === flightId ? { ...f, gateId: null } : f))
  const invert: AppPatch = { flights: state.flights, gates: state.gates }
  const next = pushHistory({ ...state, flights, gates }, `Released gate ${gateId}`, true, invert)
  return { state: next, info: `${gateId} released.` }
}

export function assignRunway(state: AppState, flightId: string, runwayId: string, start: string, end: string): ActionResult {
  const flight = state.flights.find((f) => f.id === flightId)
  const runway = state.runways.find((r) => r.id === runwayId)
  if (!flight || !runway) return { state, error: 'Unknown flight or runway.' }
  if (runway.status !== 'Open') return { state, error: `${runwayId} is not open in this simulation.` }
  if (start >= end) return { state, error: 'Reservation interval is invalid.' }
  if (wouldRunwayOverlap(state.runways, runwayId, start, end, flightId)) {
    return { state, error: 'That runway already has an overlapping reservation.' }
  }
  const runways = state.runways.map((r) => {
    if (r.assignedFlightId === flightId) {
      return { ...r, assignedFlightId: null, intervalStart: null, intervalEnd: null }
    }
    if (r.id === runwayId) {
      return { ...r, assignedFlightId: flightId, intervalStart: start, intervalEnd: end }
    }
    return r
  })
  const flights = state.flights.map((f) => (f.id === flightId ? { ...f, runwayId } : f))
  const invert: AppPatch = { flights: state.flights, runways: state.runways }
  const next = pushHistory({ ...state, flights, runways }, `Reserved ${runwayId} for ${flight.flightNumber}`, true, invert)
  return { state: next, info: `${runwayId} reserved (simulated, not ATC separation).` }
}

export function releaseRunway(state: AppState, runwayId: string): ActionResult {
  const runway = state.runways.find((r) => r.id === runwayId)
  if (!runway) return { state, error: 'Unknown runway.' }
  const flightId = runway.assignedFlightId
  const runways = state.runways.map((r) =>
    r.id === runwayId ? { ...r, assignedFlightId: null, intervalStart: null, intervalEnd: null } : r,
  )
  const flights = state.flights.map((f) => (f.id === flightId ? { ...f, runwayId: null } : f))
  const invert: AppPatch = { flights: state.flights, runways: state.runways }
  const next = pushHistory({ ...state, flights, runways }, `Released runway ${runwayId}`, true, invert)
  return { state: next, info: `${runwayId} released.` }
}

export function enqueueDeparture(state: AppState, flightId: string): ActionResult {
  const flight = state.flights.find((f) => f.id === flightId)
  if (!flight) return { state, error: 'Unknown flight.' }
  if (isInactiveForQueue(flight)) return { state, error: 'Cancelled or already processed flights cannot enter the queue.' }
  if (state.departureQueue.includes(flightId)) return { state, error: 'Flight is already in the departure queue.' }
  const q = new Queue(state.departureQueue)
  q.enqueue(flightId)
  const next = pushHistory({ ...state, departureQueue: q.toArray() }, `Enqueued ${flight.flightNumber}`, true, {
    departureQueue: state.departureQueue,
  })
  return { state: next, info: `${flight.flightNumber} enqueued (FIFO).` }
}

export function dequeueDeparture(state: AppState): ActionResult {
  const q = new Queue(state.departureQueue)
  const id = q.dequeue()
  if (!id) return { state, error: 'Departure queue is empty.' }
  const flight = state.flights.find((f) => f.id === id)
  const next = pushHistory({ ...state, departureQueue: q.toArray() }, `Dequeued ${flight?.flightNumber ?? id}`, true, {
    departureQueue: state.departureQueue,
  })
  return { state: next, info: `Processed ${flight?.flightNumber ?? id} from the FIFO queue.` }
}

export function clearDepartureQueue(state: AppState): ActionResult {
  const next = pushHistory({ ...state, departureQueue: [] }, 'Cleared departure queue', true, {
    departureQueue: state.departureQueue,
  })
  return { state: next, info: 'Departure queue cleared.' }
}

export function heapInsert(state: AppState, flightId: string): ActionResult {
  const flight = state.flights.find((f) => f.id === flightId)
  if (!flight) return { state, error: 'Unknown flight.' }
  if (isInactiveForQueue(flight)) return { state, error: 'Inactive flights cannot enter the priority heap.' }
  const heap = new MaxHeap<string>(
    state.emergencyHeap.map((e) => ({ value: e.flightId, priority: e.priority, seq: e.seq })),
    state.heapSeq,
  )
  if (heap.contains((v) => v === flightId)) return { state, error: 'Flight is already in the priority heap.' }
  heap.insert(flightId, flight.priority)
  const emergencyHeap = heap.toArray().map((e) => ({ flightId: e.value, priority: e.priority as PriorityLevel, seq: e.seq }))
  const next = pushHistory({ ...state, emergencyHeap, heapSeq: heap.getSeqCounter() }, `Heap insert ${flight.flightNumber}`, true, {
    emergencyHeap: state.emergencyHeap,
    heapSeq: state.heapSeq,
  })
  return { state: next, info: `${flight.flightNumber} inserted into the educational max-heap.` }
}

export function heapExtract(state: AppState): ActionResult {
  const heap = new MaxHeap<string>(
    state.emergencyHeap.map((e) => ({ value: e.flightId, priority: e.priority, seq: e.seq })),
    state.heapSeq,
  )
  const item = heap.extractMax()
  if (!item) return { state, error: 'Priority heap is empty.' }
  const flight = state.flights.find((f) => f.id === item.value)
  const emergencyHeap = heap.toArray().map((e) => ({ flightId: e.value, priority: e.priority as PriorityLevel, seq: e.seq }))
  const next = pushHistory({ ...state, emergencyHeap }, `Heap extract ${flight?.flightNumber ?? item.value}`, true, {
    emergencyHeap: state.emergencyHeap,
  })
  return { state: next, info: `Extracted ${flight?.flightNumber ?? item.value} (highest priority).` }
}

export function heapChangePriority(state: AppState, flightId: string, priority: PriorityLevel): ActionResult {
  const heap = new MaxHeap<string>(
    state.emergencyHeap.map((e) => ({ value: e.flightId, priority: e.priority, seq: e.seq })),
    state.heapSeq,
  )
  const ok = heap.changePriority((v) => v === flightId, priority)
  if (!ok) return { state, error: 'Flight is not in the priority heap.' }
  const flights = state.flights.map((f) => (f.id === flightId ? { ...f, priority } : f))
  const emergencyHeap = heap.toArray().map((e) => ({ flightId: e.value, priority: e.priority as PriorityLevel, seq: e.seq }))
  const next = pushHistory({ ...state, flights, emergencyHeap }, 'Changed heap priority', true, {
    flights: state.flights,
    emergencyHeap: state.emergencyHeap,
  })
  return { state: next, info: 'Priority updated and heap property restored.' }
}

export function addPassenger(state: AppState, draft: Omit<Passenger, 'id'>): ActionResult {
  const numbers = state.flights.map((f) => f.flightNumber)
  const errors = validatePassenger(draft, state.passengers, numbers)
  if (errors.length) return { state, error: errors[0] }
  const passenger: Passenger = {
    ...draft,
    id: uid('p'),
    bookingRef: draft.bookingRef.trim().toUpperCase(),
    seat: draft.seat.trim().toUpperCase(),
    name: draft.name.trim(),
  }
  const next = pushHistory({ ...state, passengers: [...state.passengers, passenger] }, `Added passenger ${passenger.name}`, false)
  return { state: next, info: 'Passenger added (fictional record).' }
}

export function updatePassenger(state: AppState, id: string, patch: Partial<Passenger>): ActionResult {
  const current = state.passengers.find((p) => p.id === id)
  if (!current) return { state, error: 'Passenger not found.' }
  const merged = { ...current, ...patch }
  const numbers = state.flights.map((f) => f.flightNumber)
  const errors = validatePassenger(merged, state.passengers, numbers, id)
  if (errors.length) return { state, error: errors[0] }
  const passengers = state.passengers.map((p) => (p.id === id ? { ...merged, bookingRef: merged.bookingRef.toUpperCase(), seat: merged.seat.toUpperCase() } : p))
  const invert: AppPatch = { passengers: state.passengers }
  const next = pushHistory({ ...state, passengers }, `Updated passenger ${merged.name}`, true, invert)
  return { state: next, info: 'Passenger updated.' }
}

export function deletePassenger(state: AppState, id: string): ActionResult {
  const current = state.passengers.find((p) => p.id === id)
  if (!current) return { state, error: 'Passenger not found.' }
  const next = pushHistory(
    { ...state, passengers: state.passengers.filter((p) => p.id !== id) },
    `Removed passenger ${current.name}`,
    false,
  )
  return { state: next, info: 'Passenger removed.' }
}

export function undoLast(state: AppState): ActionResult {
  const stack = new Stack(state.undoStack)
  const cmd = stack.pop()
  if (!cmd) return { state, error: 'No undoable actions remain. (This is the educational Stack, not browser history.)' }
  const restored = { ...state, ...cmd.invert, undoStack: stack.toArray() }
  const next = pushHistory(restored, `Undo: ${cmd.label}`, false)
  return { state: next, info: `Undid: ${cmd.label}` }
}

export function resetDemo(_state: AppState, date: string): ActionResult {
  const seeded = createSeedState(date)
  return {
    state: { ...seeded, simulationDate: date },
    info: 'Demonstration data restored for the selected simulation date.',
  }
}

export function setSimulationDate(_state: AppState, date: string): ActionResult {
  const seeded = createSeedState(date)
  return { state: seeded, info: `Simulation date set to ${date}. Timetable rebuilt from seed templates.` }
}

export function toggleRoute(state: AppState, routeId: string): ActionResult {
  const routes = state.routes.map((r) => (r.id === routeId ? { ...r, available: !r.available } : r))
  return { state: { ...state, routes }, info: 'Route availability updated (simulated).' }
}

export function bookFlightSlot(
  state: AppState,
  flightId: string,
  passengerName: string,
  preferredSeat?: string,
): ActionResult {
  const flight = state.flights.find((f) => f.id === flightId)
  if (!flight) return { state, error: 'Flight not found.' }
  if (flight.status === 'Cancelled') return { state, error: 'Cannot book slots on a cancelled flight.' }
  if (flight.passengerCount >= 500) return { state, error: 'Flight capacity limit reached.' }

  const flightPassengers = state.passengers.filter((p) => p.flightNumber === flight.flightNumber)
  const existingSeats = new Set(flightPassengers.map((p) => p.seat.toUpperCase()))

  let seat = preferredSeat?.trim().toUpperCase()
  if (!seat || existingSeats.has(seat)) {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F']
    let allocated = ''
    for (let row = 1; row <= 50; row++) {
      for (const col of cols) {
        const candidate = `${row}${col}`
        if (!existingSeats.has(candidate)) {
          allocated = candidate
          break
        }
      }
      if (allocated) break
    }
    seat = allocated || '32A'
  }

  const prefix = flight.flightNumber.replace(/\s+/g, '').slice(0, 4)
  let pnr = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`
  while (state.passengers.some((p) => p.bookingRef === pnr)) {
    pnr = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`
  }

  const newPassenger: Passenger = {
    id: uid('p'),
    name: passengerName.trim() || 'Guest Passenger',
    bookingRef: pnr,
    flightNumber: flight.flightNumber,
    seat,
    checkedIn: true,
  }

  const updatedFlight: Flight = {
    ...flight,
    passengerCount: flight.passengerCount + 1,
  }

  const flights = state.flights.map((f) => (f.id === flightId ? updatedFlight : f))
  const passengers = [...state.passengers, newPassenger]

  const invert: AppPatch = { flights: state.flights, passengers: state.passengers }
  const next = pushHistory(
    { ...state, flights, passengers },
    `Booked seat ${seat} on ${flight.flightNumber} for ${newPassenger.name} (PNR ${pnr})`,
    true,
    invert,
  )

  return {
    state: next,
    info: `Booking confirmed! PNR: ${pnr} · Seat: ${seat} · ${flight.flightNumber}`,
  }
}

export type { Gate, Runway }
