export type CertificateStatus = 'regular' | 'irregular'

export type CertificateModel = 'estadual' | 'trabalhista' | 'fgts' | 'rfb-pgfn' | 'municipal'

export type Certificate = {
  id: string
  razaoSocial: string
  cnpj: string
  uf: string
  status: CertificateStatus
  ultimaConsultaISO: string
  vencimentoISO: string
}

export type CertidoesListResponse = {
  items: Certificate[]
  total: number
}

