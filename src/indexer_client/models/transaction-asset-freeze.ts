import type { ModelMetadata } from '../core/model-runtime'

/**
 * Fields for an asset freeze transaction.
 *
 * Definition:
 * data/transactions/asset.go : AssetFreezeTxnFields
 */
export type TransactionAssetFreeze = {
  /**
   * \[fadd\] Address of the account whose asset is being frozen or thawed.
   */
  address: string

  /**
   * \[faid\] ID of the asset being frozen or thawed.
   */
  assetId: bigint

  /**
   * \[afrz\] The new freeze status.
   */
  newFreezeStatus: boolean
}

export const TransactionAssetFreezeMeta: ModelMetadata = {
  name: 'TransactionAssetFreeze',
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
      name: 'assetId',
      wireKey: 'asset-id',
      optional: false,
      nullable: false,
      type: { kind: 'scalar', isBigint: true },
    },
    {
      name: 'newFreezeStatus',
      wireKey: 'new-freeze-status',
      optional: false,
      nullable: false,
      type: { kind: 'scalar' },
    },
  ],
}
