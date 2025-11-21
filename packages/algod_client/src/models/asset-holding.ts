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
   * \[a\] number of units held.
   */
  amount: bigint

  /**
   * Asset ID of the holding.
   */
  assetId: bigint

  /**
   * \[f\] whether or not the holding is frozen.
   */
  isFrozen: boolean
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
  ],
}
