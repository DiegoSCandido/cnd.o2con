import { Text } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { getModelConfig } from '../features/certidoes/models'
import { CertidaoModeloPage } from './CertidaoModeloPage'

export function CertidaoModeloRoute() {
  const { model } = useParams()
  const cfg = getModelConfig(model)

  if (!cfg) return <Text>Modelo não encontrado.</Text>
  return <CertidaoModeloPage model={cfg.model} />
}

