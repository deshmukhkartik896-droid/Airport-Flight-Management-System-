import { AIRPORTS, ROUTES } from './airports'
import { AIRLINES } from './airlines'
import type { AppState, Flight, Gate, Passenger, Runway } from '../types/models'
import { STORAGE_VERSION } from '../types/models'
import { addMinutes, isoAt } from '../utils/time'

export function createSeedState(simulationDate: string): AppState {
  const d = simulationDate
  const flights: Flight[] = [
    f('fl-001', '6E 210', 'IndiGo', 'NAG', 'BOM', 'A320', 'Narrow', d, 7, 10, 90, 'T1', 'G-A1', 'RWY-14', 'Boarding', 148, 0, 2, 'Scheduled hub departure to Mumbai'),
    f('fl-002', 'AI 441', 'Air India', 'BOM', 'NAG', 'A321', 'Narrow', d, 8, 40, 95, 'T1', 'G-A2', null, 'Scheduled', 164, 0, 1, ''),
    f('fl-003', 'UK 118', 'Vistara', 'NAG', 'DEL', 'B737', 'Narrow', d, 9, 15, 110, 'T1', 'G-A3', null, 'Delayed', 152, 35, 2, 'Simulated weather hold'),
    f('fl-004', 'SQ 402', 'Singapore Airlines', 'DEL', 'NAG', 'A350', 'Wide', d, 10, 5, 115, 'T2', null, null, 'Scheduled', 280, 0, 1, ''),
    f('fl-005', '6E 330', 'IndiGo', 'NAG', 'HYD', 'ATR72', 'Regional', d, 11, 20, 80, 'T1', null, null, 'Scheduled', 68, 0, 1, ''),
    f('fl-006', 'AI 551', 'Air India', 'BLR', 'NAG', 'A320', 'Narrow', d, 12, 0, 100, 'T2', 'G-B1', null, 'Scheduled', 155, 0, 1, ''),
    f('fl-007', 'EK 500', 'Emirates', 'NAG', 'MAA', 'B777', 'Wide', d, 13, 30, 120, 'T1', null, null, 'Scheduled', 340, 0, 3, 'High-capacity widebody connection'),
    f('fl-008', 'QR 556', 'Qatar Airways', 'CCU', 'NAG', 'A350', 'Wide', d, 14, 10, 125, 'T2', null, null, 'Scheduled', 290, 12, 1, ''),
    f('fl-009', 'QF 068', 'Qantas', 'NAG', 'GOI', 'B787', 'Wide', d, 15, 45, 90, 'T1', null, null, 'Cancelled', 210, 0, 1, 'Simulated technical cancellation'),
    f('fl-010', 'UK 612', 'Vistara', 'HYD', 'NAG', 'A320', 'Narrow', d, 16, 20, 95, 'T2', null, null, 'Scheduled', 144, 0, 1, ''),
    f('fl-011', 'EK 504', 'Emirates', 'NAG', 'CCU', 'A380', 'Wide', d, 6, 0, 140, 'T2', 'G-B2', 'RWY-32', 'Departed', 480, 0, 1, 'Superjumbo long-range connection'),
    f('fl-012', 'SQ 990', 'Singapore Airlines', 'MAA', 'NAG', 'B777', 'Wide', d, 5, 30, 130, 'T1', null, null, 'Arrived', 310, 0, 1, ''),
    f('fl-013', 'QF 401', 'Qantas', 'NAG', 'BLR', 'B787', 'Wide', d, 18, 10, 105, 'T1', null, null, 'Scheduled', 260, 0, 4, 'Simulated priority return drill'),
  ]

  const gates: Gate[] = [
    { id: 'G-A1', terminal: 'T1', aircraftCategory: 'Narrow', assignedFlightId: 'fl-001', occupancyStart: isoAt(d, 6, 40), occupancyEnd: isoAt(d, 7, 40) },
    { id: 'G-A2', terminal: 'T1', aircraftCategory: 'Narrow', assignedFlightId: 'fl-002', occupancyStart: isoAt(d, 8, 10), occupancyEnd: isoAt(d, 9, 20) },
    { id: 'G-A3', terminal: 'T1', aircraftCategory: 'Narrow', assignedFlightId: 'fl-003', occupancyStart: isoAt(d, 8, 45), occupancyEnd: isoAt(d, 10, 10) },
    { id: 'G-A4', terminal: 'T1', aircraftCategory: 'Regional', assignedFlightId: null, occupancyStart: null, occupancyEnd: null },
    { id: 'G-B1', terminal: 'T2', aircraftCategory: 'Narrow', assignedFlightId: 'fl-006', occupancyStart: isoAt(d, 11, 30), occupancyEnd: isoAt(d, 12, 40) },
    { id: 'G-B2', terminal: 'T2', aircraftCategory: 'Wide', assignedFlightId: 'fl-011', occupancyStart: isoAt(d, 5, 0), occupancyEnd: isoAt(d, 6, 20) },
    { id: 'G-R1', terminal: 'Remote', aircraftCategory: 'Narrow', assignedFlightId: null, occupancyStart: null, occupancyEnd: null },
  ]

  const runways: Runway[] = [
    { id: 'RWY-14', status: 'Open', assignedFlightId: 'fl-001', intervalStart: isoAt(d, 7, 5), intervalEnd: isoAt(d, 7, 20) },
    { id: 'RWY-32', status: 'Open', assignedFlightId: 'fl-011', intervalStart: isoAt(d, 5, 50), intervalEnd: isoAt(d, 6, 10) },
    { id: 'RWY-09', status: 'Maintenance', assignedFlightId: null, intervalStart: null, intervalEnd: null },
  ]

  const passengers: Passenger[] = [
    p('p-001', 'Aarav Mehta', '6E21A4', '6E 210', '12A', true),
    p('p-002', 'Diya Kulkarni', '6E21B8', '6E 210', '12B', true),
    p('p-003', 'Rohan Iyer', 'AI44C1', 'AI 441', '7C', false),
    p('p-004', 'Nisha Verma', 'UK11D2', 'UK 118', '15F', true),
    p('p-005', 'Kabir Shah', 'SQ40E3', 'SQ 402', '4A', false),
    p('p-006', 'Ananya Rao', '6E33F9', '6E 330', '8D', true),
    p('p-007', 'Vikram Nair', 'AI55G2', 'AI 551', '21A', false),
    p('p-008', 'Meera Joshi', 'EK50H5', 'EK 500', '3C', true),
    p('p-009', 'Ishaan Gupta', 'QR55J1', 'QR 556', '18B', false),
    p('p-010', 'Sara Khan', 'UK61K8', 'UK 612', '9A', true),
    p('p-011', 'Arjun Patel', 'EK54L3', 'EK 504', '1A', true),
    p('p-012', 'Leela Menon', 'SQ99M4', 'SQ 990', '22C', true),
    p('p-013', 'Dev Malhotra', 'QF40N7', 'QF 401', '6F', false),
  ]

  return {
    version: STORAGE_VERSION,
    simulationDate: d,
    flights,
    airports: AIRPORTS,
    routes: ROUTES,
    gates,
    runways,
    passengers,
    departureQueue: ['fl-002', 'fl-004', 'fl-005', 'fl-007'],
    emergencyHeap: [
      { flightId: 'fl-013', priority: 4, seq: 0 },
      { flightId: 'fl-007', priority: 3, seq: 1 },
      { flightId: 'fl-003', priority: 2, seq: 2 },
    ],
    heapSeq: 3,
    history: [
      {
        id: 'h-seed',
        timestamp: isoAt(d, 6, 5),
        description: 'Demonstration data loaded. All records are simulated.',
        undoable: false,
      },
    ],
    undoStack: [],
  }
}

function f(
  id: string,
  flightNumber: string,
  airline: string,
  origin: string,
  destination: string,
  aircraftType: string,
  aircraftCategory: Flight['aircraftCategory'],
  date: string,
  hh: number,
  mm: number,
  duration: number,
  terminal: string,
  gateId: string | null,
  runwayId: string | null,
  status: Flight['status'],
  passengerCount: number,
  delayMinutes: number,
  priority: Flight['priority'],
  notes: string,
): Flight {
  const dep = isoAt(date, hh, mm)
  const est = addMinutes(dep, delayMinutes)
  return {
    id,
    flightNumber,
    airline,
    origin,
    destination,
    aircraftType,
    aircraftCategory,
    scheduledDeparture: dep,
    estimatedDeparture: est,
    scheduledArrival: addMinutes(dep, duration),
    terminal,
    gateId,
    runwayId,
    status,
    passengerCount,
    delayMinutes,
    priority,
    notes,
  }
}

function p(
  id: string,
  name: string,
  bookingRef: string,
  flightNumber: string,
  seat: string,
  checkedIn: boolean,
): Passenger {
  return { id, name, bookingRef, flightNumber, seat, checkedIn }
}

export { AIRLINES }
