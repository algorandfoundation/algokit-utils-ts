import type { ModelMetadata } from '../core/model-runtime'

export type Ed25519Signature = bigint[]

export const Ed25519SignatureMeta: ModelMetadata = {
  name: 'Ed25519Signature',
  kind: 'array',
  arrayItems: { kind: 'scalar' },
}
