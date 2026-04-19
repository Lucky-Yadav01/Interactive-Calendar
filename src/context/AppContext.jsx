import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { formatDateTime, generateId, normalizeEmail } from '../utils/helpers'
import { getData, hasData, removeData, setData } from '../utils/localStorage'

const AppContext = createContext(null)

const DEFAULT_DEPARTMENTS = [
  { id: 'dep-management', name: 'Management' },
  { id: 'dep-hr', name: 'HR' },
  { id: 'dep-engineering', name: 'Engineering' },
]

const DEFAULT_EMPLOYEES = [
  {
    id: 'emp-admin-1',
    name: 'System Admin',
    email: 'admin@office.local',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    isActive: true,
  },
]

function initializeCollection(key, defaults) {
  if (hasData(key)) {
    const value = getData(key, defaults)
    return Array.isArray(value) ? value : defaults
  }

  setData(key, defaults)
  return defaults
}

function initializeCurrentUser() {
  return getData(STORAGE_KEYS.CURRENT_USER, null)
}

export function AppProvider({ children }) {
  const [departments, setDepartments] = useState(() =>
    initializeCollection(STORAGE_KEYS.DEPARTMENTS, DEFAULT_DEPARTMENTS),
  )
  const [employees, setEmployees] = useState(() =>
    initializeCollection(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES),
  )
  const [events, setEvents] = useState(() =>
    initializeCollection(STORAGE_KEYS.EVENTS, []),
  )
  const [notifications, setNotifications] = useState(() =>
    initializeCollection(STORAGE_KEYS.NOTIFICATIONS, []),
  )
  const [announcements, setAnnouncements] = useState(() =>
    initializeCollection(STORAGE_KEYS.ANNOUNCEMENTS, []),
  )
  const [currentUser, setCurrentUser] = useState(initializeCurrentUser)

  useEffect(() => {
    setData(STORAGE_KEYS.DEPARTMENTS, departments)
  }, [departments])

  useEffect(() => {
    setData(STORAGE_KEYS.EMPLOYEES, employees)
  }, [employees])

  useEffect(() => {
    setData(STORAGE_KEYS.EVENTS, events)
  }, [events])

  useEffect(() => {
    setData(STORAGE_KEYS.NOTIFICATIONS, notifications)
  }, [notifications])

  useEffect(() => {
    setData(STORAGE_KEYS.ANNOUNCEMENTS, announcements)
  }, [announcements])

  useEffect(() => {
    if (currentUser) {
      setData(STORAGE_KEYS.CURRENT_USER, currentUser)
      return
    }

    removeData(STORAGE_KEYS.CURRENT_USER)
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) {
      return
    }

    const latestUser = employees.find((employee) => employee.id === currentUser.id)

    if (!latestUser || !latestUser.isActive) {
      setCurrentUser(null)
      return
    }

    if (JSON.stringify(latestUser) !== JSON.stringify(currentUser)) {
      setCurrentUser(latestUser)
    }
  }, [employees, currentUser])

  const createNotification = (payload) => {
    const notification = {
      id: generateId('notif'),
      createdAt: new Date().toISOString(),
      ...payload,
    }

    setNotifications((previous) => [notification, ...previous])
    return notification
  }

  const login = ({ email, password }) => {
    const normalizedEmail = normalizeEmail(email)

    const matched = employees.find(
      (employee) =>
        normalizeEmail(employee.email) === normalizedEmail &&
        employee.password === password,
    )

    if (!matched) {
      return { ok: false, message: 'Invalid email or password.' }
    }

    if (!matched.isActive) {
      return { ok: false, message: 'Your account is disabled. Contact admin.' }
    }

    setCurrentUser(matched)
    return { ok: true, user: matched }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const createDepartment = ({ name }) => {
    const cleanName = name.trim()

    if (!cleanName) {
      return { ok: false, message: 'Department name is required.' }
    }

    const exists = departments.some(
      (department) => department.name.toLowerCase() === cleanName.toLowerCase(),
    )

    if (exists) {
      return { ok: false, message: 'Department already exists.' }
    }

    const newDepartment = {
      id: generateId('dep'),
      name: cleanName,
    }

    setDepartments((previous) => [...previous, newDepartment])
    return { ok: true, department: newDepartment }
  }

  const updateDepartment = (departmentId, { name }) => {
    const cleanName = name.trim()
    const existingDepartment = departments.find(
      (department) => department.id === departmentId,
    )

    if (!existingDepartment) {
      return { ok: false, message: 'Department not found.' }
    }

    const conflict = departments.some(
      (department) =>
        department.id !== departmentId &&
        department.name.toLowerCase() === cleanName.toLowerCase(),
    )

    if (conflict) {
      return { ok: false, message: 'Department name already in use.' }
    }

    setDepartments((previous) =>
      previous.map((department) =>
        department.id === departmentId
          ? { ...department, name: cleanName }
          : department,
      ),
    )

    if (existingDepartment.name !== cleanName) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.department === existingDepartment.name
            ? { ...employee, department: cleanName }
            : employee,
        ),
      )

      setEvents((previous) =>
        previous.map((event) =>
          event.department === existingDepartment.name
            ? { ...event, department: cleanName }
            : event,
        ),
      )

      setAnnouncements((previous) =>
        previous.map((announcement) => ({
          ...announcement,
          targetDepartments: (announcement.targetDepartments || []).map(
            (departmentName) =>
              departmentName === existingDepartment.name
                ? cleanName
                : departmentName,
          ),
        })),
      )
    }

    return { ok: true }
  }

  const deleteDepartment = (departmentId) => {
    const existingDepartment = departments.find(
      (department) => department.id === departmentId,
    )

    if (!existingDepartment) {
      return { ok: false, message: 'Department not found.' }
    }

    setDepartments((previous) =>
      previous.filter((department) => department.id !== departmentId),
    )

    setEmployees((previous) =>
      previous.map((employee) =>
        employee.department === existingDepartment.name
          ? { ...employee, department: 'Unassigned' }
          : employee,
      ),
    )

    setEvents((previous) =>
      previous.map((event) =>
        event.department === existingDepartment.name
          ? { ...event, department: '', isBroadcast: true }
          : event,
      ),
    )

    setAnnouncements((previous) =>
      previous.map((announcement) => {
        const nextTargets = (announcement.targetDepartments || []).filter(
          (departmentName) => departmentName !== existingDepartment.name,
        )

        return {
          ...announcement,
          targetDepartments: nextTargets,
          isBroadcast: nextTargets.length === 0 ? true : announcement.isBroadcast,
        }
      }),
    )

    return { ok: true }
  }

  const createEmployee = (employeeData) => {
    const normalizedNewEmail = normalizeEmail(employeeData.email)

    const emailTaken = employees.some(
      (employee) => normalizeEmail(employee.email) === normalizedNewEmail,
    )

    if (emailTaken) {
      return { ok: false, message: 'Email already exists.' }
    }

    const newEmployee = {
      id: generateId('emp'),
      name: employeeData.name.trim(),
      email: normalizedNewEmail,
      password: employeeData.password,
      role: employeeData.role || 'staff',
      department: employeeData.department || 'Unassigned',
      isActive: true,
    }

    setEmployees((previous) => [...previous, newEmployee])
    return { ok: true, employee: newEmployee }
  }

  const updateEmployee = (employeeId, updates) => {
    const existingEmployee = employees.find((employee) => employee.id === employeeId)

    if (!existingEmployee) {
      return { ok: false, message: 'Employee not found.' }
    }

    if (updates.email) {
      const normalizedUpdateEmail = normalizeEmail(updates.email)
      const emailTaken = employees.some(
        (employee) =>
          employee.id !== employeeId &&
          normalizeEmail(employee.email) === normalizedUpdateEmail,
      )

      if (emailTaken) {
        return { ok: false, message: 'Email already exists.' }
      }
    }

    setEmployees((previous) =>
      previous.map((employee) => {
        if (employee.id !== employeeId) {
          return employee
        }

        return {
          ...employee,
          ...updates,
          email: updates.email ? normalizeEmail(updates.email) : employee.email,
        }
      }),
    )

    return { ok: true }
  }

  const deleteEmployee = (employeeId) => {
    if (currentUser?.id === employeeId) {
      return { ok: false, message: 'You cannot delete your own account.' }
    }

    const nextEmployees = employees.filter((employee) => employee.id !== employeeId)
    const adminCount = nextEmployees.filter((employee) => employee.role === 'admin').length

    if (adminCount === 0) {
      return { ok: false, message: 'At least one admin account is required.' }
    }

    setEmployees(nextEmployees)
    return { ok: true }
  }

  const resetEmployeePassword = (employeeId, newPassword) => {
    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === employeeId
          ? { ...employee, password: newPassword }
          : employee,
      ),
    )

    return { ok: true }
  }

  const toggleEmployeeStatus = (employeeId, isActive) => {
    if (currentUser?.id === employeeId && !isActive) {
      return { ok: false, message: 'You cannot disable your own account.' }
    }

    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === employeeId ? { ...employee, isActive } : employee,
      ),
    )

    return { ok: true }
  }

  const createEvent = (eventData) => {
    const newEvent = {
      id: generateId('event'),
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      start: eventData.start,
      end: eventData.end,
      type: eventData.type,
      department: eventData.department || '',
      isBroadcast: eventData.isBroadcast,
      createdAt: new Date().toISOString(),
    }

    setEvents((previous) => [newEvent, ...previous])

    createNotification({
      title: `New ${newEvent.type} created`,
      message: `${newEvent.title} scheduled for ${formatDateTime(newEvent.start)}.`,
      type: 'event',
      isBroadcast: newEvent.isBroadcast,
      targetType: 'department',
      targetIds: newEvent.isBroadcast ? [] : [newEvent.department],
    })

    return { ok: true, event: newEvent }
  }

  const updateEvent = (eventId, updates) => {
    setEvents((previous) =>
      previous.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event,
      ),
    )

    return { ok: true }
  }

  const deleteEvent = (eventId) => {
    setEvents((previous) => previous.filter((event) => event.id !== eventId))
    return { ok: true }
  }

  const createAnnouncement = (announcementData) => {
    const newAnnouncement = {
      id: generateId('ann'),
      title: announcementData.title.trim(),
      message: announcementData.message.trim(),
      isBroadcast: announcementData.isBroadcast,
      targetDepartments: announcementData.targetDepartments || [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || null,
    }

    setAnnouncements((previous) => [newAnnouncement, ...previous])

    createNotification({
      title: `Announcement: ${newAnnouncement.title}`,
      message: newAnnouncement.message,
      type: 'announcement',
      isBroadcast: newAnnouncement.isBroadcast,
      targetType: 'department',
      targetIds: newAnnouncement.isBroadcast
        ? []
        : newAnnouncement.targetDepartments,
    })

    return { ok: true, announcement: newAnnouncement }
  }

  const canViewEvent = (event, user) => {
    if (!user) {
      return false
    }

    if (user.role === 'admin' || event.isBroadcast) {
      return true
    }

    if (!event.department) {
      return true
    }

    return event.department === user.department
  }

  const filterEventsForUser = (user) => events.filter((event) => canViewEvent(event, user))

  const canViewNotification = (notification, user) => {
    if (!user) {
      return false
    }

    if (user.role === 'admin' || notification.isBroadcast) {
      return true
    }

    const targets = Array.isArray(notification.targetIds)
      ? notification.targetIds
      : []

    if (notification.targetType === 'department') {
      return targets.includes(user.department)
    }

    if (notification.targetType === 'role') {
      return targets.includes(user.role)
    }

    if (notification.targetType === 'user') {
      return targets.includes(user.id)
    }

    return false
  }

  const filterNotificationsForUser = (user) =>
    notifications.filter((notification) => canViewNotification(notification, user))

  const canViewAnnouncement = (announcement, user) => {
    if (!user) {
      return false
    }

    if (user.role === 'admin' || announcement.isBroadcast) {
      return true
    }

    return (announcement.targetDepartments || []).includes(user.department)
  }

  const filterAnnouncementsForUser = (user) =>
    announcements.filter((announcement) => canViewAnnouncement(announcement, user))

  const dashboardStats = useMemo(() => {
    const activeEmployees = employees.filter((employee) => employee.isActive).length

    return {
      employees: employees.length,
      activeEmployees,
      departments: departments.length,
      events: events.length,
      announcements: announcements.length,
    }
  }, [announcements.length, departments.length, employees, events.length])

  const value = {
    departments,
    employees,
    events,
    notifications,
    announcements,
    currentUser,
    dashboardStats,
    login,
    logout,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployeePassword,
    toggleEmployeeStatus,
    createEvent,
    updateEvent,
    deleteEvent,
    createAnnouncement,
    filterEventsForUser,
    filterNotificationsForUser,
    filterAnnouncementsForUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
