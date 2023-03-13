import algosdk, { Algodv2, SuggestedParams } from 'algosdk'
import { AlgoAmount } from './algo-amount'
import { AlgoKitConfig } from './config'
import {
  encodeTransactionNote,
  getSenderAddress,
  getTransactionParams,
  sendTransaction,
  SendTransactionFrom,
  SendTransactionParams,
  SendTransactionResult,
  TransactionNote,
} from './transaction'

interface AlgoTransferParams extends SendTransactionParams {
  /** The account (with private key loaded) that will send the µALGOs */
  from: SendTransactionFrom
  /** The account address that will receive the ALGOs */
  to: string
  /** The amount to send */
  amount: AlgoAmount
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
}

/**
 * Transfer ALGOs between two accounts.
 * @param transfer The transfer definition
 * @param algod An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 */
export async function transferAlgos(transfer: AlgoTransferParams, algod: Algodv2): Promise<SendTransactionResult> {
  const { from, to, amount, note, transactionParams, ...sendParams } = transfer

  const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: getSenderAddress(from),
    to: to,
    amount: amount.microAlgos,
    note: encodeTransactionNote(note),
    suggestedParams: await getTransactionParams(transactionParams, algod),
    closeRemainderTo: undefined,
    rekeyTo: undefined,
  })

  if (!sendParams.skipSending) {
    AlgoKitConfig.getLogger(sendParams.suppressLog).debug(`Transferring ${amount.microAlgos}µALGOs from ${getSenderAddress(from)} to ${to}`)
  }

  return sendTransaction({ transaction, from, sendParams }, algod)
}
