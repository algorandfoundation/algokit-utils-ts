import type { ObjectModelMetadata } from '@algorandfoundation/algokit-common'
import { stringCodec, bigIntCodec } from '@algorandfoundation/algokit-common'

/**
 * Fields for an asset transfer transaction.
 *
 * Definition:
 * data/transactions/asset.go : AssetTransferTxnFields
 */
export type TransactionAssetTransfer = {
  /**
   * \[aamt\] Amount of asset to transfer. A zero amount transferred to self allocates that asset in the account's Assets map.
   */
  amount: bigint

  /**
   * \[xaid\] ID of the asset being transferred.
   */
  assetId: bigint

  /**
   * Number of assets transferred to the close-to account as part of the transaction.
   */
  closeAmount?: bigint

  /**
   * \[aclose\] Indicates that the asset should be removed from the account's Assets map, and specifies where the remaining asset holdings should be transferred.  It's always valid to transfer remaining asset holdings to the creator account.
   */
  closeTo?: string

  /**
   * \[arcv\] Recipient address of the transfer.
   */
  receiver: string

  /**
   * \[asnd\] The effective sender during a clawback transactions. If this is not a zero value, the real transaction sender must be the Clawback address from the AssetParams.
   */
  sender?: string
}

export const TransactionAssetTransferMeta: ObjectModelMetadata<TransactionAssetTransfer> = {
  name: 'TransactionAssetTransfer',
  kind: 'object',
  fields: [
    {
      name: 'amount',
      wireKey: 'amount',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'assetId',
      wireKey: 'asset-id',
      optional: false,
      codec: bigIntCodec,
    },
    {
      name: 'closeAmount',
      wireKey: 'close-amount',
      optional: true,
      codec: bigIntCodec,
    },
    {
      name: 'closeTo',
      wireKey: 'close-to',
      optional: true,
      codec: stringCodec,
    },
    {
      name: 'receiver',
      wireKey: 'receiver',
      optional: false,
      codec: stringCodec,
    },
    {
      name: 'sender',
      wireKey: 'sender',
      optional: true,
      codec: stringCodec,
    },
  ],
}
