import { useState } from 'react'
import Button from '../ui/Button'
import InputField from '../ui/InputField'

function DepartmentForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState(initialData?.name || '')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name })
    if (!initialData) {
      setName('')
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <InputField
        id="department-name"
        label="Department Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter department"
        required
      />
      <div className="form-actions">
        <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default DepartmentForm
