import type { ArrayModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * MasterDerivationKey is used to derive ed25519 keys for use in wallets
 */
export type MasterDerivationKey = number[]

export const MasterDerivationKeyMeta: ArrayModelMetadata = {
  name: 'MasterDerivationKey',
  kind: 'array',
  codec: new ArrayCodec(stringCodec),
}
