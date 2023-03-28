import { SuggestedParams } from 'algosdk'
import { AlgoAmount } from './amount'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'

/** Parameters for @see transferAlgos call. */
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

/** Parameters for @see ensureFunded call. */
export interface EnsureFundedParams extends SendTransactionParams {
  /** The account to fund */
  accountToFund: SendTransactionFrom | string
  /** The account to use as a funding source */
  fundingSource: SendTransactionFrom
  /** The minimum balance of ALGOs that the account should have available to spend (i.e. on top of minimum balance requirement) */
  minSpendingBalance: AlgoAmount
  /** When issuing a funding amount, the minimum amount to transfer (avoids many small transfers if this gets called often on an active account) */
  minFundingIncrement?: AlgoAmount
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note, default: "Funding account to meet minimum requirement" */
  note?: TransactionNote
}
