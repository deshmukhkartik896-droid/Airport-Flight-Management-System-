import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { importState, loadState, saveState } from '../services/storage'
import type { AppState } from '../types/models'
import type { ActionResult } from './store'

interface Toast {
  kind: 'ok' | 'error'
  text: string
}

interface AppContextValue {
  state: AppState
  setState: (state: AppState) => void
  apply: (result: ActionResult) => boolean
  toast: Toast | null
  notify: (kind: 'ok' | 'error', text: string) => void
  doImport: (json: string) => void
}

const Ctx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const notify = useCallback((kind: 'ok' | 'error', text: string) => {
    setToast({ kind, text })
    window.setTimeout(() => setToast(null), 4200)
  }, [])

  const apply = useCallback(
    (result: ActionResult) => {
      if (result.error) {
        notify('error', result.error)
        return false
      }
      setState(result.state)
      if (result.info) notify('ok', result.info)
      return true
    },
    [notify],
  )

  const doImport = useCallback(
    (json: string) => {
      const parsed = importState(json)
      if (!parsed.ok) {
        notify('error', parsed.error)
        return
      }
      setState(parsed.state)
      notify('ok', 'Records imported. Simulated data only.')
    },
    [notify],
  )

  const value = useMemo(
    () => ({ state, setState, apply, toast, notify, doImport }),
    [state, apply, toast, notify, doImport],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
