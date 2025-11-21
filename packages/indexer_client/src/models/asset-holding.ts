import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

/**
 * Describes an asset held by an account.
 *
 * Definition:
 * data/basics/userBalance.go : AssetHolding
 */
export type AssetHolding = {
  /**
   * number of units held.
   */
  amount: bigint

  /**
   * Asset ID of the holding.
   */
  assetId: bigint

  /**
   * whether or not the holding is frozen.
   */
  isFrozen: boolean

  /**
   * Whether or not the asset holding is currently deleted from its account.
   */
  deleted?: boolean

  /**
   * Round during which the account opted into this asset holding.
   */
  optedInAtRound?: bigint

  /**
   * Round during which the account opted out of this asset holding.
   */
  optedOutAtRound?: bigint
}

export const AssetHoldingMeta: ObjectModelMetadata = {
  name: 'AssetHolding',
  kind: 'object',
  fields: [
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: false,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'isFrozen',
      wireKey: 'is-frozen',
      optional: false,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      nullable: false,
      codec: booleanCodec,
    },
    {
      name: 'optedInAtRound',
      wireKey: 'opted-in-at-round',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
    {
      name: 'optedOutAtRound',
      wireKey: 'opted-out-at-round',
      optional: true,
      nullable: false,
      codec: bigIntCodec,
    },
  ],
}
