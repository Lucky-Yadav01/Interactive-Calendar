import Card from '../components/ui/Card'
import AnnouncementForm from '../components/forms/AnnouncementForm'
import { useAppContext } from '../context/AppContext'
import { formatDateTime } from '../utils/helpers'

function AnnouncementsPage() {
  const {
    currentUser,
    departments,
    createAnnouncement,
    filterAnnouncementsForUser,
    filterNotificationsForUser,
  } = useAppContext()

  const visibleAnnouncements = filterAnnouncementsForUser(currentUser)
  const visibleNotifications = filterNotificationsForUser(currentUser)
  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="page-grid">
      {isAdmin && (
        <Card
          title="Create Announcement"
          subtitle="Publish broadcast or department-targeted updates"
        >
          <AnnouncementForm
            departments={departments}
            onSubmit={createAnnouncement}
          />
        </Card>
      )}

      <section className="split-grid">
        <Card
          title="Announcements"
          subtitle="Visible based on role and department"
        >
          <ul className="list announcements-list">
            {visibleAnnouncements.map((announcement) => (
              <li key={announcement.id}>
                <div>
                  <strong>{announcement.title}</strong>
                  <p>{announcement.message}</p>
                </div>
                <span>
                  {announcement.isBroadcast
                    ? 'Broadcast'
                    : `Departments: ${(announcement.targetDepartments || []).join(', ')}`}
                </span>
              </li>
            ))}
            {visibleAnnouncements.length === 0 && <li>No announcements available.</li>}
          </ul>
        </Card>

        <Card title="Notifications" subtitle="Auto-generated alerts">
          <ul className="list announcements-list">
            {visibleNotifications.map((notification) => (
              <li key={notification.id}>
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </div>
                <span>{formatDateTime(notification.createdAt)}</span>
              </li>
            ))}
            {visibleNotifications.length === 0 && <li>No notifications found.</li>}
          </ul>
        </Card>
      </section>
    </div>
  )
}

export default AnnouncementsPage
