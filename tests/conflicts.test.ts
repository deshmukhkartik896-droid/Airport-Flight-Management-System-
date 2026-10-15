import { describe, expect, it } from 'vitest'
import {
  gateConflicts,
  runwayConflicts,
  wouldGateOverlap,
  wouldRunwayOverlap,
} from '../src/services/conflicts'
import type { Flight, Gate, Runway } from '../src/types/models'

describe('Resource Conflicts & Overlap Detection', () => {
  const dummyFlight: Flight = {
    id: 'f-1',
    flightNumber: 'SF 100',
    airline: 'Saffron Air (sim.)',
    origin: 'NAG',
    destination: 'BOM',
    aircraftType: 'A320',
    aircraftCategory: 'Narrow',
    scheduledDeparture: '2026-10-10T10:00:00Z',
    estimatedDeparture: '2026-10-10T10:00:00Z',
    scheduledArrival: '2026-10-10T11:30:00Z',
    terminal: 'T1',
    gateId: 'G-A1',
    runwayId: 'RWY-14',
    status: 'Scheduled',
    passengerCount: 140,
    delayMinutes: 0,
    priority: 1,
    notes: '',
  }

  describe('Gate Overlap and Conflicts', () => {
    it('detects time-overlap on an assigned gate', () => {
      const gates: Gate[] = [
        {
          id: 'G-A1',
          terminal: 'T1',
          aircraftCategory: 'Narrow',
          assignedFlightId: 'f-1',
          occupancyStart: '2026-10-10T09:00:00Z',
          occupancyEnd: '2026-10-10T10:30:00Z',
        },
      ]

      // Overlaps from 09:30 to 11:00
      expect(
        wouldGateOverlap(gates, 'G-A1', '2026-10-10T09:30:00Z', '2026-10-10T11:00:00Z'),
      ).toBe(true)

      // Does not overlap: before 09:00
      expect(
        wouldGateOverlap(gates, 'G-A1', '2026-10-10T07:00:00Z', '2026-10-10T08:30:00Z'),
      ).toBe(false)

      // Does not overlap: after 10:30
      expect(
        wouldGateOverlap(gates, 'G-A1', '2026-10-10T10:45:00Z', '2026-10-10T12:00:00Z'),
      ).toBe(false)

      // Ignores overlap if it is the same flight updating its window
      expect(
        wouldGateOverlap(gates, 'G-A1', '2026-10-10T09:30:00Z', '2026-10-10T11:00:00Z', 'f-1'),
      ).toBe(false)
    })

    it('detects aircraft category mismatch and inverted intervals in gateConflicts', () => {
      const wideFlight: Flight = { ...dummyFlight, id: 'f-wide', aircraftCategory: 'Wide' }
      const gates: Gate[] = [
        {
          id: 'G-A1',
          terminal: 'T1',
          aircraftCategory: 'Narrow',
          assignedFlightId: 'f-wide',
          occupancyStart: '2026-10-10T09:00:00Z',
          occupancyEnd: '2026-10-10T10:00:00Z',
        },
        {
          id: 'G-A2',
          terminal: 'T1',
          aircraftCategory: 'Narrow',
          assignedFlightId: 'f-1',
          occupancyStart: '2026-10-10T11:00:00Z',
          occupancyEnd: '2026-10-10T10:00:00Z', // Inverted interval
        },
      ]

      const conflicts = gateConflicts(gates, [wideFlight, dummyFlight])
      expect(conflicts.some((c) => c.message.includes('incompatible'))).toBe(true)
      expect(conflicts.some((c) => c.message.includes('inverted'))).toBe(true)
    })
  })

  describe('Runway Overlap and Conflicts', () => {
    it('detects overlapping runway reservations', () => {
      const runways: Runway[] = [
        {
          id: 'RWY-14',
          status: 'Open',
          assignedFlightId: 'f-1',
          intervalStart: '2026-10-10T10:00:00Z',
          intervalEnd: '2026-10-10T10:15:00Z',
        },
      ]

      expect(
        wouldRunwayOverlap(runways, 'RWY-14', '2026-10-10T10:05:00Z', '2026-10-10T10:20:00Z'),
      ).toBe(true)
      expect(
        wouldRunwayOverlap(runways, 'RWY-14', '2026-10-10T10:30:00Z', '2026-10-10T10:45:00Z'),
      ).toBe(false)
    })

    it('detects assigned flights on non-open runways', () => {
      const runways: Runway[] = [
        {
          id: 'RWY-09',
          status: 'Maintenance',
          assignedFlightId: 'f-1',
          intervalStart: '2026-10-10T10:00:00Z',
          intervalEnd: '2026-10-10T10:15:00Z',
        },
      ]

      const conflicts = runwayConflicts(runways)
      expect(conflicts.some((c) => c.message.includes('Maintenance'))).toBe(true)
    })
  })
})
