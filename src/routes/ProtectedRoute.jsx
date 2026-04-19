import { Navigate, Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function ProtectedRoute({ allowedRoles = [] }) {
  const { currentUser } = useAppContext()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <Navigate
        to={currentUser.role === 'admin' ? '/dashboard' : '/calendar'}
        replace
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute
