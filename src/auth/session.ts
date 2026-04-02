export type SessionUser = {
  name: string
  email: string
}

const KEY = 'o2con.session.v1'

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function setSessionUser(user: SessionUser) {
  localStorage.setItem(KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}

