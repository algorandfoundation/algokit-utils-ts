import type { ObjectModelMetadata } from '../core/model-runtime'
import { stringCodec, numberCodec, bigIntCodec, booleanCodec, bytesCodec } from '@algorandfoundation/algokit-common'

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

export const MiniAssetHoldingMeta: ObjectModelMetadata = {
  name: 'MiniAssetHolding',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      codec: stringCodec,
    },
    {
      name: 'amount',
      wireKey: 'amount',
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
