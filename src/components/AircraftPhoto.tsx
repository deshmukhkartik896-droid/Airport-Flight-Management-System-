import type { FC } from 'react'
import { getAircraftDetails } from '../data/aircraft'
import { getAirlineInfo } from '../data/airlines'

interface AircraftPhotoProps {
  aircraftType: string
  airlineName?: string
  variant?: 'card' | 'compact' | 'hero'
  className?: string
}

export const AircraftPhoto: FC<AircraftPhotoProps> = ({
  aircraftType,
  airlineName = 'IndiGo',
  variant = 'card',
  className = '',
}) => {
  const aircraft = getAircraftDetails(aircraftType)
  const airline = getAirlineInfo(airlineName)

  // Determine specific livery colors
  const liveryFinColor = airline.primaryColor
  const liveryAccentColor = airline.secondaryColor
  const isSuperjumbo = aircraft.type === 'A380'
  const isTurboprop = aircraft.type === 'ATR72'

  const renderIllustration = () => (
    <svg viewBox="0 0 520 180" width="100%" height="100%" className="aircraft-svg-art">
      <defs>
        {/* Sky / Runway Tarmac atmospheric lighting */}
        <linearGradient id={`skyGrad-${airline.iata}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B1528" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#142138" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1E3152" stopOpacity="0.9" />
        </linearGradient>

        {/* Metallic fuselage shading */}
        <linearGradient id="fuselageShade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#EAF0F8" />
          <stop offset="70%" stopColor="#D5DFEE" />
          <stop offset="100%" stopColor="#B3C4DC" />
        </linearGradient>

        {/* Engine cowling gradient */}
        <linearGradient id="engineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A5870" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#253043" />
        </linearGradient>
      </defs>

      {/* Atmospheric Horizon & Tarmac Guidelines */}
      <rect x="0" y="0" width="520" height="180" fill={`url(#skyGrad-${airline.iata})`} rx="8" />
      <line x1="20" y1="150" x2="500" y2="150" stroke="#253754" strokeWidth="1" strokeDasharray="8 6" />
      <line x1="0" y1="165" x2="520" y2="165" stroke="#17263C" strokeWidth="1.5" />

      {/* Distant runway runway lights */}
      <circle cx="50" cy="150" r="2" fill="#3EC6FF" opacity="0.6" />
      <circle cx="160" cy="150" r="2" fill="#3EC6FF" opacity="0.4" />
      <circle cx="280" cy="150" r="2" fill="#3EC6FF" opacity="0.6" />
      <circle cx="420" cy="150" r="2" fill="#3EC6FF" opacity="0.4" />

      {/* AIRCRAFT STRUCTURE */}
      <g transform="translate(25, 10)">
        {/* Horizontal Stabilizer (Tail Plane) */}
        <path d="M40 82 L15 72 L18 84 L50 88 Z" fill="#C5D3E8" stroke="#90A4C3" strokeWidth="0.8" />

        {/* Vertical Tail Fin with Authentic Airline Livery */}
        <path
          d={
            isSuperjumbo
              ? 'M65 90 L22 20 L58 18 L115 90 Z'
              : 'M60 92 L28 26 L56 24 L108 92 Z'
          }
          fill={liveryFinColor}
        />
        {/* Livery Brand Accent Stripe on Fin */}
        <path
          d={
            isSuperjumbo
              ? 'M42 20 L58 18 L90 60 L78 62 Z'
              : 'M40 25 L56 24 L86 64 L74 65 Z'
          }
          fill={liveryAccentColor}
          opacity="0.9"
        />

        {/* Airline IATA / Logo indicator on Tail Fin */}
        <text
          x={isSuperjumbo ? '58' : '56'}
          y={isSuperjumbo ? '52' : '56'}
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          {airline.iata}
        </text>

        {/* MAIN FUSELAGE */}
        {isSuperjumbo ? (
          /* Double-decker A380 fuselage */
          <path
            d="M50 92 C90 92 380 92 410 95 C435 98 448 108 450 114 C448 124 430 134 380 134 C250 134 90 134 50 115 Z"
            fill="url(#fuselageShade)"
            stroke="#98ABCA"
            strokeWidth="1"
          />
        ) : (
          /* Sleek single/twin-aisle fuselage */
          <path
            d="M48 94 C90 94 380 94 414 96 C438 98 452 106 454 112 C450 120 435 126 385 126 C250 126 90 126 48 108 Z"
            fill="url(#fuselageShade)"
            stroke="#98ABCA"
            strokeWidth="1"
          />
        )}

        {/* Nose Cone & Radome curve */}
        <path d="M440 102 C452 106 455 110 454 113 C450 118 442 121 436 122" fill="#CBD8EC" />

        {/* Airline Livery Belly or cheatline */}
        <path
          d="M70 120 L400 120 C420 120 435 118 442 115 L438 122 C410 126 250 126 70 123 Z"
          fill={liveryFinColor}
          opacity="0.85"
        />
        <path d="M110 120 L380 120 L375 122 L115 122 Z" fill={liveryAccentColor} />

        {/* Cockpit Windshield */}
        <path d="M428 100 L442 104 L440 108 L427 105 Z" fill="#172235" stroke="#486581" strokeWidth="0.8" />
        <path d="M421 101 L426 101 L425 105 L420 104 Z" fill="#172235" />

        {/* Passenger Cabin Windows (Double row for A380, single row for others) */}
        {isSuperjumbo ? (
          <>
            {/* Upper deck windows */}
            {Array.from({ length: 32 }, (_, i) => (
              <rect key={`uw-${i}`} x={100 + i * 9.5} y={100} width="4.5" height="4" rx="1.5" fill="#1E2C42" />
            ))}
            {/* Main deck windows */}
            {Array.from({ length: 34 }, (_, i) => (
              <rect key={`mw-${i}`} x={92 + i * 9.5} y={112} width="4.5" height="4.5" rx="1.5" fill="#1E2C42" />
            ))}
          </>
        ) : (
          /* Single deck passenger windows */
          Array.from({ length: 28 }, (_, i) => (
            <rect key={`w-${i}`} x={110 + i * 10} y={104} width="4.5" height="5" rx="1.5" fill="#1E2C42" />
          ))
        )}

        {/* Passenger Boarding Doors */}
        <rect x="94" y="101" width="6" height="18" rx="1" fill="#CAD8EC" stroke="#90A4C3" strokeWidth="0.8" />
        <rect x="360" y="101" width="6" height="18" rx="1" fill="#CAD8EC" stroke="#90A4C3" strokeWidth="0.8" />

        {/* Main Swept Wing */}
        {isTurboprop ? (
          /* High-wing turboprop configuration */
          <path d="M220 90 L260 84 L310 84 L305 92 Z" fill="#BACCE3" stroke="#879DBE" strokeWidth="1" />
        ) : (
          /* Low swept wing with sharklet/winglet */
          <g>
            <path
              d="M175 118 L260 138 L300 138 L255 116 Z"
              fill="#BACCE3"
              stroke="#879DBE"
              strokeWidth="1"
            />
            {/* Wingtip Sharklet / Raked wingtip */}
            <path d="M298 138 L308 128 L304 138 Z" fill={liveryFinColor} />
          </g>
        )}

        {/* Jet Engine Nacelles / Turboprops */}
        {isTurboprop ? (
          /* ATR 72 Turboprop Engine with 6-blade propeller */
          <g transform="translate(240, 80)">
            <ellipse cx="25" cy="14" rx="20" ry="7" fill="url(#engineGrad)" />
            {/* Spinner cone */}
            <path d="M45 14 L52 14 L45 12 Z" fill="#D71921" />
            {/* Spinning propeller blades blur disc */}
            <ellipse cx="48" cy="14" rx="3" ry="18" fill="#3EC6FF" opacity="0.35" />
          </g>
        ) : isSuperjumbo ? (
          /* Four Engines for A380 */
          <>
            <g transform="translate(195, 122)">
              <rect x="0" y="0" width="34" height="14" rx="6" fill="url(#engineGrad)" stroke="#334155" strokeWidth="0.8" />
              <ellipse cx="32" cy="7" rx="3" ry="6" fill="#1E293B" />
              <circle cx="32" cy="7" r="2.5" fill="#3EC6FF" opacity="0.7" />
            </g>
            <g transform="translate(242, 126)">
              <rect x="0" y="0" width="34" height="14" rx="6" fill="url(#engineGrad)" stroke="#334155" strokeWidth="0.8" />
              <ellipse cx="32" cy="7" rx="3" ry="6" fill="#1E293B" />
              <circle cx="32" cy="7" r="2.5" fill="#3EC6FF" opacity="0.7" />
            </g>
          </>
        ) : (
          /* Twin High-Bypass Turbofan Jet Engine */
          <g transform="translate(225, 118)">
            <rect x="0" y="0" width="40" height="17" rx="7" fill="url(#engineGrad)" stroke="#334155" strokeWidth="0.8" />
            {/* Engine pylon strut to wing */}
            <path d="M12 0 L18 -6 L28 -6 L26 0 Z" fill="#879DBE" />
            {/* Fan spinner cowl */}
            <ellipse cx="38" cy="8.5" rx="3" ry="7" fill="#1E293B" />
            <circle cx="38" cy="8.5" r="3" fill="#3EC6FF" opacity="0.8" />
          </g>
        )}

        {/* Landing Gear Assemblies */}
        {/* Nose Gear */}
        <line x1="410" y1="126" x2="410" y2="148" stroke="#4A5568" strokeWidth="2" />
        <ellipse cx="410" cy="150" rx="3.5" ry="3.5" fill="#1A202C" />
        {/* Main Body Gear */}
        <line x1="220" y1="126" x2="220" y2="148" stroke="#4A5568" strokeWidth="2.5" />
        <ellipse cx="217" cy="150" rx="4" ry="4" fill="#1A202C" />
        <ellipse cx="225" cy="150" rx="4" ry="4" fill="#1A202C" />
      </g>

      {/* Floating Specs Badges on Upper Corners */}
      <g transform="translate(18, 16)">
        <rect width="90" height="20" rx="5" fill="#0B1324" opacity="0.8" stroke="#253754" strokeWidth="0.8" />
        <text x="45" y="14" fill="#3EC6FF" fontSize="10" fontWeight="700" textAnchor="middle">
          {aircraft.name.split(' ')[0]} {aircraft.type}
        </text>
      </g>

      <g transform="translate(415, 16)">
        <rect width="88" height="20" rx="5" fill="#0B1324" opacity="0.8" stroke="#253754" strokeWidth="0.8" />
        <text x="44" y="14" fill="#9AA8BC" fontSize="9.5" fontWeight="600" textAnchor="middle">
          Max {aircraft.rangeKm.toLocaleString()} km
        </text>
      </g>
    </svg>
  )

  if (variant === 'compact') {
    return (
      <div className={`aircraft-compact-box ${className}`} style={{ height: 80, width: '100%', maxWidth: 220 }}>
        {renderIllustration()}
      </div>
    )
  }

  return (
    <div
      className={`aircraft-photo-card ${className}`}
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ height: variant === 'hero' ? 210 : 160, position: 'relative' }}>
        {renderIllustration()}
      </div>
      <div style={{ padding: '12px 14px', background: 'var(--bg-1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{aircraft.name}</span>
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background: 'var(--bg-3)',
              color: 'var(--cyan)',
            }}
          >
            {aircraft.category} Body
          </span>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
          {aircraft.description}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            fontSize: 11,
            color: 'var(--muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: 8,
          }}
        >
          <div>
            <span style={{ display: 'block', color: 'var(--text)', fontWeight: 600 }}>
              {aircraft.typicalCapacity} seats
            </span>
            <span>Capacity</span>
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--text)', fontWeight: 600 }}>
              {aircraft.cruiseSpeedKmh} km/h
            </span>
            <span>Cruise Speed</span>
          </div>
          <div>
            <span style={{ display: 'block', color: 'var(--text)', fontWeight: 600 }}>
              {aircraft.ceilingFt.toLocaleString()} ft
            </span>
            <span>Max Altitude</span>
          </div>
        </div>
      </div>
    </div>
  )
}
