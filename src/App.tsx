import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './app/AppContext'
import { NetworkPage } from './features/airport-network/NetworkPage'
import { BookingPage } from './features/booking/BookingPage'
import { OverviewPage } from './features/dashboard/OverviewPage'
import { QueuePage } from './features/departure-queue/QueuePage'
import { LabPage } from './features/dsa-lab/LabPage'
import { FlightsPage } from './features/flights/FlightsPage'
import { GatesPage } from './features/gate-control/GatesPage'
import { PassengersPage } from './features/passengers/PassengersPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { SyllabusPage } from './features/syllabus/SyllabusPage'
import { AppLayout } from './layouts/AppLayout'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/gates" element={<GatesPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/passengers" element={<PassengersPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/syllabus" element={<SyllabusPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
