import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import EmployeeForm from '../components/forms/EmployeeForm'
import { useAppContext } from '../context/AppContext'

function EmployeesPage() {
  const {
    employees,
    departments,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployeePassword,
    toggleEmployeeStatus,
    currentUser,
  } = useAppContext()

  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [message, setMessage] = useState('')

  const editingEmployee = useMemo(
    () => employees.find((employee) => employee.id === editingEmployeeId) || null,
    [employees, editingEmployeeId],
  )

  const handleCreate = (formState) => {
    const result = createEmployee(formState)
    setMessage(result.ok ? 'Employee created successfully.' : result.message)
  }

  const handleUpdate = (formState) => {
    const result = updateEmployee(editingEmployeeId, {
      name: formState.name,
      email: formState.email,
      role: formState.role,
      department: formState.department,
      password: formState.password,
    })

    if (result.ok) {
      setEditingEmployeeId(null)
      setMessage('Employee updated successfully.')
      return
    }

    setMessage(result.message)
  }

  return (
    <div className="page-grid">
      <Card
        title={editingEmployee ? 'Edit Employee' : 'Create Employee'}
        subtitle="Manage employee accounts and roles"
      >
        <EmployeeForm
          departments={departments}
          onSubmit={editingEmployee ? handleUpdate : handleCreate}
          initialData={editingEmployee}
          onCancel={editingEmployee ? () => setEditingEmployeeId(null) : null}
          lockRole={editingEmployee?.id === currentUser?.id}
        />
        {message && <p className="message info">{message}</p>}
      </Card>

      <Card title="Employee Directory" subtitle="Create, edit, disable, or reset passwords">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td data-label="Name">{employee.name}</td>
                  <td data-label="Email">{employee.email}</td>
                  <td data-label="Role">{employee.role}</td>
                  <td data-label="Department">{employee.department}</td>
                  <td data-label="Status">
                    <span className={`tag ${employee.isActive ? 'ok' : 'off'}`}>
                      {employee.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="actions-inline">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingEmployeeId(employee.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const nextStatus = !employee.isActive
                          const result = toggleEmployeeStatus(employee.id, nextStatus)
                          if (!result.ok) {
                            setMessage(result.message)
                          }
                        }}
                      >
                        {employee.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const newPassword = window.prompt(
                            'Enter new password',
                            employee.password,
                          )

                          if (!newPassword) {
                            return
                          }

                          resetEmployeePassword(employee.id, newPassword)
                          setMessage('Password reset successfully.')
                        }}
                      >
                        Reset Password
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const result = deleteEmployee(employee.id)
                          if (!result.ok) {
                            setMessage(result.message)
                            return
                          }
                          setMessage('Employee deleted successfully.')
                        }}
                        disabled={employee.id === currentUser?.id}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default EmployeesPage
