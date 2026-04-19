import { useAppContext } from '../context/AppContext'
import Card from '../components/ui/Card'
import { formatDateTime } from '../utils/helpers'

function DashboardPage() {
  const {
    dashboardStats,
    currentUser,
    events,
    announcements,
    filterNotificationsForUser,
  } = useAppContext()

  const notifications = filterNotificationsForUser(currentUser).slice(0, 5)

  return (
    <div className="page-grid">
      <section className="stats-grid">
        <Card title="Employees">
          <p className="metric">{dashboardStats.employees}</p>
          <p className="muted">Active: {dashboardStats.activeEmployees}</p>
        </Card>
        <Card title="Departments">
          <p className="metric">{dashboardStats.departments}</p>
        </Card>
        <Card title="Events">
          <p className="metric">{dashboardStats.events}</p>
        </Card>
        <Card title="Announcements">
          <p className="metric">{dashboardStats.announcements}</p>
        </Card>
      </section>

      <section className="split-grid">
        <Card
          title="Upcoming Events"
          subtitle="Latest 5 scheduled items"
        >
          <ul className="list">
            {events.slice(0, 5).map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong>
                <span>{formatDateTime(event.start)}</span>
              </li>
            ))}
            {events.length === 0 && <li>No events available.</li>}
          </ul>
        </Card>

        <Card
          title="Recent Announcements"
          subtitle="Latest updates across office"
        >
          <ul className="list">
            {announcements.slice(0, 5).map((announcement) => (
              <li key={announcement.id}>
                <strong>{announcement.title}</strong>
                <span>{formatDateTime(announcement.createdAt)}</span>
              </li>
            ))}
            {announcements.length === 0 && <li>No announcements yet.</li>}
          </ul>
        </Card>
      </section>

      <Card title="Notifications" subtitle="Personalized updates">
        <ul className="list">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <strong>{notification.title}</strong>
              <span>{notification.message}</span>
            </li>
          ))}
          {notifications.length === 0 && <li>No notifications.</li>}
        </ul>
      </Card>
    </div>
  )
}

export default DashboardPage
