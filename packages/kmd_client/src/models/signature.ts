import type { PassthroughModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ModelCodec } from '@algorandfoundation/algokit-common'
import type { Ed25519Signature } from './ed25519-signature'

export type Signature = Ed25519Signature

export const SignatureMeta: PassthroughModelMetadata = {
  name: 'Signature',
  kind: 'passthrough',
  codec: stringCodec,
}
