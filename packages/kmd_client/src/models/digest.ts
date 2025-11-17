import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

export type Digest = number[]

export const DigestMeta: ModelMetadata = {
  name: 'Digest',
  kind: 'array',
  arrayCodec: new ArrayCodec(stringCodec),
}
