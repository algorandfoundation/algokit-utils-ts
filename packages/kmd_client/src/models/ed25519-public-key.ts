import type { ModelMetadata } from '../core/model-runtime'

export type Ed25519PublicKey = number[]

export const Ed25519PublicKeyMeta: ModelMetadata = {
  name: 'Ed25519PublicKey',
  kind: 'array',
  arrayItems: { kind: 'scalar' },
}
