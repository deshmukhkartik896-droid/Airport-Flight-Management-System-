import { beforeEach, describe, expect, it } from 'vitest'
import { createSeedState } from '../src/data/seed'
import { exportState, importState, loadState, saveState } from '../src/services/storage'
import { STORAGE_KEY } from '../src/types/models'

describe('Storage & State Persistence', () => {
  let memoryStore: Record<string, string> = {}

  beforeEach(() => {
    memoryStore = {}
    const mockLocalStorage = {
      getItem: (key: string) => memoryStore[key] ?? null,
      setItem: (key: string, value: string) => {
        memoryStore[key] = value
      },
      removeItem: (key: string) => {
        delete memoryStore[key]
      },
      clear: () => {
        memoryStore = {}
      },
    }
    // Polyfill global localStorage for Node test runner
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    })
  })

  it('loads seed state when storage is empty', () => {
    const state = loadState()
    expect(state.flights.length).toBeGreaterThan(0)
    expect(state.airports.length).toBeGreaterThan(0)
    expect(state.gates.length).toBeGreaterThan(0)
  })

  it('saves state and restores it on subsequent load', () => {
    const initial = createSeedState('2026-10-10')
    const updated = {
      ...initial,
      simulationDate: '2026-10-15',
    }
    saveState(updated)

    const loaded = loadState()
    expect(loaded.simulationDate).toBe('2026-10-15')
    expect(loaded.flights.length).toBe(initial.flights.length)
  })

  it('falls back to seed state if stored JSON is corrupt or outdated version', () => {
    localStorage.setItem(STORAGE_KEY, 'INVALID_JSON{{{')
    const state1 = loadState()
    expect(state1.flights.length).toBeGreaterThan(0)

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 999, flights: 'not-an-array' }))
    const state2 = loadState()
    expect(state2.flights.length).toBeGreaterThan(0)
  })

  it('exports and imports valid JSON correctly', () => {
    const current = createSeedState('2026-10-10')
    const json = exportState(current)
    expect(json).toContain('"flights"')
    expect(json).toContain('"simulationDate"')

    const importRes = importState(json)
    expect(importRes.ok).toBe(true)
    if (importRes.ok) {
      expect(importRes.state.flights.length).toBe(current.flights.length)
      expect(importRes.state.airports.length).toBe(current.airports.length)
    }
  })

  it('rejects invalid JSON string or missing collections during import', () => {
    const invalidJsonRes = importState('NOT JSON')
    expect(invalidJsonRes.ok).toBe(false)
    if (!invalidJsonRes.ok) {
      expect(invalidJsonRes.error).toContain('Could not parse JSON')
    }

    const missingCollectionsRes = importState(JSON.stringify({ someKey: 123 }))
    expect(missingCollectionsRes.ok).toBe(false)
    if (!missingCollectionsRes.ok) {
      expect(missingCollectionsRes.error).toContain('missing required collections')
    }
  })
})
