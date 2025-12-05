export type ApiError = Error & { status?: number; code?: number | string; retryAfter?: number }

const base = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:3000'

function getToken() {
  if (typeof localStorage === 'undefined') return null
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('auth_token') ||
    (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') : null)
  )
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {})
  headers.set('Accept', 'application/json')
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  const t = getToken()
  if (t) headers.set('Authorization', `Bearer ${t}`)
  const res = await fetch(base.replace(/\/$/, '') + path, { ...init, headers })
  const ct = res.headers.get('Content-Type') || ''
  const parse: Promise<any> = ct.includes('application/json') ? res.json() : res.text()
  if (!res.ok) {
    const data = await parse.catch(() => ({} as any))
    const e: ApiError = new Error((data && (data.message || data.error)) || res.statusText)
    e.status = res.status
    e.code = (data && data.code) || res.status
    const ra = res.headers.get('Retry-After')
    if (ra) e.retryAfter = Number(ra)
    throw e
  }
  return (await parse) as T
}

export type UploadItem = {
  id: string | number
  text?: string | null
  cached?: boolean
  timestamp?: string | number
  imageUrl?: string
  thumbnailUrl?: string
}

export const api = {
  history: (page = 1, limit = 20) => request<UploadItem[]>(`/history?limit=${limit}&page=${page}`, { method: 'GET' })
}
