import {
  BookOpen,
  DoorOpen,
  FlaskConical,
  LayoutDashboard,
  ListOrdered,
  Menu,
  Network,
  Plane,
  Settings,
  Ticket,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../app/AppContext'
import { APP_NAME, APP_SUBTITLE, SIMULATION_BANNER } from '../config/constants'
import { formatDateTime } from '../utils/time'

const LINKS = [
  { to: '/', label: 'Operations Overview', icon: LayoutDashboard },
  { to: '/flights', label: 'Flight Operations', icon: Plane },
  { to: '/booking', label: 'Flight Booking Slots', icon: Ticket },
  { to: '/network', label: 'Airport Network', icon: Network },
  { to: '/gates', label: 'Gate & Runway Control', icon: DoorOpen },
  { to: '/queue', label: 'Departure Queue', icon: ListOrdered },
  { to: '/passengers', label: 'Passenger Manifest', icon: Users },
  { to: '/lab', label: 'DSA Laboratory', icon: FlaskConical },
  { to: '/syllabus', label: 'Syllabus Coverage', icon: BookOpen },
  { to: '/settings', label: 'Settings & Data', icon: Settings },
]

export function AppLayout() {
  const { state, toast } = useApp()
  const [open, setOpen] = useState(false)
  const [systemTime] = useState(() => formatDateTime(new Date().toISOString()))

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <h1>{APP_NAME}</h1>
          <p>{APP_SUBTITLE}</p>
        </div>
        <nav className="nav">
          {LINKS.map((link) => {
            const Icon = link.icon
            return (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
                <Icon size={16} />
                {link.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="row">
            <button className="btn menu-btn" type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              <Menu size={16} />
            </button>
            <span className="sim-badge">{SIMULATION_BANNER}</span>
          </div>
          <div className="row" style={{ color: 'var(--muted)', fontSize: 13 }}>
            Hub NAG · Sim date {state.simulationDate} · {state.flights.length} flights · {systemTime}
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
      {toast ? <div className={`toast ${toast.kind}`}>{toast.text}</div> : null}
    </div>
  )
}
