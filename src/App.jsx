import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppContext } from './context/AppContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import DepartmentsPage from './pages/DepartmentsPage'
import CalendarPage from './pages/CalendarPage'
import AnnouncementsPage from './pages/AnnouncementsPage'

function HomeRedirect() {
  const { currentUser } = useAppContext()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <Navigate
      to={currentUser.role === 'admin' ? '/dashboard' : '/calendar'}
      replace
    />
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
        <Route element={<AppLayout />}>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}

export default App
