import { TransactionValidationError, TransactionValidationErrorType } from './common'

/**
 * Represents an asset freeze transaction that freezes or unfreezes asset holdings.
 *
 * Asset freeze transactions are used by the asset freeze account to control
 * whether a specific account can transfer a particular asset.
 */
export type AssetFreezeTransactionFields = {
  /**
   * The ID of the asset being frozen/unfrozen.
   */
  assetId: bigint

  /**
   * The target account whose asset holdings will be affected.
   */
  freezeTarget: string

  /**
   * The new freeze status.
   *
   * `true` to freeze the asset holdings (prevent transfers),
   * `false` to unfreeze the asset holdings (allow transfers).
   */
  frozen: boolean
}

/**
 * Validate asset freeze transaction fields
 */
export function validateAssetFreezeTransaction(assetFreeze: AssetFreezeTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (assetFreeze.assetId === 0n) {
    errors.push({
      type: TransactionValidationErrorType.ZeroValueField,
      data: 'Asset ID',
    })
  }

  return errors
}
