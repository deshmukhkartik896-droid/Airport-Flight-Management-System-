export interface AirlineInfo {
  name: string
  iata: string
  icao: string
  callsign: string
  country: string
  hub: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  alliance: string
}

export const AIRLINE_REGISTRY: Record<string, AirlineInfo> = {
  IndiGo: {
    name: 'IndiGo',
    iata: '6E',
    icao: 'IGO',
    callsign: 'IFLY',
    country: 'India',
    hub: 'DEL / BOM',
    primaryColor: '#002B7F',
    secondaryColor: '#0085FF',
    accentColor: '#E6F0FA',
    alliance: 'None (Codeshare)',
  },
  'Air India': {
    name: 'Air India',
    iata: 'AI',
    icao: 'AIC',
    callsign: 'AIRINDIA',
    country: 'India',
    hub: 'DEL / BOM',
    primaryColor: '#D71921',
    secondaryColor: '#F7941D',
    accentColor: '#FFF2E6',
    alliance: 'Star Alliance',
  },
  'Singapore Airlines': {
    name: 'Singapore Airlines',
    iata: 'SQ',
    icao: 'SIA',
    callsign: 'SINGAPORE',
    country: 'Singapore',
    hub: 'SIN',
    primaryColor: '#00266B',
    secondaryColor: '#CBA052',
    accentColor: '#F7F3E9',
    alliance: 'Star Alliance',
  },
  Emirates: {
    name: 'Emirates',
    iata: 'EK',
    icao: 'UAE',
    callsign: 'EMIRATES',
    country: 'UAE',
    hub: 'DXB',
    primaryColor: '#D71920',
    secondaryColor: '#B38B4D',
    accentColor: '#FDF6E2',
    alliance: 'None (Global)',
  },
  'Qatar Airways': {
    name: 'Qatar Airways',
    iata: 'QR',
    icao: 'QTR',
    callsign: 'QATARI',
    country: 'Qatar',
    hub: 'DOH',
    primaryColor: '#5C0632',
    secondaryColor: '#A37A58',
    accentColor: '#F7EFF3',
    alliance: 'oneworld',
  },
  Qantas: {
    name: 'Qantas',
    iata: 'QF',
    icao: 'QFA',
    callsign: 'QANTAS',
    country: 'Australia',
    hub: 'SYD / MEL',
    primaryColor: '#E0001A',
    secondaryColor: '#1A1A1A',
    accentColor: '#FEECEC',
    alliance: 'oneworld',
  },
  Vistara: {
    name: 'Vistara',
    iata: 'UK',
    icao: 'VTI',
    callsign: 'VISTARA',
    country: 'India',
    hub: 'DEL / BOM',
    primaryColor: '#4B1238',
    secondaryColor: '#C29B38',
    accentColor: '#F8F1E7',
    alliance: 'Tata SIA',
  },
  Lufthansa: {
    name: 'Lufthansa',
    iata: 'LH',
    icao: 'DLH',
    callsign: 'LUFTHANSA',
    country: 'Germany',
    hub: 'FRA / MUC',
    primaryColor: '#05164D',
    secondaryColor: '#FFAC00',
    accentColor: '#FFF8E6',
    alliance: 'Star Alliance',
  },
  'British Airways': {
    name: 'British Airways',
    iata: 'BA',
    icao: 'BAW',
    callsign: 'SPEEDBIRD',
    country: 'United Kingdom',
    hub: 'LHR',
    primaryColor: '#075AAA',
    secondaryColor: '#EB2226',
    accentColor: '#EEF5FB',
    alliance: 'oneworld',
  },
}

export const AIRLINES = Object.keys(AIRLINE_REGISTRY)

export function getAirlineInfo(name?: string): AirlineInfo {
  if (!name) return AIRLINE_REGISTRY['IndiGo']
  // Direct match or partial match
  if (AIRLINE_REGISTRY[name]) return AIRLINE_REGISTRY[name]
  const lower = name.toLowerCase()
  for (const [key, info] of Object.entries(AIRLINE_REGISTRY)) {
    if (lower.includes(key.toLowerCase()) || lower.includes(info.iata.toLowerCase())) {
      return info
    }
  }
  return {
    name,
    iata: name.slice(0, 2).toUpperCase(),
    icao: name.slice(0, 3).toUpperCase(),
    callsign: name.toUpperCase(),
    country: 'International',
    hub: 'Global',
    primaryColor: '#2D3D55',
    secondaryColor: '#3EC6FF',
    accentColor: '#172033',
    alliance: 'Independent',
  }
}
