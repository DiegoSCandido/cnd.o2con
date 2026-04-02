import { useForm } from '@mantine/form'
import loginBg from '@/assets/login-bg.jpg'
import o2conIcon from '@/assets/o2con-icon.png'
import Logo from '@/components/Logo'
import { useLocation, useNavigate } from 'react-router-dom'
import { setSessionUser } from '../auth/session'

type FormValues = {
  email: string
  password: string
  remember: boolean
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: string } | null)?.from ?? '/certidoes'

  const form = useForm<FormValues>({
    initialValues: {
      email: 'sou@email.com',
      password: '123456',
      remember: true,
    },
  })

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-in text-center">
          <div className="mb-8 lg:mb-10 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">
              Bem-vindo
            </h1>
            <p className="text-muted-foreground text-lg">
              Faça login para acessar sua conta
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 shadow-soft">
            <form
              onSubmit={form.onSubmit((values: FormValues) => {
                setSessionUser({ name: 'Administrador', email: values.email })
                navigate(from, { replace: true })
              })}
              className="space-y-4"
            >
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium">E-mail</label>
                <input
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                  {...form.getInputProps('email')}
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium">Senha</label>
                <input
                  type="password"
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="Sua senha"
                  {...form.getInputProps('password')}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={form.values.remember}
                    onChange={(e) => form.setFieldValue('remember', e.currentTarget.checked)}
                    className="h-4 w-4 rounded border border-input"
                  />
                  Lembrar-me
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                className="h-11 w-full rounded-lg brand-gradient text-white font-semibold shadow-glow-primary transition-opacity hover:opacity-95"
              >
                Entrar
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            © 2026 O2con Soluções Contábeis. Todos os direitos reservados.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginBg}
          alt="O2con"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/80" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="text-center max-w-md animate-fade-in">
            <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl p-4">
              <img
                src={o2conIcon}
                alt="O2con"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>

            <h2 className="text-3xl font-display font-bold mb-4">
              Tudo em um só lugar
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Apps internos e externos, links úteis, ferramentas e muito mais. Sua intranet contábil completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

