import { useState } from 'react'
import { useApp } from '../../app/AppContext'
import { resetDemo, setSimulationDate } from '../../app/store'
import { exportState } from '../../services/storage'

export function SettingsPage() {
  const { state, apply, doImport } = useApp()
  const [json, setJson] = useState('')
  const [date, setDate] = useState(state.simulationDate)

  return (
    <div>
      <div className="page-header">
        <h2>Settings & Data</h2>
        <p>LocalStorage persistence (key aeroflow-atos-v1). No passwords or real personal data are stored.</p>
      </div>
      <div className="grid two">
        <div className="card">
          <div className="card-h">
            <h3>Simulation date</h3>
          </div>
          <div className="card-b">
            <p>Rebuilding the seed timetable uses this date so samples never freeze on an outdated calendar day.</p>
            <div className="toolbar">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <button className="btn primary" type="button" onClick={() => apply(setSimulationDate(state, date))}>
                Apply date & rebuild seed
              </button>
              <button className="btn" type="button" onClick={() => apply(resetDemo(state, date))}>
                Restore demonstration data
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            <h3>Undo stack</h3>
          </div>
          <div className="card-b">
            <p>{state.undoStack.length} reversible command(s) on the educational Stack.</p>
            <p>Supported: flight field edits, gate/runway assignments, queue/heap mutations, passenger edits.</p>
            <p>Not every action is undoable (deletes and imports are not).</p>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-h">
          <h3>Export / import JSON</h3>
        </div>
        <div className="card-b">
          <div className="toolbar">
            <button
              className="btn"
              type="button"
              onClick={() => {
                const blob = new Blob([exportState(state)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'aeroflow-atos-export.json'
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              Download export
            </button>
            <button className="btn" type="button" onClick={() => setJson(exportState(state))}>
              Show JSON
            </button>
            <button className="btn primary" type="button" onClick={() => doImport(json)}>
              Import JSON
            </button>
          </div>
          <textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder="Paste exported JSON here" />
        </div>
      </div>
    </div>
  )
}
