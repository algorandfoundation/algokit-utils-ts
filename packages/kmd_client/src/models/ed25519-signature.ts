import type { ArrayModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberArrayCodec,
} from '@algorandfoundation/algokit-common'

export type Ed25519Signature = number[]

export const Ed25519SignatureMeta: ArrayModelMetadata = {
  name: 'Ed25519Signature',
  kind: 'array',
  codec: numberArrayCodec,
}
