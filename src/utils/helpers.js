export function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function formatDateTime(value) {
  if (!value) {
    return 'N/A'
  }

  try {
    return new Date(value).toLocaleString()
  } catch (error) {
    return 'Invalid date'
  }
}

export function normalizeEmail(email) {
  return (email || '').trim().toLowerCase()
}
