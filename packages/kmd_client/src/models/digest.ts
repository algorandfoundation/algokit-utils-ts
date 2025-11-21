import type { ArrayModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

export type Digest = number[]

export const DigestMeta: ArrayModelMetadata = {
  name: 'Digest',
  kind: 'array',
  codec: new ArrayCodec(stringCodec),
}
