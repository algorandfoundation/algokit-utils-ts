import type { ModelMetadata } from '../core/model-runtime'

export type Ed25519PrivateKey = bigint[]

export const Ed25519PrivateKeyMeta: ModelMetadata = {
  name: 'Ed25519PrivateKey',
  kind: 'array',
  arrayItems: { kind: 'scalar' },
}
