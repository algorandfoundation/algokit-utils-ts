import type { ArrayModelMetadata } from '@algorandfoundation/algokit-common'
import { numberArrayCodec } from '@algorandfoundation/algokit-common'

export type Ed25519PublicKey = number[]

export const Ed25519PublicKeyMeta: ArrayModelMetadata = {
  name: 'Ed25519PublicKey',
  kind: 'array',
  codec: numberArrayCodec,
}
