import algosdk from 'algosdk'
import { legacySendTransactionBridge } from '../transaction/legacy-bridge'
import { encodeTransactionNote, getSenderAddress } from '../transaction/transaction'
import { PaymentParams } from '../types/composer'
import { SendTransactionResult } from '../types/transaction'
import { AlgoTransferParams } from '../types/transfer'
import Algodv2 = algosdk.Algodv2

/**
 * @deprecated Use `algorand.send.payment()` / `algorand.transaction.payment()` instead
 *
 * Transfer Algos between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 *
 * @example Usage example
 * ```typescript
 * await algokit.transferAlgos({ from, to, amount: algokit.algos(1) }, algod)
 * ```
 */
export async function transferAlgos(transfer: AlgoTransferParams, algod: Algodv2): Promise<SendTransactionResult> {
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
    (c) => c.transactions.payment,
    (c) => c.send.payment,
  )
}
