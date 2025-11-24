import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { legacySendTransactionBridge } from '../transaction/legacy-bridge'
import { encodeTransactionNote, getSenderAddress } from '../transaction/transaction'
import { SendTransactionResult } from '../types/transaction'
import { AlgoRekeyParams, TransferAssetParams } from '../types/transfer'

/**
 * @deprecated Use `algorand.send.assetTransfer()` / `algorand.createTransaction.assetTransfer()` instead
 *
 * Transfer asset between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.transferAsset({ from, to, assetId, amount }, algod)
 * ```
 */
export async function transferAsset(transfer: TransferAssetParams, algod: AlgodClient): Promise<SendTransactionResult> {
  return legacySendTransactionBridge(
    algod,
    transfer.from,
    transfer,
    {
      assetId: BigInt(transfer.assetId),
      sender: getSenderAddress(transfer.from),
      receiver: getSenderAddress(transfer.to),
      clawbackTarget: transfer.clawbackFrom ? getSenderAddress(transfer.clawbackFrom) : undefined,
      amount: BigInt(transfer.amount),
      note: encodeTransactionNote(transfer.note),
      lease: transfer.lease,
    },
    (c) => c.assetTransfer,
    (c) => c.assetTransfer,
  )
}

/**
 * @deprecated Use `algorand.account.rekeyAccount()` instead
 *
 * Rekey an account to a new address.
 *
 * **Note:** Please be careful with this function and be sure to read the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying).
 *
 * @param rekey The rekey definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.rekeyAccount({ from, rekeyTo }, algod)
 * ```
 */
export async function rekeyAccount(rekey: AlgoRekeyParams, algod: AlgodClient): Promise<SendTransactionResult> {
  return legacySendTransactionBridge(
    algod,
    rekey.from,
    rekey,
    {
      sender: getSenderAddress(rekey.from),
      receiver: getSenderAddress(rekey.from),
      amount: (0).microAlgo(),
      rekeyTo: typeof rekey.rekeyTo === 'string' ? rekey.rekeyTo : getSenderAddress(rekey.rekeyTo),
      note: encodeTransactionNote(rekey.note),
      lease: rekey.lease,
    },
    (c) => c.payment,
    (c) => c.payment,
  )
}
