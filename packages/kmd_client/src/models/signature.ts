import type { ModelMetadata } from '../core/model-runtime'
import type { Ed25519Signature } from './ed25519-signature'

export type Signature = Ed25519Signature

export const SignatureMeta: ModelMetadata = {
  name: 'Signature',
  kind: 'passthrough',
  passThrough: { kind: 'scalar' },
}
