import type { Flight, Gate, Runway } from '../types/models'
import { intervalsOverlap } from '../utils/time'

export interface Conflict {
  resourceId: string
  message: string
}

export function gateConflicts(gates: Gate[], flights: Flight[]): Conflict[] {
  const conflicts: Conflict[] = []
  for (const gate of gates) {
    if (!gate.assignedFlightId || !gate.occupancyStart || !gate.occupancyEnd) continue
    const flight = flights.find((item) => item.id === gate.assignedFlightId)
    if (flight && flight.aircraftCategory !== gate.aircraftCategory) {
      conflicts.push({
        resourceId: gate.id,
        message: `${gate.id}: aircraft category ${flight.aircraftCategory} is incompatible with gate ${gate.aircraftCategory}.`,
      })
    }
    if (gate.occupancyStart >= gate.occupancyEnd) {
      conflicts.push({ resourceId: gate.id, message: `${gate.id}: occupancy interval is inverted.` })
    }
  }
  return conflicts
}

export function wouldGateOverlap(
  gates: Gate[],
  gateId: string,
  start: string,
  end: string,
  ignoreFlightId?: string,
): boolean {
  const gate = gates.find((g) => g.id === gateId)
  if (!gate || !gate.occupancyStart || !gate.occupancyEnd) return false
  if (ignoreFlightId && gate.assignedFlightId === ignoreFlightId) return false
  if (!gate.assignedFlightId) return false
  return intervalsOverlap(gate.occupancyStart, gate.occupancyEnd, start, end)
}

export function wouldRunwayOverlap(
  runways: Runway[],
  runwayId: string,
  start: string,
  end: string,
  ignoreFlightId?: string,
): boolean {
  const runway = runways.find((r) => r.id === runwayId)
  if (!runway || !runway.intervalStart || !runway.intervalEnd) return false
  if (ignoreFlightId && runway.assignedFlightId === ignoreFlightId) return false
  if (!runway.assignedFlightId) return false
  return intervalsOverlap(runway.intervalStart, runway.intervalEnd, start, end)
}

export function runwayConflicts(runways: Runway[]): Conflict[] {
  const conflicts: Conflict[] = []
  for (const runway of runways) {
    if (runway.status !== 'Open' && runway.assignedFlightId) {
      conflicts.push({
        resourceId: runway.id,
        message: `${runway.id} is ${runway.status} but still has a simulated assignment.`,
      })
    }
    if (runway.intervalStart && runway.intervalEnd && runway.intervalStart >= runway.intervalEnd) {
      conflicts.push({ resourceId: runway.id, message: `${runway.id}: reservation interval is inverted.` })
    }
  }
  return conflicts
}
