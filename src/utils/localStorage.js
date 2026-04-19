export function getData(key, fallback = null) {
  if (typeof window === 'undefined') {
    return fallback
  }

  const rawValue = window.localStorage.getItem(key)

  if (rawValue === null) {
    return fallback
  }

  try {
    return JSON.parse(rawValue)
  } catch (error) {
    console.error(`Invalid localStorage JSON for key: ${key}`, error)
    return fallback
  }
}

export function setData(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeData(key) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(key)
}

export function hasData(key) {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(key) !== null
}
