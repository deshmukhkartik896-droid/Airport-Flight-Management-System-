export interface AircraftDetails {
  type: string
  name: string
  manufacturer: 'Airbus' | 'Boeing' | 'ATR'
  category: 'Narrow' | 'Wide' | 'Regional'
  typicalCapacity: number
  rangeKm: number
  cruiseSpeedKmh: number
  ceilingFt: number
  engines: string
  description: string
}

export const AIRCRAFT_REGISTRY: Record<string, AircraftDetails> = {
  A320: {
    type: 'A320',
    name: 'Airbus A320neo',
    manufacturer: 'Airbus',
    category: 'Narrow',
    typicalCapacity: 180,
    rangeKm: 6500,
    cruiseSpeedKmh: 830,
    ceilingFt: 39000,
    engines: '2× CFM LEAP-1A / Pratt & Whitney PW1100G',
    description: 'Workhorse of short-to-medium haul domestic networks with sharklet wingtips and quiet high-bypass turbofans.',
  },
  A321: {
    type: 'A321',
    name: 'Airbus A321neo',
    manufacturer: 'Airbus',
    category: 'Narrow',
    typicalCapacity: 220,
    rangeKm: 7400,
    cruiseSpeedKmh: 835,
    ceilingFt: 39800,
    engines: '2× CFM LEAP-1A',
    description: 'Stretched single-aisle aircraft delivering exceptional passenger throughput and transcontinental range.',
  },
  B737: {
    type: 'B737',
    name: 'Boeing 737-800',
    manufacturer: 'Boeing',
    category: 'Narrow',
    typicalCapacity: 168,
    rangeKm: 5765,
    cruiseSpeedKmh: 840,
    ceilingFt: 41000,
    engines: '2× CFM56-7B',
    description: 'Proven global narrow-body with blended winglets, trusted by major full-service and regional carriers.',
  },
  A350: {
    type: 'A350',
    name: 'Airbus A350-900',
    manufacturer: 'Airbus',
    category: 'Wide',
    typicalCapacity: 314,
    rangeKm: 15000,
    cruiseSpeedKmh: 903,
    ceilingFt: 43100,
    engines: '2× Rolls-Royce Trent XWB',
    description: 'Ultra-long-range wide-body built with carbon-fiber reinforced plastic fuselage, mood lighting, and low cabin altitude.',
  },
  B777: {
    type: 'B777',
    name: 'Boeing 777-300ER',
    manufacturer: 'Boeing',
    category: 'Wide',
    typicalCapacity: 396,
    rangeKm: 13650,
    cruiseSpeedKmh: 905,
    ceilingFt: 43100,
    engines: '2× GE90-115B (World’s Most Powerful Jet Engine)',
    description: 'Flagship long-haul twin-engine airliner commanding intercontinental hubs with massive payload and range.',
  },
  B787: {
    type: 'B787',
    name: 'Boeing 787-9 Dreamliner',
    manufacturer: 'Boeing',
    category: 'Wide',
    typicalCapacity: 290,
    rangeKm: 14140,
    cruiseSpeedKmh: 903,
    ceilingFt: 43000,
    engines: '2× GEnx-1B / Rolls-Royce Trent 1000',
    description: 'Composite Dreamliner featuring raked wingtips, electrochromic dimming windows, and higher cabin humidity.',
  },
  A380: {
    type: 'A380',
    name: 'Airbus A380-800 Superjumbo',
    manufacturer: 'Airbus',
    category: 'Wide',
    typicalCapacity: 520,
    rangeKm: 14800,
    cruiseSpeedKmh: 903,
    ceilingFt: 43000,
    engines: '4× Engine Alliance GP7200 / Trent 900',
    description: 'The world’s largest passenger airliner: double-deck wide-body offering unprecedented comfort and hub throughput.',
  },
  A330: {
    type: 'A330',
    name: 'Airbus A330-300',
    manufacturer: 'Airbus',
    category: 'Wide',
    typicalCapacity: 277,
    rangeKm: 11750,
    cruiseSpeedKmh: 871,
    ceilingFt: 41100,
    engines: '2× Rolls-Royce Trent 700 / GE CF6',
    description: 'Efficient wide-body twin powering medium-to-long haul trunk routes and international cargo operations.',
  },
  ATR72: {
    type: 'ATR72',
    name: 'ATR 72-600',
    manufacturer: 'ATR',
    category: 'Regional',
    typicalCapacity: 70,
    rangeKm: 1528,
    cruiseSpeedKmh: 510,
    ceilingFt: 25000,
    engines: '2× Pratt & Whitney Canada PW127M Turboprops',
    description: 'Short-takeoff twin-turboprop connecting regional airfields and underserved regional connectivity hubs.',
  },
}

export function getAircraftDetails(type: string): AircraftDetails {
  // Direct key lookup or fuzzy match
  for (const [key, details] of Object.entries(AIRCRAFT_REGISTRY)) {
    if (type.toUpperCase().includes(key.toUpperCase())) return details
  }
  return AIRCRAFT_REGISTRY['A320']
}
