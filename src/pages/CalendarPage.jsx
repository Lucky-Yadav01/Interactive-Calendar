import Card from '../components/ui/Card'
import EventForm from '../components/forms/EventForm'
import CalendarView from '../components/calendar/CalendarView'
import { useAppContext } from '../context/AppContext'

function CalendarPage() {
  const {
    currentUser,
    departments,
    createEvent,
    updateEvent,
    deleteEvent,
    filterEventsForUser,
  } = useAppContext()

  const visibleEvents = filterEventsForUser(currentUser)
  const isAdmin = currentUser?.role === 'admin'

  return (
    <div className="page-grid">
      {isAdmin && (
        <Card title="Create Event" subtitle="Schedule office events and meetings">
          <EventForm departments={departments} onSubmit={createEvent} />
        </Card>
      )}

      <CalendarView
        events={visibleEvents}
        departments={departments}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
        canManage={isAdmin}
      />
    </div>
  )
}

export default CalendarPage
