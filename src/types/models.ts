export type FlightStatus =
  | 'Scheduled'
  | 'Boarding'
  | 'Departed'
  | 'Arrived'
  | 'Delayed'
  | 'Cancelled'

export type PriorityLevel = 1 | 2 | 3 | 4

export type AircraftCategory = 'Regional' | 'Narrow' | 'Wide'

export type RunwayStatus = 'Open' | 'Closed' | 'Maintenance'

export interface Flight {
  id: string
  flightNumber: string
  airline: string
  origin: string
  destination: string
  aircraftType: string
  aircraftCategory: AircraftCategory
  scheduledDeparture: string
  estimatedDeparture: string
  scheduledArrival: string
  terminal: string
  gateId: string | null
  runwayId: string | null
  status: FlightStatus
  passengerCount: number
  delayMinutes: number
  priority: PriorityLevel
  notes: string
}

export interface Airport {
  code: string
  name: string
  city: string
  x: number
  y: number
}

export interface RouteEdge {
  id: string
  from: string
  to: string
  distanceKm: number
  label?: string
  available: boolean
}

export interface Gate {
  id: string
  terminal: string
  aircraftCategory: AircraftCategory
  assignedFlightId: string | null
  occupancyStart: string | null
  occupancyEnd: string | null
}

export interface Runway {
  id: string
  status: RunwayStatus
  assignedFlightId: string | null
  intervalStart: string | null
  intervalEnd: string | null
}

export interface Passenger {
  id: string
  name: string
  bookingRef: string
  flightNumber: string
  seat: string
  checkedIn: boolean
}

export interface BookingSlot {
  id: string
  flightId: string
  flightNumber: string
  airline: string
  origin: string
  destination: string
  aircraftType: string
  departureTime: string
  arrivalTime: string
  terminal: string
  gateId: string | null
  totalCapacity: number
  bookedSeats: number
  availableSeats: number
  priceInr: number
  cabinClass: 'Economy' | 'Premium Economy' | 'Business'
}

export interface HistoryEntry {
  id: string
  timestamp: string
  description: string
  undoable: boolean
}

export interface UndoCommand {
  id: string
  label: string
  invert: AppPatch
}

export interface HeapEntry {
  flightId: string
  priority: PriorityLevel
  seq: number
}

export interface AppState {
  version: number
  simulationDate: string
  flights: Flight[]
  airports: Airport[]
  routes: RouteEdge[]
  gates: Gate[]
  runways: Runway[]
  passengers: Passenger[]
  departureQueue: string[]
  emergencyHeap: HeapEntry[]
  heapSeq: number
  history: HistoryEntry[]
  undoStack: UndoCommand[]
}

export type AppPatch = Partial<
  Pick<
    AppState,
    | 'flights'
    | 'gates'
    | 'runways'
    | 'passengers'
    | 'departureQueue'
    | 'emergencyHeap'
    | 'heapSeq'
    | 'simulationDate'
    | 'routes'
  >
>

export interface DashboardStats {
  totalFlights: number
  scheduledDepartures: number
  scheduledArrivals: number
  delayedFlights: number
  cancelledFlights: number
  availableGates: number
  occupiedGates: number
  onTimePerformance: number
}

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  1: 'Routine',
  2: 'Time-sensitive',
  3: 'Urgent',
  4: 'Simulated emergency',
}

export const STORAGE_KEY = 'aeroflow-atos-v1'
export const STORAGE_VERSION = 1
