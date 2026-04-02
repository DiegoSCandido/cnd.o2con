import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

async function enableMocking() {
  if (!import.meta.env.DEV) return
  if (import.meta.env.VITE_USE_MOCKS === 'false') return

  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster richColors />
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
})
