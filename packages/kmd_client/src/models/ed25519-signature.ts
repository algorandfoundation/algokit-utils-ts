import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

export type Ed25519Signature = number[]

export const Ed25519SignatureMeta: ModelMetadata = {
  name: 'Ed25519Signature',
  kind: 'array',
  arrayCodec: new ArrayCodec(stringCodec),
}
