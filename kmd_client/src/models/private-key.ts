import type { ModelMetadata } from '../core/model-runtime'
import type { Ed25519PrivateKey } from './ed25519-private-key'

export type PrivateKey = Ed25519PrivateKey

export const PrivateKeyMeta: ModelMetadata = {
  name: 'PrivateKey',
  kind: 'passthrough',
  passThrough: { kind: 'scalar' },
}
