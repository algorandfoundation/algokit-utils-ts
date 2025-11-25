import type { ArrayModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberArrayCodec,
} from '@algorandfoundation/algokit-common'

export type Digest = number[]

export const DigestMeta: ArrayModelMetadata = {
  name: 'Digest',
  kind: 'array',
  codec: numberArrayCodec,
}
