import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import DepartmentForm from '../components/forms/DepartmentForm'
import { useAppContext } from '../context/AppContext'

function DepartmentsPage() {
  const { departments, createDepartment, updateDepartment, deleteDepartment } =
    useAppContext()

  const [editingDepartmentId, setEditingDepartmentId] = useState(null)
  const [message, setMessage] = useState('')

  const editingDepartment =
    departments.find((department) => department.id === editingDepartmentId) || null

  const handleSubmit = (payload) => {
    if (!editingDepartment) {
      const result = createDepartment(payload)
      setMessage(result.ok ? 'Department created successfully.' : result.message)
      return
    }

    const result = updateDepartment(editingDepartment.id, payload)

    if (result.ok) {
      setMessage('Department updated successfully.')
      setEditingDepartmentId(null)
      return
    }

    setMessage(result.message)
  }

  return (
    <div className="page-grid">
      <Card
        title={editingDepartment ? 'Edit Department' : 'Create Department'}
        subtitle="Maintain office department structure"
      >
        <DepartmentForm
          onSubmit={handleSubmit}
          initialData={editingDepartment}
          onCancel={
            editingDepartment ? () => setEditingDepartmentId(null) : undefined
          }
        />
        {message && <p className="message info">{message}</p>}
      </Card>

      <Card title="Department List" subtitle="Current organizational units">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td data-label="Name">{department.name}</td>
                  <td data-label="Actions">
                    <div className="actions-inline">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingDepartmentId(department.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          deleteDepartment(department.id)
                          if (editingDepartmentId === department.id) {
                            setEditingDepartmentId(null)
                          }
                        }}
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

export default DepartmentsPage
