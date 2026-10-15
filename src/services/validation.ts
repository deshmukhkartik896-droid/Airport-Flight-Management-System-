import { VALID_STATUS_TRANSITIONS } from '../config/constants'
import type { Flight, FlightStatus, Gate, Passenger } from '../types/models'
import { AIRPORT_CODES } from '../data/airports'

export function validateFlight(
  flight: Partial<Flight>,
  existing: Flight[],
  gates: Gate[],
  ignoreId?: string,
): string[] {
  const errors: string[] = []
  if (!flight.flightNumber?.trim()) errors.push('Flight number is required.')
  if (!flight.airline?.trim()) errors.push('Airline is required.')
  if (!flight.origin) errors.push('Origin is required.')
  if (!flight.destination) errors.push('Destination is required.')
  if (flight.origin && flight.destination && flight.origin === flight.destination) {
    errors.push('Origin and destination cannot be the same airport.')
  }
  if (flight.origin && !AIRPORT_CODES.includes(flight.origin)) {
    errors.push('Origin is not a known simulated airport.')
  }
  if (flight.destination && !AIRPORT_CODES.includes(flight.destination)) {
    errors.push('Destination is not a known simulated airport.')
  }
  if (!flight.aircraftType?.trim()) errors.push('Aircraft type is required.')
  if (!flight.scheduledDeparture) errors.push('Scheduled departure is required.')
  if (!flight.scheduledArrival) errors.push('Scheduled arrival is required.')
  if (
    flight.scheduledDeparture &&
    flight.scheduledArrival &&
    flight.scheduledDeparture >= flight.scheduledArrival
  ) {
    errors.push('Departure must occur before arrival on this simulated schedule.')
  }
  if (flight.passengerCount === undefined || Number.isNaN(flight.passengerCount)) {
    errors.push('Passenger count is required.')
  } else if (flight.passengerCount < 0 || !Number.isInteger(flight.passengerCount)) {
    errors.push('Passenger count must be a non-negative integer.')
  } else if (flight.passengerCount > 500) {
    errors.push('Passenger count exceeds the simulated aircraft capacity limit (500).')
  }
  if (flight.delayMinutes !== undefined && (flight.delayMinutes < 0 || flight.delayMinutes > 24 * 60)) {
    errors.push('Delay duration is invalid.')
  }
  if (flight.gateId) {
    const gate = gates.find((g) => g.id === flight.gateId)
    if (!gate) errors.push('Gate reference is invalid.')
  }
  const dup = existing.find(
    (item) => item.flightNumber === flight.flightNumber?.trim() && item.id !== ignoreId,
  )
  if (dup) errors.push('A flight with this flight number already exists.')
  return errors
}

export function canTransition(from: FlightStatus, to: FlightStatus): boolean {
  if (from === to) return true
  return (VALID_STATUS_TRANSITIONS[from] ?? []).includes(to)
}

const BOOKING_RE = /^[A-Z0-9]{5,8}$/
const SEAT_RE = /^[0-9]{1,2}[A-F]$/

export function validatePassenger(
  passenger: Partial<Passenger>,
  existing: Passenger[],
  flightNumbers: string[],
  ignoreId?: string,
): string[] {
  const errors: string[] = []
  if (!passenger.name?.trim()) errors.push('Passenger name is required.')
  if (!passenger.bookingRef?.trim()) errors.push('Booking reference is required.')
  else if (!BOOKING_RE.test(passenger.bookingRef.trim().toUpperCase())) {
    errors.push('Booking reference must be 5–8 letters or digits (simulated PNR).')
  }
  if (!passenger.flightNumber) errors.push('Flight number is required.')
  else if (!flightNumbers.includes(passenger.flightNumber)) {
    errors.push('Flight number is not in the current timetable.')
  }
  if (!passenger.seat?.trim()) errors.push('Seat is required.')
  else if (!SEAT_RE.test(passenger.seat.trim().toUpperCase())) {
    errors.push('Seat must look like 12A (row 1–99, letter A–F).')
  }
  const dupRef = existing.find(
    (item) => item.bookingRef.toUpperCase() === passenger.bookingRef?.trim().toUpperCase() && item.id !== ignoreId,
  )
  if (dupRef) errors.push('Booking reference must be unique.')
  const dupSeat = existing.find(
    (item) =>
      item.flightNumber === passenger.flightNumber &&
      item.seat.toUpperCase() === passenger.seat?.trim().toUpperCase() &&
      item.id !== ignoreId,
  )
  if (dupSeat) errors.push('That seat is already assigned on this flight.')
  return errors
}
