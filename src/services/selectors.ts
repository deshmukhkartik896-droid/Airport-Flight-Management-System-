import { HUB_CODE } from '../config/constants'
import type { AppState, DashboardStats, Flight } from '../types/models'

export function computeStats(state: AppState): DashboardStats {
  const { flights, gates } = state
  const hub = HUB_CODE
  const nowLike = `${state.simulationDate}T12:00:00`
  const scheduledDepartures = flights.filter(
    (f) => f.origin === hub && f.status !== 'Cancelled' && f.status !== 'Arrived',
  ).length
  const scheduledArrivals = flights.filter(
    (f) => f.destination === hub && f.status !== 'Cancelled' && f.status !== 'Departed',
  ).length
  const delayedFlights = flights.filter((f) => f.status === 'Delayed' || f.delayMinutes > 0).length
  const cancelledFlights = flights.filter((f) => f.status === 'Cancelled').length
  const occupiedGates = gates.filter((g) => g.assignedFlightId).length
  const eligible = flights.filter((f) => f.status !== 'Cancelled')
  const onTime = eligible.filter((f) => f.delayMinutes === 0 && f.status !== 'Delayed').length
  const onTimePerformance = eligible.length === 0 ? 100 : Math.round((onTime / eligible.length) * 100)
  void nowLike
  return {
    totalFlights: flights.length,
    scheduledDepartures,
    scheduledArrivals,
    delayedFlights,
    cancelledFlights,
    availableGates: gates.length - occupiedGates,
    occupiedGates,
    onTimePerformance,
  }
}

export function upcomingDepartures(state: AppState, limit = 6): Flight[] {
  return state.flights
    .filter((f) => f.origin === HUB_CODE && f.status !== 'Cancelled' && f.status !== 'Arrived' && f.status !== 'Departed')
    .slice()
    .sort((a, b) => a.scheduledDeparture.localeCompare(b.scheduledDeparture))
    .slice(0, limit)
}

export function upcomingArrivals(state: AppState, limit = 6): Flight[] {
  return state.flights
    .filter((f) => f.destination === HUB_CODE && f.status !== 'Cancelled' && f.status !== 'Arrived')
    .slice()
    .sort((a, b) => a.scheduledArrival.localeCompare(b.scheduledArrival))
    .slice(0, limit)
}

export function queuePosition(state: AppState, flightId: string): number | null {
  const idx = state.departureQueue.indexOf(flightId)
  return idx >= 0 ? idx + 1 : null
}

export function isInactiveForQueue(flight: Flight): boolean {
  return flight.status === 'Cancelled' || flight.status === 'Departed' || flight.status === 'Arrived'
}

export function passengerCounts(state: AppState): Record<string, number> {
  const map: Record<string, number> = {}
  for (const p of state.passengers) {
    map[p.flightNumber] = (map[p.flightNumber] ?? 0) + 1
  }
  return map
}
