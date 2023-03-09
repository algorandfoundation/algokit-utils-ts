import algosdk, { Account, Algodv2, LogicSigAccount } from 'algosdk'
import { AlgoAmount } from './algo-amount'
import {
  encodeTransactionNote,
  sendTransaction,
  SendTransactionParams,
  SendTransactionResult,
  SigningAccount,
  TransactionNote,
} from './transaction'

interface AlgoTransferParams extends SendTransactionParams {
  /** The account (with private key loaded) that will send the µALGOs */
  from: Account | SigningAccount | LogicSigAccount
  /** The account address that will receive the ALGOs */
  to: string
  /** The amount to send */
  amount: AlgoAmount
  /** The (optional) transaction note */
  note?: TransactionNote
}

/**
 * Transfer ALGOs between two accounts.
 * @param transfer The transfer definition
 * @param client An algod client
 * @returns The transaction object and optionally the confirmation if it was sent to the chain (`skipSending` is `false` or unset)
 */
export async function transferAlgos(transfer: AlgoTransferParams, client: Algodv2): Promise<SendTransactionResult> {
  const { from, to, amount, note, ...sendConfig } = transfer
  const params = await client.getTransactionParams().do()

  const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: 'addr' in from ? from.addr : from.address(),
    to: to,
    amount: amount.microAlgos,
    note: note ? encodeTransactionNote(note) : undefined,
    suggestedParams: params,
    closeRemainderTo: undefined,
    rekeyTo: undefined,
  })

  return sendTransaction(client, transaction, from, sendConfig)
}
