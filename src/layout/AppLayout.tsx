import loginBg from '@/assets/login-bg.jpg'
import logo from '@/assets/logo-o2con.png'
import o2conIcon from '@/assets/o2con-icon.png'
import { Bell, ChevronLeft, ChevronRight, LogOut, Menu, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearSession, getSessionUser } from '../auth/session'
import { cn } from '../lib/utils'

export function AppLayout(props: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getSessionUser()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const apply = () => setIsDesktop(mql.matches)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  const sidebarWidth = collapsed ? 72 : 260
  const effectiveMainOffset = isDesktop ? sidebarWidth : 0

  const active = useMemo(() => {
    if (location.pathname.startsWith('/certidoes')) return 'certidoes'
    return 'inicio'
  }, [location.pathname])

  return (
    <div className="min-h-screen min-w-0 bg-background">
      {!isDesktop && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar duration-150',
          'transition-[transform,width]',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          isDesktop ? 'translate-x-0' : mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border px-3">
          {collapsed ? (
            <img src={o2conIcon} alt="O2con" className="h-9 w-9 shrink-0 object-contain object-center" />
          ) : (
            <img
              src={logo}
              alt="O2con"
              className="h-8 w-auto max-w-[min(200px,calc(100%-0.5rem))] shrink-0 object-contain object-center"
            />
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <SidebarItem
            collapsed={collapsed}
            active={active === 'inicio'}
            label="Início"
            onClick={() => {
              navigate('/certidoes')
              if (!isDesktop) setMobileMenuOpen(false)
            }}
          />
          <SidebarItem
            collapsed={collapsed}
            active={active === 'certidoes'}
            label="CND's"
            onClick={() => {
              navigate('/certidoes')
              if (!isDesktop) setMobileMenuOpen(false)
            }}
          />
        </nav>

        <div className="border-t border-sidebar-border px-5 py-3">
          {!collapsed && <p className="mb-2 text-xs font-medium text-sidebar-muted">{user?.name ?? 'Administrador'}</p>}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                clearSession()
                navigate('/login', { replace: true })
                if (!isDesktop) setMobileMenuOpen(false)
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors duration-150 hover:bg-sidebar-accent"
            >
              <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {!collapsed && <span>Sair</span>}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-150 hover:text-foreground lg:flex"
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      <main
        className="relative min-h-screen min-w-0 transition-all duration-150"
        style={{
          marginLeft: `${effectiveMainOffset}px`,
          width: `calc(100% - ${effectiveMainOffset}px)`,
        }}
      >
        <div
          className="fixed top-0 right-0 bottom-0 z-0 bg-cover bg-center bg-no-repeat opacity-[.18]"
          style={{
            left: `${effectiveMainOffset}px`,
            backgroundImage: `url(${loginBg})`,
            backgroundAttachment: 'fixed',
          }}
          aria-hidden
        />
        <div
          className="fixed top-0 right-0 bottom-0 z-0 bg-background/70"
          style={{ left: `${effectiveMainOffset}px` }}
          aria-hidden
        />

        <div className="relative z-10">
          <header className="sticky top-0 z-40 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-border bg-card px-3 sm:px-4 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">Bem-vindo</p>
                <p className="hidden truncate text-xs text-muted-foreground sm:block">{user?.name ?? 'Administrador'}</p>
              </div>
            </div>

            <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2 md:gap-4">
              <div className="relative hidden min-w-0 sm:block md:max-w-[12rem] lg:max-w-none lg:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="h-9 w-full min-w-0 rounded-lg border border-input bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors duration-150 md:pr-4"
                />
              </div>

              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <div className="flex h-8 w-8 items-center justify-center rounded-full brand-gradient font-display text-xs font-semibold text-white shadow-glow-primary">
                {(user?.name ?? 'AD')
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
            </div>
          </header>

          <div className="px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">{props.children}</div>
        </div>
      </main>
    </div>
  )
}

function SidebarItem(props: { collapsed: boolean; active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-opacity duration-150',
        props.active
          ? 'brand-gradient text-white shadow-glow-primary hover:opacity-90'
          : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      )}
    >
      <span className="h-5 w-5 shrink-0" aria-hidden />
      {!props.collapsed && <span className="truncate">{props.label}</span>}
    </button>
  )
}

