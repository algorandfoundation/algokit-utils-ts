import type { ModelMetadata } from '../core/model-runtime'
import type { Ed25519PublicKey } from './ed25519-public-key'

export type PublicKey = Ed25519PublicKey

export const PublicKeyMeta: ModelMetadata = {
  name: 'PublicKey',
  kind: 'passthrough',
  passThrough: { kind: 'scalar' },
}
