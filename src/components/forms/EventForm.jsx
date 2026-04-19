import { useState } from 'react'
import Button from '../ui/Button'
import InputField from '../ui/InputField'

function EventForm({ departments, onSubmit }) {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'event',
    isBroadcast: true,
    department: '',
  })

  const handleChange = (field, value) => {
    setFormState((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formState.isBroadcast && !formState.department) {
      return
    }

    onSubmit(formState)
    setFormState({
      title: '',
      description: '',
      start: '',
      end: '',
      type: 'event',
      isBroadcast: true,
      department: '',
    })
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <InputField
        id="event-title"
        label="Title"
        value={formState.title}
        onChange={(event) => handleChange('title', event.target.value)}
        placeholder="Quarterly meeting"
        required
      />
      <div className="field">
        <label htmlFor="event-description">Description</label>
        <textarea
          id="event-description"
          value={formState.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Details about this event"
          rows={3}
          required
        />
      </div>
      <InputField
        id="event-start"
        label="Start Date & Time"
        type="datetime-local"
        value={formState.start}
        onChange={(event) => handleChange('start', event.target.value)}
        required
      />
      <InputField
        id="event-end"
        label="End Date & Time"
        type="datetime-local"
        value={formState.end}
        onChange={(event) => handleChange('end', event.target.value)}
      />

      <div className="field">
        <label htmlFor="event-type">Type</label>
        <select
          id="event-type"
          value={formState.type}
          onChange={(event) => handleChange('type', event.target.value)}
        >
          <option value="holiday">Holiday</option>
          <option value="meeting">Meeting</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div className="field-checkbox">
        <label htmlFor="event-broadcast">
          <input
            id="event-broadcast"
            type="checkbox"
            checked={formState.isBroadcast}
            onChange={(event) => handleChange('isBroadcast', event.target.checked)}
          />
          Broadcast to all users
        </label>
      </div>

      {!formState.isBroadcast && (
        <div className="field">
          <label htmlFor="event-department">Target Department</label>
          <select
            id="event-department"
            value={formState.department}
            onChange={(event) => handleChange('department', event.target.value)}
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
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  )
}

export default EventForm
