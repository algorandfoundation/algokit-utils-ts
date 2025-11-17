import type { ModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec, ArrayCodec } from '@algorandfoundation/algokit-common'

/**
 * MasterDerivationKey is used to derive ed25519 keys for use in wallets
 */
export type MasterDerivationKey = number[]

export const MasterDerivationKeyMeta: ModelMetadata = {
  name: 'MasterDerivationKey',
  kind: 'array',
  arrayCodec: new ArrayCodec(stringCodec),
}
