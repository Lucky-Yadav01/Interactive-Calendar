import { NavLink } from 'react-router-dom'
import {
  FaCalendarDays,
  FaChartLine,
  FaUsers,
  FaBuilding,
  FaBullhorn,
} from 'react-icons/fa6'
import { useAppContext } from '../../context/AppContext'

const adminItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FaChartLine },
  { to: '/employees', label: 'Employees', icon: FaUsers },
  { to: '/departments', label: 'Departments', icon: FaBuilding },
  { to: '/calendar', label: 'Calendar', icon: FaCalendarDays },
  { to: '/announcements', label: 'Announcements', icon: FaBullhorn },
]

const staffItems = [
  { to: '/calendar', label: 'Calendar', icon: FaCalendarDays },
  { to: '/announcements', label: 'Announcements', icon: FaBullhorn },
]

function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAppContext()
  const items = currentUser?.role === 'admin' ? adminItems : staffItems

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">Office Panel</div>
        <nav>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              onClick={onClose}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {isOpen && <button className="backdrop" onClick={onClose} />}
    </>
  )
}

export default Sidebar
