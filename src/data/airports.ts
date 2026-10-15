import type { Airport, RouteEdge } from '../types/models'

export const AIRPORTS: Airport[] = [
  { code: 'NAG', name: 'Nagpur (simulated hub)', city: 'Nagpur', x: 430, y: 250 },
  { code: 'BOM', name: 'Mumbai (simulated)', city: 'Mumbai', x: 180, y: 280 },
  { code: 'DEL', name: 'Delhi (simulated)', city: 'Delhi', x: 360, y: 70 },
  { code: 'HYD', name: 'Hyderabad (simulated)', city: 'Hyderabad', x: 420, y: 380 },
  { code: 'BLR', name: 'Bengaluru (simulated)', city: 'Bengaluru', x: 360, y: 470 },
  { code: 'MAA', name: 'Chennai (simulated)', city: 'Chennai', x: 560, y: 480 },
  { code: 'GOI', name: 'Goa (simulated)', city: 'Goa', x: 200, y: 400 },
  { code: 'CCU', name: 'Kolkata (simulated)', city: 'Kolkata', x: 720, y: 220 },
  { code: 'TST', name: 'Isolated demo field', city: 'Test', x: 820, y: 60 },
]

export const ROUTES: RouteEdge[] = [
  { id: 'r1', from: 'NAG', to: 'BOM', distanceKm: 700, label: 'NAG–BOM', available: true },
  { id: 'r2', from: 'NAG', to: 'DEL', distanceKm: 850, label: 'NAG–DEL', available: true },
  { id: 'r3', from: 'NAG', to: 'HYD', distanceKm: 470, label: 'NAG–HYD', available: true },
  { id: 'r4', from: 'NAG', to: 'BLR', distanceKm: 910, label: 'NAG–BLR', available: true },
  { id: 'r5', from: 'NAG', to: 'CCU', distanceKm: 980, label: 'NAG–CCU', available: true },
  { id: 'r6', from: 'BOM', to: 'GOI', distanceKm: 420, label: 'BOM–GOI', available: true },
  { id: 'r7', from: 'BOM', to: 'DEL', distanceKm: 1150, label: 'BOM–DEL', available: true },
  { id: 'r8', from: 'BOM', to: 'HYD', distanceKm: 710, label: 'BOM–HYD', available: true },
  { id: 'r9', from: 'HYD', to: 'BLR', distanceKm: 500, label: 'HYD–BLR', available: true },
  { id: 'r10', from: 'BLR', to: 'MAA', distanceKm: 290, label: 'BLR–MAA', available: true },
  { id: 'r11', from: 'HYD', to: 'MAA', distanceKm: 520, label: 'HYD–MAA', available: true },
  { id: 'r12', from: 'MAA', to: 'CCU', distanceKm: 1350, label: 'MAA–CCU', available: true },
  { id: 'r13', from: 'DEL', to: 'CCU', distanceKm: 1300, label: 'DEL–CCU', available: true },
  { id: 'r14', from: 'DEL', to: 'HYD', distanceKm: 1250, label: 'DEL–HYD', available: true },
]

export const AIRPORT_CODES = AIRPORTS.map((a) => a.code)
