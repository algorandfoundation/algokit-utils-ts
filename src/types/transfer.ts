import { SuggestedParams } from 'algosdk'
import { AlgoAmount } from './amount'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'

export interface AlgoTransferParams extends SendTransactionParams {
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
