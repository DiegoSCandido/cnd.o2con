import type { CertidoesListResponse, Certificate, CertificateModel } from './types'

type StatusFilter = 'all' | 'regular' | 'irregular'
type ExportFormat = 'csv' | 'pdf' | 'xlsx'

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, window.location.origin)
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }
  return url.toString()
}

async function assertOk(res: Response) {
  if (res.ok) return
  const text = await res.text().catch(() => '')
  throw new Error(text || `Request failed: ${res.status}`)
}

export async function listCertidoes(args: { status: StatusFilter; q?: string }) {
  return listCertidoesByModel({ model: 'estadual', status: args.status, q: args.q })
}

export async function atualizarCertidao(id: string) {
  return atualizarCertidaoByModel({ model: 'estadual', id })
}

export async function exportCertidoes(args: { format: ExportFormat; status: StatusFilter; q?: string }) {
  return exportCertidoesByModel({ model: 'estadual', ...args })
}

export async function baixarTodasCertidoes() {
  return baixarTodasCertidoesByModel({ model: 'estadual' })
}

export async function listCertidoesByModel(args: { model: CertificateModel; status: StatusFilter; q?: string }) {
  const res = await fetch(
    buildUrl(`/api/certidoes/${encodeURIComponent(args.model)}`, { status: args.status, q: args.q }),
    { headers: { Accept: 'application/json' } },
  )
  await assertOk(res)
  return (await res.json()) as CertidoesListResponse
}

export async function atualizarCertidaoByModel(args: { model: CertificateModel; id: string }) {
  const res = await fetch(
    `/api/certidoes/${encodeURIComponent(args.model)}/${encodeURIComponent(args.id)}/atualizar`,
    {
      method: 'POST',
      headers: { Accept: 'application/json' },
    },
  )
  await assertOk(res)
  const json = (await res.json()) as { item: Certificate }
  return json.item
}

export async function exportCertidoesByModel(args: {
  model: CertificateModel
  format: ExportFormat
  status: StatusFilter
  q?: string
}) {
  const res = await fetch(
    buildUrl(`/api/certidoes/${encodeURIComponent(args.model)}/export`, {
      format: args.format,
      status: args.status,
      q: args.q,
    }),
    { headers: { Accept: 'application/octet-stream' } },
  )
  await assertOk(res)
  return {
    blob: await res.blob(),
    filename: res.headers.get('x-filename') ?? `certidoes.${args.format}`,
  }
}

export async function baixarTodasCertidoesByModel(args: { model: CertificateModel }) {
  const res = await fetch(`/api/certidoes/${encodeURIComponent(args.model)}/baixar-todas`, {
    headers: { Accept: 'application/octet-stream' },
  })
  await assertOk(res)
  return {
    blob: await res.blob(),
    filename: res.headers.get('x-filename') ?? 'certidoes.zip',
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

