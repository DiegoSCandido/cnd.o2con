import type { CertificateModel } from './types'

export type CertificateModelConfig = {
  model: CertificateModel
  title: string
  subtitle: string
}

export const CERT_MODELS: CertificateModelConfig[] = [
  { model: 'estadual', title: 'CND Estadual', subtitle: 'Certidão Estadual' },
  { model: 'trabalhista', title: 'CND Trabalhista', subtitle: 'CNDT' },
  { model: 'fgts', title: 'CND FGTS', subtitle: 'FGTS' },
  { model: 'rfb-pgfn', title: 'CND RFB/PGFN', subtitle: 'Federal' },
  { model: 'municipal', title: 'CND Municipal', subtitle: 'Certidão Municipal' },
]

export function getModelConfig(model: string | undefined) {
  return CERT_MODELS.find((m) => m.model === model)
}

