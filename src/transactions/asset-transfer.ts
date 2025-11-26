import { SuggestedParams } from '@algorandfoundation/algokit-algod-client'
import { ReadableAddress, getAddress, getOptionalAddress } from '@algorandfoundation/algokit-common'
import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { CommonTransactionParams, buildTransactionCommonData } from './common'

/** Parameters to define an asset transfer transaction. */
export type AssetTransferParams = CommonTransactionParams & {
  /** ID of the asset to transfer. */
  assetId: bigint
  /** Amount of the asset to transfer (in smallest divisible (decimal) units). */
  amount: bigint
  /** The address of the account that will receive the asset unit(s). */
  receiver: ReadableAddress
  /** Optional address of an account to clawback the asset from.
   *
   * Requires the sender to be the clawback account.
   *
   * **Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.
   */
  clawbackTarget?: ReadableAddress
  /** Optional address of an account to close the asset position to.
   *
   * **Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.
   */
  closeAssetTo?: ReadableAddress
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
  creator: ReadableAddress
}

export const buildAssetTransfer = (
  params: AssetTransferParams,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Transaction => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  return {
    ...commonData,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: params.amount,
      receiver: getAddress(params.receiver),
      assetSender: getOptionalAddress(params.clawbackTarget),
      closeRemainderTo: getOptionalAddress(params.closeAssetTo),
    },
  }
}

export const buildAssetOptIn = (params: AssetOptInParams, suggestedParams: SuggestedParams, defaultValidityWindow: bigint): Transaction => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  return {
    ...commonData,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: commonData.sender,
    },
  }
}

export const buildAssetOptOut = (
  params: AssetOptOutParams,
  suggestedParams: SuggestedParams,
  defaultValidityWindow: bigint,
): Transaction => {
  const commonData = buildTransactionCommonData(params, suggestedParams, defaultValidityWindow)
  return {
    ...commonData,
    type: TransactionType.AssetTransfer,
    assetTransfer: {
      assetId: params.assetId,
      amount: 0n,
      receiver: commonData.sender,
      closeRemainderTo: getOptionalAddress(params.creator),
    },
  }
}
