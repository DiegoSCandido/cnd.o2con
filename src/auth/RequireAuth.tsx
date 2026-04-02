import { Navigate, useLocation } from 'react-router-dom'
import { getSessionUser } from './session'

export function RequireAuth(props: { children: React.ReactNode }) {
  const user = getSessionUser()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return props.children
}

