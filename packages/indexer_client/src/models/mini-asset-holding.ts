import type { ModelMetadata } from '../core/model-runtime'

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

export const MiniAssetHoldingMeta: ModelMetadata = {
  name: 'MiniAssetHolding',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'amount',
      wireKey: 'amount',
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
