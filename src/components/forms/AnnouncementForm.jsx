import { useState } from 'react'
import Button from '../ui/Button'
import InputField from '../ui/InputField'

function AnnouncementForm({ departments, onSubmit }) {
  const [formState, setFormState] = useState({
    title: '',
    message: '',
    isBroadcast: true,
    targetDepartments: [],
  })

  const handleTargetToggle = (departmentName) => {
    setFormState((previous) => {
      const exists = previous.targetDepartments.includes(departmentName)
      const targetDepartments = exists
        ? previous.targetDepartments.filter((name) => name !== departmentName)
        : [...previous.targetDepartments, departmentName]

      return { ...previous, targetDepartments }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formState.isBroadcast && formState.targetDepartments.length === 0) {
      return
    }

    onSubmit(formState)

    setFormState({
      title: '',
      message: '',
      isBroadcast: true,
      targetDepartments: [],
    })
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <InputField
        id="announcement-title"
        label="Title"
        value={formState.title}
        onChange={(event) =>
          setFormState((previous) => ({ ...previous, title: event.target.value }))
        }
        placeholder="Office update"
        required
      />

      <div className="field">
        <label htmlFor="announcement-message">Message</label>
        <textarea
          id="announcement-message"
          value={formState.message}
          onChange={(event) =>
            setFormState((previous) => ({ ...previous, message: event.target.value }))
          }
          rows={4}
          placeholder="Write your announcement"
          required
        />
      </div>

      <div className="field-checkbox">
        <label htmlFor="announcement-broadcast">
          <input
            id="announcement-broadcast"
            type="checkbox"
            checked={formState.isBroadcast}
            onChange={(event) =>
              setFormState((previous) => ({
                ...previous,
                isBroadcast: event.target.checked,
              }))
            }
          />
          Broadcast to all users
        </label>
      </div>

      {!formState.isBroadcast && (
        <div className="field">
          <label>Target Departments</label>
          <div className="checkbox-grid">
            {departments.map((department) => (
              <label key={department.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formState.targetDepartments.includes(department.name)}
                  onChange={() => handleTargetToggle(department.name)}
                />
                {department.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        <Button type="submit">Publish Announcement</Button>
      </div>
    </form>
  )
}

export default AnnouncementForm
