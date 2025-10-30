import * as algosdk from '@algorandfoundation/sdk'
import { AlgodClient } from '@algorandfoundation/algod-client'
import { legacySendTransactionBridge } from '../transaction/legacy-bridge'
import { encodeTransactionNote, getSenderAddress } from '../transaction/transaction'
import { PaymentParams } from '../types/composer'
import { SendTransactionResult } from '../types/transaction'
import { AlgoTransferParams } from '../types/transfer'

/**
 * @deprecated Use `algorand.send.payment()` / `algorand.createTransaction.payment()` instead
 *
 * Transfer Algo between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.transferAlgos({ from, to, amount: algokit.algo(1) }, algod)
 * ```
 */
export async function transferAlgos(transfer: AlgoTransferParams, algod: AlgodClient): Promise<SendTransactionResult> {
  const params: PaymentParams = {
    sender: getSenderAddress(transfer.from),
    receiver: getSenderAddress(transfer.to),
    amount: transfer.amount,
    note: encodeTransactionNote(transfer.note),
    lease: transfer.lease,
  }

  return await legacySendTransactionBridge(
    algod,
    transfer.from,
    transfer,
    params,
    (c) => c.payment,
    (c) => c.payment,
  )
}
