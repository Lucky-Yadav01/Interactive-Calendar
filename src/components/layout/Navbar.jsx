import { FaBell, FaBars } from 'react-icons/fa6'
import { useAppContext } from '../../context/AppContext'

function Navbar({ onMenuToggle }) {
  const { currentUser, logout, filterNotificationsForUser } = useAppContext()
  const notificationCount = filterNotificationsForUser(currentUser).length

  return (
    <header className="navbar">
      <button className="icon-btn menu-btn" onClick={onMenuToggle}>
        <FaBars />
      </button>

      <div className="navbar-title-group">
        <h1>Office Interactive Calendar</h1>
        <p>Employee Management System</p>
      </div>

      <div className="navbar-actions">
        <div className="notification-pill" title="Notifications">
          <FaBell />
          <span>{notificationCount}</span>
        </div>
        <div className="user-chip">
          <strong>{currentUser?.name}</strong>
          <small>{currentUser?.role}</small>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
