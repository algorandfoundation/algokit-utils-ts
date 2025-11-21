import type { ArrayModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

export type Ed25519PublicKey = number[]

export const Ed25519PublicKeyMeta: ArrayModelMetadata = {
  name: 'Ed25519PublicKey',
  kind: 'array',
  codec: new ArrayCodec(stringCodec),
}
