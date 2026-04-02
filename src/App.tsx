import { Navigate, Route, Routes } from 'react-router-dom'
import { CertidoesDashboardPage } from './pages/CertidoesDashboardPage'
import { CertidaoModeloRoute } from './pages/CertidaoModeloRoute'
import { LoginPage } from './pages/LoginPage'
import { RequireAuth } from './auth/RequireAuth'
import { AppLayout } from './layout/AppLayout'
import { getSessionUser } from './auth/session'

function HomeRedirect() {
  const user = getSessionUser()
  return <Navigate to={user ? '/certidoes' : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/certidoes"
        element={
          <RequireAuth>
            <AppLayout>
              <CertidoesDashboardPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/certidoes/:model"
        element={
          <RequireAuth>
            <AppLayout>
              <CertidaoModeloRoute />
            </AppLayout>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
