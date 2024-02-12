import algosdk from 'algosdk'
import { Config } from '../config'
import { encodeLease, encodeTransactionNote, getSenderAddress, getTransactionParams, sendTransaction } from '../transaction/transaction'
import { SendTransactionResult } from '../types/transaction'
import { AlgoTransferParams } from '../types/transfer'
import Algodv2 = algosdk.Algodv2

/**
 * Transfer ALGOs between two accounts.
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
  const { from, to, amount, note, transactionParams, lease, ...sendParams } = transfer

  const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(from),
    to: getSenderAddress(to),
    amount: amount.microAlgos,
    note: encodeTransactionNote(note),
    suggestedParams: await getTransactionParams(transactionParams, algod),
    closeRemainderTo: undefined,
    rekeyTo: undefined,
  })

  const encodedLease = encodeLease(lease)
  if (encodedLease) {
    transaction.addLease(encodedLease)
  }

  if (!sendParams.skipSending) {
    Config.getLogger(sendParams.suppressLog).debug(
      `Transferring ${amount.microAlgos}µALGOs from ${getSenderAddress(from)} to ${getSenderAddress(to)}`,
    )
  }

  return sendTransaction({ transaction, from, sendParams }, algod)
}
