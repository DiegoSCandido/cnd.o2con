import type { Certificate, CertificateModel, CertificateStatus } from '../features/certidoes/types'

function rand(seed: number) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const UFS = ['RS', 'SC', 'PR', 'SP', 'RJ', 'MG', 'BA', 'PE', 'CE']

const RAZOES = [
  'ACQT QUIMICA LTDA',
  'ADM SERVICOS DE LOGISTICA E DISTRIBUICAO LTDA',
  'AGROPECUARIA TITO LTDA',
  'ALDUARTE SOFTWARE LTDA',
  'ALESSANDRA BIANCA DE OLIVEIRA SOCIEDADE INDIVIDUAL DE ADVOCACIA',
  'ALEXANDRE DE ALMEIDA MARIA',
  'ALEXANDRE SOARES CASTELO',
  'ALEXIA LEONUR LIMAN',
  'ALVES E QUEIRINO PRESTADORA DE SERVICOS LTDA',
  'AMARELINHO LANCHES LTDA',
  'AMAZING LTDA',
]

function pad(n: number, size: number) {
  return String(n).padStart(size, '0')
}

function randomCnpj(r: number) {
  const base = Math.floor(r * 10 ** 12)
  return `${pad(Math.floor(base / 10 ** 8), 4)}${pad(Math.floor((base / 10 ** 4) % 10 ** 4), 4)}${pad(base % 10 ** 4, 4)}0001${pad(Math.floor(r * 99), 2)}`
}

// status é calculado por modelo via modelIrregularRate

function randomDateISO(r: number) {
  const now = Date.now()
  const daysAgo = Math.floor(r * 40)
  const ms = now - daysAgo * 24 * 60 * 60 * 1000
  return new Date(ms).toISOString()
}

function addDaysISO(iso: string, days: number) {
  const d = new Date(iso)
  return new Date(d.getTime() + days * 24 * 60 * 60 * 1000).toISOString()
}

const byModel = new Map<CertificateModel, Certificate[]>()

function modelSeed(model: CertificateModel) {
  switch (model) {
    case 'estadual':
      return 1000
    case 'trabalhista':
      return 2000
    case 'fgts':
      return 3000
    case 'rfb-pgfn':
      return 4000
    case 'municipal':
      return 5000
  }
}

function modelIrregularRate(model: CertificateModel) {
  switch (model) {
    case 'estadual':
      return 0.25
    case 'trabalhista':
      return 0.18
    case 'fgts':
      return 0.12
    case 'rfb-pgfn':
      return 0.22
    case 'municipal':
      return 0.15
  }
}

function modelValidityDays(model: CertificateModel) {
  switch (model) {
    case 'estadual':
      return 180
    case 'trabalhista':
      return 180
    case 'fgts':
      return 30
    case 'rfb-pgfn':
      return 180
    case 'municipal':
      return 90
  }
}

export function getCertidoes(model: CertificateModel): Certificate[] {
  const existing = byModel.get(model)
  if (existing) return existing

  const items: Certificate[] = []
  const seedBase = modelSeed(model)
  const irregularRate = modelIrregularRate(model)
  const validityDays = modelValidityDays(model)
  const total = model === 'rfb-pgfn' ? 55 : model === 'fgts' ? 48 : 65

  for (let i = 0; i < total; i += 1) {
    const r1 = rand(seedBase + i + 1)
    const r2 = rand(seedBase + i + 11)
    const r3 = rand(seedBase + i + 21)

    const ultimaConsultaISO = randomDateISO(rand(seedBase + i + 31))
    items.push({
      id: String(i + 1),
      razaoSocial: RAZOES[i % RAZOES.length],
      cnpj: randomCnpj(r1),
      uf: UFS[Math.floor(r2 * UFS.length)],
      status: r3 < irregularRate ? 'irregular' : 'regular',
      ultimaConsultaISO,
      vencimentoISO: addDaysISO(ultimaConsultaISO, validityDays),
    })
  }

  byModel.set(model, items)
  return items
}

export function updateCertidao(model: CertificateModel, id: string): Certificate | null {
  const items = getCertidoes(model)
  const idx = items.findIndex((x) => x.id === id)
  if (idx === -1) return null

  const r = rand(modelSeed(model) + Number(id) + Math.floor(Date.now() / 1000))
  const newStatus: CertificateStatus = r < 0.2 ? 'irregular' : 'regular'
  const ultimaConsultaISO = new Date().toISOString()
  const validityDays = modelValidityDays(model)
  const updated: Certificate = {
    ...items[idx],
    status: newStatus,
    ultimaConsultaISO,
    vencimentoISO: addDaysISO(ultimaConsultaISO, validityDays),
  }
  items[idx] = updated
  return updated
}

