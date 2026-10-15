import { describe, expect, it } from 'vitest'
import { canTransition, validateFlight, validatePassenger } from '../src/services/validation'
import type { Flight, Gate, Passenger } from '../src/types/models'

describe('Domain Models Validation', () => {
  const sampleGates: Gate[] = [
    {
      id: 'G-A1',
      terminal: 'T1',
      aircraftCategory: 'Narrow',
      assignedFlightId: null,
      occupancyStart: null,
      occupancyEnd: null,
    },
  ]

  const validFlight: Omit<Flight, 'id'> = {
    flightNumber: 'SF 210',
    airline: 'Saffron Air (sim.)',
    origin: 'NAG',
    destination: 'BOM',
    aircraftType: 'A320',
    aircraftCategory: 'Narrow',
    scheduledDeparture: '2026-10-10T07:10:00Z',
    estimatedDeparture: '2026-10-10T07:10:00Z',
    scheduledArrival: '2026-10-10T08:40:00Z',
    terminal: 'T1',
    gateId: 'G-A1',
    runwayId: null,
    status: 'Scheduled',
    passengerCount: 148,
    delayMinutes: 0,
    priority: 1,
    notes: 'Demo',
  }

  describe('validateFlight', () => {
    it('approves valid flight record', () => {
      const errs = validateFlight(validFlight, [], sampleGates)
      expect(errs).toEqual([])
    })

    it('rejects missing required flight fields', () => {
      const errs = validateFlight({}, [], sampleGates)
      expect(errs).toContain('Flight number is required.')
      expect(errs).toContain('Airline is required.')
      expect(errs).toContain('Origin is required.')
      expect(errs).toContain('Destination is required.')
      expect(errs).toContain('Aircraft type is required.')
      expect(errs).toContain('Scheduled departure is required.')
      expect(errs).toContain('Scheduled arrival is required.')
      expect(errs).toContain('Passenger count is required.')
    })

    it('rejects origin equal to destination', () => {
      const errs = validateFlight({ ...validFlight, destination: 'NAG' }, [], sampleGates)
      expect(errs).toContain('Origin and destination cannot be the same airport.')
    })

    it('rejects unknown airport codes', () => {
      const errs = validateFlight({ ...validFlight, origin: 'JFK' }, [], sampleGates)
      expect(errs).toContain('Origin is not a known simulated airport.')
    })

    it('rejects departure time greater than or equal to arrival time', () => {
      const errs = validateFlight(
        { ...validFlight, scheduledArrival: '2026-10-10T06:00:00Z' },
        [],
        sampleGates,
      )
      expect(errs).toContain('Departure must occur before arrival on this simulated schedule.')
    })

    it('rejects invalid passenger count (negative or exceeding max capacity)', () => {
      const negative = validateFlight({ ...validFlight, passengerCount: -5 }, [], sampleGates)
      expect(negative).toContain('Passenger count must be a non-negative integer.')

      const huge = validateFlight({ ...validFlight, passengerCount: 600 }, [], sampleGates)
      expect(huge).toContain('Passenger count exceeds the simulated aircraft capacity limit (500).')
    })

    it('rejects duplicate flight numbers', () => {
      const existing: Flight[] = [{ ...validFlight, id: 'fl-1' }]
      const errs = validateFlight(validFlight, existing, sampleGates)
      expect(errs).toContain('A flight with this flight number already exists.')
    })

    it('ignores self flight number when editing with ignoreId', () => {
      const existing: Flight[] = [{ ...validFlight, id: 'fl-1' }]
      const errs = validateFlight(validFlight, existing, sampleGates, 'fl-1')
      expect(errs).toEqual([])
    })
  })

  describe('Flight Status Transitions (canTransition)', () => {
    it('allows valid transitions according to state machine', () => {
      expect(canTransition('Scheduled', 'Boarding')).toBe(true)
      expect(canTransition('Scheduled', 'Delayed')).toBe(true)
      expect(canTransition('Scheduled', 'Cancelled')).toBe(true)
      expect(canTransition('Boarding', 'Departed')).toBe(true)
      expect(canTransition('Departed', 'Arrived')).toBe(true)
      expect(canTransition('Delayed', 'Departed')).toBe(true)
      expect(canTransition('Scheduled', 'Scheduled')).toBe(true)
    })

    it('forbids invalid transitions', () => {
      expect(canTransition('Arrived', 'Scheduled')).toBe(false)
      expect(canTransition('Cancelled', 'Departed')).toBe(false)
      expect(canTransition('Departed', 'Boarding')).toBe(false)
    })
  })

  describe('validatePassenger', () => {
    const validPassenger: Passenger = {
      id: 'p-001',
      name: 'Aarav Mehta',
      bookingRef: 'SF21A4',
      flightNumber: 'SF 210',
      seat: '12A',
      checkedIn: true,
    }

    it('approves valid passenger', () => {
      const errs = validatePassenger(validPassenger, [], ['SF 210'])
      expect(errs).toEqual([])
    })

    it('rejects missing name, bookingRef, seat or flightNumber not in timetable', () => {
      const errs = validatePassenger({}, [], ['SF 210'])
      expect(errs).toContain('Passenger name is required.')
      expect(errs).toContain('Booking reference is required.')
      expect(errs).toContain('Flight number is required.')
      expect(errs).toContain('Seat is required.')
    })

    it('validates booking reference format and uniqueness', () => {
      const badRef = validatePassenger({ ...validPassenger, bookingRef: '??' }, [], ['SF 210'])
      expect(badRef).toContain('Booking reference must be 5–8 letters or digits (simulated PNR).')

      const duplicateRef = validatePassenger(validPassenger, [validPassenger], ['SF 210'])
      expect(duplicateRef).toContain('Booking reference must be unique.')
    })

    it('validates seat format and seat assignment collision per flight', () => {
      const badSeat = validatePassenger({ ...validPassenger, seat: 'XYZ' }, [], ['SF 210'])
      expect(badSeat).toContain('Seat must look like 12A (row 1–99, letter A–F).')

      const seatCollision = validatePassenger(
        { ...validPassenger, id: 'p-002', bookingRef: 'OTHER1' },
        [validPassenger],
        ['SF 210'],
      )
      expect(seatCollision).toContain('That seat is already assigned on this flight.')
    })
  })
})
