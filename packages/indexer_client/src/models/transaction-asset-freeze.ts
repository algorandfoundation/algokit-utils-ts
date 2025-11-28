import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import {
  stringCodec,
  bigIntCodec,
  booleanCodec,
} from '@algorandfoundation/algokit-common'

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

export const TransactionAssetFreezeMeta: ObjectModelMetadata<TransactionAssetFreeze> = {
  name: 'TransactionAssetFreeze',
  kind: 'object',
  fields: [
    {
      name: 'address',
      wireKey: 'address',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'newFreezeStatus',
      wireKey: 'new-freeze-status',
      optional: false,
      codec: booleanCodec,
    },
  ],
}
