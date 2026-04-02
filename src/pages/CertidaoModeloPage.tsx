import {
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Certificate, CertificateModel, CertificateStatus } from '../features/certidoes/types'
import { useAtualizarCertidao, useBaixarTodasCertidoes, useCertidoes, useExportCertidoes } from '../features/certidoes/hooks'

type StatusFilter = 'all' | 'regular' | 'irregular'

function statusLabel(status: CertificateStatus) {
  return status === 'regular' ? 'Regular' : 'Irregular'
}

function formatCnpj(cnpj: string) {
  const digits = cnpj.replace(/\D/g, '').padStart(14, '0').slice(-14)
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function formatDateBR(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

type ColumnKey = 'razaoSocial' | 'cnpj' | 'uf' | 'status' | 'ultimaConsulta' | 'vencimento'

const ALL_COLUMNS: Array<{ key: ColumnKey; label: string }> = [
  { key: 'razaoSocial', label: 'Razão Social' },
  { key: 'cnpj', label: 'CNPJ' },
  { key: 'uf', label: 'UF' },
  { key: 'status', label: 'Situação' },
  { key: 'ultimaConsulta', label: 'Última Consulta' },
  { key: 'vencimento', label: 'Vencimento' },
]

export function CertidaoModeloPage(props: { model: CertificateModel }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [q, setQ] = useState('')
  const [qDebounced] = useDebouncedValue(q, 250)

  const [visible, setVisible] = useState<Record<ColumnKey, boolean>>({
    razaoSocial: true,
    cnpj: true,
    uf: true,
    status: true,
    ultimaConsulta: true,
    vencimento: true,
  })

  const certidoesQuery = useCertidoes({ model: props.model, status, q: qDebounced })
  const atualizar = useAtualizarCertidao()
  const exportar = useExportCertidoes()
  const baixarTodas = useBaixarTodasCertidoes()

  const items = certidoesQuery.data?.items ?? []
  const total = certidoesQuery.data?.total ?? 0

  const columns = useMemo(() => ALL_COLUMNS.filter((c) => visible[c.key]), [visible])
  const exportDisabled = exportar.isPending || certidoesQuery.isPending

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <details className="group">
                <summary className="list-none">
                  <button
                    type="button"
                    disabled={exportDisabled}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.5} />
                    Exportar
                  </button>
                </summary>
                <div className="absolute z-20 mt-2 w-44 rounded-lg border border-border bg-popover p-1 shadow-soft-lg">
                  <MenuItem
                    icon={<FileSpreadsheet className="h-4 w-4" strokeWidth={1.5} />}
                    label="Excel"
                    onClick={() => exportar.mutate({ model: props.model, format: 'xlsx', status, q: qDebounced || undefined })}
                  />
                  <MenuItem
                    icon={<FileText className="h-4 w-4" strokeWidth={1.5} />}
                    label="PDF"
                    onClick={() => exportar.mutate({ model: props.model, format: 'pdf', status, q: qDebounced || undefined })}
                  />
                  <MenuItem
                    icon={<FileText className="h-4 w-4" strokeWidth={1.5} />}
                    label="CSV"
                    onClick={() => exportar.mutate({ model: props.model, format: 'csv', status, q: qDebounced || undefined })}
                  />
                </div>
              </details>
            </div>

            <div className="relative">
              <details className="group">
                <summary className="list-none">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                    Colunas
                  </button>
                </summary>
                <div className="absolute z-20 mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-soft-lg">
                  <div className="space-y-1">
                    {ALL_COLUMNS.map((c) => (
                      <label key={c.key} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                        <span>{c.label}</span>
                        <input
                          type="checkbox"
                          checked={visible[c.key]}
                          onChange={() => setVisible((v) => ({ ...v, [c.key]: !v[c.key] }))}
                          className="h-4 w-4"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input
                value={q}
                onChange={(e) => setQ(e.currentTarget.value)}
                placeholder="Buscar por razão social ou CNPJ"
                className="h-9 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Filter className="h-4 w-4" strokeWidth={1.5} />
              Filtro
            </button>

            <button
              type="button"
              onClick={() => baixarTodas.mutate({ model: props.model })}
              className="inline-flex h-9 items-center gap-2 rounded-lg brand-gradient px-3 text-sm font-semibold text-white shadow-glow-primary transition-opacity hover:opacity-95 disabled:opacity-60"
              disabled={baixarTodas.isPending}
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Baixar Todas
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                {columns.some((c) => c.key === 'razaoSocial') && <th className="px-3 py-3 text-left text-sm font-semibold">Razão Social</th>}
                {columns.some((c) => c.key === 'cnpj') && <th className="px-3 py-3 text-left text-sm font-semibold">CNPJ</th>}
                {columns.some((c) => c.key === 'uf') && <th className="px-3 py-3 text-left text-sm font-semibold">UF</th>}
                {columns.some((c) => c.key === 'status') && <th className="px-3 py-3 text-left text-sm font-semibold">Situação</th>}
                {columns.some((c) => c.key === 'ultimaConsulta') && <th className="px-3 py-3 text-left text-sm font-semibold">Última Consulta</th>}
                {columns.some((c) => c.key === 'vencimento') && <th className="px-3 py-3 text-left text-sm font-semibold">Vencimento</th>}
                <th className="px-3 py-3 text-left text-sm font-semibold">Ações</th>
                <th className="px-3 py-3 text-right text-sm font-semibold" />
              </tr>
            </thead>
            <tbody>
              {certidoesQuery.isPending && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-sm text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              )}
              {certidoesQuery.isError && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-sm text-destructive">
                    Falha ao carregar certidões.
                  </td>
                </tr>
              )}
              {!certidoesQuery.isPending && !items.length && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-sm text-muted-foreground">
                    Nenhum resultado.
                  </td>
                </tr>
              )}

              {items.map((row) => (
                <Row
                  key={`${props.model}-${row.id}`}
                  row={row}
                  visible={visible}
                  onAtualizar={() => atualizar.mutate({ model: props.model, id: row.id })}
                  atualizando={
                    atualizar.isPending &&
                    atualizar.variables?.model === props.model &&
                    atualizar.variables?.id === row.id
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Total: {total}</span>
          <span>Mostrando: {items.length}</span>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 h-full w-[min(420px,100vw)] bg-card border-l border-border p-6 shadow-soft-lg">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg font-bold">Opções de Filtro</div>
              <button
                type="button"
                className="h-9 w-9 rounded-lg hover:bg-accent flex items-center justify-center"
                onClick={() => setFilterOpen(false)}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.currentTarget.value as StatusFilter)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="all">Todas</option>
                  <option value="irregular">Irregulares</option>
                  <option value="regular">Regulares</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Busca</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.currentTarget.value)}
                    placeholder="Razão social ou CNPJ"
                    className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Row(props: {
  row: Certificate
  visible: Record<ColumnKey, boolean>
  onAtualizar: () => void
  atualizando: boolean
}) {
  const { row, visible } = props

  return (
    <tr className="border-b border-border hover:bg-accent/30">
      {visible.razaoSocial && <td className="px-3 py-3 text-sm">{row.razaoSocial}</td>}
      {visible.cnpj && <td className="px-3 py-3 text-sm">{formatCnpj(row.cnpj)}</td>}
      {visible.uf && <td className="px-3 py-3 text-sm">{row.uf}</td>}
      {visible.status && (
        <td className="px-3 py-3 text-sm">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              row.status === 'regular' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white',
            )}
          >
            {statusLabel(row.status)}
          </span>
        </td>
      )}
      {visible.ultimaConsulta && <td className="px-3 py-3 text-sm">{formatDateBR(row.ultimaConsultaISO)}</td>}
      {visible.vencimento && <td className="px-3 py-3 text-sm">{formatDateBR(row.vencimentoISO)}</td>}

      <td className="px-3 py-3 text-sm">
        <div className="flex items-center gap-1.5">
          <IconAction label="Ver" icon={<Eye className="h-4 w-4" strokeWidth={1.5} />} onClick={() => {}} />
          <IconAction label="Baixar" icon={<Download className="h-4 w-4" strokeWidth={1.5} />} onClick={() => {}} />
          <IconAction label="Reconsultar" icon={<RefreshCcw className="h-4 w-4" strokeWidth={1.5} />} onClick={props.onAtualizar} />
        </div>
      </td>
      <td className="px-3 py-3 text-right text-sm">
        <button
          type="button"
          onClick={props.onAtualizar}
          disabled={props.atualizando}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-semibold transition-colors hover:bg-accent disabled:opacity-60"
        >
          {props.atualizando ? 'Atualizando...' : 'Atualizar'}
        </button>
      </td>
    </tr>
  )
}

function IconAction(props: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-label={props.label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {props.icon}
    </button>
  )
}

function MenuItem(props: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent"
    >
      <span className="text-muted-foreground">{props.icon}</span>
      <span>{props.label}</span>
    </button>
  )
}

