import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { CommonTransactionParams, ComposerTransactionType, TransactionHeader } from './common'
export type AssetFreezeComposerTransaction = { type: ComposerTransactionType.AssetFreeze; data: AssetFreezeParams }
export type AssetUnfreezeComposerTransaction = { type: ComposerTransactionType.AssetUnfreeze; data: AssetUnfreezeParams }

/** Parameters for creating an asset freeze transaction. */
export type AssetFreezeParams = CommonTransactionParams & {
  /** The ID of the asset to freeze */
  assetId: bigint
  /** The address of the account to freeze */
  targetAddress: string
}

/** Parameters for creating an asset unfreeze transaction. */
export type AssetUnfreezeParams = CommonTransactionParams & {
  /** The ID of the asset to unfreeze */
  assetId: bigint
  /** The address of the account to unfreeze */
  targetAddress: string
}

export const buildAssetFreeze = (params: AssetFreezeParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AssetFreeze,
    assetFreeze: {
      assetId: params.assetId,
      freezeTarget: params.targetAddress,
      frozen: true,
    },
  }
}

export const buildAssetUnfreeze = (params: AssetUnfreezeParams, header: TransactionHeader): Transaction => {
  return {
    ...header,
    transactionType: TransactionType.AssetFreeze,
    assetFreeze: {
      assetId: params.assetId,
      freezeTarget: params.targetAddress,
      frozen: false,
    },
  }
}
