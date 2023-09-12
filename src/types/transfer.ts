import { SuggestedParams } from 'algosdk'
import { AlgoAmount } from './amount'
import { SendTransactionFrom, SendTransactionParams, TransactionNote } from './transaction'

/** Parameters for `transferAlgos` call. */
export interface AlgoTransferParams extends SendTransactionParams {
  /** The account that will send the ALGOs */
  from: SendTransactionFrom
  /** The account / account address that will receive the ALGOs */
  to: SendTransactionFrom | string
  /** The amount to send */
  amount: AlgoAmount
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note */
  note?: TransactionNote
}

/** Parameters for `ensureFunded` call. */
export interface EnsureFundedParams extends SendTransactionParams {
  /** The account to fund */
  accountToFund: SendTransactionFrom | string
  /** The account to use as a funding source, will default to using the dispenser account returned by `algokit.getDispenserAccount` */
  fundingSource?: SendTransactionFrom
  /** The minimum balance of ALGOs that the account should have available to spend (i.e. on top of minimum balance requirement) */
  minSpendingBalance: AlgoAmount
  /** When issuing a funding amount, the minimum amount to transfer (avoids many small transfers if this gets called often on an active account) */
  minFundingIncrement?: AlgoAmount
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** The (optional) transaction note, default: "Funding account to meet minimum requirement" */
  note?: TransactionNote
}

/** Parameters for `transferAsset` call. */
export interface TransferAssetParams extends SendTransactionParams {
  /** The account that will send the asset */
  from: SendTransactionFrom
  /** The account / account address that will receive the asset */
  to: SendTransactionFrom | string
  /** The asset id that will be transfered */
  assetId: number
  /** The amount to send */
  amount: number
  /** Optional transaction parameters */
  transactionParams?: SuggestedParams
  /** An address of a target account from which to perform a clawback operation. Please note, in such cases senderAccount must be equal to clawback field on ASA metadata. */
  clawbackFrom?: SendTransactionFrom | string
  /** The (optional) transaction note */
  note?: TransactionNote
}
