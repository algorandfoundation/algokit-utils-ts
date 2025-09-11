import { TransactionValidationError, TransactionValidationErrorType } from './common'

/**
 * Represents an asset transfer transaction that moves ASAs between accounts.
 *
 * Asset transfer transactions are used to transfer Algorand Standard Assets (ASAs)
 * from one account to another.
 */
export type AssetTransferTransactionFields = {
  /**
   * The ID of the asset being transferred.
   */
  assetId: bigint

  /**
   * The amount of the asset to transfer.
   *
   * An integer value representing the number of units (to their smallest denomination) of
   * the asset that are being transferred.
   * In other words, the asset decimals don't play a role in this value.
   * It should be up to the caller (or a higher abstraction) to handle the conversion based on
   * the asset decimals.
   */
  amount: bigint

  /**
   * The address of the account that will receive the asset.
   *
   * The receiver must have opted-in to the asset before they can receive it.
   */
  receiver: string

  /**
   * Optional address of the account that actually holds the asset being transferred.
   *
   * If provided, this indicates that the transaction is a clawback operation,
   * where the sender is the asset clawback address and is forcibly moving assets
   * from this account to the receiver.
   */
  assetSender?: string

  /**
   * Optional address to send all remaining asset units to after the transfer.
   *
   * If specified, this indicates that the sender is closing out their position in the asset,
   * and all remaining units of this asset owned by the sender will be transferred to this address.
   * This effectively removes the asset from the sender's account.
   */
  closeRemainderTo?: string
}

/**
 * Validate asset transfer transaction fields
 */
export function validateAssetTransferTransaction(assetTransfer: AssetTransferTransactionFields): TransactionValidationError[] {
  const errors = new Array<TransactionValidationError>()

  if (assetTransfer.assetId === 0n) {
    errors.push({
      type: TransactionValidationErrorType.ZeroValueField,
      data: 'Asset ID',
    })
  }

  return errors
}
