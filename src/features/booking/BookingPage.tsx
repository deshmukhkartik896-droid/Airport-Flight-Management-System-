import { useMemo, useState } from 'react'
import { useApp } from '../../app/AppContext'
import { bookFlightSlot } from '../../app/store'
import { AircraftPhoto } from '../../components/AircraftPhoto'
import { AirlineLogo } from '../../components/AirlineLogo'
import { Modal } from '../../components/Modal'
import { StatusBadge } from '../../components/StatusBadge'
import { getAircraftDetails } from '../../data/aircraft'
import { AIRLINES, getAirlineInfo } from '../../data/airlines'
import { AIRPORTS } from '../../data/airports'
import type { Flight } from '../../types/models'
import { formatDateTime, formatTime } from '../../utils/time'

export function BookingPage() {
  const { state, apply } = useApp()
  const [selectedAirline, setSelectedAirline] = useState<string>('')
  const [origin, setOrigin] = useState<string>('')
  const [dest, setDest] = useState<string>('')
  const [cabin, setCabin] = useState<'All' | 'Economy' | 'Business'>('All')
  const [bookingFlight, setBookingFlight] = useState<Flight | null>(null)
  const [passengerName, setPassengerName] = useState<string>('')
  const [preferredSeat, setPreferredSeat] = useState<string>('')
  const [confirmedBooking, setConfirmedBooking] = useState<{
    flight: Flight
    name: string
    seat: string
    pnr: string
  } | null>(null)

  // Filter available flights that can be booked (not cancelled or departed)
  const availableSlots = useMemo(() => {
    return state.flights.filter((f) => {
      if (f.status === 'Cancelled' || f.status === 'Departed' || f.status === 'Arrived') return false
      if (selectedAirline && f.airline !== selectedAirline) return false
      if (origin && f.origin !== origin) return false
      if (dest && f.destination !== dest) return false
      return true
    })
  }, [state.flights, selectedAirline, origin, dest])

  function handleOpenBooking(flight: Flight) {
    setBookingFlight(flight)
    setPassengerName('')
    setPreferredSeat('')
  }

  function handleConfirmBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!bookingFlight) return

    // Find existing seats for suggestions
    const existing = state.passengers.filter((p) => p.flightNumber === bookingFlight.flightNumber)
    const existingSeats = new Set(existing.map((p) => p.seat.toUpperCase()))

    let seat = preferredSeat.trim().toUpperCase()
    if (!seat || existingSeats.has(seat)) {
      const cols = ['A', 'B', 'C', 'D', 'E', 'F']
      for (let r = 1; r <= 35; r++) {
        for (const c of cols) {
          const test = `${r}${c}`
          if (!existingSeats.has(test)) {
            seat = test
            break
          }
        }
        if (seat) break
      }
    }

    const prefix = bookingFlight.flightNumber.replace(/\s+/g, '').slice(0, 4)
    const genPnr = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`

    const ok = apply(bookFlightSlot(state, bookingFlight.id, passengerName || 'Guest Passenger', seat))
    if (ok) {
      setConfirmedBooking({
        flight: bookingFlight,
        name: passengerName.trim() || 'Guest Passenger',
        seat,
        pnr: genPnr,
      })
      setBookingFlight(null)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2>Flight Booking Slots</h2>
            <p>
              Reserve seats on scheduled flights across IndiGo, Air India, Singapore Airlines, Emirates, Qatar Airways,
              Qantas, and Vistara. Each reservation updates passenger counts, syncs with the separate-chaining Hash Table, and generates an educational boarding pass.
            </p>
          </div>
          <span className="badge" style={{ background: 'var(--cyan-dim)', color: 'var(--cyan)', padding: '6px 12px' }}>
            {availableSlots.length} Active Booking Slots Available
          </span>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="toolbar" style={{ flexWrap: 'wrap' }}>
        <select value={selectedAirline} onChange={(e) => setSelectedAirline(e.target.value)}>
          <option value="">All Airlines (IndiGo, Air India, Emirates, etc.)</option>
          {AIRLINES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
          <option value="">Any Origin</option>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code}>
              {a.code} — {a.city}
            </option>
          ))}
        </select>

        <select value={dest} onChange={(e) => setDest(e.target.value)}>
          <option value="">Any Destination</option>
          {AIRPORTS.map((a) => (
            <option key={a.code} value={a.code}>
              {a.code} — {a.city}
            </option>
          ))}
        </select>

        <select value={cabin} onChange={(e) => setCabin(e.target.value as typeof cabin)}>
          <option value="All">All Cabin Classes</option>
          <option value="Economy">Economy</option>
          <option value="Business">Business Class</option>
        </select>

        {(selectedAirline || origin || dest || cabin !== 'All') && (
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setSelectedAirline('')
              setOrigin('')
              setDest('')
              setCabin('All')
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* AIRLINE QUICK SELECTOR CHIPS */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 14 }}>
        {AIRLINES.slice(0, 7).map((a) => {
          const isSelected = selectedAirline === a
          return (
            <button
              key={a}
              type="button"
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: isSelected ? 'var(--cyan-dim)' : 'var(--bg-1)',
                borderColor: isSelected ? 'var(--cyan)' : 'var(--border)',
                padding: '6px 12px',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setSelectedAirline(isSelected ? '' : a)}
            >
              <AirlineLogo airline={a} size={20} />
              <span style={{ fontSize: 13, color: isSelected ? 'var(--cyan)' : 'var(--text)' }}>{a}</span>
            </button>
          )
        })}
      </div>

      {/* FLIGHT SLOTS GRID */}
      {availableSlots.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>No flight booking slots match your selected filters.</p>
          <button
            className="btn primary"
            type="button"
            onClick={() => {
              setSelectedAirline('')
              setOrigin('')
              setDest('')
              setCabin('All')
            }}
          >
            Show All Available Flights
          </button>
        </div>
      ) : (
        <div className="grid two" style={{ gap: 16 }}>
          {availableSlots.map((flight) => {
            const aircraft = getAircraftDetails(flight.aircraftType)
            const airlineInfo = getAirlineInfo(flight.airline)
            const maxCap = aircraft.typicalCapacity
            const booked = flight.passengerCount
            const remaining = Math.max(0, maxCap - booked)
            const occupancyPct = Math.min(100, Math.round((booked / maxCap) * 100))

            // Simulated pricing based on duration/aircraft
            const economyPrice = flight.aircraftCategory === 'Wide' ? 6200 : 3800
            const businessPrice = Math.round(economyPrice * 2.8)

            return (
              <div
                key={flight.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                {/* CARD HEADER */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'var(--bg-2)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AirlineLogo airline={flight.airline} size={32} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{flight.airline}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Flight <strong style={{ color: 'var(--text)' }}>{flight.flightNumber}</strong> · {airlineInfo.alliance}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={flight.status} />
                </div>

                {/* AIRCRAFT PHOTO / ILLUSTRATION PREVIEW */}
                <div style={{ padding: '0', position: 'relative' }}>
                  <AircraftPhoto aircraftType={flight.aircraftType} airlineName={flight.airline} variant="compact" />
                </div>

                {/* ROUTE & SCHEDULE DETAILS */}
                <div style={{ padding: '12px 16px', flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-0)',
                      padding: '12px 16px',
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--cyan)' }}>{flight.origin}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        STD {formatTime(flight.scheduledDeparture)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', flex: 1, padding: '0 16px' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Direct Flight</div>
                      <div
                        style={{
                          height: 2,
                          background: 'var(--border)',
                          margin: '4px 0',
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: -4,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'var(--cyan)',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {aircraft.name.split(' ')[0]} {aircraft.type}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--cyan)' }}>{flight.destination}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        STA {formatTime(flight.scheduledArrival)}
                      </div>
                    </div>
                  </div>

                  {/* SEATS & CABIN AVAILABILITY */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--muted)' }}>Seat Availability Slot:</span>
                      <span>
                        <strong style={{ color: remaining > 15 ? 'var(--green)' : 'var(--amber)' }}>
                          {remaining} seats available
                        </strong>{' '}
                        ({booked}/{maxCap})
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: 'var(--bg-0)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${occupancyPct}%`,
                          background: occupancyPct > 85 ? 'var(--amber)' : 'var(--cyan)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* PRICING & FARE TIERS */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                      marginBottom: 12,
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{
                        background: 'var(--bg-0)',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ color: 'var(--muted)', display: 'block', fontSize: 11 }}>Economy Slot</span>
                      <strong style={{ fontSize: 14, color: 'var(--text)' }}>₹{economyPrice.toLocaleString()}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: 10 }}> / seat</span>
                    </div>
                    <div
                      style={{
                        background: 'var(--bg-0)',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <span style={{ color: 'var(--muted)', display: 'block', fontSize: 11 }}>Business Slot</span>
                      <strong style={{ fontSize: 14, color: '#CBA052' }}>₹{businessPrice.toLocaleString()}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: 10 }}> / seat</span>
                    </div>
                  </div>

                  {/* GATE & TERMINAL BADGES */}
                  <div style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--muted)', alignItems: 'center' }}>
                    <span className="badge" style={{ background: 'var(--bg-3)' }}>
                      Terminal {flight.terminal}
                    </span>
                    <span className="badge" style={{ background: 'var(--bg-3)' }}>
                      Gate {flight.gateId ?? 'TBD'}
                    </span>
                    <span className="badge" style={{ background: 'var(--bg-3)' }}>
                      {aircraft.category} Body
                    </span>
                  </div>
                </div>

                {/* ACTION FOOTER */}
                <div
                  style={{
                    padding: '10px 16px',
                    background: 'var(--bg-0)',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>Instant PNR Generation</span>
                  <button
                    className="btn primary"
                    type="button"
                    onClick={() => handleOpenBooking(flight)}
                    disabled={remaining <= 0}
                  >
                    {remaining > 0 ? 'Book This Slot' : 'Slot Full'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* INTERACTIVE BOOKING MODAL */}
      {bookingFlight && (
        <Modal
          title={`Book Slot: ${bookingFlight.airline} (${bookingFlight.flightNumber})`}
          onClose={() => setBookingFlight(null)}
        >
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <AirlineLogo airline={bookingFlight.airline} size={36} showName showBadge />
            </div>

            <div style={{ marginBottom: 14 }}>
              <AircraftPhoto
                aircraftType={bookingFlight.aircraftType}
                airlineName={bookingFlight.airline}
                variant="card"
              />
            </div>

            <form onSubmit={handleConfirmBooking}>
              <div className="form-grid" style={{ marginBottom: 14 }}>
                <label className="field">
                  Passenger Full Name
                  <input
                    placeholder="e.g. Saumya Sharma"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    required
                  />
                </label>

                <label className="field">
                  Preferred Seat (optional)
                  <input
                    placeholder="e.g. 12A, 14B (auto-allocated if blank)"
                    value={preferredSeat}
                    onChange={(e) => setPreferredSeat(e.target.value.toUpperCase())}
                  />
                </label>
              </div>

              <div
                style={{
                  background: 'var(--bg-0)',
                  border: '1px solid var(--border)',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>Route:</span>
                  <strong>
                    {bookingFlight.origin} → {bookingFlight.destination}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>Departure Schedule:</span>
                  <span>{formatDateTime(bookingFlight.scheduledDeparture)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>Aircraft:</span>
                  <span>
                    {getAircraftDetails(bookingFlight.aircraftType).name} ({bookingFlight.aircraftType})
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Simulation Status:</span>
                  <span style={{ color: 'var(--green)' }}>Instant Booking & Manifest Hash Table Update</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn" type="button" onClick={() => setBookingFlight(null)}>
                  Cancel
                </button>
                <button className="btn primary" type="submit">
                  Confirm & Generate Boarding Pass
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* CONFIRMED BOARDING PASS MODAL */}
      {confirmedBooking && (
        <Modal title="Boarding Pass & Booking Confirmation" onClose={() => setConfirmedBooking(null)}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0E1A30 0%, #172642 100%)',
              border: '2px solid var(--cyan)',
              borderRadius: 12,
              padding: 20,
              boxShadow: 'var(--shadow)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header with Airline Logo and Brand Accent */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px dashed var(--border)',
                paddingBottom: 12,
                marginBottom: 14,
              }}
            >
              <AirlineLogo airline={confirmedBooking.flight.airline} size={36} showName showBadge />
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    color: 'var(--muted)',
                  }}
                >
                  Electronic Boarding Pass
                </span>
                <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--cyan)' }}>
                  PNR: {confirmedBooking.pnr}
                </span>
              </div>
            </div>

            {/* Passenger & Flight Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 10 }}>PASSENGER</span>
                <strong style={{ fontSize: 13, color: 'var(--text)' }}>{confirmedBooking.name}</strong>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 10 }}>FLIGHT</span>
                <strong style={{ fontSize: 13, color: 'var(--text)' }}>{confirmedBooking.flight.flightNumber}</strong>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 10 }}>SEAT</span>
                <strong style={{ fontSize: 15, color: 'var(--green)' }}>{confirmedBooking.seat}</strong>
              </div>
              <div>
                <span style={{ display: 'block', color: 'var(--muted)', fontSize: 10 }}>GATE</span>
                <strong style={{ fontSize: 13, color: 'var(--amber)' }}>
                  {confirmedBooking.flight.gateId ?? 'TBD'}
                </strong>
              </div>
            </div>

            {/* Route details */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '10px 14px',
                borderRadius: 8,
                marginBottom: 14,
              }}
            >
              <div>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{confirmedBooking.flight.origin}</span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                  {formatTime(confirmedBooking.flight.scheduledDeparture)}
                </span>
              </div>
              <div style={{ textAlign: 'center', color: 'var(--cyan)', fontSize: 12 }}>
                ✈ {confirmedBooking.flight.airline} · {confirmedBooking.flight.aircraftType}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{confirmedBooking.flight.destination}</span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--muted)' }}>
                  {formatTime(confirmedBooking.flight.scheduledArrival)}
                </span>
              </div>
            </div>

            {/* Aircraft Illustration Mini Preview */}
            <div style={{ marginBottom: 12, height: 75 }}>
              <AircraftPhoto
                aircraftType={confirmedBooking.flight.aircraftType}
                airlineName={confirmedBooking.flight.airline}
                variant="compact"
              />
            </div>

            {/* Simulated Barcode */}
            <div
              style={{
                borderTop: '1px dashed var(--border)',
                paddingTop: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: 4,
                  fontSize: 16,
                  color: 'var(--muted)',
                  fontWeight: 700,
                }}
              >
                ||| | |||| | ||||| ||| |||| | |||| |||
              </div>
              <span style={{ fontSize: 11, color: 'var(--green)' }}>
                ✓ Manifest Indexed (Hash Table $O(1)$)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, gap: 10 }}>
            <button className="btn primary" type="button" onClick={() => setConfirmedBooking(null)}>
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
