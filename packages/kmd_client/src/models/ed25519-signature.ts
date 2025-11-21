import type { ArrayModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

export type Ed25519Signature = number[]

export const Ed25519SignatureMeta: ArrayModelMetadata = {
  name: 'Ed25519Signature',
  kind: 'array',
  codec: new ArrayCodec(stringCodec),
}
