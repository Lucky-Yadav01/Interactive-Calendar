import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Card from '../ui/Card'
import { formatDateTime } from '../../utils/helpers'

function CalendarView({
  events,
  departments,
  onDelete,
  onUpdate,
  canManage = false,
}) {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const toDateTimeInputValue = (value) => {
    if (!value) {
      return ''
    }

    if (typeof value === 'string' && value.length >= 16) {
      return value.slice(0, 16)
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      return ''
    }

    const offset = parsed.getTimezoneOffset()
    const localDate = new Date(parsed.getTime() - offset * 60 * 1000)
    return localDate.toISOString().slice(0, 16)
  }

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const typeMatch = selectedType === 'all' || event.type === selectedType

      const departmentMatch =
        selectedDepartment === 'all'
          ? true
          : event.department === selectedDepartment

      return typeMatch && departmentMatch
    })
  }, [events, selectedDepartment, selectedType])

  const calendarEvents = filteredEvents.map((event) => {
    const eventColorClass =
      event.type === 'holiday'
        ? 'event-holiday'
        : event.type === 'meeting'
          ? 'event-meeting'
          : 'event-event'

    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || undefined,
      extendedProps: {
        description: event.description,
        type: event.type,
        department: event.department,
        isBroadcast: event.isBroadcast,
      },
      classNames: [eventColorClass],
    }
  })

  const handleEventClick = (clickInfo) => {
    const matched = filteredEvents.find((event) => event.id === clickInfo.event.id)
    setSelectedEvent(matched || null)

    if (matched && canManage) {
      setEditForm({
        title: matched.title || '',
        description: matched.description || '',
        start: toDateTimeInputValue(matched.start),
        end: toDateTimeInputValue(matched.end),
        type: matched.type || 'event',
        isBroadcast: Boolean(matched.isBroadcast),
        department: matched.department || '',
      })
    } else {
      setEditForm(null)
    }
  }

  const handleEditSubmit = (event) => {
    event.preventDefault()

    if (!selectedEvent || !editForm || !onUpdate) {
      return
    }

    if (!editForm.isBroadcast && !editForm.department) {
      return
    }

    const updates = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      start: editForm.start,
      end: editForm.end,
      type: editForm.type,
      isBroadcast: editForm.isBroadcast,
      department: editForm.isBroadcast ? '' : editForm.department,
    }

    onUpdate(selectedEvent.id, updates)
    setSelectedEvent((previous) => (previous ? { ...previous, ...updates } : previous))
  }

  return (
    <div className="calendar-module">
      <Card title="Filters" subtitle="Filter events by type or department">
        <div className="filters-grid">
          <div className="field">
            <label htmlFor="filter-type">Event Type</label>
            <select
              id="filter-type"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              <option value="all">All types</option>
              <option value="holiday">Holiday</option>
              <option value="meeting">Meeting</option>
              <option value="event">Event</option>
            </select>
          </div>

          {canManage && (
            <div className="field">
              <label htmlFor="filter-department">Department</label>
              <select
                id="filter-department"
                value={selectedDepartment}
                onChange={(event) => setSelectedDepartment(event.target.value)}
              >
                <option value="all">All departments</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      <Card title="Calendar" subtitle="Click an event to view details">
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>
      </Card>

      {selectedEvent && (
        <Card
          title={selectedEvent.title}
          subtitle={`Type: ${selectedEvent.type}`}
          action={
            canManage ? (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  onDelete(selectedEvent.id)
                  setSelectedEvent(null)
                  setEditForm(null)
                }}
              >
                Delete
              </button>
            ) : null
          }
        >
          <div className="details-grid">
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Start:</strong> {formatDateTime(selectedEvent.start)}
            </p>
            <p>
              <strong>End:</strong> {formatDateTime(selectedEvent.end)}
            </p>
            <p>
              <strong>Visibility:</strong>{' '}
              {selectedEvent.isBroadcast
                ? 'Broadcast to all users'
                : `Department: ${selectedEvent.department}`}
            </p>
          </div>

          {canManage && editForm && (
            <form className="form-grid" onSubmit={handleEditSubmit}>
              <div className="field">
                <label htmlFor="edit-event-title">Title</label>
                <input
                  id="edit-event-title"
                  value={editForm.title}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="edit-event-description">Description</label>
                <textarea
                  id="edit-event-description"
                  value={editForm.description}
                  rows={3}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="filters-grid">
                <div className="field">
                  <label htmlFor="edit-event-start">Start</label>
                  <input
                    id="edit-event-start"
                    type="datetime-local"
                    value={editForm.start}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        start: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="edit-event-end">End</label>
                  <input
                    id="edit-event-end"
                    type="datetime-local"
                    value={editForm.end}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        end: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="filters-grid">
                <div className="field">
                  <label htmlFor="edit-event-type">Type</label>
                  <select
                    id="edit-event-type"
                    value={editForm.type}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        type: event.target.value,
                      }))
                    }
                  >
                    <option value="holiday">Holiday</option>
                    <option value="meeting">Meeting</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div className="field-checkbox">
                  <label htmlFor="edit-event-broadcast">
                    <input
                      id="edit-event-broadcast"
                      type="checkbox"
                      checked={editForm.isBroadcast}
                      onChange={(event) =>
                        setEditForm((previous) => ({
                          ...previous,
                          isBroadcast: event.target.checked,
                        }))
                      }
                    />
                    Broadcast to all users
                  </label>
                </div>
              </div>

              {!editForm.isBroadcast && (
                <div className="field">
                  <label htmlFor="edit-event-department">Department</label>
                  <select
                    id="edit-event-department"
                    value={editForm.department}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        department: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  Update Event
                </button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  )
}

export default CalendarView
