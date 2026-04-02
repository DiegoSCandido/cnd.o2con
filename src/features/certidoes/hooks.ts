import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  atualizarCertidaoByModel,
  baixarTodasCertidoesByModel,
  downloadBlob,
  exportCertidoesByModel,
  listCertidoesByModel,
} from './api'
import type { CertificateModel } from './types'

export function useCertidoes(args: { model: CertificateModel; status: 'all' | 'regular' | 'irregular'; q: string }) {
  return useQuery({
    queryKey: ['certidoes', args],
    queryFn: () =>
      listCertidoesByModel({ model: args.model, status: args.status, q: args.q || undefined }),
  })
}

export function useAtualizarCertidao() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { model: CertificateModel; id: string }) =>
      atualizarCertidaoByModel({ model: vars.model, id: vars.id }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['certidoes'] })
      toast.success('Certidão atualizada.')
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Falha ao atualizar.')
    },
  })
}

export function useExportCertidoes() {
  return useMutation({
    mutationFn: exportCertidoesByModel,
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename)
      toast.success('Exportação gerada.')
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Falha ao exportar.')
    },
  })
}

export function useBaixarTodasCertidoes() {
  return useMutation({
    mutationFn: baixarTodasCertidoesByModel,
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename)
      toast.success('Download iniciado.')
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Falha ao baixar.')
    },
  })
}

