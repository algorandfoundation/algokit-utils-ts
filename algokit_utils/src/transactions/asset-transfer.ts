import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { CommonTransactionParams, ComposerTransactionType, TransactionHeader } from './common'

export type AssetTransferComposerTransaction = { type: ComposerTransactionType.AssetTransfer; data: AssetTransferParams }
export type AssetOptInComposerTransaction = { type: ComposerTransactionType.AssetOptIn; data: AssetOptInParams }
export type AssetOptOutComposerTransaction = { type: ComposerTransactionType.AssetOptOut; data: AssetOptOutParams }
export type AssetClawbackComposerTransaction = { type: ComposerTransactionType.AssetClawback; data: AssetClawbackParams }

/** Parameters for creating an asset transfer transaction. */
export type AssetTransferParams = CommonTransactionParams & {
  /** ID of the asset to transfer. */
  assetId: bigint
  /** Amount of the asset to transfer (in smallest divisible (decimal) units). */
  amount: bigint
  /** The address of the account that will receive the asset unit(s). */
  receiver: string
}

/** Parameters for creating an asset opt-in transaction. */
export type AssetOptInParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-in to. */
  assetId: bigint
}

/** Parameters for creating an asset opt-out transaction. */
export type AssetOptOutParams = CommonTransactionParams & {
  /** ID of the asset that will be opted-out of. */
  assetId: bigint
  /** Optional address of an account to close the remaining asset position to. We recommend setting this to the asset creator.
   *
   * **Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeRemainderTo?: string
}

/** Parameters for creating an asset clawback transaction. */
export type AssetClawbackParams = CommonTransactionParams & {
  /** ID of the asset to clawback. */
  assetId: bigint
  /** Amount of the asset to transfer (in smallest divisible (decimal) units). */
  amount: bigint
  /** The address of the account that will receive the asset unit(s). */
  receiver: string
  /** Address of an account to clawback the asset from.
   *
   * Requires the sender to be the clawback account.
   *
   * **Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.
   */
  clawbackTarget: string
}

export const buildAssetTransfer = (params: AssetTransferParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: params.amount,
      receiver: params.receiver,
    },
  }
}

export const buildAssetOptIn = (params: AssetOptInParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AssetTransfer,
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
    transactionType: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: header.sender,
      closeRemainderTo: params.closeRemainderTo,
    },
  }
}

export const buildAssetClawback = (params: AssetClawbackParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: params.amount,
      receiver: params.receiver,
      assetSender: params.clawbackTarget,
    },
  }
}
