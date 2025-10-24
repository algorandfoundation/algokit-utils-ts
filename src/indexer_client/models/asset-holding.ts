import type { ModelMetadata } from '../core/model-runtime'

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

export const AssetHoldingMeta: ModelMetadata = {
  name: 'AssetHolding',
  kind: 'object',
  fields: [
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'isFrozen',
      wireKey: 'is-frozen',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'deleted',
      wireKey: 'deleted',
      optional: true,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'optedInAtRound',
      wireKey: 'opted-in-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'optedOutAtRound',
      wireKey: 'opted-out-at-round',
      optional: true,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
