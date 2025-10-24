import type { ModelMetadata } from '../core/model-runtime'

/**
 * References an asset held by an account.
 */
export type AssetHoldingReference = {
  /**
   * Address of the account holding the asset.
   */
  account: string

  /**
   * Asset ID of the holding.
   */
  asset: bigint
}

export const AssetHoldingReferenceMeta: ModelMetadata = {
  name: 'AssetHoldingReference',
  kind: 'object',
  fields: [
    {
      name: 'account',
      wireKey: 'account',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
    {
      name: 'asset',
      wireKey: 'asset',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
  ],
}
