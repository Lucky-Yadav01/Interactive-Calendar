import { useState } from 'react'
import Button from '../ui/Button'
import InputField from '../ui/InputField'

function EmployeeForm({
  departments,
  onSubmit,
  initialData,
  onCancel,
  lockRole = false,
}) {
  const [formState, setFormState] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'staff',
    department: initialData?.department || '',
  })

  const handleChange = (field, value) => {
    setFormState((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(formState)

    if (!initialData) {
      setFormState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        department: '',
      })
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <InputField
        id="employee-name"
        label="Full Name"
        value={formState.name}
        onChange={(event) => handleChange('name', event.target.value)}
        placeholder="Employee full name"
        required
      />
      <InputField
        id="employee-email"
        label="Email"
        type="email"
        value={formState.email}
        onChange={(event) => handleChange('email', event.target.value)}
        placeholder="name@office.com"
        required
      />
      <InputField
        id="employee-password"
        label="Password"
        type="text"
        value={formState.password}
        onChange={(event) => handleChange('password', event.target.value)}
        placeholder="Temporary password"
        required
      />

      <div className="field">
        <label htmlFor="employee-role">Role</label>
        <select
          id="employee-role"
          value={formState.role}
          onChange={(event) => handleChange('role', event.target.value)}
          disabled={lockRole}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="employee-department">Department</label>
        <select
          id="employee-department"
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

      <div className="form-actions">
        <Button type="submit">{initialData ? 'Save Changes' : 'Create Employee'}</Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default EmployeeForm
