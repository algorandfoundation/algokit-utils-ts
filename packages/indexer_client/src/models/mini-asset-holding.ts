import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

/**
 * A simplified version of AssetHolding
 */
export type MiniAssetHolding = {
  address: string
  amount: bigint
  isFrozen: boolean

  /**
   * Whether or not this asset holding is currently deleted from its account.
   */
  deleted?: boolean

  /**
   * Round during which the account opted into the asset.
   */
  optedInAtRound?: bigint

  /**
   * Round during which the account opted out of the asset.
   */
  optedOutAtRound?: bigint
}

export const MiniAssetHoldingMeta: ObjectModelMetadata<MiniAssetHolding> = {
  name: 'MiniAssetHolding',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'isFrozen',
      wireKey: 'is-frozen',
      optional: false,
      codec: booleanCodec,
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      codec: booleanCodec,
    },
    {
      name: 'optedInAtRound',
      wireKey: 'opted-in-at-round',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'optedOutAtRound',
      wireKey: 'opted-out-at-round',
      optional: true,
      codec: bigIntCodec,
    },
  ],
}
