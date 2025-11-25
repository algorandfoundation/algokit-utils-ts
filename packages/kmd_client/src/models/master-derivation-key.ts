import type { ArrayModelMetadata } from '@algorandfoundation/algokit-common'
import {
  numberArrayCodec,
} from '@algorandfoundation/algokit-common'

/**
 * MasterDerivationKey is used to derive ed25519 keys for use in wallets
 */
export type MasterDerivationKey = number[]

export const MasterDerivationKeyMeta: ArrayModelMetadata = {
  name: 'MasterDerivationKey',
  kind: 'array',
  codec: numberArrayCodec,
}
