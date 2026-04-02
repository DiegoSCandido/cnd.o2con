import { Building2, FileSearch, FileText, ScrollText, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useCertidoes } from '../features/certidoes/hooks'
import { CERT_MODELS } from '../features/certidoes/models'
import type { CertificateModel } from '../features/certidoes/types'

function CountLine(props: { regular: number; irregular: number; alert: number }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>{props.regular} Regulares</span>
      <span>|</span>
      <span>{props.irregular} Irregulares</span>
      <span>|</span>
      <span className="text-primary">{props.alert} Alerta</span>
    </div>
  )
}

export function CertidoesDashboardPage() {
  const navigate = useNavigate()

  const estadual = useCertidoes({ model: 'estadual', status: 'all', q: '' })
  const trabalhista = useCertidoes({ model: 'trabalhista', status: 'all', q: '' })
  const fgts = useCertidoes({ model: 'fgts', status: 'all', q: '' })
  const rfbPgfn = useCertidoes({ model: 'rfb-pgfn', status: 'all', q: '' })
  const municipal = useCertidoes({ model: 'municipal', status: 'all', q: '' })

  const dataByModel = useMemo(
    () =>
      ({
        estadual: estadual.data?.items ?? [],
        trabalhista: trabalhista.data?.items ?? [],
        fgts: fgts.data?.items ?? [],
        'rfb-pgfn': rfbPgfn.data?.items ?? [],
        municipal: municipal.data?.items ?? [],
      }) satisfies Record<CertificateModel, Array<{ status: 'regular' | 'irregular' }>>,
    [estadual.data, trabalhista.data, fgts.data, rfbPgfn.data, municipal.data],
  )

  const countsByModel = useMemo(() => {
    const calc = (items: Array<{ status: 'regular' | 'irregular' }>) => {
      const regular = items.filter((x) => x.status === 'regular').length
      const irregular = items.filter((x) => x.status === 'irregular').length
      const alert = Math.max(0, Math.round(irregular * 0.35))
      return { regular, irregular, alert }
    }

    return {
      estadual: calc(dataByModel.estadual),
      trabalhista: calc(dataByModel.trabalhista),
      fgts: calc(dataByModel.fgts),
      'rfb-pgfn': calc(dataByModel['rfb-pgfn']),
      municipal: calc(dataByModel.municipal),
    } satisfies Record<CertificateModel, { regular: number; irregular: number; alert: number }>
  }, [dataByModel])

  const iconByModel: Record<CertificateModel, React.ReactNode> = {
    estadual: <ScrollText className="h-5 w-5" strokeWidth={1.5} />,
    trabalhista: <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />,
    fgts: <FileText className="h-5 w-5" strokeWidth={1.5} />,
    'rfb-pgfn': <Building2 className="h-5 w-5" strokeWidth={1.5} />,
    municipal: <FileSearch className="h-5 w-5" strokeWidth={1.5} />,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Certidões</h2>
          <p className="mt-1 text-sm text-muted-foreground">Dashboard dos modelos de CNDs</p>
        </div>

        <button
          type="button"
          className="h-9 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
        >
          Relatório Unificado de Certidões
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CERT_MODELS.map((m) => (
          <button
            key={m.model}
            type="button"
            onClick={() => navigate(`/certidoes/${m.model}`)}
            className="text-left rounded-lg border border-border bg-card p-6 shadow-soft transition-colors duration-150 hover:border-primary"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg brand-gradient-soft border border-border text-primary">
                  {iconByModel[m.model]}
                </div>
                <div>
                  <div className="font-display text-base font-semibold text-card-foreground">{m.title}</div>
                  <div className="text-sm text-muted-foreground">{m.subtitle}</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CountLine {...countsByModel[m.model]} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

