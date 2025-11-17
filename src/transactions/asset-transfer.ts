import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { Address } from '@algorandfoundation/sdk'
import { CommonTransactionParams, TransactionHeader } from './common'

/** Parameters to define an asset transfer transaction. */
export type AssetTransferParams = CommonTransactionParams & {
  /** ID of the asset to transfer. */
  assetId: bigint
  /** Amount of the asset to transfer (in smallest divisible (decimal) units). */
  amount: bigint
  /** The address of the account that will receive the asset unit(s). */
  receiver: string | Address
  /** Optional address of an account to clawback the asset from.
   *
   * Requires the sender to be the clawback account.
   *
   * **Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.
   */
  clawbackTarget?: string | Address
  /** Optional address of an account to close the asset position to.
   *
   * **Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeAssetTo?: string | Address
}

/** Parameters to define an asset opt-in transaction. */
export type AssetOptInParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-in to. */
  assetId: bigint
}

/** Parameters to define an asset opt-out transaction. */
export type AssetOptOutParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-out of. */
  assetId: bigint
  /**
   * The address of the asset creator account to close the asset
   *   position to (any remaining asset units will be sent to this account).
   */
  creator: string | Address
}

export const buildAssetTransfer = (params: AssetTransferParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: params.amount,
      receiver: params.receiver.toString(),
      assetSender: params.clawbackTarget?.toString(),
      closeRemainderTo: params.closeAssetTo?.toString(),
    },
  }
}

export const buildAssetOptIn = (params: AssetOptInParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
    },
  }
}

export const buildAssetOptOut = (params: AssetOptOutParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
      closeRemainderTo: params.creator?.toString(),
    },
  }
}
