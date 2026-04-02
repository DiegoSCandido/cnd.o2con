import { http, HttpResponse } from 'msw'
import { getCertidoes, updateCertidao } from './certidoesDb'
import type { CertificateModel } from '../features/certidoes/types'

function asCsv(rows: Array<Record<string, string>>) {
  const headers = Object.keys(rows[0] ?? {})
  const escape = (v: string) => `"${v.replaceAll('"', '""')}"`
  const lines = [headers.join(',')]
  for (const r of rows) lines.push(headers.map((h) => escape(r[h] ?? '')).join(','))
  return lines.join('\n')
}

export const handlers = [
  // Back-compat (default: estadual)
  http.get('/api/certidoes', ({ request }) => {
    const url = new URL(request.url)
    url.pathname = '/api/certidoes/estadual'
    return HttpResponse.redirect(url.toString())
  }),

  http.get('/api/certidoes/:model', ({ request, params }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status') ?? 'all'
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const model = String(params.model) as CertificateModel

    let items = getCertidoes(model)
    if (status === 'regular' || status === 'irregular') {
      items = items.filter((x) => x.status === status)
    }
    if (q) {
      items = items.filter(
        (x) =>
          x.razaoSocial.toLowerCase().includes(q) ||
          x.cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')),
      )
    }

    return HttpResponse.json({ items, total: items.length })
  }),

  // Back-compat (default: estadual)
  http.post('/api/certidoes/:id/atualizar', ({ params }) => {
    const id = String(params.id)
    const updated = updateCertidao('estadual', id)
    if (!updated) return new HttpResponse('Not found', { status: 404 })
    return HttpResponse.json({ item: updated })
  }),

  http.post('/api/certidoes/:model/:id/atualizar', ({ params }) => {
    const model = String(params.model) as CertificateModel
    const id = String(params.id)
    const updated = updateCertidao(model, id)
    if (!updated) return new HttpResponse('Not found', { status: 404 })
    return HttpResponse.json({ item: updated })
  }),

  // Back-compat (default: estadual)
  http.get('/api/certidoes/export', ({ request }) => {
    const url = new URL(request.url)
    url.pathname = '/api/certidoes/estadual/export'
    return HttpResponse.redirect(url.toString())
  }),

  http.get('/api/certidoes/:model/export', ({ request, params }) => {
    const url = new URL(request.url)
    const format = (url.searchParams.get('format') ?? 'csv').toLowerCase()
    const status = url.searchParams.get('status') ?? 'all'
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const model = String(params.model) as CertificateModel

    let items = getCertidoes(model)
    if (status === 'regular' || status === 'irregular') {
      items = items.filter((x) => x.status === status)
    }
    if (q) {
      items = items.filter(
        (x) =>
          x.razaoSocial.toLowerCase().includes(q) ||
          x.cnpj.replace(/\D/g, '').includes(q.replace(/\D/g, '')),
      )
    }

    const rows = items.map((x) => ({
      razaoSocial: x.razaoSocial,
      cnpj: x.cnpj,
      uf: x.uf,
      situacao: x.status,
      ultimaConsultaISO: x.ultimaConsultaISO,
      vencimentoISO: x.vencimentoISO,
    }))
    const csv = asCsv(
      rows.length
        ? rows
        : [{ razaoSocial: '', cnpj: '', uf: '', situacao: '', ultimaConsultaISO: '', vencimentoISO: '' }],
    )
    const ext = format === 'pdf' ? 'pdf' : format === 'xlsx' ? 'xlsx' : 'csv'
    const contentType =
      ext === 'pdf'
        ? 'application/pdf'
        : ext === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'

    return new HttpResponse(csv, {
      headers: {
        'content-type': contentType,
        'x-filename': `certidoes-${model}.${ext}`,
      },
    })
  }),

  // Back-compat (default: estadual)
  http.get('/api/certidoes/baixar-todas', () => {
    const content = 'ZIP_MOCK: este é um download simulado.\n'
    return new HttpResponse(content, {
      headers: {
        'content-type': 'application/zip',
        'x-filename': 'certidoes.zip',
      },
    })
  }),

  http.get('/api/certidoes/:model/baixar-todas', ({ params }) => {
    const model = String(params.model) as CertificateModel
    const content = `ZIP_MOCK(${model}): este é um download simulado.\n`
    return new HttpResponse(content, {
      headers: {
        'content-type': 'application/zip',
        'x-filename': `certidoes-${model}.zip`,
      },
    })
  }),
]

