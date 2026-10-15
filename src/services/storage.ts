import { createSeedState } from '../data/seed'
import type { AppState } from '../types/models'
import { STORAGE_KEY, STORAGE_VERSION } from '../types/models'
import { todayIsoDate } from '../utils/time'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState(todayIsoDate())
    const parsed = JSON.parse(raw) as Partial<AppState>
    if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.flights)) {
      return createSeedState(todayIsoDate())
    }
    const seed = createSeedState(parsed.simulationDate || todayIsoDate())
    return {
      ...seed,
      ...parsed,
      version: STORAGE_VERSION,
      airports: seed.airports,
      routes: parsed.routes ?? seed.routes,
      undoStack: parsed.undoStack ?? [],
      history: parsed.history ?? seed.history,
    } as AppState
  } catch {
    return createSeedState(todayIsoDate())
  }
}

export function saveState(state: AppState): void {
  try {
    const persistable: AppState = { ...state, undoStack: state.undoStack.slice(-40), history: state.history.slice(-80) }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable))
  } catch {
    /* quota / private mode — keep running in memory */
  }
}

export function exportState(state: AppState): string {
  return JSON.stringify({ ...state, undoStack: [] }, null, 2)
}

export function importState(json: string): { ok: true; state: AppState } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(json) as Partial<AppState>
    if (!Array.isArray(parsed.flights) || !Array.isArray(parsed.passengers)) {
      return { ok: false, error: 'JSON is missing required collections.' }
    }
    const base = createSeedState(parsed.simulationDate || todayIsoDate())
    return {
      ok: true,
      state: {
        ...base,
        ...parsed,
        version: STORAGE_VERSION,
        airports: base.airports,
        undoStack: [],
      } as AppState,
    }
  } catch {
    return { ok: false, error: 'Could not parse JSON.' }
  }
}
