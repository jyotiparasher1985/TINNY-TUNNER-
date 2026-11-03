/**
 * Single API helper.
 * In development Vite proxies /api to Django (see vite.config.js).
 * In production set VITE_API_URL, e.g. https://api.yoursite.com
 */
const BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (err) {
    throw new Error('Could not reach the server. Please check your connection and try again.')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    throw new Error('The server returned an unreadable response.')
  }

  if (!response.ok || data?.ok === false) {
    const error = new Error(data?.error || `Request failed (${response.status})`)
    error.fieldErrors = data?.field_errors || {}
    error.status = response.status
    throw error
  }
  return data
}

export const api = {
  get: (path, options = {}) => request(path, options),
  post: (path, body, headers) => request(path, { method: 'POST', body: JSON.stringify(body), headers }),
  patch: (path, body, headers) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body), headers }),
  adminKey: import.meta.env.VITE_ADMIN_API_KEY || '',
}

export default api