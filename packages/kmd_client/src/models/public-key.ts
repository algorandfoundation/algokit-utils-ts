import type { PassthroughModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Ed25519PublicKey } from './ed25519-public-key'

export type PublicKey = Ed25519PublicKey

export const PublicKeyMeta: PassthroughModelMetadata = {
  name: 'PublicKey',
  kind: 'passthrough',
  codec: stringCodec,
}
